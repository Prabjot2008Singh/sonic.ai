import React from 'react';
import { Message, Song } from '../types';
import { PlusIcon, CheckIcon } from './Icons';
import LanguageSelector from './LanguageSelector';

interface MessageBubbleProps {
  message: Message;
  onLanguageConfirm?: (languages: string[]) => void;
  isLanguageSelectionDone?: boolean;
  onAddToQueue: (song: Song) => void;
  queue: Song[];
  onDiscoverMore?: (message: Message) => void;
  onSongClick: (song: Song) => void;
  onQuickMoodSelect: (mood: string) => void;
}

const quickMoods = ['happy', 'sad', 'romantic', 'energetic', 'calm'];


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onLanguageConfirm, isLanguageSelectionDone, onAddToQueue, queue, onDiscoverMore, onSongClick, onQuickMoodSelect }) => {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    // FIX: Corrected typo from `onLanguageconfirm` to `onLanguageConfirm`.
    if (message.type === 'language-selection' && !isLanguageSelectionDone && onLanguageConfirm) {
        return (
          <div id="language-selector-container">
            <p className="mb-3 whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
            <LanguageSelector onConfirm={onLanguageConfirm} />
          </div>
        );
    }
    
    if (message.type === 'quick_moods') {
      return (
        <div>
           <p className="mb-3 whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
           <div id="quick-moods-contextual" className="flex flex-wrap gap-2 justify-center mt-3">
            {quickMoods.map((mood) => (
              <button
                key={mood}
                onClick={() => onQuickMoodSelect(mood)}
                className="px-3 py-1 rounded-full bg-white/30 dark:bg-gray-800/60 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-white/50 dark:hover:bg-gray-800/90 transition-all transform hover:scale-105 shadow capitalize whitespace-nowrap"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (message.songs && message.songs.length > 0) {
      return (
        <div>
          <p className="mb-3 whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {message.songs.map((song) => {
                const isQueued = queue.some(s => s.title === song.title && s.artist === song.artist);
                return (
                  <div 
                    key={song.id} 
                    className="flex flex-col text-left p-3 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                    onClick={() => onSongClick(song)}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{song.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{song.artist}</p>
                      </div>
                      <div className="flex items-center -mr-2 -mt-1 pl-2">
                          <button
                              onClick={(e) => {
                                  e.stopPropagation(); // Prevent modal from opening
                                  !isQueued && onAddToQueue(song);
                              }}
                              className={`p-2 rounded-full transition-colors ${
                                  isQueued ? 'text-green-600 dark:text-green-400 cursor-default' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                              }`}
                              aria-label={isQueued ? "Song is in queue" : "Add to queue"}
                          >
                              {isQueued ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                          </button>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
           {onDiscoverMore && message.type === 'discover_more' && (
             <div className="mt-4 flex justify-center">
                <button
                    onClick={() => onDiscoverMore(message)}
                    className="px-4 py-2 bg-white/30 dark:bg-gray-800/60 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-full text-xs font-semibold hover:bg-white/50 dark:hover:bg-gray-800/90 transition-all transform hover:scale-105"
                >
                    Discover More
                </button>
            </div>
           )}
        </div>
      );
    }
    return <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>;
  };

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
       {!isUser && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="Sonic AI Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
        )}
      <div className={`max-w-[85%] sm:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 sm:px-5 sm:py-3 shadow-lg ${isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
        {message.user && <p className="font-bold text-sm mb-1">{message.user.firstName}</p>}
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;