import React, { useState } from 'react';
import { SparklesIcon } from './Icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
  lastError?: string | null;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, lastError }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!key.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    setError(null);
    onSave(key);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 text-gray-800 dark:text-gray-200 transform transition-all animate-scale-in">
        <div className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <SparklesIcon className="w-8 h-8 text-white" />
             </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 dark:text-white">Enter Your API Key</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            To use Sonic AI, please enter your Google AI Studio API key. Your key will be saved securely in your browser's local storage and will not be shared.
          </p>

          <input
            type="password"
            value={key}
            onChange={(e) => {
                setKey(e.target.value);
                if (error) setError(null);
            }}
            placeholder="Paste your API key here"
            className="w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 transition-shadow duration-200"
          />

          {(error || lastError) && <p className="text-red-500 text-xs mt-3">{error || lastError}</p>}

          <button
            onClick={handleSave}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all hover:scale-105 text-base sm:text-lg"
          >
            Save and Continue
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You can get a free key from{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-purple-500 dark:hover:text-purple-400">
              Google AI Studio
            </a>.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;