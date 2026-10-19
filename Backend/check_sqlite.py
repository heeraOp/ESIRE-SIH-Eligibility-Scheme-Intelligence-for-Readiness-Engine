import sqlite3

conn = sqlite3.connect("esire.db")
cursor = conn.cursor()

tables = [
    "applications",
    "match_results",
    "otp_challenges",
    "profiles",
    "scheme_records",
    "user_documents",
    "users",
]

print("\nSQLite Database Contents")
print("========================")

for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"{table}: {count} records")

conn.close()