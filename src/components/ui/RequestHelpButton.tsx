import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface RequestHelpButtonProps {
  className?: string;
  variant?: 'navbar' | 'floating' | 'hero';
}

export const RequestHelpButton: React.FC<RequestHelpButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/request-help');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        data-emergency="true"
        aria-label="Request Emergency Assistance"
        className={`emergency-cta fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 px-5 py-3.5 bg-emergency-600 hover:bg-emergency-500 text-theme-dark font-bold rounded-full shadow-emergency-glow beacon-pulse transition-transform active:scale-95 ${className}`}
      >
        <AlertTriangle className="w-5 h-5 animate-pulse" />
        <span className="tracking-wider text-sm font-extrabold">REQUEST HELP</span>
      </button>
    );
  }

  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        data-emergency="true"
        aria-label="Request Emergency Assistance"
        className={`emergency-cta group relative inline-flex items-center gap-3 px-8 py-4 bg-emergency-600 hover:bg-emergency-500 text-theme-dark text-base font-bold rounded-xl shadow-emergency-glow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <AlertTriangle className="w-5 h-5 text-theme-dark group-hover:scale-110 transition-transform" />
        <span className="tracking-wider uppercase font-black">REQUEST HELP</span>
      </button>
    );
  }

  // Default navbar variant
  return (
    <button
      onClick={handleClick}
      data-emergency="true"
      aria-label="Request Emergency Assistance"
      className={`emergency-cta relative inline-flex items-center gap-2 px-4 py-2 bg-emergency-600 hover:bg-emergency-500 text-theme-dark text-xs font-bold uppercase tracking-wider rounded-xl shadow-emergency-glow transition-all duration-200 transform active:scale-95 hover:shadow-red-500/50 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <AlertTriangle className="w-4 h-4 text-theme-dark" />
      <span>REQUEST HELP</span>
    </button>
  );
};
