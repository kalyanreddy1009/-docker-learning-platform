"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Box, Shield, Zap, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Box className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">DockerLearn</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-medium px-5 py-2.5 rounded-full bg-foreground text-background hover:scale-105 transition-transform shadow-lg">
            Get Started
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            v2.0 Beta Now Live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
          >
            Master Containers <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Interactive & Real-time
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Ditch the dry tutorials. Spin up real containers in your browser, solve practical challenges, and level up your DevOps career.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              Start Coding Now
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="https://github.com" target="_blank" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-medium text-lg transition-all hover:scale-105 backdrop-blur-md">
              View Source
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
        >
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Live Terminal</h3>
            <p className="text-slate-400 leading-relaxed">
              Experience a full macOS-style terminal directly in your browser. Real commands, real environments, zero setup required.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800/50 hover:border-purple-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Instant Feedback</h3>
            <p className="text-slate-400 leading-relaxed">
              Our auto-validation engine checks your container states in real-time. Know exactly when you've nailed the solution.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800/50 hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Enterprise Grade</h3>
            <p className="text-slate-400 leading-relaxed">
              Learn production-ready patterns, multi-stage builds, and security best practices used by top engineering teams.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
