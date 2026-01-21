import os
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURACIÓN INICIAL ---
# En una app real, nunca pongas tu API Key directamente en el código.
# Usa variables de entorno.
API_KEY = os.environ.get("API_KEY")
CEREBRAS_URL = os.environ.get("CEREBRAS_URL")

# --- CREAR LA APLICACIÓN DE FLASK ---
app = Flask(__name__)
# Habilitar CORS para todas las rutas
CORS(app)

# --- HISTORIAL DE CONVERSACIÓN ---
historial_conversacion = [
    {
        "role": "system",
        "content": "Eres un asistente útil y amigable que mantiene una conversación fluida.",
    }
]

# --- DEFINIR UN ENDPOINT (Ruta de la API) ---
@app.route('/chat', methods=['POST'])
def chat():
    # 1. Obtener el mensaje del usuario desde la petición del frontend
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "El mensaje es requerido"}), 400

    # 2. Añadir el mensaje del usuario al historial
    historial_conversacion.append({"role": "user", "content": user_message})

    # 3. Hacer la llamada a la API de Cerebras
    try:
        response = requests.post(
            url=CEREBRAS_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "zai-glm-4.6",
                "messages": historial_conversacion,
            }),
            timeout=30,
        )
        response.raise_for_status() # Lanza un error para códigos de estado 4xx/5xx
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión con la API de Cerebras: {e}")
        return jsonify({"error": "No se pudo conectar con el servicio de IA"}), 500

    # 4. Obtener la respuesta del asistente
    respuesta_asistente = response.json()["choices"][0]["message"]["content"]

    # 5. Añadir la respuesta del asistente al historial
    historial_conversacion.append(
        {"role": "assistant", "content": respuesta_asistente}
    )

    # 6. Devolver la respuesta al frontend en formato JSON
    return jsonify({"reply": respuesta_asistente})

# --- PUNTO DE ENTRADA PARA EJECUTAR EL SERVIDOR ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)