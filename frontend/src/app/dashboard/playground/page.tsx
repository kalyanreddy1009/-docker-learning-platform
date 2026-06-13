"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, Settings, Code, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

const TerminalComponent = dynamic(() => import('@/components/TerminalComponent'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>
});

export default function PlaygroundPage() {
  return (
    <div className="space-y-6 pb-10 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <TerminalIcon className="w-8 h-8 mr-3 text-purple-500" />
            Interactive Playground
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            A free-form sandbox environment. You have full root access to experiment with Docker.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Snippets
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 shadow-lg rounded-xl text-sm font-medium transition-all flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Reset Environment
          </button>
        </div>
      </motion.div>

      {/* Terminal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 w-full rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative group bg-black"
      >
        <div className="absolute top-0 w-full h-8 bg-slate-900 flex items-center px-4 border-b border-slate-800 z-10 select-none">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto text-xs font-mono text-slate-400">root@dlp-lab-env:~</div>
          <div className="flex space-x-2">
             <Settings className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="absolute inset-0 pt-8">
          <TerminalComponent labId="playground" />
        </div>
      </motion.div>
    </div>
  );
}
