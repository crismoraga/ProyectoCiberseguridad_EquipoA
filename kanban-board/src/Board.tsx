import React, { useState, useEffect } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Award } from 'lucide-react';
import { Column } from './Column';
import type { Task, Status } from './types';
import { initialTasks } from './data';
// import confetti from 'canvas-confetti';

const COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'QA / Review', color: 'bg-orange-500' },
  { id: 'done', title: 'Completed', color: 'bg-emerald-500' },
];

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('teamA-kanban-vars');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    localStorage.setItem('teamA-kanban-vars', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskIndex = tasks.findIndex(t => t.id === draggableId);
    const updatedTask = { ...tasks[taskIndex], status: destination.droppableId as Status };
    
    // Check if task moved to 'done'
    if (destination.droppableId === 'done' && source.droppableId !== 'done') {
        const myCanvas = document.createElement('canvas');
        myCanvas.style.position = 'fixed';
        myCanvas.style.inset = '0';
        myCanvas.style.width = '100vw';
        myCanvas.style.height = '100vh';
        myCanvas.style.pointerEvents = 'none';
        myCanvas.style.zIndex = '9999';
        document.body.appendChild(myCanvas);
        
        // I will just use motion achievement since canvas-confetti is not installed.
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
    }

    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);
    
    // Find exact index to insert
    const destinationTasks = newTasks.filter(t => t.status === destination.droppableId);
    destinationTasks.splice(destination.index, 0, updatedTask);
    
    const otherTasks = newTasks.filter(t => t.status !== destination.droppableId);
    
    setTasks([...otherTasks, ...destinationTasks]);
  };

  const completedCount = tasks.filter(t => t.status === 'done').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-200 p-8 font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      {/* Background Blobs for ultra advanced feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="fixed bottom-10 right-10 bg-gradient-to-r from-emerald-500/90 to-teal-400/90 backdrop-blur-xl border border-white/10 text-white px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] z-50 flex items-center gap-4"
            >
              <Award className="w-8 h-8 animate-bounce text-yellow-200" />
              <div>
                <p className="font-bold text-lg">Task Secured! 🚀</p>
                <p className="text-sm opacity-90">Great job, Team A! Keep securing the net.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="mb-12 max-w-[1500px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/5 backdrop-blur-lg text-indigo-400 rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Shield className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-200 tracking-tight mb-1">
                  CyberSec Operations
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400/80 font-medium">Equipo A</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  <span className="text-slate-400 text-sm">Infraestructura & Red Perimetral</span>
                </div>
              </div>
            </div>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg backdrop-blur-md flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              New Objective
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10"></div>
            
            <div className="flex-1 w-full">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Mission Completion</span>
                <span className="text-cyan-400 font-bold text-lg">{progressPercent}%</span>
              </div>
              <div className="h-3.5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full relative bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]"
                >
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]"></div>
                </motion.div>
              </div>
            </div>

            <div className="flex gap-4 md:border-l border-white/10 md:pl-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{tasks.length}</div>
                <div className="text-xs text-slate-400 font-medium uppercase mt-1">Total Signals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
                <div className="text-xs text-slate-400 font-medium uppercase mt-1">Secured</div>
              </div>
            </div>
          </div>
        </header>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-8 overflow-x-auto pb-10 custom-scrollbar max-w-[1500px] mx-auto h-[68vh] items-start">
            {COLUMNS.map(col => (
              <div key={col.id} className="h-full min-h-0">
                <Column
                  id={col.id}
                  title={col.title}
                  accentColor={col.color}
                  tasks={tasks.filter(t => t.status === col.id)}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};