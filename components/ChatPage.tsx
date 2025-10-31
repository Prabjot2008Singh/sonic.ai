import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import { getAiResponse } from '../services/geminiService';
import { Message, Page } from '../types';
import { SparklesIcon, TrashIcon } from './Icons';
import ConfirmationDialog from './ConfirmationDialog';

const WELCOME_MESSAGE: Message = {
    id: 0,
    text: "🎵 Welcome to Sonic.AI! I can understand your emotions. Just tell me how you're feeling!",
    sender: 'ai',
};

const emotionThemes = {
    happy: { gradient: 'from-yellow-400 via-orange-400 to-pink-500', primary: 'from-yellow-500 to-orange-500' },
    sad: { gradient: 'from-blue-400 via-indigo-400 to-purple-500', primary: 'from-blue-500 to-indigo-500' },
    romantic: { gradient: 'from-pink-400 via-rose-400 to-red-500', primary: 'from-pink-500 to-rose-500' },
    energetic: { gradient: 'from-orange-500 via-red-500 to-pink-600', primary: 'from-orange-500 to-red-500' },
    stressed: { gradient: 'from-indigo-400 via-purple-400 to-pink-500', primary: 'from-indigo-500 to-purple-500' },
    anxious: { gradient: 'from-violet-400 via-purple-500 to-fuchsia-500', primary: 'from-violet-500 to-purple-500' },
    calm: { gradient: 'from-green-400 via-teal-400 to-blue-500', primary: 'from-green-500 to-teal-500' },
    angry: { gradient: 'from-red-500 via-pink-500 to-purple-600', primary: 'from-red-500 to-pink-500' },
    lonely: { gradient: 'from-slate-400 via-gray-400 to-zinc-500', primary: 'from-slate-500 to-gray-500' },
    tired: { gradient: 'from-cyan-400 via-sky-400 to-blue-500', primary: 'from-cyan-500 to-sky-500' },
    motivated: { gradient: 'from-amber-500 via-orange-500 to-red-600', primary: 'from-amber-500 to-orange-500' },
    peaceful: { gradient: 'from-emerald-400 via-teal-400 to-cyan-500', primary: 'from-emerald-500 to-teal-500' },
    excited: { gradient: 'from-fuchsia-500 via-pink-500 to-rose-600', primary: 'from-fuchsia-500 to-pink-500' },
    neutral: { gradient: 'from-purple-500 via-pink-500 to-orange-500', primary: 'from-purple-500 to-pink-500' }
};

interface ChatPageProps {
  onNavigate: (page: Page) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const theme = emotionThemes[currentEmotion as keyof typeof emotionThemes] || emotionThemes.neutral;

    const addBotMessage = (text: string, songs?: any[]) => {
         const aiMessage: Message = {
            id: Date.now(),
            text,
            sender: 'ai',
            songs,
        };
        setMessages(prev => [...prev, aiMessage]);
    }

    const handleSendMessage = async (text: string) => {
        const userMessage: Message = {
            id: Date.now(),
            text,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const lowerInput = text.toLowerCase().trim();
        
        const creatorKeywords = ['who built', 'who created', 'who developed', 'who made', 'your creator', 'your developer', 'prabjot singh', 'prabjot'];
        if (creatorKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => addBotMessage('🌟 I was built and developed by Mr. Prabjot Singh! He created Sonic.AI to understand human emotions through AI and recommend music that touches your heart. His vision was to combine advanced AI with music therapy for emotional well-being. 🎵'), 500);
            setIsLoading(false);
            return;
        }

        const whoAreYouKeywords = ['who are you', 'what are you', 'who r u', 'introduce yourself'];
        if (whoAreYouKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => addBotMessage("🎵 Hi! I'm SONIC.AI - your AI-powered music companion! I'm designed to understand your emotions and recommend the perfect Punjabi & Bollywood songs to match or improve your mood. I was created by Mr. Prabjot Singh to help you 'Feel the Magic in Every Beat'! Just tell me how you're feeling, and I'll find the perfect song for you! ✨"), 500);
            setIsLoading(false);
            return;
        }

        const purposeKeywords = ['what is your purpose', 'your purpose', 'what do you do', 'what can you do', 'app purpose', 'why were you created'];
        if (purposeKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => addBotMessage("🎯 My purpose is to:\n\n🤖 Analyze your emotions using advanced AI\n🎵 Recommend Punjabi & Bollywood songs that match or improve your mood\n💚 Promote emotional well-being through music therapy\n🌐 Provide instant access to your favorite music platforms\n\nI was created by Mr. Prabjot Singh to make music discovery emotional and intelligent! Feel the Magic in Every Beat! ✨"), 500);
            setIsLoading(false);
            return;
        }

        const thanksKeywords = ['thank', 'thanks', 'appreciate'];
        if (thanksKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => addBotMessage("😊 You're welcome! I'm happy to help brighten your day with music! Keep feeling the magic in every beat! 🎵💫"), 500);
            setIsLoading(false);
            return;
        }

        const greetingKeywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        if (greetingKeywords.some(keyword => lowerInput.startsWith(keyword))) {
            setTimeout(() => addBotMessage("Hello there! It's wonderful to see you. How are you feeling today? Tell me, and I'll find the perfect soundtrack for your moment."), 500);
            setIsLoading(false);
            return;
        }

        const howAreYouKeywords = ['how are you', "how's it going", "what's up", 'hw r u'];
        if (howAreYouKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => addBotMessage("I'm doing wonderfully, thank you for asking! I'm here and ready to find the perfect music for you. How are you feeling right now?"), 500);
            setIsLoading(false);
            return;
        }

        const farewellKeywords = ['bye', 'goodbye', 'see you', 'cya', 'take care'];
        if (farewellKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => addBotMessage("Goodbye for now! I hope the music brought you some joy. Feel free to return whenever you need a song for your mood. Take care! 🎵"), 500);
            setIsLoading(false);
            return;
        }

        try {
            const { mood, songs, responseText } = await getAiResponse(text);
            setCurrentEmotion(mood);
            addBotMessage(responseText, songs);
        } catch (error) {
            addBotMessage("I'm sorry, I had trouble finding songs. Please try a different mood or check your connection.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setCurrentEmotion('neutral');
    };

    const confirmAndResetChat = () => {
        handleResetChat();
        setIsConfirmDialogOpen(false);
    };

    return (
        <div className={`w-full min-h-screen bg-gradient-to-br ${theme.gradient} text-white transition-all duration-1000`}>
            <main className="w-full h-screen flex flex-col items-center p-2 sm:p-4">
               <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
                <header className="flex-shrink-0 bg-white/95 backdrop-blur rounded-t-2xl shadow-2xl p-4 sm:p-5 mt-0 sm:mt-4 md:mt-8 relative">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                         <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            SONIC.AI
                        </h1>
                    </div>
                     <p className="text-center text-xs sm:text-sm text-gray-600 italic mb-3">Feel the Magic in Every Beat</p>
                     <div className={`flex items-center justify-center gap-2 p-2 sm:p-3 bg-gradient-to-r ${theme.primary} text-white rounded-full shadow-lg text-xs sm:text-sm`}>
                        <SparklesIcon className="w-4 h-4" />
                        <span className="font-semibold">Emotion: {currentEmotion.toUpperCase()}</span>
                    </div>
                    <button 
                        onClick={() => setIsConfirmDialogOpen(true)}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center space-x-2 p-2 text-gray-500 hover:bg-black/10 rounded-full transition-colors"
                        aria-label="Reset chat"
                    >
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                </header>
                <div className="flex-grow w-full min-h-0">
                   <ChatInterface messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} theme={theme} currentEmotion={currentEmotion} />
                </div>
                 <footer className="flex-shrink-0 text-center py-3 sm:py-4 text-white/90 text-xs sm:text-sm px-4">
                    <div className="flex justify-center items-center space-x-4 mb-2">
                        <button onClick={() => onNavigate('about')} className="hover:underline">About</button>
                        <button onClick={() => onNavigate('terms')} className="hover:underline">Terms</button>
                        <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy</button>
                    </div>
                    <p className="mb-1 text-xs sm:text-sm">✨ Made with ❤ in India ✨</p>
                    <p className="text-[10px] sm:text-xs opacity-75">🎵 Feel the Magic in Every Beat 🎵</p>
                </footer>
              </div>
            </main>
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmAndResetChat}
                title="Clear Chat History"
                message="Are you sure you want to clear the entire conversation? This action cannot be undone."
            />
        </div>
    );
};

export default ChatPage;