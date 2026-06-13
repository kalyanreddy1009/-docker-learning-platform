"use client";

import React from 'react';
import Sidebar from './Sidebar';
import { Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">Welcome back, Student!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Ready to deploy some containers?</p>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative p-2 text-slate-400 hover:text-foreground transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-card"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-all">
              JD
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
