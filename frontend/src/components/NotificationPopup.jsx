import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

const NotificationPopup = ({ type = 'info', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    info: FiInfo,
    warning: FiAlertCircle,
  };

  const colors = {
    success: {
      bg: 'bg-gradient-to-br from-green-600 to-green-700',
      border: 'border-green-500',
      iconBg: 'bg-green-500',
      text: 'text-white',
    },
    error: {
      bg: 'bg-gradient-to-br from-red-600 to-red-700',
      border: 'border-red-500',
      iconBg: 'bg-red-500',
      text: 'text-white',
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
      border: 'border-blue-500',
      iconBg: 'bg-blue-500',
      text: 'text-white',
    },
    warning: {
      bg: 'bg-gradient-to-br from-yellow-600 to-yellow-700',
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-500',
      text: 'text-white',
    },
  };

  const Icon = icons[type] || FiInfo;
  const colorScheme = colors[type] || colors.info;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Popup Modal - Centered in viewport */}
      <div
        className={`fixed z-[9999] ${colorScheme.bg} ${colorScheme.border} border-2 rounded-2xl shadow-2xl`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 2rem)',
          maxWidth: '28rem',
          minWidth: '20rem',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Icon Section */}
        <div className="flex items-center justify-center pt-6 pb-4">
          <div className={`${colorScheme.iconBg} p-4 rounded-full shadow-lg`}>
            <Icon size={32} className="text-white" />
          </div>
        </div>

        {/* Message Section */}
        <div className="px-6 pb-6">
          <p className={`${colorScheme.text} text-center font-medium text-base leading-relaxed mb-4`}>
            {message}
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 border-white/30 hover:border-white/50"
            aria-label="Tutup notifikasi"
          >
            Tutup
          </button>
        </div>

        {/* Close X Button (Top Right) */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${colorScheme.text} hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-white/20`}
          aria-label="Tutup notifikasi"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default NotificationPopup;

