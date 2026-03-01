import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search as SearchIcon,
  Plus,
  Pencil,
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
  const [activeSidebarItem, setActiveSidebarItem] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [showEditNoteForm, setShowEditNoteForm] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(false);
  
  // Form states for creating new note
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteMasterPassword, setNewNoteMasterPassword] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [editNoteMasterPassword, setEditNoteMasterPassword] = useState('');
  const [updatingNote, setUpdatingNote] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  
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
      await axios.post(`${API_BASE_URL}/notes/`, {
        title: newNoteTitle,
        content: newNoteContent,
        master_password: newNoteMasterPassword,
      });
      
      setSaveMessage('Catatan berhasil disimpan dan dienkripsi!');
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
      setSaveMessage('Gagal menyimpan catatan: ' + (error.response?.data?.detail || error.message));
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

      if (pendingEdit) {
        setShowEditNoteForm(true);
        setEditNoteTitle(response.data.title || '');
        setEditNoteContent(response.data.decrypted_content || '');
        setEditNoteMasterPassword('');
        setEditMessage('');
        setPendingEdit(false);
      }
    } catch (error) {
      setDecryptError((error.response?.data?.detail || 'Master password salah atau terjadi kesalahan'));
    } finally {
      setDecryptingNote(false);
    }
  };

  const handleSelectNote = (noteId, editAfterDecrypt = false) => {
    setActiveCard(noteId);
    setDecryptedNote(null);
    setDecryptPassword('');
    setDecryptError('');
    setShowNewNoteForm(false);
    setShowEditNoteForm(false);
    setPendingEdit(editAfterDecrypt);
  };

  const handleBackToList = () => {
    setActiveCard(null);
    setDecryptedNote(null);
    setDecryptPassword('');
    setDecryptError('');
    setShowEditNoteForm(false);
    setEditMessage('');
    setPendingEdit(false);
  };

  const handleNewNote = () => {
    setShowNewNoteForm(true);
    setShowEditNoteForm(false);
    setActiveCard(null);
    setDecryptedNote(null);
    setSaveMessage('');
    setPendingEdit(false);
  };

  const handleStartEditNote = () => {
    if (!decryptedNote) return;
    setShowEditNoteForm(true);
    setShowNewNoteForm(false);
    setEditNoteTitle(decryptedNote.title || '');
    setEditNoteContent(decryptedNote.decrypted_content || '');
    setEditNoteMasterPassword('');
    setEditMessage('');
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!activeCard) return;

    setUpdatingNote(true);
    setEditMessage('');
    try {
      await axios.put(`${API_BASE_URL}/notes/${activeCard}`, {
        title: editNoteTitle,
        content: editNoteContent,
        master_password: editNoteMasterPassword,
      });

      setEditMessage('Catatan berhasil diupdate!');
      setDecryptedNote({
        ...decryptedNote,
        title: editNoteTitle,
        decrypted_content: editNoteContent,
      });
      await fetchNotes();
      setEditNoteMasterPassword('');

      setTimeout(() => {
        setShowEditNoteForm(false);
        setEditMessage('');
      }, 1200);
    } catch (error) {
      setEditMessage('Gagal update catatan: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUpdatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = window.confirm('Hapus catatan ini? Tindakan ini tidak bisa dibatalkan.');
    if (!isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`);
      if (activeCard === noteId) {
        setActiveCard(null);
        setDecryptedNote(null);
        setShowEditNoteForm(false);
      }
      await fetchNotes();
    } catch (error) {
      alert('Gagal hapus catatan: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sidebar menu items
  const mainMenuItems = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'search', icon: SearchIcon, label: 'Search' },
    { key: 'updates', icon: Bell, label: 'Updates' },
  ];

  const workspaceItems = [
    { key: 'workspace', icon: Users, label: 'Workspace' },
    { key: 'shared', icon: Share2, label: 'Shared' },
    { key: 'archive', icon: Archive, label: 'Archive' },
    { key: 'trash', icon: Trash2, label: 'Trash' },
    { key: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#D0D4D8] overflow-hidden text-base text-[#545453]">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="w-64 bg-[#C0C7CC] border-r border-[#A8B0B5] p-5 flex flex-col">
        {/* Workspace Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-semibold text-[#545453] tracking-tight">My Workspace</h2>
            <p className="text-base text-[#6E777B] mt-0.5">Personal</p>
          </div>
        </div>

        {/* Main Menu Section */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#6E777B] uppercase tracking-[0.14em] mb-3 px-2">Menu</p>
          <nav className="space-y-1.5">
            {mainMenuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeSidebarItem === item.key;
              return (
                <motion.button
                  key={idx}
                  onClick={() => setActiveSidebarItem(item.key)}
                  whileHover={{ x: isActive ? 0 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#E7EAEC] text-[#545453] shadow-sm ring-1 ring-[#A8B0B5]'
                      : 'text-[#6E777B] hover:bg-[#D0D4D8] hover:text-[#545453]'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span className="text-base font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Workspace Section */}
        <div className="mb-6 flex-1">
          <p className="text-sm font-semibold text-[#6E777B] uppercase tracking-[0.14em] mb-3 px-2">Workspace</p>
          <nav className="space-y-1.5">
            {workspaceItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeSidebarItem === item.key;
              return (
                <motion.button
                  key={idx}
                  onClick={() => setActiveSidebarItem(item.key)}
                  whileHover={{ x: isActive ? 0 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#E7EAEC] text-[#545453] shadow-sm ring-1 ring-[#A8B0B5]'
                      : 'text-[#6E777B] hover:bg-[#D0D4D8] hover:text-[#545453]'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span className="text-base font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* New Page Button */}
        <motion.button 
          onClick={handleNewNote}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 mx-auto rounded-full bg-[#545453] text-[#E7EAEC] flex items-center justify-center hover:bg-[#6A7276] transition-colors"
          title="New Note"
          aria-label="New Note"
        >
          <Plus size={18} strokeWidth={2} />
        </motion.button>
      </div>

      {/* ===== MIDDLE COLUMN ===== */}
      <div className="w-80 bg-[#E7EAEC] border-r border-[#A8B0B5] flex flex-col p-4">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[#8D979A]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#D0D4D8] border border-[#A8B0B5] text-base text-[#545453] placeholder-[#6E777B] focus:outline-none focus:ring-2 focus:ring-[#8D979A] focus:bg-[#E7EAEC] transition-all"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 overflow-y-auto flex-1">
          {loadingNotes ? (
            <div className="flex items-center justify-center py-8 text-[#6E777B]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-base">Loading notes...</span>
            </div>
          ) : filteredNotes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-base text-center py-8 text-[#6E777B]"
            >
              <p className="text-base">
                {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredNotes.map((note, idx) => {
                const isActiveNote = activeCard === note.id;
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className={`w-full p-4 rounded-2xl transition-all ${
                      isActiveNote ? 'bg-[#8D979A] text-[#E7EAEC]' : 'bg-transparent hover:bg-[#D0D4D8]'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectNote(note.id)}
                      className="w-full text-left"
                    >
                      <h3 className={`font-semibold text-lg mb-2 ${isActiveNote ? 'text-[#E7EAEC]' : 'text-[#545453]'}`}>
                        {note.title}
                      </h3>
                      <p className={`text-base ${isActiveNote ? 'text-[#D0D4D8]' : 'text-[#8D979A]'}`}>
                        {note.date}
                      </p>
                    </button>

                    <motion.div 
                      className="mt-3 flex justify-end gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.button
                        onClick={() => handleSelectNote(note.id, true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-1.5 rounded-md transition-colors ${
                          isActiveNote
                            ? 'hover:bg-[#6A7276] text-[#E7EAEC]'
                            : 'hover:bg-[#C0C7CC] text-[#6E777B]'
                        }`}
                        title="Edit"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteNote(note.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-1.5 rounded-md transition-colors ${
                          isActiveNote
                            ? 'hover:bg-[#6A7276] text-[#E7EAEC]'
                            : 'hover:bg-[#C0C7CC] text-[#6E777B]'
                        }`}
                        title="Delete"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ===== RIGHT COLUMN / EDITOR AREA ===== */}
      <div className="flex-1 bg-[#E7EAEC] flex flex-col relative overflow-hidden">
        {/* Top Right Navigation */}
        <motion.div 
          className="flex items-center justify-end gap-4 p-6 border-b border-[#A8B0B5]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-base font-medium text-[#6E777B] cursor-pointer hover:text-[#545453]"
          >Updates</motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-base font-medium text-[#6E777B] cursor-pointer hover:text-[#545453]"
          >Share</motion.span>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 hover:bg-[#D0D4D8] rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-[#6E777B]" />
          </motion.button>
        </motion.div>

        {/* Editor Content - Dynamic based on state */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center pt-12 pb-20">
          <div className="max-w-3xl w-full px-8">
            <AnimatePresence mode="wait">
            
              {/* View: New Note Form */}
              {showNewNoteForm && (
              <motion.div
                key="new-note-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-[#545453] mb-3">Create New Note</h1>
                <p className="text-lg text-[#6E777B] mb-8">Your note will be encrypted with your master password</p>

                <form onSubmit={handleCreateNote} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      required
                      className="w-full text-2xl font-semibold border-0 border-b-2 border-[#A8B0B5] focus:border-[#8D979A] outline-none pb-3 placeholder-[#8D979A] bg-transparent"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Start typing your note content..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      required
                      rows={12}
                      className="w-full text-base leading-relaxed border-2 border-[#A8B0B5] rounded-xl p-4 focus:border-[#8D979A] outline-none resize-none placeholder-[#8D979A] bg-[#D0D4D8]"
                    />
                  </div>

                  <div className="border-t-2 border-[#C0C7CC] pt-6">
                    <label className="block text-base font-medium text-[#545453] mb-2">
                      Master Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter master password to encrypt"
                      value={newNoteMasterPassword}
                      onChange={(e) => setNewNoteMasterPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                    />
                    <p className="text-sm text-[#6E777B] mt-2">
                      Remember this password - you'll need it to decrypt your note
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={savingNote}
                      whileHover={{ scale: savingNote ? 1 : 1.02 }}
                      whileTap={{ scale: savingNote ? 1 : 0.98 }}
                      className="flex-1 bg-[#545453] text-[#E7EAEC] py-3 px-6 rounded-lg font-medium hover:bg-[#6A7276] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {savingNote ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>Save & Encrypt</>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowNewNoteForm(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border-2 border-[#A8B0B5] rounded-lg font-medium hover:bg-[#D0D4D8] transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>

                  {saveMessage && (
                    <div className="p-4 rounded-lg bg-[#D0D4D8] text-[#545453] border border-[#A8B0B5]">
                      {saveMessage}
                    </div>
                  )}
                </form>
              </motion.div>
              )}

              {/* View: Decrypt Note Form */}
              {!showNewNoteForm && activeCard && !decryptedNote && (
              <motion.div
                key="decrypt-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-[#545453] mb-3">Unlock Note</h1>
                <p className="text-lg text-[#6E777B] mb-8">Enter your master password to decrypt this note</p>

                <form onSubmit={handleDecryptNote} className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-[#545453] mb-2">
                      Master Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter master password"
                      value={decryptPassword}
                      onChange={(e) => setDecryptPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={decryptingNote}
                      whileHover={{ scale: decryptingNote ? 1 : 1.02 }}
                      whileTap={{ scale: decryptingNote ? 1 : 0.98 }}
                      className="flex-1 bg-[#545453] text-[#E7EAEC] py-3 px-6 rounded-lg font-medium hover:bg-[#6A7276] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {decryptingNote ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Decrypting...
                        </>
                      ) : (
                        <>Unlock Note</>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleBackToList}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border-2 border-[#A8B0B5] rounded-lg font-medium hover:bg-[#D0D4D8] transition-colors"
                    >
                      Back
                    </motion.button>
                  </div>

                  {decryptError && (
                    <div className="p-4 rounded-lg bg-[#D0D4D8] text-[#545453] border border-[#A8B0B5]">
                      {decryptError}
                    </div>
                  )}
                </form>
              </motion.div>
              )}

              {/* View: Edit Note Form */}
              {!showNewNoteForm && showEditNoteForm && (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-[#545453] mb-3">Edit Note</h1>
                <p className="text-lg text-[#6E777B] mb-8">Update note lalu enkripsi lagi dengan master password</p>

                <form onSubmit={handleUpdateNote} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={editNoteTitle}
                      onChange={(e) => setEditNoteTitle(e.target.value)}
                      required
                      className="w-full text-2xl font-semibold border-0 border-b-2 border-[#A8B0B5] focus:border-[#8D979A] outline-none pb-3 placeholder-[#8D979A] bg-transparent"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Update your note content..."
                      value={editNoteContent}
                      onChange={(e) => setEditNoteContent(e.target.value)}
                      required
                      rows={12}
                      className="w-full text-base leading-relaxed border-2 border-[#A8B0B5] rounded-xl p-4 focus:border-[#8D979A] outline-none resize-none placeholder-[#8D979A] bg-[#D0D4D8]"
                    />
                  </div>

                  <div className="border-t-2 border-[#C0C7CC] pt-6">
                    <label className="block text-base font-medium text-[#545453] mb-2">
                      Master Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter master password to re-encrypt"
                      value={editNoteMasterPassword}
                      onChange={(e) => setEditNoteMasterPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={updatingNote}
                      whileHover={{ scale: updatingNote ? 1 : 1.02 }}
                      whileTap={{ scale: updatingNote ? 1 : 0.98 }}
                      className="flex-1 bg-[#545453] text-[#E7EAEC] py-3 px-6 rounded-lg font-medium hover:bg-[#6A7276] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {updatingNote ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>Save Changes</>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowEditNoteForm(false);
                        setEditMessage('');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border-2 border-[#A8B0B5] rounded-lg font-medium hover:bg-[#D0D4D8] transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>

                  {editMessage && (
                    <div className="p-4 rounded-lg bg-[#D0D4D8] text-[#545453] border border-[#A8B0B5]">
                      {editMessage}
                    </div>
                  )}
                </form>
              </motion.div>
              )}

              {/* View: Decrypted Note Content */}
              {!showNewNoteForm && !showEditNoteForm && decryptedNote && (
              <motion.div
                key="note-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h1 className="text-4xl font-bold text-[#545453]">
                    {decryptedNote.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={handleStartEditNote}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#A8B0B5] text-[#545453] hover:bg-[#D0D4D8] transition-colors"
                    >
                      <Pencil size={16} />
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteNote(activeCard)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#8D979A] text-[#545453] hover:bg-[#D0D4D8] transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="bg-[#D0D4D8] rounded-xl p-6 border-2 border-[#A8B0B5]">
                    <pre className="whitespace-pre-wrap font-sans text-lg text-[#545453] leading-relaxed">
                      {decryptedNote.decrypted_content}
                    </pre>
                  </div>
                </div>

                <div className="mt-8">
                  <motion.button
                    onClick={handleBackToList}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border-2 border-[#A8B0B5] rounded-lg font-medium hover:bg-[#D0D4D8] transition-colors"
                  >
                    Back to Notes
                  </motion.button>
                </div>
              </motion.div>
              )}

              {/* View: Welcome/Empty State */}
              {!showNewNoteForm && !showEditNoteForm && !activeCard && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h1 className="text-4xl font-bold text-[#545453] mb-4">
                  Welcome to Secure Notes
                </h1>
                <p className="text-[#6E777B] text-lg mb-8">
                  Create a new encrypted note or select one from the list
                </p>
                <motion.button
                  onClick={handleNewNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-[#545453] text-[#E7EAEC] py-3 px-8 rounded-lg font-medium hover:bg-[#6A7276] transition-colors"
                >
                  <Plus size={20} />
                  Create Your First Note
                </motion.button>
              </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
};

export default NoteApp;
