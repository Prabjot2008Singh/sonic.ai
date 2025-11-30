import React from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100">
      <header className="flex-shrink-0 flex items-center justify-center p-4 border-b border-gray-200 dark:border-white/20 relative">
        <h1 className="text-lg sm:text-xl font-bold text-center">{title}</h1>
      </header>
      <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="prose prose-sm sm:prose-base dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageWrapper;