import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya, Hapus', cancelText = 'Batal', type = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <FiAlertTriangle
              className={type === 'danger' ? 'text-red-600' : 'text-yellow-600'}
              size={24}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${colors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

