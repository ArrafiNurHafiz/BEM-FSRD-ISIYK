import React, { useState } from 'react';
import { FiHelpCircle, FiX } from 'react-icons/fi';

const HelpBadge = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ml-2"
        type="button"
      >
        <FiHelpCircle size={14} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="text-gray-600 whitespace-pre-line">{content}</div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpBadge;

