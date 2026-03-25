import requests
import os
import json
import time
from dotenv import load_dotenv
from datetime import date, timedelta
import subprocess
# --- NEW: AUTO-SETUP FUNCTION ---
def ensure_ollama_ready():
    print("🛠 Checking local AI setup...")
    
    # 1. Check if Homebrew is installed
    if subprocess.run(["which", "brew"], capture_output=True).returncode != 0:
        print("Installing Homebrew (this may take a minute and require your password)...")
        subprocess.run(['/bin/bash', '-c', '$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)'])

    # 2. Check if Ollama is installed
    if subprocess.run(["which", "ollama"], capture_output=True).returncode != 0:
        print("Installing Ollama via Homebrew...")
        subprocess.run(["brew", "install", "ollama"])

    # 3. Ensure Ollama server is running (with retry logic)
    server_ready = False
    for attempt in range(10):
        try:
            requests.get("http://localhost:11434/api/tags", timeout=2)
            server_ready = True
            break
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            if attempt == 0:
                print("Starting Ollama server...")
                subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            time.sleep(2)
    
    if not server_ready:
        print("Warning: Ollama server may not be ready")

    # 4. Pull the model
    print("Ensuring llama3.2:3b is downloaded...")
    subprocess.run(["ollama", "pull", "llama3.2:3b"], capture_output=True)

# --- CLEANUP FUNCTION ---
def cleanup_ollama():
    print("\n🧹 Cleaning up Ollama...")
    try:
        # Unload the model from memory (frees GPU/RAM immediately)
        requests.post("http://localhost:11434/api/generate", 
                      json={"model": "llama3.2:3b", "keep_alive": 0})
        print("Model unloaded from memory.")
    except:
        pass
    
    # Kill Ollama server and app completely
    subprocess.run(["pkill", "-9", "ollama"], capture_output=True)
    subprocess.run(["pkill", "-9", "-f", "Ollama.app"], capture_output=True)
    print("Ollama server stopped.")

# Run the setup before importing the ollama library
ensure_ollama_ready()
import ollama # Now safe to import
 
load_dotenv()
#this is the core veriable !!!!!! dude it is like the input for the netsuit fuction !!
timesheets_entry = None

WORKSPACE = os.getenv("WORKSPACE")
REPO_SLUG = os.getenv("REPO_SLUG")
EMAIL = os.getenv("EMAIL")
API_TOKEN = os.getenv("API_TOKEN")
PROJECT_NAME = os.getenv("PROJECT_NAME")
PROJECT_ID = os.getenv("PROJECT_ID")
today_str = date.today().isoformat()
yesterday_str = (date.today() - timedelta(days=1)).isoformat()
url = f"https://api.bitbucket.org/2.0/repositories/{WORKSPACE}/{REPO_SLUG}/commits/dev?pagelen=6&q=author.raw+%7E+%22satya%22"


response = requests.get(url, auth=(EMAIL, API_TOKEN))


if response.status_code == 200:
    data = response.json()
    commits = data.get("values", [])
    
    # Lists to separate work
    todays_work = []
    yesterdays_work = []
    rest_of_the_work = []
    
    for c in commits:
        commit_date = c['date'][:10]
        msg = c['message'].strip().split('\n')[0]
        rest_of_the_work.append(f"[{commit_date}] {msg}")
        
        if commit_date == today_str:
            todays_work.append(f"[{commit_date}] {msg}")
        elif commit_date == yesterday_str:
            yesterdays_work.append(f"[{commit_date}] {msg}")
            
    # Output Results
    print(f"Checking updates for: {today_str}")
    print("rest of the work: ", rest_of_the_work)
    print("-" * 30)
            
else:
    print(f"Failed! Code: {response.status_code}")

recent_commits =  todays_work + yesterdays_work
if recent_commits:
    clean_msgs = ", ".join([c.split("] ")[1] for c in recent_commits])
    
    # We tell the AI to START with the ID and Name, then APPEND the actual work
    prompt = (
        f"Context: My recent work commits are: {clean_msgs}. "
        f"Task: Create a timesheet entry that starts exactly with '{PROJECT_ID} : Working on project {PROJECT_NAME} development and - ' "
        f"and then describes the specific work done in the commits "
        f"Constraint: Return ONLY the sentence. No quotes, no intro."
    )

    print("\n--- Generating Timesheet Sentence ---")
    try:
        ai_response = ollama.chat(
            model='llama3.2:3b',
            messages=[{'role': 'user', 'content': prompt}],
            options={'temperature': 0}
        )
        # We strip any unwanted quotes the AI might add
        timesheets_entry = ai_response['message']['content'].strip('"')
        print(timesheets_entry)
    except Exception as e:
        timesheets_entry = f"{PROJECT_ID} : {PROJECT_NAME} - development and bugfixes: {clean_msgs}"
        print(timesheets_entry)
else:
    timesheets_entry = f"{PROJECT_ID} : Working on project {PROJECT_NAME} development and bugfixes."
    print(timesheets_entry)
# Cleanup: stop Ollama to free system resources
cleanup_ollama()