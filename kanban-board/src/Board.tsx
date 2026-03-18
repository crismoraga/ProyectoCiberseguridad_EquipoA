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
    <div className="min-h-screen bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B1120] to-[#0B1120] p-8 font-sans overflow-x-hidden">
      
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-10 right-10 bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4"
          >
            <Award className="w-8 h-8 animate-bounce" />
            <div>
              <p className="font-bold text-lg">Task Completed! 🚀</p>
              <p className="text-sm opacity-90">Great job, Team A! Keep securing the net.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-10 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">CyberSec Operations</h1>
              <p className="text-slate-400 font-medium">Equipo A - Infraestructura & Red</p>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Mission
          </button>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-6 backdrop-blur-sm max-w-2xl">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-medium">Project Progress</span>
              <span className="text-indigo-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory max-w-[1400px] mx-auto h-[70vh]">
          {COLUMNS.map(col => (
            <div key={col.id} className="snap-center h-full">
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
  );
};