import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

const FormToast = ({ type = 'info', message, onClose, duration = 5000, formRef }) => {
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
    success: {
      bg: 'bg-gradient-to-r from-green-600 to-green-700',
      border: 'border-green-500',
      iconBg: 'bg-green-500',
      text: 'text-white',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-600 to-red-700',
      border: 'border-red-500',
      iconBg: 'bg-red-500',
      text: 'text-white',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      border: 'border-blue-500',
      iconBg: 'bg-blue-500',
      text: 'text-white',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-500',
      text: 'text-white',
    },
  };

  const Icon = icons[type] || FiInfo;
  const colorScheme = colors[type] || colors.info;

  return (
    <>
      <div
        className={`${colorScheme.bg} ${colorScheme.border} border-2 rounded-xl shadow-2xl px-6 py-4 w-full`}
        style={{
          animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          zIndex: 1000,
        }}
      >
        <div className="flex items-center gap-3">
          <Icon className={`flex-shrink-0 ${colorScheme.text}`} size={24} />
          <p className={`flex-1 ${colorScheme.text} font-medium text-sm leading-relaxed`}>
            {message}
          </p>
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${colorScheme.text} hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-white/20`}
            aria-label="Tutup notifikasi"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default FormToast;

