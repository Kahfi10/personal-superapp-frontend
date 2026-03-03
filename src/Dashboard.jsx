import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  Music,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  Plus,
  Clock,
  Zap,
  Settings,
  User,
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalSongs: 0,
    totalPhotos: 0,
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isActive = true;

    axios
      .get(`${API_BASE_URL}/notes/`)
      .then((notesResponse) => {
        if (!isActive) return;
        const notes = notesResponse.data.notes || [];

        setStats({
          totalNotes: notes.length,
          totalSongs: 0,
          totalPhotos: 0,
        });

        setRecentNotes(notes.slice(0, 3));
      })
      .catch((error) => {
        if (!isActive) return;
        console.error('Error fetching dashboard data:', error);
      })
      .finally(() => {
        if (isActive) {
          setLoadingStats(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const features = [
    {
      id: 'notes',
      title: 'Secure Notes',
      description: 'Catatan terenkripsi dengan password master',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/notes'),
      count: stats.totalNotes,
    },
    {
      id: 'music',
      title: 'Music Library',
      description: 'Koleksi musik pribadi Anda',
      icon: Music,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/music'),
      count: stats.totalSongs,
    },
    {
      id: 'photos',
      title: 'Photo Album',
      description: 'Galeri foto terorganisir',
      icon: ImageIcon,
      color: 'from-pink-500 to-pink-600',
      action: () => navigate('/photos'),
      count: stats.totalPhotos,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#A8B0B5]">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#545453]">My Workspace</h1>
              <p className="text-[#6E777B] mt-2">Selamat datang kembali</p>
            </div>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')}
              className="p-3 rounded-full bg-[#D0D4D8] hover:bg-[#A8B0B5] transition-colors"
            >
              <Settings size={24} className="text-[#545453]" />
            </Motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        {/* Quick Stats */}
        <Motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-[#D0D4D8]"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <IconComponent size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#545453] mb-2">{feature.title}</h3>
                <p className="text-[#6E777B] text-sm mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#8D979A]">{feature.count}</span>
                  <Motion.button
                    whileHover={{ scale: 1.15, x: 5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.92 }}
                    onClick={feature.action}
                    className="p-2 rounded-lg bg-[#D0D4D8] hover:bg-[#A8B0B5] transition-colors"
                  >
                    <ChevronRight size={20} className="text-[#545453]" />
                  </Motion.button>
                </div>
              </Motion.div>
            );
          })}
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Features Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-[#D0D4D8]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#545453]">Fitur Utama</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => {
                  const IconComponent = feature.icon;
                  return (
                    <Motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                      whileTap={{ scale: 0.96 }}
                      onClick={feature.action}
                      className="p-4 rounded-xl border-2 border-[#D0D4D8] hover:border-[#A8B0B5] hover:bg-[#E7EAEC] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent size={24} className="text-[#545453]" />
                        <h3 className="font-semibold text-[#545453]">{feature.title}</h3>
                      </div>
                      <p className="text-sm text-[#6E777B]">{feature.description}</p>
                    </Motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D0D4D8]">
              <h3 className="text-lg font-bold text-[#545453] mb-4 flex items-center gap-2">
                <Zap size={20} />
                Aksi Cepat
              </h3>
              <div className="space-y-2">
                <Motion.button
                  whileHover={{ scale: 1.03, x: 5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/notes')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#D0D4D8] hover:bg-[#A8B0B5] transition-colors text-[#545453] font-medium"
                >
                  <Plus size={20} />
                  Catatan Baru
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.03, x: 5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/music')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#D0D4D8] hover:bg-[#A8B0B5] transition-colors text-[#545453] font-medium"
                >
                  <Plus size={20} />
                  Upload Musik
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.03, x: 5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/photos')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#D0D4D8] hover:bg-[#A8B0B5] transition-colors text-[#545453] font-medium"
                >
                  <Plus size={20} />
                  Upload Foto
                </Motion.button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D0D4D8]">
              <h3 className="text-lg font-bold text-[#545453] mb-4 flex items-center gap-2">
                <Clock size={20} />
                Aktivitas Terakhir
              </h3>
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-3 border-[#A8B0B5] border-t-[#545453] rounded-full animate-spin"></div>
                </div>
              ) : recentNotes.length === 0 ? (
                <p className="text-[#6E777B] text-sm">Belum ada catatan baru</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentNotes.map((note, idx) => (
                    <Motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                      className="p-3 rounded-lg bg-[#D0D4D8] hover:bg-[#A8B0B5] transition-colors cursor-pointer"
                      onClick={() => navigate('/notes')}
                    >
                      <p className="font-medium text-[#545453] text-sm truncate">{note.title || 'Untitled'}</p>
                      <p className="text-xs text-[#6E777B] mt-1">Catatan terenkripsi</p>
                    </Motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D0D4D8]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#545453]">My Workspace</p>
                  <p className="text-xs text-[#6E777B]">Personal SuperApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-[#D0D4D8]">
          <h2 className="text-2xl font-bold text-[#545453] mb-6">Tentang SuperApp</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-[#545453] mb-2">Catatan Aman</h3>
              <p className="text-[#6E777B] text-sm">Simpan catatan pribadi dengan enkripsi end-to-end</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Music size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-[#545453] mb-2">Musik Pribadi</h3>
              <p className="text-[#6E777B] text-sm">Kelola dan mainkan koleksi lagu favorit Anda</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <ImageIcon size={24} className="text-pink-600" />
              </div>
              <h3 className="font-bold text-[#545453] mb-2">Album Foto</h3>
              <p className="text-[#6E777B] text-sm">Organisir dan tampilkan koleksi foto Anda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
