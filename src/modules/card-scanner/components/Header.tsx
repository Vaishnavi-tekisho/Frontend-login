import React from 'react';
import { ChevronLeft, Menu } from 'lucide-react';
import { ViewState } from '../../../../types';

interface HeaderProps {
  currentView: ViewState;
  onBack: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ currentView, onBack, title }) => {
  const showBack = currentView !== 'HOME';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            aria-label="Go Back"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>
      <button className="p-2 text-gray-400 hover:text-gray-600">
        <Menu size={24} />
      </button>
    </header>
  );
};

export default Header;