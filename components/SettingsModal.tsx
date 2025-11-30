import React from 'react';
import { Theme } from '../types';
import { TrashIcon, SunIcon, MoonIcon, RefreshCwIcon, LanguageIcon, CloseIcon, SystemThemeIcon, KeyIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
  onClearChat: () => void;
  onRevisitTour: () => void;
  onChangeLanguage: () => void;
  onChangeApiKey: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, onSetTheme, onClearChat, onRevisitTour, onChangeLanguage, onChangeApiKey }) => {
  if (!isOpen) return null;

  const themeOptions: { value: Theme; label: string; icon: React.ReactElement }[] = [
    { value: 'light', label: 'Light', icon: <SunIcon className="w-5 h-5" /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon className="w-5 h-5" /> },
    { value: 'system', label: 'System', icon: <SystemThemeIcon className="w-5 h-5" /> },
  ];

  const settingsOptions = [
    { 
        id: 'settings-change-api-key',
        icon: <KeyIcon className="w-5 h-5" />, 
        label: 'Change API Key', 
        action: onChangeApiKey 
    },
    { 
        id: 'settings-change-music-languages',
        icon: <LanguageIcon className="w-5 h-5" />, 
        label: 'Change Music Languages', 
        action: onChangeLanguage 
    },
    { 
      id: 'settings-revisit-tour',
      icon: <RefreshCwIcon className="w-5 h-5" />, 
      label: 'Re-View Onboarding Tour', 
      action: onRevisitTour 
    },
    { 
      id: 'settings-clear-chat',
      icon: <TrashIcon className="w-5 h-5 text-red-500" />, 
      label: 'Clear Chat History', 
      action: onClearChat, 
      isDestructive: true 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm m-4 text-gray-800 dark:text-gray-200 transform transition-all animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
            aria-label="Close settings"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-grow p-2">
           <div className="p-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                    {themeOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => onSetTheme(option.value)}
                            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-md text-xs font-semibold transition-colors ${
                                theme === option.value
                                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
                            }`}
                        >
                            {option.icon}
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
          <ul className="space-y-1 mt-2">
            {settingsOptions.map((option, index) => (
              <li key={index}>
                <button
                  id={option.id}
                  onClick={option.action}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                    option.isDestructive
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                      : 'dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={option.isDestructive ? '' : 'text-gray-600 dark:text-gray-400'}>{option.icon}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
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

export default SettingsModal;