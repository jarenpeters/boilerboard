# ---------------- LLM ----------------
def createvalues(matrix, account_username, starting_tag):
    print("importing llm")
    import json
    from openai import OpenAI
    import pandas as pd
    print("imported llm")
    from dotenv import load_dotenv
    import os

    load_dotenv()

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    if not OPENAI_API_KEY:
        raise ValueError("Missing OPENAI_API_KEY in environment!")

    clean_matrix = []
    for row in matrix:
        caption = row[0]
        date_iso = row[2]
        ocr_text = row[4]

        clean_matrix.append([caption, ocr_text, date_iso])

    client = OpenAI(api_key=OPENAI_API_KEY)
    print("client created")

    results = []

    system_prompt = """You will be provided with an Instagram username and a list of that account’s recent posts.
Each post will include a caption, image text, and post date.
For each event post, return the following fields:
- Username
- PostIndex
- EventTitle (use lower case, 32 characters or less)
- DateISO (ISO format: YYYY-MM-DD, or NOT_FOUND) (infer an event's year based on the post date provided)
- Date (“month day, year” or NOT_FOUND, use lowercase and abbreviate month (jan. feb. mar. apr. may.)
- Time (“0:00AM/PM” or NOT_FOUND, only use start time)
- Location (e.g., “WALC 1009” or "lawson commons", or NOT_FOUND)
- EventSummary (1 sentence, 100 characters or less)
- Tags (return an array of 1 to 5 tags for each post; take ONLY from the tagLibrary; include StartingTag as the first tag; DON'T user underlines to separate words)
    - taglibrary = ["computer science","engineering","data science","ai","robotics","science","business","entrepreneurship","health","music","theater","dance","fitness","comedy","volunteering","english","cultural","sports","fitness","outdoors","gaming","environment","art"]
- IsEventQuery (Based on the provided info, determine if a post is an upcoming event, then return True or False. if 3 or more fields are NOT_FOUND, then make false.)
OVERALL:
1) Output exactly ONE JSON object with this structure.
2) Return all 8 posts, even if IsEventQuery is False.
3) Do not deviate from formats mentioned in parentheses."""

    print(f"Processing {account_username}")
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Username: {account_username}\nPosts: {json.dumps(clean_matrix)}\nStartingTag: {starting_tag}"}
        ]
    )
    content = response.choices[0].message.content
    print(content)

    def extract_json_from_ai(content: str):
        import json
        cleaned = (
            content.replace("```json", "")
            .replace("```", "")
            .strip()
        )
        start = cleaned.find("[")
        end = cleaned.rfind("]") + 1
        if start == -1 or end == -1:
            raise ValueError("No JSON array found in AI response.")
        return json.loads(cleaned[start:end])

    try:
        data = extract_json_from_ai(content)
    except Exception as e:
        print("Failed to parse JSON for account. Saving raw content.")
        print(e)
        return None

    expected_keys = ["Username", "PostIndex", "EventTitle", "Date", "DateISO", "Time", "Location",
                     "EventSummary", "IsEventQuery", "Tags"]
    for idx, event in enumerate(data):
        row = {key: event.get(key, "NOT_FOUND") for key in expected_keys}
        # ----------------------------
        # Add ImageURL + InstagramURL
        # ----------------------------
        row["ImageURL"] = matrix[idx][1]  # original image URL
        row["InstagramURL"] = matrix[idx][3]  # original instagram post URL
        # ----------------------------

        results.append(row)

    df = pd.DataFrame(results)
    df.to_csv("posts_data.csv", index=False)

    print("Saved to posts_data.csv")
    return df
# ---------------- LLM ----------------