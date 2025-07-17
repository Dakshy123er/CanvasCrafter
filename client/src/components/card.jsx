import React, { useState } from 'react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Card = ({ _id, name, prompt, photo, onDelete }) => {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const downloadImage = async () => {
  try {
    const response = await fetch(photo, { mode: 'cors' });
    const blob = await response.blob();

    if (window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({
        suggestedName: `image-${_id || Date.now()}.jpg`,
        types: [
          {
            description: 'JPEG Image',
            accept: { 'image/jpeg': ['.jpg'] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${_id || Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error('Download failed:', err);
    
  }
};



  return (
    <>
      <div
        className="group rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover Image Enlargement */}
        <motion.img
          src={photo}
          alt={prompt}
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={() => setIsEnlarged(true)}
        />

        {/* Prompt Text */}
        
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-white truncate">
            {prompt}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-300">By {name}</p>
        </div>

        {/* Buttons below image on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="hover-buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex justify-center gap-4 p-3 bg-indigo-200"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage();
                }}
                className="text-white bg-[#6366f1] px-3 py-1 rounded-full text-sm hover:bg-[#4f46e5] transition"
              >
                Download
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(_id);
                }}
                className="text-white bg-red-500 px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enlarged View on Click */}
      <AnimatePresence>
        {isEnlarged && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEnlarged(false)}
          >
            <motion.img
              src={photo}
              alt={prompt}
              className="max-w-full h-3/4 rounded-xl shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute top-5 right-5 flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage();
                }}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-300 transition"
                title="Download"
              >
                <FiDownload size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(_id);
                  setIsEnlarged(false);
                }}
                className="bg-white text-red-500 rounded-full p-2 hover:bg-red-100 transition"
                title="Delete"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;
