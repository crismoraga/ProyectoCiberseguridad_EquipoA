import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, AlertCircle, AlertTriangle, ArrowRightCircle, CheckCircle, ListChecks } from 'lucide-react';
import type { Task, Priority } from './types';
import { teamMembers } from './data';

interface Props {
  task: Task;
  index: number;
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

export const TaskCard: React.FC<Props> = ({ task, index }) => {
  const doneSubTasks = task.subTasks.filter((subTask) => subTask.done).length;
  const subTaskProgress = task.subTasks.length
    ? Math.round((doneSubTasks / task.subTasks.length) * 100)
    : 0;

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
            <span className={`text-[10px] px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              {task.priority}
            </span>
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
            <div className="h-1.5 rounded-full bg-slate-700/70 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${subTaskProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, i) => {
                const member = teamMembers.find(m => m.name === assignee);
                return (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#090e1a] flex items-center justify-center text-sm shadow-md hover:-translate-y-1 transition-transform cursor-pointer"
                    title={assignee}
                  >
                    {member?.avatar}
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