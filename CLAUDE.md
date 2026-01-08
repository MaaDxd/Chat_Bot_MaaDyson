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
- Borrar conversaciones individuales
- Limpiar historial de chat

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
- Endpoints:
  - `/chat` (POST): Enviar mensaje y recibir respuesta
  - `/clear_chat` (POST): Limpiar historial de conversación
- Puerto: 5000

## Iniciar el Proyecto
1. Backend: `cd backend && python app.py` (puerto 5000)
2. Frontend: `cd frontend && npm install && npm start` (puerto 3000 o siguiente disponible)

## Uso
- Abre el navegador en http://localhost:3000 (o el puerto asignado)
- Crea una nueva conversación o selecciona una existente
- Escribe mensajes y recibe respuestas de la IA
- Usa el botón X en la sidebar para borrar conversaciones
- El historial se guarda automáticamente en localStorage