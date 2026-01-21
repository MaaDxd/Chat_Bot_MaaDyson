import React, { useEffect, useRef, useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
    conversations,
    activeConversation,
    onNewChat,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    userName
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [openConversationMenu, setOpenConversationMenu] = useState(null);
    const [renamingIndex, setRenamingIndex] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const renameInputRef = useRef(null);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    useEffect(() => {
        const onDocMouseDown = (e) => {
            const target = e.target;
            const canClosest = target && typeof target.closest === 'function';

            // Cerrar menú de 3 puntos si se clickea fuera
            if (!canClosest || !target.closest('.conversation-menu-wrapper')) {
                setOpenConversationMenu(null);
            }
        };

        const onDocKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOpenConversationMenu(null);
                setRenamingIndex(null);
            }
        };

        document.addEventListener('mousedown', onDocMouseDown);
        document.addEventListener('keydown', onDocKeyDown);
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown);
            document.removeEventListener('keydown', onDocKeyDown);
        };
    }, []);

    useEffect(() => {
        if (renamingIndex !== null) {
            // esperar a que renderice
            setTimeout(() => renameInputRef.current?.focus(), 0);
        }
    }, [renamingIndex]);

    const startRename = (index) => {
        setOpenConversationMenu(null);
        setRenamingIndex(index);
        setRenameValue(conversations[index]?.title || '');
    };

    const commitRename = (index) => {
        const next = (renameValue || '').trim();
        if (next) {
            onRenameConversation?.(index, next);
        }
        setRenamingIndex(null);
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
                                {renamingIndex === index ? (
                                    <input
                                        ref={renameInputRef}
                                        className="conversation-rename-input"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                commitRename(index);
                                            }
                                            if (e.key === 'Escape') {
                                                e.preventDefault();
                                                setRenamingIndex(null);
                                            }
                                        }}
                                        onBlur={() => commitRename(index)}
                                    />
                                ) : (
                                    <div className="conversation-title">{conversation.title}</div>
                                )}
                                <div className="conversation-date">{conversation.date}</div>
                            </div>
                            <div className="conversation-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="conversation-menu-btn"
                                    title="Opciones"
                                    onClick={() => setOpenConversationMenu(openConversationMenu === index ? null : index)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                </button>

                                {openConversationMenu === index && (
                                    <div className="conversation-menu" role="menu">
                                        <button className="conversation-menu-item" onClick={() => startRename(index)}>
                                            <span className="menu-icon" aria-hidden="true">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            Rename
                                        </button>
                                        <button
                                            className="conversation-menu-item danger"
                                            onClick={() => {
                                                setOpenConversationMenu(null);
                                                onDeleteConversation(index);
                                            }}
                                        >
                                            <span className="menu-icon" aria-hidden="true">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6 6l1 14h10l1-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </span>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
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
