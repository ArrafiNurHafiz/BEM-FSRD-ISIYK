import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

const Toast = ({ type = 'info', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    info: FiInfo,
    warning: FiAlertCircle,
  };

  const colors = {
    success: 'bg-gradient-to-r from-green-600 to-green-700 border-green-500 text-white',
    error: 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white',
    info: 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500 text-white',
  };

  const Icon = icons[type] || FiInfo;

  return (
    <>
      <div
        className={`fixed top-4 right-4 z-[9999] ${colors[type]} border-2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md`}
        style={{
          animation: 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      >
        <Icon className="flex-shrink-0" size={24} />
        <p className="flex-1 font-medium text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity p-1 rounded-full hover:bg-white/20"
          aria-label="Tutup notifikasi"
        >
          <FiX size={18} />
        </button>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(calc(100% + 16px));
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Toast;

