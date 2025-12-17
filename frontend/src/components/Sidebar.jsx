import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ conversations, activeConversation, onNewChat, onSelectConversation, onDeleteConversation, userName }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Nuevo chat
                </button>
            </div>

            <div className="conversations-list">
                <div className="conversations-title">Historial</div>
                {conversations.length === 0 ? (
                    <div className="empty-history">No hay conversaciones anteriores</div>
                ) : (
                    conversations.map((conversation, index) => (
                        <div
                            key={index}
                            className={`conversation-item ${activeConversation === index ? 'active' : ''}`}
                            onClick={() => onSelectConversation(index)}
                        >
                            <div className="conversation-content">
                                <div className="conversation-title">{conversation.title}</div>
                                <div className="conversation-date">{conversation.date}</div>
                            </div>
                            <button
                                className="delete-conversation-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteConversation(index);
                                }}
                                title="Borrar conversación"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="user-menu">
                <button className="user-menu-btn" onClick={toggleUserMenu}>
                    <div className="user-avatar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="user-name">{userName}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {isUserMenuOpen && (
                    <div className="user-dropdown">
                        <div className="dropdown-item">Configuración</div>
                        <div className="dropdown-item">Ayuda</div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item">Cerrar sesión</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;