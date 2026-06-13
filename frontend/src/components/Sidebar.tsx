"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Terminal, CheckCircle, Settings, LogOut, Container } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Playground', href: '/dashboard/playground', icon: Terminal },
  { name: 'Certificates', href: '/dashboard/certificates', icon: CheckCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div className="p-6 flex items-center space-x-3">
        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Container className="w-6 h-6 text-blue-500" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">DockerLearn</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-blue-500 transition-colors'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/20">
        <div className="space-y-1">
          <Link 
            href="/dashboard/settings"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
