import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, AlertCircle, AlertTriangle, ArrowRightCircle, CheckCircle, ListChecks } from 'lucide-react';
import type { Task, Priority } from './types';
import { teamMembers } from './data';

interface Props {
  task: Task;
  index: number;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
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

export const TaskCard: React.FC<Props> = ({ task, index, onTaskUpdate }) => {
  const doneSubTasks = task.subTasks.filter((subTask) => subTask.done).length;
  const subTaskProgress = task.subTasks.length
    ? Math.round((doneSubTasks / task.subTasks.length) * 100)
    : 0;

  const toggleSubtask = (subTaskId: string) => {
    if(!onTaskUpdate) return;
    const newSubTasks = task.subTasks.map(st => 
      st.id === subTaskId ? { ...st, done: !st.done } : st
    );
    onTaskUpdate(task.id, { subTasks: newSubTasks });
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
              ? 'bg-slate-800/90 shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-indigo-500/50 scale-105 rotate-2 backdrop-blur-xl z-50' 
              : 'bg-black/40 shadow-lg border-white/5 hover:border-white/20 hover:bg-slate-800/60'
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

          <h3 className="font-bold text-slate-100 mb-2 leading-snug text-sm group-hover:text-indigo-300 transition-colors">{task.title}</h3>
          <p className="text-[13px] text-slate-400 mb-5 line-clamp-3 leading-relaxed">{task.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag) => (
              <span
                key={`${task.id}-${tag}`}
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
                    <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${st.done ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 group-hover/st:border-indigo-400'}`}>
                      {st.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-[11px] leading-tight transition-all ${st.done ? 'text-slate-500 line-through' : 'text-slate-300 group-hover/st:text-slate-200'}`}>
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
                    className={`w-8 h-8 rounded-full border-2 border-[#090e1a] flex items-center justify-center text-sm shadow-md hover:-translate-y-1 hover:z-10 transition-all cursor-crosshair relative group/avatar ${member?.color || 'bg-slate-800'}`}
                  >
                    {member?.avatar}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {member?.name} - {member?.role}
                    </div>
                  </div>
                );
              })}
            </div>

            {task.comments > 0 && (
              <div className="flex items-center text-xs text-slate-400 gap-1.5 bg-white/5 px-2 py-1 rounded-md hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold">{task.comments}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};