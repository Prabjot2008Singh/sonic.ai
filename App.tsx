import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { Page, Theme } from './types';

const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<{ firstName: string; lastName?: string; }>({ firstName: '' });
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        return savedTheme || 'system';
    });

    // Effect to apply the theme class to the HTML element
    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Effect to listen for OS theme changes when in 'system' mode
    useEffect(() => {
        if (theme !== 'system') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            document.documentElement.classList.toggle('dark', mediaQuery.matches);
        };
        // Initial check
        handleChange();
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    
    const handleLogin = (name: { firstName: string; lastName?: string; }) => {
        setUserName(name);
        setIsLoggedIn(true);
    };

    const renderPage = () => {
        if (!isLoggedIn) {
            return <LoginPage onLogin={handleLogin} />;
        }
        return <ChatPage theme={theme} setTheme={setTheme} userName={userName.firstName} />;
    };

    return (
        <>
            {showSplash && <SplashScreen />}
            <div className={`w-full min-h-screen font-sans bg-gray-100 dark:bg-gray-900 transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                {renderPage()}
            </div>
        </>
    );
};

export default App;