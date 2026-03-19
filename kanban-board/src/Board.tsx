import React, { useState, useEffect } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Award } from 'lucide-react';
import { Column } from './Column';
import type { Member, Task, Status } from './types';
import { initialTasks, teamMembers } from './data';
// import confetti from 'canvas-confetti';

const COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'QA / Review', color: 'bg-orange-500' },
  { id: 'done', title: 'Completed', color: 'bg-emerald-500' },
];

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('teamA-kanban-vars-v2');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [showAchievement, setShowAchievement] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState<'ALL' | Member>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | Task['priority']>('ALL');

  useEffect(() => {
    localStorage.setItem('teamA-kanban-vars-v2', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskIndex = tasks.findIndex(t => t.id === draggableId);
    if(taskIndex === -1) return;
    
    const updatedTask = { ...tasks[taskIndex], status: destination.droppableId as Status };
    
    // Check if task moved to 'done'
    if (destination.droppableId === 'done' && source.droppableId !== 'done') {
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
    }

    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);
    
    const destinationTasks = newTasks.filter(t => t.status === destination.droppableId);
    destinationTasks.splice(destination.index, 0, updatedTask);
    
    const otherTasks = newTasks.filter(t => t.status !== destination.droppableId);
    
    setTasks([...otherTasks, ...destinationTasks]);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const filteredTasks = tasks.filter((task) => {
    const bySearch =
      searchTerm.trim().length === 0 ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const byMember = memberFilter === 'ALL' || task.assignees.includes(memberFilter);
    const byPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return bySearch && byMember && byPriority;
  });

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
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">{filteredTasks.length}</div>
                <div className="text-xs text-slate-400 font-medium uppercase mt-1">Visible</div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-3 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tareas, tags o descripción..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20"
            />

            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value as 'ALL' | Member)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">Todos los responsables</option>
              {teamMembers.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.avatar} {member.name} ({member.role})
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | Task['priority'])}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">Todas las prioridades</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {teamMembers.map((member) => (
              <button
                key={`chip-${member.name}`}
                onClick={() => setMemberFilter(memberFilter === member.name ? 'ALL' : member.name)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                  memberFilter === member.name
                    ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {member.avatar} {member.name}
              </button>
            ))}
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
                  tasks={filteredTasks.filter(t => t.status === col.id)}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};