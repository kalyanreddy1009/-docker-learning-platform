"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Terminal } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
      {/* Left side: Branding & Visuals */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-slate-950 items-center justify-center">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

        <div className="relative z-10 p-12 max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
                <div className="relative glass-panel w-full h-full rounded-2xl flex items-center justify-center border-blue-500/30">
                  <Container className="w-12 h-12 text-blue-400" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Master <span className="gradient-text">Containers</span> <br /> & Cloud Native.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join the ultimate interactive platform to learn Docker, Kubernetes, and modern infrastructure with AI-guided assistance.
            </p>
          </motion.div>

          {/* Interactive terminal mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 text-left"
          >
            <div className="glass-panel rounded-lg overflow-hidden border-slate-700/50">
              <div className="flex items-center px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center text-xs text-slate-400 font-mono">
                  <Terminal className="w-3 h-3 mr-2" />
                  root@docker-learning:~
                </div>
              </div>
              <div className="p-5 font-mono text-sm">
                <div className="text-slate-300">
                  <span className="text-green-400">➜</span> <span className="text-blue-400">~</span> docker run hello-world
                </div>
                <div className="text-slate-400 mt-2">
                  Hello from Docker!
                  <br />
                  This message shows that your installation appears to be working correctly.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 relative overflow-hidden bg-background">
        {/* Mobile background elements */}
        <div className="md:hidden absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Container className="w-8 h-8 text-blue-500" />
            </div>
            <span className="text-xl font-bold tracking-tight">DockerLearn</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>

          {children}

        </motion.div>
      </div>
    </div>
  );
}
