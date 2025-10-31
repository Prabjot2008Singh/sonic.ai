import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import AboutPage from './components/pages/AboutPage';
import { Page } from './types';

const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('login');

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = () => {
        setCurrentPage('chat');
    };

    const handleNavigation = (page: Page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
            case 'chat':
                return <ChatPage onNavigate={handleNavigation} />;
            case 'terms':
                return <TermsPage onBack={() => setCurrentPage('login')} />;
            case 'privacy':
                return <PrivacyPage onBack={() => setCurrentPage('login')} />;
            case 'about':
                return <AboutPage onBack={() => setCurrentPage('chat')} />;
            default:
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
        }
    };

    return (
        <>
            {showSplash && <SplashScreen />}
            <div className={`w-full min-h-screen font-sans transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                {renderPage()}
            </div>
        </>
    );
};

export default App;