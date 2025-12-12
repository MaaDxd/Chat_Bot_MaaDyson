# Chat Bot MaaDyson

Proyecto de chatbot con frontend en React y backend en Flask.

## Estructura del Proyecto
- `frontend/`: Aplicación React con interfaz de chat
- `backend/`: API Flask con endpoint de chat usando Cerebras AI

## Funcionalidades
- Chat en tiempo real con IA
- Historial de conversación
- Soporte para Markdown en mensajes
- Interfaz moderna con sidebar

## Dependencias
### Frontend (React)
- React 19.2.1
- react-markdown para soporte de Markdown
- react-scripts

### Backend (Flask)
- Flask
- Flask-CORS
- requests

## API Configuration
- Usa Cerebras AI API (zai-glm-4.6 model)
- Endpoint: `/chat` (POST)
- Puerto: 5000

## Iniciar el Proyecto
1. Frontend: `cd frontend && npm install && npm start` (puerto 3000)
2. Backend: `cd backend && python app.py` (puerto 5000)