from flask import Flask, render_template, request, jsonify
import subprocess
import json
import os

# Set up proper template and static folder paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
MEMORY_DIR = os.path.join(BASE_DIR, 'memory')
chat_log_path = os.path.join(MEMORY_DIR, 'chat_log.json')

# Flask app setup
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

def query_ollama(prompt):
    result = subprocess.run(
        ["ollama", "run", "mistral"],
        input=prompt,
        capture_output=True,
        text=True
    )
    return result.stdout.strip()

def save_message(sender, message):
    if os.path.exists(chat_log_path):
        with open(chat_log_path, "r") as f:
            chat_history = json.load(f)
    else:
        chat_history = []

    chat_history.append({ "sender": sender, "message": message })

    with open(chat_log_path, "w") as f:
        json.dump(chat_history, f, indent=2)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    save_message("user", user_input)

    response = query_ollama(user_input)
    save_message("bot", response)

    return jsonify({ "response": response })

if __name__ == "__main__":
    app.run(debug=True)
