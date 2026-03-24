import requests
import os
import json
from dotenv import load_dotenv
 
load_dotenv()

WORKSPACE = os.getenv("WORKSPACE")
REPO_SLUG = os.getenv("REPO_SLUG")
EMAIL = os.getenv("EMAIL")
API_TOKEN = os.getenv("API_TOKEN")
# 1. Configuration

# 2. URL (Last 3 commits from 'dev' branch)
# The query 'author.raw ~ "satya"' looks for "satya" anywhere in the author field
url = f"https://api.bitbucket.org/2.0/repositories/{WORKSPACE}/{REPO_SLUG}/commits/dev?pagelen=3&q=author.raw+%7E+%22satya%22"

# 3. Make the Request
# auth=(EMAIL, TOKEN) automatically formats it for Basic Authentication
response = requests.get(url, auth=(EMAIL, API_TOKEN))

# 4. Handle the Result
if response.status_code == 200:
    data = response.json()
    commits = data.get("values", [])
    
    print(f"\n--- Success! Showing last {len(commits)} commits for dev branch ---")
    for c in commits:
        date = c['date'][:10]
        #author = c['author']['raw'] # Optional: uncomment if you want to see author
        msg = c['message'].strip().split('\n')[0]
        print(f"[{date}] {msg}")
else:
    print(f"Failed! Code: {response.status_code}")
    print(f"Response: {response.text}")