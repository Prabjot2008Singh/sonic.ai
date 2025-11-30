import React, { useState, useRef, useEffect } from 'react';
import { Message, Song } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { SendIcon, MicrophoneIcon, StopIcon } from './Icons';

// Web Speech API interfaces for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  theme: { primary: string };
  isInputDisabled: boolean;
  onLanguageConfirm: (languages: string[]) => void;
  isLanguageSelectionDone: boolean;
  onAddToQueue: (song: Song) => void;
  queue: Song[];
  onDiscoverMore: (message: Message) => void;
  onSongClick: (song: Song) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, theme, isInputDisabled, onLanguageConfirm, isLanguageSelectionDone, onAddToQueue, queue, onDiscoverMore, onSongClick }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInputText(finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (inputText.trim()) {
        handleSubmit();
      }
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current?.start();
          setIsRecording(true);
        })
        .catch(err => {
          console.error("Microphone access denied:", err);
          alert("Microphone access is required for voice input. Please allow it in your browser settings.");
        });
    }
  };


  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim() && !isLoading && !isInputDisabled) {
      onSendMessage(inputText);
      setInputText('');
    }
  };
  
  const handleQuickMoodSelect = (mood: string) => {
    if (!isLoading && !isInputDisabled) {
      onSendMessage(mood);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            onLanguageConfirm={onLanguageConfirm}
            isLanguageSelectionDone={isLanguageSelectionDone}
            onAddToQueue={onAddToQueue}
            queue={queue}
            onDiscoverMore={onDiscoverMore}
            onSongClick={onSongClick}
            onQuickMoodSelect={handleQuickMoodSelect}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isInputDisabled ? "Please complete language selection..." : "How are you feeling?"}
            className="flex-1 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-2 sm:py-3 rounded-full border-2 border-purple-300 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 transition-shadow duration-200 text-sm sm:text-base"
            disabled={isLoading || isInputDisabled}
          />
          {recognitionRef.current && !isInputDisabled && (
            <button
                type="button"
                onClick={toggleRecording}
                className={`flex-shrink-0 text-white p-3 sm:p-3.5 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 ${isRecording ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
                {isRecording ? <StopIcon className="h-5 w-5 sm:h-6 sm:h-6" /> : <MicrophoneIcon className="h-5 w-5 sm:h-6 sm:h-6" />}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || isInputDisabled || !inputText.trim()}
            className={`flex-shrink-0 bg-gradient-to-r ${theme.primary} text-white p-3 sm:p-3.5 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110`}
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5 sm:h-6 sm:h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;