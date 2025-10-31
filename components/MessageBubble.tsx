import React from 'react';
import { Message } from '../types';
import { SparklesIcon, YoutubeIcon, PlayIcon, ShareIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
  currentEmotion: string;
}

const platforms = [
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'youtubemusic', name: 'YT Music', color: 'bg-red-500 hover:bg-red-600' },
    { id: 'spotify', name: 'Spotify', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'gaana', name: 'Gaana', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'jiosaavn', name: 'JioSaavn', color: 'bg-green-500 hover:bg-green-600' },
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
      default:
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentEmotion }) => {
  const isUser = message.sender === 'user';

  const handleShare = async (songTitle: string, artist: string) => {
    const shareData = {
      title: 'Sonic.ai Music Recommendation',
      text: `Sonic.ai recommended '${songTitle}' by ${artist} for my ${currentEmotion} mood! 🎶 #SonicAI #${currentEmotion}`,
      url: 'https://sonic-ai-music.netlify.app/',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Sharing is not supported on this browser.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderContent = () => {
    if (message.songs && message.songs.length > 0) {
      return (
        <div>
          <p className="mb-3 whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
          <ul className="space-y-3">
            {message.songs.map((song, index) => (
              <li key={index} className="flex flex-col p-3 bg-gray-200/80 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{song.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{song.artist}</p>
                  </div>
                  <button 
                    onClick={() => handleShare(song.title, song.artist)}
                    className="p-2 -mr-2 -mt-1 text-gray-500 hover:text-purple-600 hover:bg-gray-300 rounded-full transition-colors"
                    aria-label="Share song"
                  >
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-start mt-2 gap-2 flex-wrap">
                    {platforms.map((platform) => (
                      <a
                        key={platform.id}
                        href={getPlatformURL(song.title, song.artist, platform.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 ${platform.color} text-white rounded-full text-xs font-medium transition-transform transform hover:scale-105 shadow-lg`}
                      >
                        {platform.id === 'youtube' ? <YoutubeIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                        {platform.name}
                      </a>
                    ))}
                  </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>;
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 sm:px-5 sm:py-3 shadow-lg ${isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
        {!isUser && <SparklesIcon className="inline w-4 h-4 mr-1 text-purple-600" />}
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;