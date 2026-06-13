"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: User, title: 'Profile', description: 'Update your name, email, and avatar', color: 'blue' },
          { icon: Bell, title: 'Notifications', description: 'Configure email and push notifications', color: 'purple' },
          { icon: Palette, title: 'Appearance', description: 'Switch between light and dark themes', color: 'orange' },
          { icon: SettingsIcon, title: 'Account', description: 'Manage password and security settings', color: 'green' },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 hover:border-blue-500/30 transition-colors cursor-pointer group"
          >
            <div className={`w-12 h-12 bg-${item.color}-500/10 rounded-xl flex items-center justify-center mb-4 border border-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-6 h-6 text-${item.color}-500`} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            <p className="text-xs text-slate-400 mt-3 italic">Coming soon</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
