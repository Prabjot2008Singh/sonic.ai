import React from 'react';
import { Page } from '../types';
import { QueueIcon, HistoryIcon, SettingsIcon, InfoIcon, FileTextIcon, MailIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  queueCount: number;
  onOpenQueue: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, queueCount, onOpenQueue, onOpenHistory, onOpenSettings, onNavigate }) => {

  const mainNavItems = [
    { id: 'sidebar-queue-button', label: 'Your Song Queue', icon: <QueueIcon className="w-5 h-5" />, action: onOpenQueue, badge: queueCount > 0 ? queueCount : null },
    { id: 'sidebar-history-button', label: 'Song History', icon: <HistoryIcon className="w-5 h-5" />, action: onOpenHistory },
  ];
  
  const secondaryNavItems = [
    { label: 'About', action: () => onNavigate('about') },
    { label: 'Terms', action: () => onNavigate('terms') },
    { label: 'Privacy', action: () => onNavigate('privacy') },
    { label: 'Contact', action: () => onNavigate('contact') },
  ];

  return (
    <aside
      className={`bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-lg flex flex-col h-full transition-all duration-300 ease-in-out shadow-lg overflow-hidden ${
        isOpen ? 'w-64' : 'w-0'
      }`}
    >
      <div className="flex-shrink-0 p-4 flex items-center" style={{ height: '60px' }}>
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SONIC AI
            </h1>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <p className={`px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ${!isOpen && 'opacity-0'}`}>Recent</p>
        <ul className="space-y-1">
          {mainNavItems.map(({ id, label, icon, action, badge }) => (
            <li key={label}>
              <button
                id={id}
                onClick={action}
                title={isOpen ? '' : label}
                className="w-full flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              >
                {icon}
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>{label}</span>
                {badge && (
                  <span className={`ml-auto text-xs font-bold text-white bg-pink-500 rounded-full h-5 w-5 flex items-center justify-center transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>
                    {badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className={`pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 ${!isOpen && 'opacity-0'}`}>
             <ul className="space-y-1">
              {secondaryNavItems.map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="w-full flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-2 mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <p className="flex items-center gap-1.5">✨ Made with ❤️ in India ✨</p>
                <p>🎵 Feel the Magic in Every Beat 🎵</p>
            </div>
        </div>
      </nav>

      <div className="flex-shrink-0 p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          id="sidebar-settings-button"
          onClick={onOpenSettings}
          title={isOpen ? '' : 'Settings'}
          className="w-full flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
        >
          <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;