import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import type { Task, Status } from './types';

interface Props {
  id: Status;
  title: string;
  tasks: Task[];
  accentColor: string;
}

export const Column: React.FC<Props> = ({ id, title, tasks, accentColor }) => {
  return (
    <div className="flex flex-col w-[320px] min-w-[320px] bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-xl h-full pb-4">
      <div className={`p-4 border-b border-slate-800/80 rounded-t-2xl flex justify-between items-center bg-slate-800/20`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${accentColor}`} />
          <h2 className="font-semibold text-slate-200">{title}</h2>
        </div>
        <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto transition-colors duration-200 min-h-[150px] ${
              snapshot.isDraggingOver ? 'bg-slate-800/30 rounded-b-2xl' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};