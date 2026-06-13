"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, BookOpen, Star, Terminal, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { label: "Courses Completed", value: "0", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Hours Learned", value: "0", icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Lab Exercises", value: "0", icon: Terminal, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total XP", value: "0", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ]);
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(apiUrl('/api/users/me/dashboard'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats([
            { label: "Courses Completed", value: "0", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Streak (Days)", value: data.stats.streak.toString(), icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Labs Completed", value: data.stats.completedLabs.toString(), icon: Terminal, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Total XP", value: data.stats.totalXp.toLocaleString(), icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          ]);
          setRecentActivity(data.recentActivity);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your progress and pick up where you left off.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl flex items-center space-x-4 hover:scale-[1.02] transition-transform duration-300">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {isLoading ? <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-1" /> : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Continue Learning Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-6 text-foreground">Continue Learning</h2>
        <div className="glass-panel rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-slate-200/50 dark:border-slate-800/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition-colors duration-500" />
          
          <div className="flex-1 space-y-5 z-10">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20">Module 1</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Docker Basics</span>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">Docker Basics</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg leading-relaxed">
                Learn how to pull images and run simple containers in an interactive environment.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto z-10 mt-4 md:mt-0">
            <Link href="/dashboard/courses" className="w-full md:w-auto px-8 py-4 bg-foreground text-background hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl font-medium flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex">
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Learning
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View All
          </button>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6 font-semibold text-sm text-slate-500 dark:text-slate-400">Activity</th>
                  <th className="py-4 px-6 font-semibold text-sm text-slate-500 dark:text-slate-400">Date</th>
                  <th className="py-4 px-6 font-semibold text-sm text-slate-500 dark:text-slate-400 text-right">XP Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {recentActivity.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No recent activity. Start a lab to earn XP!
                    </td>
                  </tr>
                )}
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {activity.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        {activity.status === 'in-progress' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                        {activity.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {activity.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-right text-foreground">
                      <span className={activity.points.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}>
                        {activity.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
