🧠 Offline Chatbot (Developer Setup)

This is an **offline personal chatbot desktop app** powered by Python (Flask), Electron, and a local LLM (via [Ollama](https://ollama.com/)). It's designed to run entirely on your local machine — no APIs, no internet required.

# 📦 Features

- Electron-based desktop UI  
- Python Flask backend  
- Chat history stored locally (JSON)  
- Fully offline response generation using Ollama + Mistral model

# 🛠️ Developer Setup Instructions

 1. Clone the Repository

--bash
git clone https://github.com/your-username/offline-chatbot.git
cd offline-chatbot

Make sure python 3.10+ is installed 
--bash
pip install -r requirements.txt

Ensure node.js and npm are installed
--bash
npm install

Install Ollama + Mistral
Pull the mistral model:
ollama pull mistral

Running the app
npm start

1. This will launch flask server in the background
2. Open the Electron app pointing to http://localhost:5000

--bash
npm run package
the output will be saved in the folder like
OfflineChatbot-win32-x64  inside
OfflineChatbot.exe is your app

Folder Structure
offline-chatbot/
├── app.py
├── main.js
├── preload.js
├── memory/chat_log.json
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
├── splash.html
├── system_prompt.txt
├── package.json
├── requirements.txt
└── electron/chatbot.ico

Tested on Windows 11
Ollama must be running in the background to start the app

#This project is open source and free to use.


