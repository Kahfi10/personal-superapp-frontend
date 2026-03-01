import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Plus,
  ZoomIn,
  Download,
} from 'lucide-react';

const GO_API_BASE = 'http://localhost:8080';

const PhotoAlbumLibrary = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Upload form states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Sample photos (karena API belum sepenuhnya siap)
  useEffect(() => {
    // Untuk sementara gunakan dummy data
    setPhotos([
      {
        id: 1,
        title: 'Nature',
        description: 'Beautiful scenery',
        file_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      },
      {
        id: 2,
        title: 'Sunset',
        description: 'Golden hour',
        file_url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869',
      },
      {
        id: 3,
        title: 'Mountains',
        description: 'Majestic peaks',
        file_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      },
    ]);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('description', uploadDescription);
    formData.append('image', uploadFile);

    try {
      // Uncomment ketika API sudah siap
      // const response = await fetch(`${GO_API_BASE}/photos`, {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulasi upload (untuk sementara)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUploadMessage('Photo berhasil diupload!');
      setUploadTitle('');
      setUploadDescription('');
      setUploadFile(null);
      setPreviewUrl(null);

      setTimeout(() => {
        setShowUploadForm(false);
        setUploadMessage('');
      }, 2000);
    } catch (error) {
      setUploadMessage('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#545453] mb-2">Photo Album</h1>
          <p className="text-lg text-[#6E777B]">Your personal photo collection</p>
        </div>
        <motion.button
          onClick={() => setShowUploadForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 bg-[#545453] text-[#E7EAEC] py-3 px-6 rounded-lg font-medium hover:bg-[#6A7276] transition-colors"
        >
          <Plus size={20} />
          Upload Photo
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
              className="bg-[#E7EAEC] rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#545453]">Upload Photo</h2>
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
                {previewUrl && (
                  <div className="mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#545453] mb-2">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8]"
                    placeholder="Enter photo title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#545453] mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-[#A8B0B5] rounded-lg focus:border-[#8D979A] outline-none bg-[#D0D4D8] resize-none"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#545453] mb-2">
                    Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <div className="bg-[#E7EAEC] rounded-2xl overflow-hidden">
                <img
                  src={selectedPhoto.file_url}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#545453] mb-2">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-[#6E777B]">{selectedPhoto.description}</p>
                </div>
              </div>
              <motion.button
                onClick={() => setSelectedPhoto(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 p-3 bg-[#545453] text-[#E7EAEC] rounded-full"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photos Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#6E777B]" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={64} className="mx-auto text-[#A8B0B5] mb-4" />
            <h3 className="text-xl font-semibold text-[#545453] mb-2">No photos yet</h3>
            <p className="text-[#6E777B]">Upload your first photo to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedPhoto(photo)}
                className="cursor-pointer group relative rounded-xl overflow-hidden border-2 border-[#A8B0B5] hover:border-[#8D979A] transition-all"
              >
                <div className="aspect-square overflow-hidden bg-[#D0D4D8]">
                  <img
                    src={photo.file_url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{photo.title}</h3>
                    <p className="text-sm text-gray-300">{photo.description}</p>
                  </div>
                  <div className="absolute top-3 right-3">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
                    >
                      <ZoomIn size={20} className="text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoAlbumLibrary;
