import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Home,
  Search as SearchIcon,
  Plus,
  Bell,
  Settings,
  Trash2,
  Archive,
  Share2,
  Users,
  MoreVertical,
  Type,
  Loader2,
} from 'lucide-react';

// API Base URL
const API_BASE_URL = 'http://localhost:8000';

const NoteApp = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  
  // Form states for creating new note
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteMasterPassword, setNewNoteMasterPassword] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // States for decrypting and viewing note
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptedNote, setDecryptedNote] = useState(null);
  const [decryptingNote, setDecryptingNote] = useState(false);
  const [decryptError, setDecryptError] = useState('');

  // Fetch all notes from API on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const response = await axios.get(`${API_BASE_URL}/notes/`);
      setNotes(response.data.notes || []);
      setLoadingNotes(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
      setLoadingNotes(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setSavingNote(true);
    setSaveMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/`, {
        title: newNoteTitle,
        content: newNoteContent,
        master_password: newNoteMasterPassword,
      });
      
      setSaveMessage('✓ Catatan berhasil disimpan dan dienkripsi!');
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteMasterPassword('');
      
      // Refresh notes list
      await fetchNotes();
      
      // Close form after 2 seconds
      setTimeout(() => {
        setShowNewNoteForm(false);
        setSaveMessage('');
      }, 2000);
      
    } catch (error) {
      setSaveMessage('❌ Gagal menyimpan catatan: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSavingNote(false);
    }
  };

  const handleDecryptNote = async (e) => {
    e.preventDefault();
    if (!activeCard) return;
    
    setDecryptingNote(true);
    setDecryptError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/${activeCard}/decrypt`, {
        master_password: decryptPassword,
      });
      
      setDecryptedNote(response.data);
      setDecryptPassword('');
    } catch (error) {
      setDecryptError('❌ ' + (error.response?.data?.detail || 'Master password salah atau terjadi kesalahan'));
    } finally {
      setDecryptingNote(false);
    }
  };

  const handleSelectNote = (noteId) => {
    setActiveCard(noteId);
    setDecryptedNote(null);
    setDecryptPassword('');
    setDecryptError('');
    setShowNewNoteForm(false);
  };

  const handleBackToList = () => {
    setActiveCard(null);
    setDecryptedNote(null);
    setDecryptPassword('');
    setDecryptError('');
  };

  const handleNewNote = () => {
    setShowNewNoteForm(true);
    setActiveCard(null);
    setDecryptedNote(null);
    setSaveMessage('');
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sidebar menu items
  const mainMenuItems = [
    { icon: Home, label: 'Home' },
    { icon: SearchIcon, label: 'Search' },
    { icon: Bell, label: 'Updates' },
  ];

  const workspaceItems = [
    { icon: Users, label: 'Workspace' },
    { icon: Share2, label: 'Shared' },
    { icon: Archive, label: 'Archive' },
    { icon: Trash2, label: 'Trash' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        {/* Workspace Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">My Workspace</h2>
            <p className="text-xs text-gray-500">Personal</p>
          </div>
        </div>

        {/* Main Menu Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Menu</p>
          <nav className="space-y-1">
            {mainMenuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workspace Section */}
        <div className="mb-6 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Workspace</p>
          <nav className="space-y-1">
            {workspaceItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* New Page Button */}
        <button 
          onClick={handleNewNote}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition-colors"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* ===== MIDDLE COLUMN ===== */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col p-4">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 overflow-y-auto flex-1">
          {loadingNotes ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading notes...</span>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">
                {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  activeCard === note.id
                    ? 'bg-orange-400 text-white'
                    : 'bg-transparent hover:bg-gray-50'
                }`}
              >
                <h3 className={`font-semibold text-sm mb-2 ${activeCard === note.id ? 'text-white' : 'text-gray-900'}`}>
                  {note.title}
                </h3>
                <p className={`text-xs ${activeCard === note.id ? 'text-orange-100' : 'text-gray-400'}`}>
                  {note.date}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ===== RIGHT COLUMN / EDITOR AREA ===== */}
      <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
        {/* Top Right Navigation */}
        <div className="flex items-center justify-end gap-4 p-6 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">Updates</span>
          <span className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">Share</span>

          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Editor Content - Dynamic based on state */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center pt-12 pb-20">
          <div className="max-w-3xl w-full px-8">
            
            {/* View: New Note Form */}
            {showNewNoteForm && (
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Note</h1>
                <p className="text-gray-500 mb-8">Your note will be encrypted with your master password</p>

                <form onSubmit={handleCreateNote} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      required
                      className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-200 focus:border-orange-400 outline-none pb-3 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Start typing your note content..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      required
                      rows={12}
                      className="w-full text-base leading-relaxed border-2 border-gray-200 rounded-xl p-4 focus:border-orange-400 outline-none resize-none placeholder-gray-400"
                    />
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔒 Master Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter master password to encrypt"
                      value={newNoteMasterPassword}
                      onChange={(e) => setNewNoteMasterPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Remember this password - you'll need it to decrypt your note
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={savingNote}
                      className="flex-1 bg-orange-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {savingNote ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>Save & Encrypt</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewNoteForm(false)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  {saveMessage && (
                    <div className={`p-4 rounded-lg ${saveMessage.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {saveMessage}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* View: Decrypt Note Form */}
            {!showNewNoteForm && activeCard && !decryptedNote && (
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Unlock Note</h1>
                <p className="text-gray-500 mb-8">Enter your master password to decrypt this note</p>

                <form onSubmit={handleDecryptNote} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔒 Master Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter master password"
                      value={decryptPassword}
                      onChange={(e) => setDecryptPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={decryptingNote}
                      className="flex-1 bg-orange-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {decryptingNote ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Decrypting...
                        </>
                      ) : (
                        <>Unlock Note</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToList}
                      className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  </div>

                  {decryptError && (
                    <div className="p-4 rounded-lg bg-red-50 text-red-700">
                      {decryptError}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* View: Decrypted Note Content */}
            {!showNewNoteForm && decryptedNote && (
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {decryptedNote.title}
                </h1>

                <div className="prose prose-lg max-w-none">
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                      {decryptedNote.decrypted_content}
                    </pre>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleBackToList}
                    className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    ← Back to Notes
                  </button>
                </div>
              </div>
            )}

            {/* View: Welcome/Empty State */}
            {!showNewNoteForm && !activeCard && (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📝</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Secure Notes
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                  Create a new encrypted note or select one from the list
                </p>
                <button
                  onClick={handleNewNote}
                  className="inline-flex items-center gap-2 bg-orange-400 text-white py-3 px-8 rounded-lg font-medium hover:bg-orange-500 transition-colors"
                >
                  <Plus size={20} />
                  Create Your First Note
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute right-6 bottom-6 flex flex-col gap-3">
          <button 
            onClick={handleNewNote}
            className="w-14 h-14 rounded-full bg-orange-400 text-white shadow-lg flex items-center justify-center hover:shadow-xl hover:bg-orange-500 transition-all"
            title="New Note"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteApp;
