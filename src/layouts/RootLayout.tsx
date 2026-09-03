import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { MobileNav } from '../components/navigation/MobileNav';
import { CustomCursor } from '../components/ui/CustomCursor';
import { CrisisAIModal } from '../components/chatbot/CrisisAIModal';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 selection:bg-emergency-500 selection:text-white">
      {/* Desktop Custom Interactive Cursor */}
      <CustomCursor />

      {/* Global Navbar with Persistent Request Help CTA */}
      <Navbar />

      {/* Main Page Outlet */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Persistent Floating CrisisAI Safety Guidance */}
      <CrisisAIModal />

      {/* Mobile Bottom Navigation & Floating Emergency CTA */}
      <MobileNav />
    </div>
  );
};
