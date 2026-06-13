"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Terminal as TerminalIcon, CheckCircle, ChevronLeft, ArrowRight, PlayCircle, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import { apiUrl } from '@/lib/api';

const TerminalComponent = dynamic(() => import('@/components/TerminalComponent'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-950/80 backdrop-blur-md rounded-3xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-sm text-purple-400 font-mono animate-pulse">Initializing Environment...</span>
      </div>
    </div>
  )
});

export default function LessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(apiUrl(`/api/courses/lesson/${id}`), {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
        }
      } catch (error) {
        console.error("Failed to fetch lesson", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchLesson();
  }, [id]);

  const handleComplete = async () => {
    try {
      setIsVerifying(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You must be logged in to verify. Please log in and try again.');
        router.push('/login');
        return;
      }

      if (lesson.type === 'LAB') {
        const res = await fetch(apiUrl(`/api/courses/lesson/${id}/verify`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          router.push('/login');
          return;
        }

        const data = await res.json();
        
        if (data.success) {
          setIsCompleted(true);
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setIsVerifying(false);
          alert(data.message || 'Validation failed. Please run all required commands in the terminal first.');
        }
      } else {
        const res = await fetch(apiUrl(`/api/users/me/progress/complete`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ lessonId: id })
        });
        
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          router.push('/login');
          return;
        }

        if (res.ok) {
          setIsCompleted(true);
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setIsVerifying(false);
          const data = await res.json().catch(() => ({}));
          alert(data.message || 'Failed to complete lesson. Please try again.');
        }
      }
    } catch (error) {
      setIsVerifying(false);
      console.error("Failed to record progress", error);
      alert('Network error. Make sure the server is running and try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[60vh] space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Lesson not found</h2>
        <Link href="/dashboard/courses" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 flex flex-col h-[calc(100vh-6rem)] max-w-7xl mx-auto">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white/5 dark:bg-slate-900/40 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 dark:border-slate-800/60 shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden group"
      >
        {/* Subtle background glow on header */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="flex items-center space-x-5 relative z-10">
          <Link href="/dashboard/courses" className="p-2.5 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 active:scale-95">
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Link>
          <div>
            <div className="flex items-center text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1 uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">{lesson.module.course.title}</span>
              <span className="mx-2 opacity-50">•</span>
              <span>{lesson.module.title}</span>
            </div>
            <h1 className="text-2xl font-black text-foreground flex items-center tracking-tight">
              {lesson.type === 'LAB' ? (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
                  <TerminalIcon className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
              )}
              {lesson.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-5 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl text-sm font-bold flex items-center border border-yellow-500/20 shadow-inner"
          >
            <Star className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
            <span className="mr-1">{lesson.xpReward}</span> <span className="opacity-70">XP</span>
          </motion.div>
          {lesson.type === 'TEXT' && (
             <motion.button 
               whileHover={{ scale: isCompleted ? 1 : 1.02 }}
               whileTap={{ scale: isCompleted ? 1 : 0.98 }}
               onClick={handleComplete}
               disabled={isCompleted || isVerifying}
               className={`px-6 py-2.5 rounded-2xl font-bold flex items-center transition-all duration-300 relative overflow-hidden group ${
                 isCompleted 
                   ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/30 cursor-default' 
                   : 'bg-foreground text-background hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] dark:hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]'
               }`}
             >
               {/* Shine effect */}
               {!isCompleted && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />}
               
               {isVerifying ? (
                 <span className="flex items-center">
                   <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                   Saving...
                 </span>
               ) : isCompleted ? (
                 <>
                   <CheckCircle className="w-5 h-5 mr-2" />
                   Completed
                 </>
               ) : (
                 <>
                   Complete Lesson
                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex-1 overflow-hidden relative"
      >
        {lesson.type === 'TEXT' ? (
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-14 rounded-[2rem] border border-white/20 dark:border-slate-800/60 h-full overflow-y-auto custom-scrollbar shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto prose prose-lg prose-slate dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-h1:mb-8 prose-h2:text-3xl prose-h2:mt-12 prose-h2:tracking-tight prose-h3:text-2xl prose-a:text-blue-500 prose-a:decoration-blue-500/30 hover:prose-a:decoration-blue-500 prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800/60 prose-pre:shadow-2xl prose-pre:rounded-2xl prose-img:rounded-2xl prose-img:shadow-xl relative z-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex h-full gap-6">
            {/* Premium Lab Instructions Sidebar */}
            <div className="w-[35%] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-slate-800/60 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
              
              <div className="p-5 border-b border-white/10 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/40 shrink-0 relative z-10">
                <h3 className="text-lg font-black flex items-center text-foreground tracking-tight">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center mr-3 border border-purple-500/20">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                  </div>
                  Lab Guide
                </h3>
              </div>
              
              <div className="p-7 overflow-y-auto flex-1 custom-scrollbar relative z-10">
                <div className="prose prose-sm prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-a:text-purple-500 prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#0d1117] prose-pre:rounded-xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {lesson.content}
                  </ReactMarkdown>
                </div>
              </div>
              
              <div className="p-5 border-t border-white/10 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/40 shrink-0 relative z-10">
                <motion.button 
                  whileHover={{ scale: isCompleted ? 1 : 1.02 }}
                  whileTap={{ scale: isCompleted ? 1 : 0.98 }}
                  onClick={handleComplete}
                  disabled={isCompleted || isVerifying}
                  className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center transition-all duration-300 relative overflow-hidden group ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] cursor-default' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]'
                  }`}
                >
                  {/* Shine effect */}
                  {!isCompleted && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />}
                  
                  {isVerifying ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Verifying Simulation...
                    </span>
                  ) : isCompleted ? (
                    <><CheckCircle className="w-5 h-5 mr-2" /> Lab Verified Successfully!</>
                  ) : (
                    <><Sparkles className="w-5 h-5 mr-2" /> Verify Completion</>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Premium Terminal Window */}
            <div className="w-[65%] h-full rounded-[2rem] overflow-hidden border border-slate-700/50 dark:border-slate-700/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative group bg-black">
              {/* Terminal mock header macOS style */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900/80 backdrop-blur-md flex items-center px-4 z-20 border-b border-white/5">
                <div className="flex space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                </div>
                <div className="mx-auto text-xs font-mono text-slate-400 flex items-center bg-slate-950/50 px-3 py-1 rounded-full border border-white/5">
                  root@dlp-lab-env:~
                </div>
              </div>
              
              {/* Terminal instance */}
              <div className="absolute inset-0 pt-12">
                <TerminalComponent labId={id as string} className="w-full h-full" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
