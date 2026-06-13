"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Clock, ChevronRight, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:3001/api/courses?_t=${Date.now()}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {},
          cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched courses:", data);
          setCourses(data);
        } else {
          setCourses([{ id: 'error-status', title: `HTTP Error: ${res.status}`, description: 'Failed to load', modules: [] }]);
        }
      } catch (error: any) {
        console.error("Failed to fetch courses", error);
        setCourses([{ id: 'error-catch', title: `Network Error: ${error.message}`, description: 'Fetch failed', modules: [] }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Curriculum</h1>
        <p className="text-slate-500 dark:text-slate-400">Master containerization from the ground up.</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-xl">
          <p className="text-white text-xl">No courses found in database.</p>
          <p className="text-slate-400">Please check backend API.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row group hover:border-blue-500/30 transition-colors"
            >
              <div className="md:w-1/3 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors duration-500" />
                <div className="z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20">
                      Beginner
                    </span>
                    <span className="flex items-center text-xs font-medium text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      5h 30m
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{course.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>
                <div className="z-10 flex flex-col gap-2">
                  <Link href={`/dashboard/lessons/${course.modules[0]?.lessons[0]?.id || ''}`} className="w-full py-3 px-4 bg-foreground text-background hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl font-medium flex items-center justify-center transition-all shadow-md group-hover:shadow-lg inline-flex">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Reading
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                  {(() => {
                    const firstLab = course.modules.flatMap((m: any) => m.lessons).find((l: any) => l.type === 'LAB');
                    return firstLab ? (
                      <Link href={`/dashboard/lessons/${firstLab.id}`} className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium flex items-center justify-center transition-all shadow-md shadow-purple-600/20 hover:shadow-lg inline-flex">
                        <Terminal className="w-4 h-4 mr-2" />
                        Start Lab
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    ) : null;
                  })()}
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Course Modules
                </h3>
                <div className="space-y-6">
                  {course.modules.map((mod: any, mIdx: number) => (
                    <div key={mod.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                      {mIdx !== course.modules.length - 1 && (
                        <div className="absolute left-[3px] top-4 bottom-[-1.5rem] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                      )}
                      <h4 className="text-lg font-bold text-foreground mb-1">{mod.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{mod.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {mod.lessons.map((lesson: any) => (
                          <Link 
                            key={lesson.id} 
                            href={`/dashboard/lessons/${lesson.id}`}
                            className="flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md rounded-lg border border-slate-200/50 dark:border-slate-700/50 text-xs font-medium text-slate-600 dark:text-slate-300 transition-all cursor-pointer group/lesson"
                          >
                            {lesson.type === 'LAB' ? (
                              <Terminal className="w-3 h-3 mr-1.5 text-purple-500 group-hover/lesson:scale-110 transition-transform" />
                            ) : (
                              <BookOpen className="w-3 h-3 mr-1.5 text-blue-500 group-hover/lesson:scale-110 transition-transform" />
                            )}
                            {lesson.title}
                            <span className="ml-2 flex items-center text-yellow-600 dark:text-yellow-500">
                              <Star className="w-3 h-3 mr-0.5" />
                              {lesson.xpReward}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
