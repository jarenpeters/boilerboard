from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import re
import os
from dotenv import load_dotenv
import threading

# Import your main.py functions
import main

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("Missing MONGO_URI in .env")

app = Flask(__name__)
CORS(app)

client = MongoClient(MONGO_URI)
db = client["launchpad"]
collection = db["events"]


@app.route("/events", methods=["GET"])
def get_events():
    events = list(collection.find({}, {"_id": 0}))
    return jsonify(events)


@app.route("/search", methods=["GET"])
def search_events():
    query = request.args.get("query", "")
    if not query:
        return jsonify([])

    if query.startswith("@"):
        username = query[1:]
        events = list(collection.find(
            {"Username": re.compile(f"^{re.escape(username)}$", re.IGNORECASE)},
            {"_id": 0}
        ))
    else:
        regex = re.compile(re.escape(query), re.IGNORECASE)
        events = list(collection.find(
            {
                "$or": [
                    {"EventTitle": regex},
                    {"EventSummary": regex},
                    {"Location": regex},
                    {"Tags": regex}
                ]
            },
            {"_id": 0}
        ))

    return jsonify(events)


# -----------------------------
# NON-BLOCKING CRON ROUTE
# -----------------------------
@app.route("/cron", methods=["GET"])
def run_daily():
    def background_job():
        try:
            print("Background job started")
            result = main.run()
            print("Background job finished:", result)
        except Exception as e:
            print("Background job error:", e)

    threading.Thread(target=background_job, daemon=True).start()

    return jsonify({"status": "started"}), 200


# Startup
if __name__ == "__main__":
    from waitress import serve
    port = int(os.environ.get("PORT", 5000))
    serve(app, host="0.0.0.0", port=port)