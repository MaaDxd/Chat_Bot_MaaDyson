 import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName] = useState('Usuario');

  // Cargar conversaciones desde localStorage al iniciar
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Guardar conversaciones en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  // Guardar mensajes en la conversación activa cuando cambian
  // (usar update funcional para evitar loops y estados stale)
  useEffect(() => {
    if (activeConversation < 0) return;

    setConversations((prev) => {
      if (!prev[activeConversation]) return prev;
      const next = [...prev];
      next[activeConversation] = {
        ...next[activeConversation],
        messages: messages,
      };
      return next;
    });
  }, [messages, activeConversation]);

  const handleNewChat = () => {
    // Guardar la conversación actual si tiene mensajes
    if (messages.length > 0 && activeConversation >= 0) {
      const updatedConversations = [...conversations];
      updatedConversations[activeConversation] = {
        ...updatedConversations[activeConversation],
        messages: messages
      };
      setConversations(updatedConversations);
    }

    // Crear nueva conversación
    const newConversation = {
      title: 'Nueva conversación',
      date: new Date().toLocaleDateString(),
      messages: []
    };

    setConversations([newConversation, ...conversations]);
    setActiveConversation(0);
    setMessages([]);
  };

  const handleSelectConversation = (index) => {
    // Guardar la conversación actual si tiene mensajes
    if (messages.length > 0 && activeConversation >= 0) {
      const updatedConversations = [...conversations];
      updatedConversations[activeConversation] = {
        ...updatedConversations[activeConversation],
        messages: messages
      };
      setConversations(updatedConversations);
    }

    // Cargar la conversación seleccionada
    setActiveConversation(index);
    setMessages(conversations[index].messages || []);
  };

  const handleDeleteConversation = async (index) => {
    // Confirmar eliminación
    if (!window.confirm('¿Estás seguro de que quieres borrar esta conversación?')) {
      return;
    }

    // Si es la conversación activa, resetear
    if (activeConversation === index) {
      setActiveConversation(-1);
      setMessages([]);
    }

    // Eliminar la conversación
    const updatedConversations = conversations.filter((_, i) => i !== index);
    setConversations(updatedConversations);

    // Ajustar el índice activo si es necesario
    if (activeConversation > index) {
      setActiveConversation(activeConversation - 1);
    }
  };

  const handleRenameConversation = (index, newTitle) => {
    const title = (newTitle || '').trim();
    if (!title) return;

    const updatedConversations = [...conversations];
    if (!updatedConversations[index]) return;

    updatedConversations[index] = {
      ...updatedConversations[index],
      title,
    };
    setConversations(updatedConversations);
  };

  const handleSendMessage = async (messageText) => {
    const userMessage = { sender: 'user', text: messageText };

    // Historial *antes* de añadir el nuevo mensaje.
    // El backend construye el contexto a partir de este historial.
    const historyForBackend = activeConversation === -1 ? [] : messages;

    // Si no hay una conversación activa, crear una nueva primero
    if (activeConversation === -1) {
      const newConversation = {
        title: messageText.substring(0, 30) + (messageText.length > 30 ? '...' : ''),
        date: new Date().toLocaleDateString(),
        messages: [userMessage]
      };

      setConversations([newConversation, ...conversations]);
      setActiveConversation(0);
      setMessages([userMessage]);
    } else {
      // Añadimos el mensaje del usuario a la UI inmediatamente
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Actualizar el título de la conversación con el primer mensaje
      if (messages.length === 0) {
        const updatedConversations = [...conversations];
        updatedConversations[activeConversation] = {
          ...updatedConversations[activeConversation],
          title: messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '')
        };
        setConversations(updatedConversations);
      }
    }

    setIsLoading(true);

    try {
      // Hacemos la petición a NUESTRO backend
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText, history: historyForBackend }),
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
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        userName={userName}
      />
      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
