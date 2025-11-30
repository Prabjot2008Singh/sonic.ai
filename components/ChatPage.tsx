import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { getAiResponse } from '../services/geminiService';
import { Message, Page, Song, HistoryEntry, Theme } from '../types';
import { MenuIcon } from './Icons';
import ConfirmationDialog from './ConfirmationDialog';
import QueueModal from './QueueModal';
import HistoryModal from './HistoryModal';
import OnboardingTour from './OnboardingTour';
import SettingsModal from './SettingsModal';
import ApiKeyModal from './ApiKeyModal';
import Sidebar from './Sidebar';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import PlatformModal from './PlatformModal';

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
    reflective: { gradient: 'from-gray-400 via-cyan-400 to-blue-500', primary: 'from-gray-500 to-cyan-500' },
    nostalgic: { gradient: 'from-orange-300 via-amber-400 to-yellow-500', primary: 'from-orange-400 to-amber-400' },
    adventurous: { gradient: 'from-lime-400 via-green-500 to-emerald-600', primary: 'from-lime-500 to-green-500' },
    confused: { gradient: 'from-slate-500 via-violet-500 to-indigo-600', primary: 'from-slate-500 to-violet-500' },
    grateful: { gradient: 'from-rose-300 via-pink-400 to-fuchsia-400', primary: 'from-rose-400 to-pink-400' },
    hopeful: { gradient: 'from-sky-300 via-cyan-300 to-teal-400', primary: 'from-sky-400 to-cyan-400' },
    playful: { gradient: 'from-fuchsia-400 via-pink-500 to-orange-400', primary: 'from-fuchsia-500 to-pink-500' },
    proud: { gradient: 'from-amber-400 via-yellow-400 to-orange-400', primary: 'from-amber-500 to-yellow-500' },
    surprised: { gradient: 'from-yellow-300 via-cyan-400 to-lime-400', primary: 'from-yellow-400 to-cyan-400' },
    loved: { gradient: 'from-red-500 via-rose-500 to-pink-500', primary: 'from-red-500 to-rose-500' },
    neutral: { gradient: 'from-purple-500 via-pink-500 to-orange-500', primary: 'from-purple-500 to-pink-500' }
};

interface ChatPageProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userName: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ theme, setTheme, userName }) => {
    const getInitialMessages = (name: string): Message[] => [
        {
            id: 0,
            text: `Hi ${name}, Welcome to Sonic AI! First, let's personalize your experience.`,
            sender: 'ai',
            type: 'text'
        },
        {
            id: 1,
            text: "Please select your preferred music languages or industries from the list below.",
            sender: 'ai',
            type: 'language-selection'
        }
    ];

    const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(userName));
    const [isLoading, setIsLoading] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isClearQueueConfirmOpen, setIsClearQueueConfirmOpen] = useState(false);
    const [languageSelectionDone, setLanguageSelectionDone] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [queue, setQueue] = useState<Song[]>([]);
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const [isInitialSetup, setIsInitialSetup] = useState(true);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [apiKeyError, setApiKeyError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mainContent, setMainContent] = useState<Page>('chat');
    const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
    const [selectedSongForPlatform, setSelectedSongForPlatform] = useState<Song | null>(null);


    const tourSteps = [
        {
          selector: '#language-selector-container',
          title: 'Select Your Music',
          content: "First, pick your favorite music languages or industries. This helps us find songs you'll truly love.",
          position: 'top',
        },
        {
          selector: '#chat-input',
          title: 'Share Your Mood',
          content: "Great! Now, tell us how you're feeling. For example, 'I'm feeling happy' or 'I had a stressful day'.",
          position: 'top',
        },
        {
          selector: '#quick-moods-contextual',
          title: 'Quick Moods',
          content: 'In a hurry? Use these quick mood buttons for instant recommendations based on common feelings.',
          position: 'top',
        },
        {
          selector: '#sidebar-toggle',
          title: 'Explore More Features',
          content: 'You can access all app features from the sidebar. Click here to open it.',
          position: 'right',
        },
        {
            selector: '#sidebar-queue-button',
            title: 'Your Song Queue',
            content: "When you add songs to your queue, they'll appear here. You can reorder or listen to them later.",
            position: 'right',
        },
        {
            selector: '#sidebar-history-button',
            title: 'Song History',
            content: "We keep a history of all the songs we've recommended, so you can always find them again.",
            position: 'right',
        },
        {
            selector: '#sidebar-settings-button',
            title: 'Customize Your Experience',
            content: 'Open the settings menu to change your theme, language preferences, and more.',
            position: 'right',
        },
        {
            selector: '#settings-change-music-languages',
            title: 'Change Languages',
            content: 'Want to explore music from different cultures? You can change your language preferences here anytime.',
            position: 'top',
        },
        {
            selector: '#settings-change-api-key',
            title: 'Update API Key',
            content: 'If you need to use a different API key, you can update it here.',
            position: 'top',
        },
        {
          selector: '#chat-container',
          title: "You're All Set!",
          content: 'Enjoy your personalized music journey. Feel the magic in every beat!',
          position: 'bottom',
        }
    ] as const;
    
    // Effect to manage UI state during onboarding tour
    useEffect(() => {
        if (!showOnboarding) return;
        const currentStepConfig = tourSteps[tourStep];
        if (!currentStepConfig) return;

        if (['#sidebar-queue-button', '#sidebar-history-button', '#sidebar-settings-button'].includes(currentStepConfig.selector)) {
            setIsSidebarOpen(true);
        } else if (tourStep > 0 && tourStep < 4) {
             setIsSidebarOpen(false);
        }

        if (['#settings-change-music-languages', '#settings-change-api-key'].includes(currentStepConfig.selector)) {
            setIsSettingsOpen(true);
            setIsSidebarOpen(true);
        } else {
            setIsSettingsOpen(false);
        }
    }, [tourStep, showOnboarding]);

    useEffect(() => {
        const savedApiKey = localStorage.getItem('gemini-api-key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
        } else {
            // Immediately prompt for API key if it's not found on load.
            setIsApiKeyModalOpen(true);
        }
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        if (!onboardingComplete) {
            setShowOnboarding(true);
        }
    }, []);

    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini-api-key', key);
        setIsApiKeyModalOpen(false);
        setApiKeyError(null);
    };

    const emotionTheme = emotionThemes[currentEmotion as keyof typeof emotionThemes] || emotionThemes.neutral;

    const handleAddToQueue = (song: Song) => {
        if (!queue.some(s => s.id === song.id)) {
            setQueue(prev => [...prev, song]);
        }
    };
    
    const handleSongClick = (song: Song) => {
      setSelectedSongForPlatform(song);
      setIsPlatformModalOpen(true);
    };

    const handleRemoveFromQueue = (songToRemove: Song) => {
        setQueue(prev => prev.filter(song => song.id !== songToRemove.id));
    };

    const handleClearQueue = () => {
        setIsClearQueueConfirmOpen(true);
    };
    
    const confirmAndClearQueue = () => {
        setQueue([]);
        setIsQueueOpen(false);
        setIsClearQueueConfirmOpen(false);
    };

    const handleReorderQueue = (newQueue: Song[]) => {
        setQueue(newQueue);
    };

    const handleOnboardingClose = () => {
        setShowOnboarding(false);
        setIsSidebarOpen(false);
        setIsSettingsOpen(false);
        localStorage.setItem('onboardingComplete', 'true');
    };

    const handleLanguageConfirm = (languages: string[]) => {
        let finalLanguages = languages;
        if (languages.length === 0) {
            finalLanguages = ['Bollywood - Hindi', 'Pollywood - Punjabi'];
        }
        setSelectedLanguages(finalLanguages);
        setLanguageSelectionDone(true);

        const userLangMessage: Message = {
            id: Date.now(),
            text: `Selected: ${finalLanguages.map(l => {
                const parts = l.split(' - ');
                return parts.length > 1 ? parts[1] : parts[0];
            }).join(', ')}.`,
            sender: 'user',
        };
        
        const followUpText = isInitialSetup 
            ? "Awesome choice! Now, how are you feeling today?"
            : "Great, your preferences have been updated! So, what's the mood now?";

        const botNextStepMessage: Message = {
            id: Date.now() + 1,
            text: followUpText,
            sender: 'ai',
            type: 'quick_moods',
        };
        setMessages(prev => [...prev.filter(m => m.type !== 'language-selection'), userLangMessage, botNextStepMessage]);
        
        if (showOnboarding) {
            setTourStep(1);
        }

        if (isInitialSetup) {
            setIsInitialSetup(false);
        }
    };

    const addBotMessage = (text: string, songs?: Song[], user?: { firstName: string }, mood?: string) => {
         const aiMessage: Message = {
            id: Date.now(),
            text,
            sender: 'ai',
            songs,
            user,
            mood,
            type: songs && songs.length > 0 ? 'discover_more' : 'text',
        };
        setMessages(prev => [...prev, aiMessage]);
    }

    const handleChangeLanguageClick = () => {
        setMainContent('chat');
        if (!languageSelectionDone) return;

        setLanguageSelectionDone(false);
        if (isInitialSetup) {
            setIsInitialSetup(false);
        }

        const changeLangMessage: Message = {
            id: Date.now(),
            text: "Of course! Please select your new preferred music languages or industries below.",
            sender: 'ai',
            type: 'language-selection',
        };
        setMessages(prev => [...prev, changeLangMessage]);
    };
    
    const handleDiscoverMore = (message: Message) => {
        if (message.mood) {
            handleSendMessage(`DISCOVER_MORE_${message.mood}`);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!apiKey) {
            setIsApiKeyModalOpen(true);
            setApiKeyError("Please enter your API key to start chatting.");
            return;
        }

        const isDiscoverMore = text.startsWith('DISCOVER_MORE_');

        if (!isDiscoverMore) {
            const userMessage: Message = {
                id: Date.now(),
                text,
                sender: 'user',
                user: { firstName: userName },
            };
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.sender === 'ai' && lastMessage.type === 'quick_moods') {
                    const updatedLastMessage = { ...lastMessage, type: 'text' as const };
                    return [...prev.slice(0, -1), updatedLastMessage, userMessage];
                } else {
                    return [...prev, userMessage];
                }
            });
        }
        
        setIsLoading(true);
        
        try {
            const { intent, mood, songs, responseText } = await getAiResponse(text, selectedLanguages, apiKey);

            if (intent === 'change_language') {
                const changeLangMessage: Message = {
                    id: Date.now() + 1,
                    text: responseText,
                    sender: 'ai',
                    type: 'language-selection',
                };
                setMessages(prev => [...prev, changeLangMessage]);
                setLanguageSelectionDone(false);
            } else {
                setCurrentEmotion(mood);
                const songsWithIds: Song[] = songs.map((song, index) => ({
                    ...song,
                    id: `${Date.now()}-${index}`
                }));
    
                if (songsWithIds.length > 0) {
                    const newHistoryEntries: HistoryEntry[] = songsWithIds.map(song => ({
                        song,
                        mood: mood,
                        timestamp: Date.now() + Math.random(),
                    }));
                    setHistory(prev => [...prev, ...newHistoryEntries]);
                }
    
                addBotMessage(responseText, songsWithIds, undefined, mood);
            }
        } catch (error: any) {
            console.error("Error fetching AI response:", error);
            if (error.message.includes('API key is not valid')) {
                setApiKeyError(error.message);
                setIsApiKeyModalOpen(true);
            } else {
                addBotMessage(error.message || "I'm sorry, I had trouble processing that. Could you please try rephrasing?");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetChat = () => {
        setMessages(getInitialMessages(userName));
        setCurrentEmotion('neutral');
        setLanguageSelectionDone(false);
        setSelectedLanguages([]);
        setQueue([]);
        setHistory([]);
        setIsInitialSetup(true);
    };

    const confirmAndResetChat = () => {
        handleResetChat();
        setIsConfirmDialogOpen(false);
    };

    const handleRevisitTour = () => {
        setIsSettingsOpen(false);
        localStorage.removeItem('onboardingComplete');
        setTourStep(0);
        setShowOnboarding(true);
    };
    
    const handleSettingsChangeLanguage = () => {
        setIsSettingsOpen(false);
        handleChangeLanguageClick();
    };

    const handleChangeApiKey = () => {
        setIsSettingsOpen(false);
        setIsApiKeyModalOpen(true);
    };

    const renderMainContent = () => {
        switch (mainContent) {
            case 'chat':
                return (
                    <div id="chat-container" className="flex-grow w-full h-full">
                       <ChatInterface 
                            messages={messages} 
                            isLoading={isLoading} 
                            onSendMessage={handleSendMessage} 
                            theme={emotionTheme} 
                            isInputDisabled={!apiKey || !languageSelectionDone}
                            onLanguageConfirm={handleLanguageConfirm}
                            isLanguageSelectionDone={languageSelectionDone}
                            onAddToQueue={handleAddToQueue}
                            queue={queue}
                            onDiscoverMore={handleDiscoverMore}
                            onSongClick={handleSongClick}
                        />
                    </div>
                );
            case 'about':
                return <AboutPage />;
            case 'terms':
                return <TermsPage />;
            case 'privacy':
                return <PrivacyPage />;
            case 'contact':
                return <ContactPage />;
            default:
                return null;
        }
    };

    return (
        <div className={`w-full min-h-screen bg-gradient-to-br ${emotionTheme.gradient} dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-black text-white transition-all duration-1000`}>
            <div className="flex h-screen w-full">
                <Sidebar
                    isOpen={isSidebarOpen}
                    queueCount={queue.length}
                    onOpenQueue={() => setIsQueueOpen(true)}
                    onOpenHistory={() => setIsHistoryOpen(true)}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onNavigate={(page) => setMainContent(page)}
                />
                <main className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
                    <div className="flex-grow flex flex-col p-2 sm:p-4 min-h-0">
                        <header className="flex-shrink-0 flex items-center mb-2 sm:mb-4 h-[44px]">
                             <button
                                id="sidebar-toggle"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Toggle sidebar"
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                            {!isSidebarOpen && (
                                <h1 className="text-xl font-bold text-white ml-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                    SONIC AI
                                </h1>
                            )}
                            {mainContent === 'chat' && (
                                <div className={`flex items-center justify-center gap-2 ml-auto p-2 sm:px-3 bg-gradient-to-r ${emotionTheme.primary} text-white rounded-full shadow-lg text-xs sm:text-sm`}>
                                    <span className="font-semibold hidden sm:inline">Emotion: </span>
                                    <span className="font-semibold capitalize">{currentEmotion}</span>
                                </div>
                            )}
                        </header>
                        <div className="flex-grow w-full h-full bg-black/10 dark:bg-white/5 rounded-2xl shadow-inner overflow-hidden min-h-0">
                           {renderMainContent()}
                        </div>
                    </div>
                </main>
            </div>
            
            <PlatformModal
                isOpen={isPlatformModalOpen}
                onClose={() => setIsPlatformModalOpen(false)}
                song={selectedSongForPlatform}
            />
            <ApiKeyModal 
                isOpen={isApiKeyModalOpen}
                onSave={handleSaveApiKey}
                lastError={apiKeyError}
            />
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmAndResetChat}
                title="Clear Chat History"
                message="Are you sure you want to clear the entire conversation? This action cannot be undone."
                confirmButtonText="Clear Chat"
            />
            <ConfirmationDialog
                isOpen={isClearQueueConfirmOpen}
                onClose={() => setIsClearQueueConfirmOpen(false)}
                onConfirm={confirmAndClearQueue}
                title="Clear Song Queue"
                message="Are you sure you want to clear your entire song queue? This action cannot be undone."
                confirmButtonText="Clear Queue"
            />
            <QueueModal
                isOpen={isQueueOpen}
                onClose={() => setIsQueueOpen(false)}
                queue={queue}
                onRemoveFromQueue={handleRemoveFromQueue}
                onClearQueue={handleClearQueue}
                onReorderQueue={handleReorderQueue}
            />
            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onAddToQueue={(song) => handleAddToQueue(song)}
                queue={queue}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                theme={theme}
                onSetTheme={setTheme}
                onClearChat={() => {
                    setIsSettingsOpen(false);
                    setIsConfirmDialogOpen(true);
                }}
                onRevisitTour={handleRevisitTour}
                onChangeLanguage={handleSettingsChangeLanguage}
                onChangeApiKey={handleChangeApiKey}
            />
            <OnboardingTour
                isOpen={showOnboarding}
                onClose={handleOnboardingClose}
                steps={tourSteps}
                currentStep={tourStep}
                onStepChange={setTourStep}
            />
        </div>
    );
};

export default ChatPage;