import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Music,
  Image as ImageIcon,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import Dashboard from './Dashboard';
import NoteApp from './NoteApp';
import MusicLibrary from './MusicLibrary';
import PhotoAlbumLibrary from './PhotoAlbumLibrary';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'home', label: 'Dashboard', path: '/', icon: Home },
    { id: 'notes', label: 'Secure Notes', path: '/notes', icon: FileText },
    { id: 'music', label: 'Music Library', path: '/music', icon: Music },
    { id: 'photos', label: 'Photo Album', path: '/photos', icon: ImageIcon },
    { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <Router>
      <div className="flex h-screen bg-[#E7EAEC]">
        {/* Sidebar */}
        <div className="w-72 hidden md:flex flex-col bg-white shadow-xl border-r border-[#D0D4D8] h-screen overflow-y-auto">
          <div className="flex flex-col h-full p-6">
            {/* App Logo/Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                SuperApp
              </h1>
              <p className="text-xs text-[#6E777B] mt-1">Your Personal Workspace</p>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Motion.a
                    key={item.id}
                    href={item.path}
                    whileHover={{ x: 8, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#545453] hover:bg-[#D0D4D8] transition-all group"
                  >
                    <IconComponent size={20} className="group-hover:text-blue-600" />
                    <span className="font-medium">{item.label}</span>
                  </Motion.a>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-[#D0D4D8] pt-4">
              <p className="text-xs text-[#6E777B] text-center">
                SuperApp v1.0 · 2026
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/30 z-30 md:hidden"
              />
              <Motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }}
                className="fixed left-0 top-0 h-screen w-72 bg-white shadow-xl border-r border-[#D0D4D8] z-40"
              >
                <div className="flex flex-col h-full p-6">
                  {/* App Logo/Title */}
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                      SuperApp
                    </h1>
                    <p className="text-xs text-[#6E777B] mt-1">Your Personal Workspace</p>
                  </div>

                  {/* Navigation Items */}
                  <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Motion.a
                          key={item.id}
                          href={item.path}
                          onClick={() => setSidebarOpen(false)}
                          whileHover={{ x: 8, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#545453] hover:bg-[#D0D4D8] transition-all group"
                        >
                          <IconComponent size={20} className="group-hover:text-blue-600" />
                          <span className="font-medium">{item.label}</span>
                        </Motion.a>
                      );
                    })}
                  </nav>

                  {/* Footer */}
                  <div className="border-t border-[#D0D4D8] pt-4">
                    <p className="text-xs text-[#6E777B] text-center">
                      SuperApp v1.0 · 2026
                    </p>
                  </div>
                </div>
              </Motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white shadow-sm border-b border-[#D0D4D8] px-6 py-4 flex items-center gap-4">
            <Motion.button
              whileHover={{ scale: 1.12, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-[#D0D4D8] transition-colors md:hidden"
            >
              {sidebarOpen ? (
                <X size={24} className="text-[#545453]" />
              ) : (
                <Menu size={24} className="text-[#545453]" />
              )}
            </Motion.button>
            <div className="flex-1" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/notes" element={<NoteApp />} />
              <Route path="/music" element={<MusicLibrary />} />
              <Route path="/photos" element={<PhotoAlbumLibrary />} />
              <Route path="/settings" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
