import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Keyframes dan Media Queries untuk animasi & responsive
const animationStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(128, 128, 128, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(128, 128, 128, 0);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .card-enter {
    animation: slideUp 0.6s ease-out forwards;
  }

  .button-pulse {
    animation: pulse 2s infinite;
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  input:focus, textarea:focus {
    animation: fadeIn 0.3s ease-out;
  }

  /* Desktop Styles */
  @media (min-width: 1024px) {
    body {
      font-size: 16px;
    }
  }

  /* Tablet Styles */
  @media (min-width: 768px) and (max-width: 1023px) {
    body {
      font-size: 15px;
    }
  }

  /* Mobile Styles */
  @media (max-width: 767px) {
    body {
      font-size: 14px;
    }
  }
`;

const styles = {
  globalContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', sans-serif",
    background: '#f5f5f5',
    backgroundAttachment: 'fixed',
  },
  navbar: {
    padding: 'clamp(12px, 4vw, 20px) clamp(16px, 5vw, 40px)',
    background: '#f9f9f9',
    display: 'flex',
    gap: 'clamp(16px, 8vw, 40px)',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e8e8e8',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: 'clamp(14px, 3vw, 16px)',
    transition: 'all 0.3s ease',
    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
    borderRadius: '6px',
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  mainContent: {
    flex: 1,
    padding: 'clamp(30px, 8vw, 60px) clamp(16px, 5vw, 40px)',
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
    gap: 'clamp(24px, 6vw, 40px)',
    maxWidth: '1400px',
    width: '100%',
    animation: 'slideUp 0.8s ease-out',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 'clamp(12px, 4vw, 20px)',
    padding: 'clamp(24px, 6vw, 40px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 'clamp(20px, 5vw, 28px)',
    fontWeight: '700',
    marginBottom: 'clamp(8px, 2vw, 12px)',
    marginTop: 0,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    color: '#6c757d',
    marginBottom: 'clamp(16px, 4vw, 25px)',
    fontWeight: '500',
  },
  inputField: {
    width: '100%',
    padding: 'clamp(10px, 3vw, 14px) clamp(12px, 3vw, 18px)',
    marginBottom: 'clamp(12px, 3vw, 16px)',
    border: '2px solid #e0e0e0',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    fontSize: 'clamp(13px, 3vw, 15px)',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
  },
  inputFocus: {
    borderColor: '#808080',
    boxShadow: '0 0 0 4px rgba(128, 128, 128, 0.15)',
    backgroundColor: 'white',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: 'clamp(12px, 3vw, 16px) clamp(16px, 3vw, 24px)',
    marginTop: 'clamp(8px, 2vw, 12px)',
    border: 'none',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    fontSize: 'clamp(13px, 3vw, 16px)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
    touchAction: 'manipulation',
  },
  buttonPrimary: {
    background: '#808080',
  },
  buttonSecondary: {
    background: '#999999',
  },
  successBox: {
    marginTop: 'clamp(16px, 4vw, 24px)',
    padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 24px)',
    background: 'linear-gradient(135deg, #f5f5f5 0%, #efefef 100%)',
    borderLeft: '5px solid #808080',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    color: '#333',
    animation: 'slideUp 0.4s ease-out',
    boxShadow: '0 5px 15px rgba(128, 128, 128, 0.1)',
  },
  errorBox: {
    marginTop: 'clamp(16px, 4vw, 24px)',
    padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 24px)',
    background: 'linear-gradient(135deg, #f5f5f5 0%, #efefef 100%)',
    borderLeft: '5px solid #888888',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    color: '#666',
    animation: 'slideUp 0.4s ease-out',
    boxShadow: '0 5px 15px rgba(128, 128, 128, 0.1)',
  },
  decryptedBox: {
    marginTop: 'clamp(16px, 4vw, 24px)',
    padding: 'clamp(16px, 4vw, 24px)',
    background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
    border: '2px solid #999999',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    color: '#555',
    animation: 'slideUp 0.4s ease-out',
    boxShadow: '0 10px 30px rgba(128, 128, 128, 0.1)',
  },
  successBoxText: {
    margin: '0 0 clamp(6px, 2vw, 10px) 0',
    fontWeight: '600',
    fontSize: 'clamp(14px, 3vw, 16px)',
  },
  successBoxCode: {
    margin: 'clamp(8px, 2vw, 12px) 0',
    fontSize: 'clamp(12px, 2vw, 14px)',
    background: 'rgba(255, 255, 255, 0.8)',
    padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2vw, 14px)',
    borderRadius: '6px',
    wordBreak: 'break-all',
    overflowWrap: 'break-word',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(76, 175, 80, 0.5)',
    fontFamily: 'monospace',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idCopyButton: {
    marginLeft: 'clamp(6px, 2vw, 10px)',
    padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
    background: '#808080',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: 'clamp(11px, 2vw, 12px)',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  decryptedTitle: {
    margin: '0 0 clamp(10px, 3vw, 14px) 0',
    fontSize: 'clamp(16px, 4vw, 20px)',
    fontWeight: '600',
  },
  decryptedContent: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.7',
    fontSize: 'clamp(13px, 3vw, 15px)',
    color: '#555',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },
};

// --- KOMPONEN: NOTES (Apple Notes macOS Style) ---
const Notes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [savedNoteId, setSavedNoteId] = useState('');
  const [savedUserId, setSavedUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [allNotes, setAllNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptedData, setDecryptedData] = useState(null);
  const [decryptError, setDecryptError] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(true);

  // Fetch notes dari database
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/notes/');
        if (response.data.notes) {
          const formattedNotes = response.data.notes.map(note => ({
            id: note.id,
            title: note.title,
            date: note.date,
            snippet: '' // Backend akan expand ini nanti
          }));
          setAllNotes(formattedNotes);
        }
        setLoadingNotes(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setLoadingNotes(false);
      }
    };
    
    fetchNotes();
  }, []);

  const copyToClipboard = (text, idType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(idType);
      setTimeout(() => setCopiedId(''), 2000);
    });
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = animationStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSaveNote = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/notes/', {
        title: title,
        content: content,
        master_password: masterPassword
      });
      setSaveMessage(response.data.message);
      setSavedNoteId(response.data.note_id);
      setSavedUserId(response.data.user_id);
      
      // Add note to sidebar
      const newNote = { 
        id: response.data.note_id, 
        title: title, 
        date: new Date().toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'}), 
        snippet: content.substring(0, 60) + (content.length > 60 ? '...' : ''), 
        folder: 'Notes',
        created_at: new Date().toISOString()
      };
      setAllNotes([newNote, ...allNotes]);
      setSelectedNoteId(response.data.note_id);
      setTitle('');
      setContent('');
      setMasterPassword('');
      setShowSaveForm(false);
    } catch (error) {
      setSaveMessage('❌ ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // macOS Notes Style Toolbar
  const toolbarStyle = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      gap: '20px',
    },
    trafficLights: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    light: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    toolsCenter: {
      display: 'flex',
      gap: '8px',
      backgroundColor: '#e8e8e8',
      padding: '6px',
      borderRadius: '6px',
    },
    toolIcon: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: '4px',
      fontSize: '16px',
      transition: 'background 0.2s',
    },
    rightTools: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
  };

  const mainLayout = {
    container: {
      display: 'flex',
      height: 'calc(100vh - 60px)',
      background: 'white',
    },
    sidebar: {
      width: showSidebar ? '280px' : '0',
      borderRight: '1px solid #e0e0e0',
      background: '#f9f9f9',
      overflowY: 'auto',
      transition: 'width 0.3s',
      padding: showSidebar ? '16px' : '0',
    },
    content: {
      flex: 1,
      display: 'flex',
      overflowY: 'auto',
      padding: '40px',
    },
  };

  const sidebarItemStyle = {
    container: {
      padding: '12px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: selectedNoteId === '1' ? '#e8e8e8' : 'transparent',
      transition: 'background 0.2s',
      borderLeft: '3px solid ' + (selectedNoteId === '1' ? '#808080' : 'transparent'),
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#000',
      marginBottom: '4px',
    },
    date: {
      fontSize: '12px',
      color: '#999',
    },
    snippet: {
      fontSize: '12px',
      color: '#666',
      marginTop: '4px',
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fafafa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* macOS Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#f9f9f9', borderBottom: '1px solid #e5e5e5', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setShowSidebar(!showSidebar)} style={{ marginLeft: '0px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px', opacity: 0.7 }}>≡</button>
          <span style={{ fontSize: '13px', color: '#888', marginLeft: '4px' }}>All Notes {allNotes.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" placeholder="Search" style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', width: '140px', fontSize: '13px', background: 'white' }} />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}>⋯</button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: 'white' }}>
        {/* Sidebar */}
        <div style={{ 
          width: showSidebar ? '260px' : '0', 
          borderRight: showSidebar ? '1px solid #e5e5e5' : 'none', 
          background: '#f9f9fb', 
          overflowY: 'auto', 
          transition: 'width 0.3s ease',
          flexShrink: 0
        }}>
          {showSidebar && (
            <div style={{ padding: '16px 12px' }}>
              {loadingNotes ? (
                <div style={{ fontSize: '13px', color: '#999', padding: '20px 10px', textAlign: 'center' }}>Loading notes...</div>
              ) : allNotes.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#999', padding: '20px 10px', textAlign: 'center' }}>No notes yet</div>
              ) : (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>RECENT</div>
                  {allNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      style={{
                        padding: '10px 12px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: selectedNoteId === note.id ? '#e8e8eb' : 'transparent',
                        borderLeft: selectedNoteId === note.id ? '3px solid #808080' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedNoteId !== note.id) {
                          e.currentTarget.style.background = '#f0f0f2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedNoteId !== note.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '3px', lineHeight: '1.3', wordBreak: 'break-word' }}>{note.title}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{note.date}</div>
                      <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.4', wordBreak: 'break-word' }}>{note.snippet}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', overflowY: 'auto', padding: '40px 50px', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
          {/* Show New Note when no note is selected */}
          {!selectedNoteId && (
            <div style={{ width: '100%', maxWidth: '600px' }}>
              {showSaveForm ? (
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '600', margin: '0 0 8px 0', color: '#1a1a1a' }}>New Note</h1>
                  <p style={{ fontSize: '15px', color: '#999', marginBottom: '32px' }}>Create and encrypt a new secure note</p>

                  <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                      type="text"
                      placeholder="Note title..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      style={{ fontSize: '18px', fontWeight: '500', border: 'none', borderBottom: '2px solid #e5e5e5', padding: '12px 0', marginBottom: '24px', outline: 'none', background: 'transparent', color: '#1a1a1a', transition: 'border-color 0.2s' }}
                      onFocus={(e) => e.target.style.borderColor = '#808080'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                    />

                    <textarea
                      placeholder="Start typing..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      required
                      style={{ fontSize: '16px', lineHeight: '1.8', border: 'none', padding: '0', minHeight: '300px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', background: 'transparent', color: '#1a1a1a' }}
                    />

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e5e5' }}>
                      <input
                        type="password"
                        placeholder="Master password..."
                        value={masterPassword}
                        onChange={e => setMasterPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #d9d9de', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', outline: 'none', background: '#f9f9fb', transition: 'all 0.2s' }}
                        onFocus={(e) => { e.target.style.borderColor = '#808080'; e.target.style.boxShadow = '0 0 0 3px rgba(128, 128, 128, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          ...styles.button, 
                          ...styles.buttonPrimary, 
                          opacity: isLoading ? 0.6 : 1, 
                          cursor: isLoading ? 'not-allowed' : 'pointer', 
                          width: '100%',
                          fontSize: '16px',
                          padding: '12px 16px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 16px rgba(128, 128, 128, 0.3)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
                      >
                        {isLoading ? 'Saving...' : 'Encrypt & Save'}
                      </button>
                    </div>
                  </form>

                  {saveMessage && !saveMessage.includes('❌') && (
                    <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', color: '#666', animation: 'slideUp 0.4s ease-out' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '500' }}>✓ {saveMessage}</p>
                      {savedNoteId && (
                        <div style={{ fontSize: '12px', background: 'white', padding: '8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace' }}>
                          <span><strong>ID:</strong> {savedNoteId.substring(0, 12)}...</span>
                          <button onClick={() => copyToClipboard(savedNoteId, 'noteId')} style={{ background: '#808080', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                            {copiedId === 'noteId' ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {saveMessage && saveMessage.includes('❌') && (
                    <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', color: '#666', fontSize: '14px', animation: 'slideUp 0.4s ease-out' }}>
                      {saveMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                  <button onClick={() => setShowSaveForm(true)} style={{ background: '#808080', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', boxShadow: '0 8px 20px rgba(128, 128, 128, 0.3)', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 24px rgba(128, 128, 128, 0.4)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 20px rgba(128, 128, 128, 0.3)'; }}
                  >
                    + New Note
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Show Open Note when a note is selected */}
          {selectedNoteId && (
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '600', margin: '0 0 8px 0', color: '#1a1a1a' }}>Open Note</h2>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '32px' }}>Select a note from the sidebar to view or decrypt it</p>
              
              {!decryptedData ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const noteId = selectedNoteId;
                  const password = decryptPassword;
                  axios.post(`http://localhost:8000/notes/${noteId}/decrypt`, { master_password: password })
                    .then(res => setDecryptedData(res.data))
                    .catch(err => setDecryptError('❌ ' + (err.response?.data?.detail || err.message)));
                }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <input
                      type="password"
                      placeholder="Enter master password..."
                      value={decryptPassword}
                      onChange={e => setDecryptPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d9d9de', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9f9fb', transition: 'all 0.2s' }}
                      onFocus={(e) => { e.target.style.borderColor = '#808080'; e.target.style.boxShadow = '0 0 0 3px rgba(128, 128, 128, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', fontSize: '16px', padding: '12px 16px', borderRadius: '8px' }}
                    onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 16px rgba(128, 128, 128, 0.3)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
                  >
                    Unlock
                  </button>
                </form>
              ) : (
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 16px 0', color: '#1a1a1a' }}>{decryptedData.title}</h3>
                  <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '20px', background: '#f9f9fb', borderRadius: '8px', border: '1px solid #e5e5e5', maxHeight: '600px', overflowY: 'auto' }}>
                    {decryptedData.decrypted_content}
                  </div>
                  <button onClick={() => { setSelectedNoteId(null); setDecryptedData(null); setDecryptPassword(''); setDecryptError(''); }} style={{ marginTop: '20px', background: 'none', border: '1px solid #d9d9de', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.target.style.background = '#f9f9fb'; e.target.style.borderColor = '#808080'; e.target.style.color = '#808080'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.borderColor = '#d9d9de'; e.target.style.color = '#666'; }}
                  >
                    ← Back to notes
                  </button>
                </div>
              )}

              {decryptError && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', color: '#666', fontSize: '14px', animation: 'slideUp 0.4s ease-out' }}>
                  {decryptError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN PLACEHOLDER LAINNYA ---
const Gallery = () => (
  <div style={{...styles.card, maxWidth: '600px', width: '100%', textAlign: 'center', animation: 'slideUp 0.6s ease-out'}}>
    <h2 style={styles.cardTitle}>🖼️ Galeri Foto</h2>
    <p style={{fontSize: 'clamp(14px, 3vw, 16px)', color: '#6c757d', marginTop: 'clamp(16px, 4vw, 20px)'}}>Fitur galeri akan segera dihubungkan ke Server Go...</p>
  </div>
);

const Playlist = () => (
  <div style={{...styles.card, maxWidth: '600px', width: '100%', textAlign: 'center', animation: 'slideUp 0.6s ease-out'}}>
    <h2 style={styles.cardTitle}>🎵 Playlist Musik</h2>
    <p style={{fontSize: 'clamp(14px, 3vw, 16px)', color: '#6c757d', marginTop: 'clamp(16px, 4vw, 20px)'}}>Fitur playlist akan segera dihubungkan ke Server Go...</p>
  </div>
);

// --- KOMPONEN UTAMA ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/*" element={
          <div style={styles.globalContainer}>
            <nav style={styles.navbar}>
              <Link
                to="/"
                style={styles.navLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(128, 128, 128, 0.1)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                📝 Notes
              </Link>
              <Link
                to="/gallery"
                style={styles.navLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(128, 128, 128, 0.1)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                🖼️ Gallery
              </Link>
              <Link
                to="/playlist"
                style={styles.navLink}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(128, 128, 128, 0.1)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                🎵 Playlist
              </Link>
            </nav>

            <div style={styles.mainContent}>
              <Routes>
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/playlist" element={<Playlist />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;