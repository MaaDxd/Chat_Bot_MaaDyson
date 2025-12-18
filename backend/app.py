import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURACIÓN INICIAL ---
# En una app real, nunca pongas tu API Key directamente en el código.
# Usa variables de entorno.
API_KEY = "csk-8mydekmh6pwynjp4c8kte69xvp548jt5e9vtrtcp5868894m"
CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions"

# --- CREAR LA APLICACIÓN DE FLASK ---
app = Flask(__name__)
# Habilitar CORS para todas las rutas
CORS(app)

SYSTEM_PROMPT = (
    "Eres un asistente útil y amigable que mantiene una conversación fluida."
)


def _normalize_history(frontend_history):
    """Convert frontend history items into Cerebras chat messages.

    Expected frontend_history: list of {sender: 'user'|'assistant', text: string}
    """
    if not frontend_history:
        return []

    normalized = []
    for item in frontend_history:
        if not isinstance(item, dict):
            continue
        sender = item.get("sender")
        text = item.get("text")
        if sender not in ("user", "assistant"):
            continue
        if not isinstance(text, str) or not text.strip():
            continue
        normalized.append({"role": sender, "content": text})
    return normalized


# --- DEFINIR UN ENDPOINT (Ruta de la API) ---
@app.route("/chat", methods=["POST"])
def chat():
    # 1. Obtener el mensaje del usuario desde la petición del frontend
    data = request.json
    user_message = data.get("message")
    frontend_history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "El mensaje es requerido"}), 400

    # 2. Construir el contexto de conversación de forma *stateless*.
    #    El frontend manda el historial del chat activo, así no se "mezclan" chats.
    historial_conversacion = (
        [{"role": "system", "content": SYSTEM_PROMPT}]
        + _normalize_history(frontend_history)
        + [{"role": "user", "content": user_message}]
    )

    # 3. Hacer la llamada a la API de Cerebras
    try:
        response = requests.post(
            url=CEREBRAS_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                {
                    "model": "zai-glm-4.6",
                    "messages": historial_conversacion,
                }
            ),
            timeout=30,
        )
        response.raise_for_status()  # Lanza un error para códigos de estado 4xx/5xx
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión con la API de Cerebras: {e}")
        return jsonify({"error": "No se pudo conectar con el servicio de IA"}), 500

    # 4. Obtener la respuesta del asistente
    respuesta_asistente = response.json()["choices"][0]["message"]["content"]

    # 5. Devolver la respuesta al frontend en formato JSON
    return jsonify({"reply": respuesta_asistente})


@app.route("/clear_chat", methods=["POST"])
def clear_chat():
    # Endpoint legacy: el backend ahora es stateless (el frontend manda el historial).
    return jsonify({"message": "OK"})


# --- PUNTO DE ENTRADA PARA EJECUTAR EL SERVIDOR ---
if __name__ == "__main__":
    app.run(debug=True, port=5000)
