import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

const Notification = ({ type = 'info', message, onClose, duration = 3000 }) => {
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
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  const Icon = icons[type] || FiInfo;

  return (
    <>
      <div
        className={`fixed top-4 right-4 z-[9999] ${colors[type]} border-2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
        style={{
          animation: 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      >
        <Icon className="flex-shrink-0" size={24} />
        <p className="flex-1 font-medium text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-black/10"
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

export default Notification;

