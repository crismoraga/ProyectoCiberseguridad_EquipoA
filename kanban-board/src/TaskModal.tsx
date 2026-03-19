import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, Member, Status, Priority, SubTask } from './types';
import { teamMembers } from './data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialStatus?: Status;
  initialData?: Task | null;
}

const generateId = () => 't-' + Math.random().toString(36).substr(2, 9);

export const TaskModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialStatus = 'todo', initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [assignees, setAssignees] = useState<Member[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [sprint, setSprint] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setPriority(initialData.priority);
        setStatus(initialData.status);
        setAssignees(initialData.assignees);
        setTagsInput(initialData.tags.join(', '));
        setSprint(initialData.sprint || '');
        setSubTasks(initialData.subTasks || []);
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setStatus(initialStatus);
        setAssignees([]);
        setTagsInput('');
        setSprint('');
        setSubTasks([]);
      }
    }
  }, [isOpen, initialData, initialStatus]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: initialData?.id || generateId(),
      title,
      description,
      priority,
      status,
      assignees,
      comments: initialData?.comments || [],
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      sprint,
      subTasks
    };

    onSave(newTask);
    onClose();
  };

  const toggleAssignee = (member: Member) => {
    setAssignees(prev => 
      prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member]
    );
  };

  const addSubtask = () => {
    setSubTasks([...subTasks, { id: 'st-' + Date.now(), title: '', done: false }]);
  };

  const updateSubtask = (id: string, newTitle: string) => {
    setSubTasks(subTasks.map(st => st.id === id ? { ...st, title: newTitle } : st));
  };

  const removeSubtask = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
          className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              {initialData ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Título</label>
              <input 
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Ej: Configurar Firewall"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Descripción</label>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Detalles de la tarea..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</label>
                <select 
                  value={status} onChange={e => setStatus(e.target.value as Status)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">QA / Review</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prioridad</label>
                <select 
                  value={priority} onChange={e => setPriority(e.target.value as Priority)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Responsables</label>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map(m => (
                  <button
                    key={m.name}
                    onClick={() => toggleAssignee(m.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      assignees.includes(m.name) 
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {m.avatar} {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sprint</label>
                <input 
                  type="text" value={sprint} onChange={e => setSprint(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:border-indigo-500 outline-none text-sm"
                  placeholder="Ej: Sprint 1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags (separados por coma)</label>
                <input 
                  type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-slate-100 focus:border-indigo-500 outline-none text-sm"
                  placeholder="Docker, Infra, BlueTeam"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subtareas</label>
                <button 
                  onClick={addSubtask}
                  className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Añadir
                </button>
              </div>
              <div className="space-y-2">
                {subTasks.map((st, i) => (
                  <div key={st.id} className="flex items-center gap-2">
                    <input 
                      type="text" value={st.title} onChange={e => updateSubtask(st.id, e.target.value)}
                      className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder={`Subtarea ${i + 1}`}
                      autoFocus
                    />
                    <button onClick={() => removeSubtask(st.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {subTasks.length === 0 && <p className="text-xs text-slate-600 italic">No hay subtareas definidas.</p>}
              </div>
            </div>

          </div>

          <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Guardar Tarea
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};