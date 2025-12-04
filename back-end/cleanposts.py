# ---------------- CLEAN POSTS ----------------
import pandas as pd
import ast

def clean_posts(input_file="all_accounts_posts.csv", output_file="cleaned_posts.csv"):

    df = pd.read_csv(input_file)

    df["IsEventQuery"] = df["IsEventQuery"].astype(str).str.lower()

    def fix_tags(x):
        if pd.isna(x) or x == "":
            return []

        # If it's already a list, normalize it
        if isinstance(x, list):
            return [t.lower().strip() for t in x if isinstance(t, str)]

        # If it's a string like "['service', 'engineering']"
        if isinstance(x, str):
            try:
                parsed = ast.literal_eval(x)
                if isinstance(parsed, list):
                    return [t.lower().strip() for t in parsed if isinstance(t, str)]
            except:
                return []

        return []

    df["Tags"] = df["Tags"].apply(fix_tags)

    cleaned = df[df["IsEventQuery"] == "true"]

    cleaned.to_csv(output_file, index=False)
    print(f"Clean complete! {len(cleaned)} posts kept. Saved → {output_file}")
# ---------------- CLEAN POSTS ----------------