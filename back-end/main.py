import json
import pandas as pd
from scraper import scrapeinsta
from imagereader import readimage
from largelanguagemodel import createvalues
from cleanposts import clean_posts
from mongoupload import upload_csv_to_mongo
from datetime import datetime

print("starting program")

# ---------------- MAIN PROGRAM ----------------
with open("testaccounts.json", "r") as f:
    accounts = json.load(f)

all_posts_df = pd.DataFrame()
for username, first_tag in accounts.items():
    print("first")
    account_df = createvalues(
        readimage(scrapeinsta(username)),
        account_username=username,
        starting_tag=first_tag
    )
    print("second")
    all_posts_df = pd.concat([all_posts_df, account_df], ignore_index=True)
    print("third")

# Save raw combined CSV
all_posts_df.to_csv("all_accounts_posts.csv", index=False)
print("All accounts saved to all_accounts_posts.csv")

# Clean posts + write cleaned_posts.csv
clean_posts()

# Upload cleaned CSV to MongoDB
upload_csv_to_mongo("cleaned_posts.csv")

print("Finished updating MongoDB with cleaned posts.")
# ---------------- END MAIN ----------------