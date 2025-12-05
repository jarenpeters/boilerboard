# ---------------- SCRAPER ----------------
def scrapeinsta(username):
    import instaloader
    from instaloader import Profile
    from itertools import islice
    import os
    import base64
    from dotenv import load_dotenv

    load_dotenv()  # loads .env automatically

    print("importing instaloader")

    # Create loader
    L = instaloader.Instaloader()

    # --- Load encoded session from .env ---
    insta_user = os.getenv("INSTALOADER_USERNAME")
    session_b64 = os.getenv("INSTA_SESSION_B64")
    if not session_b64:
        raise ValueError("Missing INSTA_SESSION_B64 in environment!")

    # Decode to bytes
    session_bytes = base64.b64decode(session_b64)

    # Write temp session file
    session_path = "temp_instaloader_session"
    with open(session_path, "wb") as f:
        f.write(session_bytes)

    # Load the session (must use your real login username)
    L.load_session_from_file(insta_user, session_path)
    os.remove(session_path)

    print("imported instaloader")

    # Fetch posts
    profile = Profile.from_username(L.context, username)
    print("fetching posts")

    posts = list(islice(profile.get_posts(), 20))
    posts.sort(key=lambda post: post.date, reverse=True)

    posts_matrix = []
    for post in posts:
        if post.is_video:
            print("post is video")
            continue

        print("post is normal")
        posts_matrix.append([
            post.caption,
            post.url,
            post.date_utc.isoformat(),
            f"https://www.instagram.com/p/{post.shortcode}/"
        ])
        if len(posts_matrix) == 8:
            break
    return posts_matrix
# ---------------- SCRAPER ----------------
