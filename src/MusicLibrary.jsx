

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Upload,
  Loader2,
  Plus,
  X,
} from 'lucide-react';

const GO_API_BASE = 'http://localhost:8080';

const MusicLibrary = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement] = useState(new Audio());

  // Upload form states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadArtist, setUploadArtist] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Sample songs (karena API belum sepenuhnya siap)
  useEffect(() => {
    // Untuk sementara gunakan dummy data
    setSongs([
      {
        id: 1,
        title: 'Boat To Sail',
        artist: 'Unknown Artist',
        file_url: '/media/songs/Boat To Sail.mp3',
      },
    ]);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('artist', uploadArtist);
    formData.append('audio', uploadFile);

    try {
      const response = await fetch(`${GO_API_BASE}/songs`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('Lagu berhasil diupload!');
        setUploadTitle('');
        setUploadArtist('');
        setUploadFile(null);

        setTimeout(() => {
          setShowUploadForm(false);
          setUploadMessage('');
        }, 2000);
      } else {
        setUploadMessage('Gagal upload lagu');
      }
    } catch (error) {
      setUploadMessage('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const playSong = (song) => {
    if (currentSong?.id === song.id && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.src = `${GO_API_BASE}${song.file_url}`;
      audioElement.play();
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audioElement.pause();
    };
  }, [audioElement]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#545453] mb-2">Music Library</h1>
          <p className="text-lg text-[#6E777B]">Your personal music collection</p>
        </div>
        <motion.button
          onClick={() => setShowUploadForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 bg-[#545453] text-[#E7EAEC] py-3 px-6 rounded-lg font-medium hover:bg-[#6A7276] transition-colors"
        >
          <Plus size={20} />
          Upload Song
        </motion.button>
      </div>

      {/* Upload Form Modal */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#E7EAEC] rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#545453]">Upload Song</h2>
                <motion.button
                  onClick={() => setShowUploadForm(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-[#D0D4D8] rounded-lg"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#545453] mb-2">
                    Song Title
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                    placeholder="Enter song title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#545453] mb-2">
                    Artist
                  </label>
                  <input
                    type="text"
                    value={uploadArtist}
                    onChange={(e) => setUploadArtist(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#545453] mb-2">
                    Audio File (MP3)
                  </label>
                  <input
                    type="file"
                    accept="audio/mp3,audio/mpeg"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    required
                    className="w-full px-4 py-2 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className="w-full bg-[#545453] text-[#E7EAEC] py-3 rounded-lg font-medium hover:bg-[#6A7276] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload
                    </>
                  )}
                </motion.button>

                {uploadMessage && (
                  <div className="p-3 rounded-lg bg-[#D0D4D8] text-[#545453] text-center">
                    {uploadMessage}
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#6E777B]" />
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-20">
            <Music size={64} className="mx-auto text-[#A8B0B5] mb-4" />
            <h3 className="text-xl font-semibold text-[#545453] mb-2">No songs yet</h3>
            <p className="text-[#6E777B]">Upload your first song to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {songs.map((song, idx) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentSong?.id === song.id
                    ? 'bg-[#8D979A] border-[#6A7276] text-[#E7EAEC]'
                    : 'bg-[#D0D4D8] border-[#A8B0B5] hover:border-[#8D979A]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => playSong(song)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full ${
                      currentSong?.id === song.id
                        ? 'bg-[#E7EAEC] text-[#545453]'
                        : 'bg-[#545453] text-[#E7EAEC]'
                    }`}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause size={24} />
                    ) : (
                      <Play size={24} />
                    )}
                  </motion.button>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{song.title}</h3>
                    <p
                      className={`text-sm ${
                        currentSong?.id === song.id ? 'text-[#D0D4D8]' : 'text-[#6E777B]'
                      }`}
                    >
                      {song.artist}
                    </p>
                  </div>

                  <Music
                    size={20}
                    className={currentSong?.id === song.id ? 'text-[#E7EAEC]' : 'text-[#8D979A]'}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Now Playing Bar (if playing) */}
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="mt-6 p-4 bg-[#545453] text-[#E7EAEC] rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music size={20} />
                <div>
                  <p className="font-semibold">{currentSong.title}</p>
                  <p className="text-sm text-[#D0D4D8]">{currentSong.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-[#6A7276] rounded-lg"
                >
                  <SkipBack size={20} />
                </motion.button>
                <motion.button
                  onClick={() => playSong(currentSong)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-[#6A7276] rounded-lg"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-[#6A7276] rounded-lg"
                >
                  <SkipForward size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicLibrary;
