import React, { useState } from 'react';
import './App.css'; // Crearemos este archivo para los estilos

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { sender: 'user', text: inputValue };
    // Añadimos el mensaje del usuario a la UI inmediatamente
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(''); // Limpiamos el input
    setIsLoading(true);

    try {
      // Hacemos la petición a NUESTRO backend
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      const assistantMessage = { sender: 'assistant', text: data.reply };

      // Añadimos la respuesta del asistente
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    } catch (error) {
      console.error("Hubo un error al contactar al backend:", error);
      const errorMessage = { sender: 'assistant', text: 'Lo siento, tuve un problema al procesar tu solicitud.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <div className="message assistant"><p>Escribiendo...</p></div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;