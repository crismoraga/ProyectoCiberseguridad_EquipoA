import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import type { Task, Status } from './types';

interface Props {
  id: Status;
  title: string;
  tasks: Task[];
  accentColor: string;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export const Column: React.FC<Props> = ({ id, title, tasks, accentColor, onTaskUpdate }) => {
  return (
    <div className="flex flex-col w-[340px] min-w-[340px] bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-md h-full pb-4 shadow-xl transition-all duration-300 hover:bg-slate-900/50">
      <div className="p-5 border-b border-white/5 rounded-t-3xl flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${accentColor} shadow-[0_0_10px_currentColor]`} />
          <h2 className="font-bold text-slate-200 uppercase tracking-wider text-sm">{title}</h2>
        </div>
        <span className="text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-full border border-white/5">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-4 overflow-y-auto custom-scrollbar transition-all duration-300 min-h-[150px] ${
              snapshot.isDraggingOver ? 'bg-white/5 rounded-b-3xl inset-shadow-sm' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onTaskUpdate={onTaskUpdate} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};