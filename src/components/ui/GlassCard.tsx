import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'emergency' | 'tech';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emergency':
        return 'border-emergency-500/30 bg-emergency-500/[0.04] shadow-emergency-glow/20';
      case 'tech':
        return 'border-tech-blue/30 bg-tech-blue/[0.03] shadow-tech-glow/20';
      case 'elevated':
        return 'border-theme-mint/40 dark:border-theme-mint/30 bg-white/80 dark:bg-[#0E1528]/80';
      default:
        return 'border-slate-200/40 dark:border-white/8 bg-white/70 dark:bg-white/60';
    }
  };

  return (
    <div
      className={`rounded-2xl backdrop-blur-xl border transition-all duration-300 ${getVariantStyles()} ${
        interactive ? 'glass-panel-interactive cursor-pointer hover:border-slate-300 dark:hover:border-theme-mint/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
