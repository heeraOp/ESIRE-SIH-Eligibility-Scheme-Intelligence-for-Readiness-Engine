from __future__ import annotations

import json
import logging
from typing import Any

from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import mongo, neo4j_db
from app.models import Application, MatchResult, Profile, User, UserDocument
from app.services import catalog, scoring
from app.services.extractor import extract_profile
from app.services.ollama import ollama_service
from app.services.z3_engine import verify_scheme

settings = get_settings()
logger = logging.getLogger("esire.matching")

STATUS_LABELS = {
    "verified_eligible": "Verified Eligible",
    "insufficient_information": "More information needed",
    "not_eligible": "Not eligible",
}

# Minimum fields needed for scheme matching to actually mean something — without
# these, most schemes evaluate to "insufficient_information" and the dashboard
# is empty. The signup page tries to fill these via Ollama extraction; whatever
# it misses, the person must fill in on the Profile page before the dashboard
# unlocks (see /api/me's "profile_complete" and the frontend's ProfileGate).
REQUIRED_PROFILE_FIELDS = ["age", "gender", "state", "occupation_type", "annual_income", "category"]


def profile_completeness(pdata: dict[str, Any]) -> dict[str, Any]:
    missing = [field for field in REQUIRED_PROFILE_FIELDS if pdata.get(field) in (None, "")]
    return {"complete": not missing, "missing_fields": missing}


def profile_to_dict(profile: Profile | None) -> dict[str, Any]:
    if profile is None:
        return {}
    return {
        "about_text": profile.about_text,
        "age": profile.age,
        "gender": profile.gender,
        "state": profile.state,
        "district": profile.district,
        "occupation": profile.occupation,
        "occupation_type": profile.occupation_type,
        "annual_income": profile.annual_income,
        "category": profile.category,
        "is_entrepreneur": profile.is_entrepreneur,
        "has_existing_business": profile.has_existing_business,
        "has_land": profile.has_land,
        "citizenship": profile.citizenship or "IN",
        "extraction_source": profile.extraction_source,
    }


def apply_extraction(profile: Profile, extracted: dict[str, Any], source: str) -> None:
    mapping = {
        "age": "age",
        "gender": "gender",
        "state": "state",
        "district": "district",
        "occupation": "occupation",
        "occupation_type": "occupation_type",
        "annual_income": "annual_income",
        "category": "category",
        "is_entrepreneur": "is_entrepreneur",
        "has_existing_business": "has_existing_business",
        "has_land": "has_land",
        "citizenship": "citizenship",
    }
    for src, dest in mapping.items():
        value = extracted.get(src)
        if value not in (None, "", []):
            setattr(profile, dest, value)
    profile.extraction_source = source


def submitted_map(db: Session, user_id: int) -> dict[str, str]:
    rows = db.query(UserDocument).filter(UserDocument.user_id == user_id).all()
    return {row.doc_type: row.status for row in rows}


def build_explanation(satisfied: list[str], uncertain: list[str], missing_docs: list[str], failed: list[str], scheme_name: str) -> str:
    """Deterministic, rule-based explanation text. This is the explanation
    shown for every scheme by default — cheap, offline, and always
    available. See `enhance_explanation` for the optional AI rewrite that
    is applied only to the handful of schemes actually displayed."""
    parts = []
    if satisfied:
        parts.append("This scheme matched because: " + "; ".join(satisfied[:4]) + ".")
    if uncertain:
        parts.append("Some conditions still need confirmation: " + "; ".join(uncertain[:3]) + ".")
    if missing_docs:
        parts.append("Missing documents reduce readiness but do not automatically disqualify you: " + ", ".join(missing_docs) + ".")
    if failed:
        parts.append("These conditions currently fail: " + "; ".join(failed) + ".")
    return " ".join(parts) or f"{scheme_name} was evaluated against your current profile."


def enhance_explanation(payload: dict[str, Any], language: str) -> str | None:
    """Best-effort AI rewrite of the already-computed deterministic
    explanation. Eligibility and scoring are never decided here — this only
    rephrases text for readability. Returns None (caller keeps the
    deterministic text) if Ollama is unavailable, errors, times out, or
    returns something unusable; this function itself never raises."""
    try:
        return ollama_service.explain_match(
            {
                "scheme": payload.get("scheme_name"),
                "satisfied": payload.get("satisfied_conditions"),
                "missing_documents": payload.get("missing_documents"),
                "status": payload.get("eligibility_status"),
            },
            language,
        )
    except Exception:  # noqa: BLE001 - AI text is a nice-to-have, never fatal
        return None


def evaluate_user(db: Session, user: User, include_excluded: bool = False) -> dict[str, Any]:
    profile = user.profile
    if profile and profile.about_text and not profile.occupation_type:
        extracted, source = extract_profile(profile.about_text, user.language)
        apply_extraction(profile, extracted, source)
        mongo.upsert("extractions", f"user-{user.id}", {"user_id": user.id, "extracted": extracted, "source": source})
        db.commit()

    pdata = profile_to_dict(profile)
    submitted = submitted_map(db, user.id)
    schemes = catalog.all_schemes()
    related = set(neo4j_db.related_scheme_ids(pdata))
    if related:
        ordered = [item for item in schemes if item["id"] in related] + [item for item in schemes if item["id"] not in related]
    else:
        ordered = schemes

    displayed = []
    excluded = []
    for scheme in ordered:
        try:
            if not isinstance(scheme, dict) or not scheme.get("id") or not scheme.get("name"):
                continue  # malformed catalog entry — skip it, never crash the whole dashboard

            verification = verify_scheme(pdata, scheme)
            missing_mandatory = scoring.mandatory_docs_unknown(scheme, submitted)
            if missing_mandatory and verification.status == "verified_eligible":
                verification.status = "insufficient_information"
                verification.uncertain = list(dict.fromkeys(verification.uncertain + missing_mandatory))

            elig = scoring.eligibility_score(scheme, verification)
            doc_score, present, missing, doc_details = scoring.document_score(scheme, submitted)
            final_score = scoring.combine_scores(elig, doc_score)
            band = scoring.display_band(final_score)
            payload = {
                "scheme_id": scheme["id"],
                "scheme_code": scheme.get("code"),
                "scheme_name": scheme["name"],
                "department": scheme.get("department"),
                "description": scheme.get("description"),
                "full_description": scheme.get("full_description"),
                "deadline": scheme.get("deadline"),
                "benefits": scheme.get("benefits") or [],
                "requirements": [item.get("explanation") for item in scheme.get("constraints") or [] if isinstance(item, dict)],
                "final_score": final_score,
                "eligibility_score": elig,
                "document_score": doc_score,
                "eligibility_status": verification.status,
                "eligibility_label": STATUS_LABELS.get(verification.status, verification.status),
                "match_band": band,
                "required_documents": [item.get("name") for item in scheme.get("documents") or [] if isinstance(item, dict)],
                "submitted_documents": present,
                "missing_documents": missing,
                "document_details": doc_details,
                "failed_conditions": verification.failed,
                "uncertain_conditions": verification.uncertain,
                "satisfied_conditions": verification.satisfied,
                "why_matched": verification.satisfied,
                "explanation": build_explanation(verification.satisfied, verification.uncertain, missing, verification.failed, scheme["name"]),
                "source": scheme.get("source"),
                "source_note": scheme.get("source_note"),
                "graph_candidate": scheme["id"] in related if related else True,
            }

            existing = (
                db.query(MatchResult)
                .filter(MatchResult.user_id == user.id, MatchResult.scheme_id == scheme["id"])
                .first()
            )
            if existing is None:
                existing = MatchResult(user_id=user.id, scheme_id=scheme["id"], scheme_name=scheme["name"])
                db.add(existing)
            existing.scheme_name = scheme["name"]
            existing.final_score = final_score
            existing.eligibility_score = elig
            existing.document_score = doc_score
            existing.eligibility_status = verification.status
            existing.displayed = band is not None
            existing.payload_json = json.dumps(payload)

            if band is None:
                excluded.append({**payload, "exclude_reason": f"final_score {final_score} is not greater than {settings.display_threshold}"})
            else:
                displayed.append(payload)
        except Exception as exc:  # noqa: BLE001 - one bad scheme (malformed
            # data, an unexpected type, anything) must never take down the
            # whole /api/dashboard request for every other scheme. Note: no
            # db.rollback() here — MatchResult updates for schemes already
            # processed earlier in this same loop are staged but not yet
            # committed (a single db.commit() happens after the loop), and
            # a rollback would wipe out all of that other, valid work too.
            scheme_id = scheme.get("id") if isinstance(scheme, dict) else scheme
            logger.error("Skipping scheme %r during evaluation due to error: %s", scheme_id, exc)
            continue

    db.commit()
    applications = {row.scheme_id for row in db.query(Application).filter(Application.user_id == user.id).all()}
    for item in displayed:
        item["applied"] = item["scheme_id"] in applications
    displayed.sort(key=lambda row: row["final_score"], reverse=True)

    

    result = {
        "schemes": displayed,
        "threshold": settings.display_threshold,
        "profile": pdata,
        "document_statuses": submitted,
    }
    if include_excluded:
        result["excluded"] = excluded
    return result
