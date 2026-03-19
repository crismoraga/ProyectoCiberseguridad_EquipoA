import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, AlertCircle, AlertTriangle, ArrowRightCircle, CheckCircle, ListChecks, Send, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import type { Task, Priority, Comment } from './types';
import { teamMembers } from './data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  task: Task;
  index: number;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onEdit?: (task: Task) => void;
}

const getPriorityIcon = (p: Priority) => {
  switch (p) {
    case 'Critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'High': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    case 'Medium': return <ArrowRightCircle className="w-4 h-4 text-yellow-500" />;
    case 'Low': return <CheckCircle className="w-4 h-4 text-green-500" />;
  }
};

const getPriorityColor = (p: Priority) => {
  switch (p) {
    case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'Low': return 'bg-green-500/10 text-green-500 border-green-500/20';
  }
};

export const TaskCard: React.FC<Props> = ({ task, index, onTaskUpdate, onEdit }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const doneSubTasks = task.subTasks.filter((subTask) => subTask.done).length;
  const subTaskProgress = task.subTasks.length
    ? Math.round((doneSubTasks / task.subTasks.length) * 100)
    : 0;

  const toggleSubtask = (subTaskId: string) => {
    if (!onTaskUpdate) return;
    const newSubTasks = task.subTasks.map(st =>
      st.id === subTaskId ? { ...st, done: !st.done } : st
    );
    onTaskUpdate(task.id, { subTasks: newSubTasks });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !onTaskUpdate) return;
    
    // Generar comentario mock como el usuario actual
    const comment: Comment = {
      id: `c-new-${Date.now()}`,
      author: 'Cristobal',
      text: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    onTaskUpdate(task.id, { comments: [...task.comments, comment] });
    setNewComment('');
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-5 rounded-2xl mb-4 border transition-all duration-300 group ${
            snapshot.isDragging 
              ? 'bg-[#131c2f] border-indigo-500/40 shadow-2xl shadow-indigo-500/20 rotate-1 scale-105 z-50' 
              : 'bg-[#0f1524] border-white/5 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/10'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-2 items-center">
              <span className={`text-[10px] px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
                {task.priority}
              </span>
              {task.sprint && (
                <span className="text-[10px] px-2.5 py-1 rounded-lg border bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold tracking-wider">
                  {task.sprint}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-bold text-slate-100 leading-snug text-sm group-hover:text-indigo-300 transition-colors flex-1">{task.title}</h3>
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="text-slate-500 hover:text-indigo-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[13px] text-slate-400 mb-5 line-clamp-3 leading-relaxed">{task.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag, i) => (
              <span
                key={`tag-${i}`}
                className="px-2 py-1 rounded-md text-[10px] uppercase tracking-wide font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-400/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <div className="flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" />
                <span>Subtareas</span>
              </div>
              <span className="font-semibold text-slate-300">{doneSubTasks}/{task.subTasks.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700/70 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${subTaskProgress}%` }}
              />
            </div>

            {task.subTasks.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                {task.subTasks.map(st => (
                  <div
                    key={st.id}
                    className="flex items-start gap-2 group/st cursor-pointer"
                    onClick={() => toggleSubtask(st.id)}
                  >
                    <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      st.done ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 group-hover/st:border-slate-400'
                    }`}>
                      {st.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-[11px] leading-tight transition-all ${
                      st.done ? 'text-slate-500 line-through' : 'text-slate-300 group-hover/st:text-slate-200'
                    }`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, i) => {
                const member = teamMembers.find(m => m.name === assignee);
                return (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#090e1a] flex items-center justify-center text-sm shadow-md hover:-translate-y-1 hover:z-10 transition-all cursor-crosshair relative group/avatar"
                    style={{ backgroundColor: member?.color || '#334155' }}
                  >
                    {member?.avatar}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {member?.name} - {member?.role}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className={`flex items-center text-xs gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                isCommentsOpen ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold">{task.comments?.length || 0}</span>
              {isCommentsOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {isCommentsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-white/5"
              >
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Discusión
                  </h4>
                  
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {task.comments.map(c => {
                       const author = teamMembers.find(m => m.name === c.author);
                       return (
                        <div key={c.id} className="bg-white/5 rounded-lg p-3 text-xs border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] w-4 h-4 rounded-full flex items-center justify-center" style={{backgroundColor: author?.color || '#334155'}}>
                                {author?.avatar || '👤'}
                              </span>
                              <span className="font-semibold text-indigo-300">{c.author}</span>
                            </div>
                            <span className="text-[9px] text-slate-500">
                              {format(new Date(c.createdAt), "d MMM, HH:mm", { locale: es })}
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed ml-5.5">{c.text}</p>
                        </div>
                       );
                    })}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Agregar un comentario..."
                      className="flex-1 bg-[#131c2f] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Draggable>
  );
};
