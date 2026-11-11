// Sample data for the frontend demo — replace with a real API call once
// the backend exists. `applied` is what My Schemes filters on.
// `documentsNeeded` reuses the exact same names as the Documents page's
// checklist, so the two pages actually agree with each other.

export const SCHEMES = [
  {
    id: 1,
    name: "PMGC",
    department: "Ministry of Finance",
    dualScore: 84,
    description: "Financial support scheme for eligible applicants.",
    fullDescription:
      "A financial assistance scheme designed to support eligible individuals and small businesses with funding to help them get established or grow. Applications are reviewed on a rolling basis, with funds disbursed directly to the applicant's bank account.",
    deadline: "Open all year",
    applied: true,
    requirements: [
      "Indian citizen, 18 years or older",
      "Valid Aadhaar and PAN card",
      "Annual household income below the scheme's eligibility threshold",
    ],
    benefits: [
      "Financial assistance disbursed directly to your bank account",
      "No collateral required",
    ],
    documentsNeeded: ["Aadhaar Card", "PAN Card", "Bank Passbook / Statement", "Income Certificate"],
  },
  {
    id: 2,
    name: "PM-KISAN",
    department: "Ministry of Agriculture & Farmers Welfare",
    dualScore: 78,
    description: "Income support scheme for eligible farmer families.",
    fullDescription:
      "Provides income support to landholding farmer families across the country, paid out in three equal instalments each year. Intended to help meet expenses related to agriculture and household needs.",
    deadline: "Open all year",
    applied: false,
    requirements: [
      "Must be a landholding farmer or part of a farmer family",
      "Valid Aadhaar linked to a bank account",
      "Land records in the applicant's name",
    ],
    benefits: [
      "Direct cash transfer paid in three instalments annually",
      "No repayment required — this is income support, not a loan",
    ],
    documentsNeeded: ["Aadhaar Card", "Bank Passbook / Statement"],
  },
  {
    id: 3,
    name: "Mudra Yojana",
    department: "Ministry of Finance",
    dualScore: 69,
    description: "Financial assistance for micro and small businesses.",
    fullDescription:
      "Offers collateral-free loans to non-corporate, non-farm micro and small enterprises, split into three categories — Shishu, Kishor, and Tarun — based on the growth stage and funding needs of the business.",
    deadline: "Open all year",
    applied: true,
    requirements: [
      "Non-farm income-generating micro or small business",
      "Business plan or existing business records",
      "No prior default on a bank loan",
    ],
    benefits: [
      "Collateral-free loan",
      "Available across three tiers depending on business size",
    ],
    documentsNeeded: ["Aadhaar Card", "PAN Card", "Bank Passbook / Statement", "Business Registration / Udyam Certificate"],
  },
  {
    id: 4,
    name: "Stand-Up India",
    department: "Ministry of Finance",
    dualScore: 55,
    description: "Support for establishing new enterprises.",
    fullDescription:
      "Facilitates bank loans for setting up new enterprises in manufacturing, services, or trading, with at least one SC/ST or woman entrepreneur per bank branch encouraged to apply.",
    deadline: "Open all year",
    applied: false,
    requirements: [
      "At least 51% shareholding held by an SC/ST or woman entrepreneur (for companies/partnerships)",
      "Applicant should not be in default with any bank or financial institution",
      "First-time enterprise (greenfield project)",
    ],
    benefits: [
      "Bank loan between ₹10 lakh and ₹1 crore",
      "Support with the loan application process",
    ],
    documentsNeeded: ["Aadhaar Card", "PAN Card", "Bank Passbook / Statement", "Business Registration / Udyam Certificate"],
  },
];
