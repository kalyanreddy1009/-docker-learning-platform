"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import io, { Socket } from 'socket.io-client';

interface TerminalComponentProps {
  labId: string;
  className?: string;
}

const TERMINAL_THEME = {
  background: '#0f172a', // slate-950
  foreground: '#f8fafc', // slate-50
  selectionBackground: '#334155',
};

// Pure utility to safely extract userId from JWT token
const getUserIdFromToken = (): string | undefined => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return undefined;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    return payload.sub; // User ID from NestJS JWT payload
  } catch {
    return undefined;
  }
};

export default function TerminalComponent({ labId, className = '' }: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const xtermRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      cursorBlink: true,
      theme: TERMINAL_THEME,
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    xtermRef.current = term;

    term.writeln('\x1b[1;34mWelcome to the Docker Interactive Lab!\x1b[0m');
    term.writeln('Connecting to lab environment...\r\n');

    // Modern, performant resize handling via ResizeObserver
    // We use setTimeout to avoid the xterm "dimensions" initialization race condition
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        try {
          if (
            terminalRef.current?.clientWidth && 
            terminalRef.current?.clientHeight && 
            term.element
          ) {
            fitAddon.fit();
          }
        } catch {
          // Ignore xterm internal rendering race condition errors
        }
      }, 50);
    });
    
    // Initial fit needs a small delay after open
    setTimeout(() => resizeObserver.observe(terminalRef.current!), 100);

    // Connect to Backend WebSocket
    const socket = io('http://localhost:3001/terminal');
    socketRef.current = socket;

    socket.on('connect', () => {
      term.writeln('\x1b[1;32mConnected successfully.\x1b[0m\r\n');
      const userId = getUserIdFromToken();
      socket.emit('start_session', { labId, userId });
    });

    socket.on('output', (data: string) => {
      term.write(data);
    });

    socket.on('disconnect', () => {
      term.writeln('\r\n\x1b[1;31mDisconnected from server.\x1b[0m');
    });

    // Handle user input
    term.onData((data) => {
      socket.emit('input', data);
    });

    return () => {
      resizeObserver.disconnect();
      socket.disconnect();
      term.dispose();
    };
  }, [labId]);

  return (
    <div className={`w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${className}`}>
      <div className="h-10 bg-slate-900 flex items-center px-4 border-b border-slate-800 shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-xs font-mono text-slate-400">root@dlp-lab-env:~</div>
      </div>
      <div className="p-4 flex-1 overflow-hidden" ref={terminalRef}></div>
    </div>
  );
}
