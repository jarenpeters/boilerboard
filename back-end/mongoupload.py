# ---------------- MONGO UPLOAD ----------------
import pandas as pd
from pymongo import MongoClient
import ast
import os
from dotenv import load_dotenv

load_dotenv()  # finds your .env automatically

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("Missing MONGO_URI in .env")

def parse_tags(x):
    if pd.isna(x) or x == "":
        return []
    if isinstance(x, list):
        return [t.lower().strip() for t in x if isinstance(t, str)]
    if isinstance(x, str):
        try:
            parsed = ast.literal_eval(x)
            if isinstance(parsed, list):
                return [t.lower().strip() for t in parsed if isinstance(t, str)]
        except:
            return []
    return []

def upload_csv_to_mongo(csv_path):
    df = pd.read_csv(csv_path)

    if "IsEventQuery" in df.columns:
        df["IsEventQuery"] = df["IsEventQuery"].astype(str).str.lower().map({"true": True, "false": False})

    client = MongoClient(
        MONGO_URI
    )

    db = client["launchpad"]
    collection = db["events"]
    collection.delete_many({})

    inserted = 0

    for _, row in df.iterrows():
        record = row.to_dict()

        record["Tags"] = parse_tags(record.get("Tags", []))

        collection.insert_one(record)
        inserted += 1

    print(f"Upload complete! Inserted: {inserted}")
# ---------------- MONGO UPLOAD ----------------
