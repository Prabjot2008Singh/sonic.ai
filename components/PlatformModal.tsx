import React from 'react';
import { Song } from '../types';
import { YoutubeIcon, PlayIcon, CloseIcon, WynkMusicIcon } from './Icons';

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

const platforms = [
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600 hover:bg-red-700', icon: <YoutubeIcon className="w-5 h-5" /> },
    { id: 'youtubemusic', name: 'YT Music', color: 'bg-red-500 hover:bg-red-600', icon: <PlayIcon className="w-5 h-5" /> },
    { id: 'spotify', name: 'Spotify', color: 'bg-green-600 hover:bg-green-700', icon: <PlayIcon className="w-5 h-5" /> },
    { id: 'gaana', name: 'Gaana', color: 'bg-orange-500 hover:bg-orange-600', icon: <PlayIcon className="w-5 h-5" /> },
    { id: 'jiosaavn', name: 'JioSaavn', color: 'bg-green-500 hover:bg-green-600', icon: <PlayIcon className="w-5 h-5" /> },
    { id: 'wynkmusic', name: 'Wynk Music', color: 'bg-red-700 hover:bg-red-800', icon: <WynkMusicIcon className="w-5 h-5" /> },
];

const getPlatformURL = (song: string, artist: string, platform: string) => {
    const searchQuery = encodeURIComponent(`${song} ${artist}`);
    switch(platform) {
      case 'youtube':
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
      case 'youtubemusic':
        return `https://music.youtube.com/search?q=${searchQuery}`;
      case 'spotify':
        return `https://open.spotify.com/search/${searchQuery}`;
      case 'gaana':
        return `https://gaana.com/search/${searchQuery}`;
      case 'jiosaavn':
        return `https://www.jiosaavn.com/search/${searchQuery}`;
      case 'wynkmusic':
        return `https://wynk.in/music/search?q=${searchQuery}`;
      default:
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }
};

const PlatformModal: React.FC<PlatformModalProps> = ({ isOpen, onClose, song }) => {
  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm m-4 text-gray-800 dark:text-gray-200 transform transition-all animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-lg font-bold dark:text-gray-100 truncate">{song.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{song.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 -mr-2 -mt-2 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">Listen on your favorite platform:</p>
            <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                    <a
                        key={platform.id}
                        href={getPlatformURL(song.title, song.artist, platform.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 px-4 py-3 ${platform.color} text-white rounded-lg text-sm font-semibold transition-transform transform hover:scale-105 shadow-md`}
                    >
                        {platform.icon}
                        {platform.name}
                    </a>
                ))}
            </div>
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

export default PlatformModal;