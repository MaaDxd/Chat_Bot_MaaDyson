# 🤖 ChatBot MaaDyson

Conversational chatbot built as a personal project to explore AI inference API consumption and REST endpoint handling in a real client-server flow.

## 🎯 What it does

MaaDyson is a conversational assistant that:

- Receives user messages from the frontend.
- Sends requests to the backend, which communicates with the **Cerebras API** to generate responses via AI inference.
- Returns the response to the user in real time, handling errors and validating requests/responses at the endpoint level.

The main goal of this project was to practice designing, consuming, and testing **REST API endpoints** in a real-world conversational AI use case.

## 🛠️ Tech Stack

- **Frontend:** JavaScript, HTML, CSS
- **Backend:** Python
- **AI / Inference:** Cerebras API
- **Automation:** `.bat` script to quickly spin up the project on Windows

## 🧱 Architecture

```
Chat_Bot_MaaDyson/
├── frontend/     # Chat user interface
├── backend/      # Server logic, request handling, and Cerebras API integration
```

- **Frontend:** captures user input and renders the conversation.
- **Backend:** exposes REST endpoints that receive messages, forward them to the Cerebras API, and process the response before returning it to the client.

## 🚀 Running it locally

```bash
# Clone the repository
git clone https://github.com/MaaDxd/Chat_Bot_MaaDyson.git
cd Chat_Bot_MaaDyson

# Backend
cd backend
# install dependencies according to the project's requirements/configuration

# Frontend
cd ../frontend
npm install
npm run dev
```

> Note: a personal Cerebras API key must be set as an environment variable for the backend to generate responses.

## 📌 Project status

✅ Completed — built as a personal project to practice AI API integration.

## 👤 Author

**Nicolas Madariaga**
[LinkedIn](https://www.linkedin.com/in/nicol%C3%A1s-madariaga-marin-a8b3073b0/) · [GitHub](https://github.com/MaaDxd)
