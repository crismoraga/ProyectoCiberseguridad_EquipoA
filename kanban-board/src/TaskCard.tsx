import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, AlertCircle, AlertTriangle, ArrowRightCircle, CheckCircle } from 'lucide-react';
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
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-xl mb-3 border bg-slate-800 transition-all duration-200 ${
            snapshot.isDragging 
              ? 'shadow-2xl border-indigo-500/50 scale-105 rotate-2' 
              : 'shadow-sm border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 font-medium ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              {task.priority}
            </span>
          </div>

          <h3 className="font-semibold text-slate-100 mb-1 leading-snug">{task.title}</h3>
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, i) => {
                const member = teamMembers.find(m => m.name === assignee);
                return (
                  <div 
                    key={i} 
                    className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs"
                    title={assignee}
                  >
                    {member?.avatar}
                  </div>
                );
              })}
            </div>
            
            {task.comments > 0 && (
              <div className="flex items-center text-xs text-slate-500 gap-1 mt-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task.comments}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};