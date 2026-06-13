"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CertificatesPage() {
  return (
    <div className="space-y-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Certificates</h1>
        <p className="text-slate-500 dark:text-slate-400">Earn certificates by completing entire courses.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-12 flex flex-col items-center justify-center text-center"
      >
        <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20">
          <Award className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No Certificates Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
          Complete all lessons in a course to unlock your certificate. 
          Start learning now to earn your first one!
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <Lock className="w-5 h-5 text-slate-400" />
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Docker 101: From Zero to Hero</p>
              <p className="text-xs text-slate-500">Complete all lessons to unlock</p>
            </div>
          </div>
        </div>
        <Link 
          href="/dashboard/courses"
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5"
        >
          Go to Courses
        </Link>
      </motion.div>
    </div>
  );
}
