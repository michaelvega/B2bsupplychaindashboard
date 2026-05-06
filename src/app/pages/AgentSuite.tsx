import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, Plus, MessageSquare, Clock, Play, CheckCircle, Bot, X, Send, 
  Image as ImageIcon, Trash2, Layout, Calendar, CheckCircle2, ListTodo, Activity,
  ChevronRight, MoreHorizontal, Download, FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import { ThinkingTimer } from '../components/ThinkingTimer';

const ITEM_TYPE = 'TASK_CARD';
const AZURE_FILE = 'agent-tasks.json';
const WEEKLY_FILE = 'weekly-agent-tasks.json';
const TARGET_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/chat';

const downloadAsWord = async (text: string, title: string) => {
  const htmlContent = await marked.parse(text);
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  const footer = "</body></html>";
  const html = header + htmlContent + footer;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface Task {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: 'todo' | 'doing' | 'done' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  interval?: string;
  comments: { text: string; timestamp: number }[];
  hasBotResponded: boolean;
  isGenerating?: boolean;
  timestamp: number;
  assignee?: { type: 'human', id: string, name: string, avatar: string } | { type: 'agent', name: string };
}

export const DUMMY_HUMANS = [
  { id: 'h1', name: 'Michael Vega', avatar: 'https://i.pravatar.cc/150?u=michael' },
  { id: 'h2', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
];

export function AgentSuite() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState<Task['status']>('todo');

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const filename = view === 'daily' ? AZURE_FILE : WEEKLY_FILE;
      try {
        const res = await fetch(`/api/azure/${filename}`);
        if (res.ok) {
          const text = await res.text();
          if (text) {
            setTasks(JSON.parse(text));
          } else {
            setTasks([]);
          }
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Failed to load tasks', err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [view]);

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    const filename = view === 'daily' ? AZURE_FILE : WEEKLY_FILE;
    try {
      await fetch(`/api/azure/${filename}`, {
        method: 'PUT',
        body: JSON.stringify(newTasks, null, 2)
      });
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  };

  const handleDrop = (taskId: string, newStatus: Task['status']) => {
    const newTasks = tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    saveTasks(newTasks);
  };

  const handleStartConversation = async (task: Task) => {
    setSelectedTaskId(task.id);
    const userMessage = `Task: ${task.title}\nDescription: ${task.description}\n\nPlease execute this task.`;

    // 1. Optimistic update
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, chatHistory: [...t.chatHistory, { role: 'user' as const, content: userMessage }], isGenerating: true };
      }
      return t;
    });
    setTasks(updatedTasks);

    // 2. Network call
    try {
      const res = await fetch(TARGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      let responseText = data.response || 'No response from agent.';
      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) responseText = responseText.split('🦞').slice(1).join('🦞').trim();

      const finalTasks = updatedTasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            chatHistory: [...t.chatHistory, { role: 'agent' as const, content: responseText }],
            hasBotResponded: true,
            isGenerating: false
          };
        }
        return t;
      });
      saveTasks(finalTasks);
    } catch (err) {
      const errorTasks = updatedTasks.map(t => {
        if (t.id === task.id) {
          return { ...t, chatHistory: [...t.chatHistory, { role: 'agent' as const, content: 'Connection error.' }], isGenerating: false };
        }
        return t;
      });
      setTasks(errorTasks);
    }
  };

  const handleMoveToDone = (taskId: string) => {
    handleDrop(taskId, 'done');
  };

  const handleAssignAgent = (taskId: string) => {
    let maxAgentId = 0;
    tasks.forEach(t => {
      if (t.assignee?.type === 'agent') {
        const match = t.assignee.name.match(/Agent (\d+)/);
        if (match) {
          maxAgentId = Math.max(maxAgentId, parseInt(match[1], 10));
        }
      }
    });
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, assignee: { type: 'agent' as const, name: `Agent ${maxAgentId + 1}` } } : t);
    saveTasks(newTasks);
  };

  const handleAssignHuman = (taskId: string, human: { id: string, name: string, avatar: string }) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, assignee: { type: 'human' as const, ...human } } : t);
    saveTasks(newTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const newTasks = tasks.filter(t => t.id !== taskId);
      saveTasks(newTasks);
      setSelectedTaskId(null);
    }
  };

  const openAddModal = (status: Task['status']) => {
    setAddModalStatus(status);
    setShowAddModal(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!showAddModal) {
          openAddModal('todo');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 flex-col gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-gray-500 font-medium"><ThinkingTimer label="Loading tasks" /></span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Header */}
      <div className="relative z-10 px-8 py-5 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Daily Tasks
            </h1>
          </div>
          
          {/* View Toggle Slider */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shadow-inner">
            <button
              onClick={() => setView('daily')}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                view === 'daily' 
                  ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              )}
            >
              <Clock className="w-4 h-4" />
              Daily View
            </button>
            <button
              onClick={() => setView('weekly')}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                view === 'weekly' 
                  ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              )}
            >
              <Calendar className="w-4 h-4" />
              Weekly View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Main Agent Connected
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="relative z-10 flex-1 overflow-x-auto p-8 custom-scrollbar">
        <div className="flex gap-8 min-w-full items-start h-full">
          <AnimatePresence mode="wait">
            {view === 'daily' ? (
              <motion.div 
                key="daily"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-8"
              >
                <KanbanColumn
                  title="To Do"
                  icon={<ListTodo className="w-4 h-4" />}
                  status="todo"
                  tasks={tasks.filter(t => t.status === 'todo')}
                  onDrop={handleDrop}
                  onCardClick={t => setSelectedTaskId(t.id)}
                  onStart={handleStartConversation}
                  onDone={handleMoveToDone}
                  onAddClick={() => openAddModal('todo')}
                  onAssignHuman={handleAssignHuman}
                  onAssignAgent={handleAssignAgent}
                />
                <KanbanColumn
                  title="In Progress"
                  icon={<Activity className="w-4 h-4" />}
                  status="doing"
                  tasks={tasks.filter(t => t.status === 'doing')}
                  onDrop={handleDrop}
                  onCardClick={t => setSelectedTaskId(t.id)}
                  onStart={handleStartConversation}
                  onDone={handleMoveToDone}
                  onAddClick={() => openAddModal('doing')}
                  onAssignHuman={handleAssignHuman}
                  onAssignAgent={handleAssignAgent}
                />
                <KanbanColumn
                  title="Completed"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  status="done"
                  tasks={tasks.filter(t => t.status === 'done')}
                  onDrop={handleDrop}
                  onCardClick={t => setSelectedTaskId(t.id)}
                  onStart={handleStartConversation}
                  onDone={handleMoveToDone}
                  onAddClick={() => openAddModal('done')}
                  onAssignHuman={handleAssignHuman}
                  onAssignAgent={handleAssignAgent}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="weekly"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-8"
              >
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day, idx) => (
                  <KanbanColumn
                    key={day}
                    title={day.charAt(0).toUpperCase() + day.slice(1)}
                    icon={<Calendar className="w-4 h-4" />}
                    status={day as any}
                    tasks={tasks.filter(t => t.status === day)}
                    onDrop={handleDrop}
                    onCardClick={t => setSelectedTaskId(t.id)}
                    onStart={handleStartConversation}
                    onDone={handleMoveToDone}
                    onAddClick={() => openAddModal(day as any)}
                    onAssignHuman={handleAssignHuman}
                    onAssignAgent={handleAssignAgent}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Input Bar */}
      {!showAddModal && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl z-40 animate-in slide-in-from-bottom-8 duration-500">
          <div 
            onClick={() => openAddModal('todo')}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl flex items-center px-8 py-5 cursor-text group hover:bg-white hover:border-indigo-300/50 hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)] transition-all duration-300 ring-1 ring-slate-900/5 w-full"
          >
            <div className="relative group flex items-center justify-between w-full">
              <span className="text-slate-500 font-medium text-base tracking-wide">Tell me what agent you want me to build</span>
              <div className="ml-auto flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1.5 rounded-md border border-slate-200">⌘</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1.5 rounded-md border border-slate-200">K</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddTaskModal
          defaultStatus={addModalStatus}
          onClose={() => setShowAddModal(false)}
          onAdd={(newTask) => {
            saveTasks([...tasks, newTask]);
            setShowAddModal(false);
          }}
        />
      )}
      {selectedTaskId && (
        <TaskDetailModal
          task={tasks.find(t => t.id === selectedTaskId)!}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={(updated) => {
            saveTasks(tasks.map(t => t.id === updated.id ? updated : t));
          }}
          onDelete={() => handleDeleteTask(selectedTaskId)}
          onChatSend={async (msg) => {
            const task = tasks.find(t => t.id === selectedTaskId)!;
            const updatedTask = { ...task, chatHistory: [...task.chatHistory, { role: 'user' as const, content: msg }], isGenerating: true };
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));

            try {
              const res = await fetch(TARGET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
              });
              const data = await res.json();
              let responseText = data.response || 'No response.';
              const lobsterIndex = responseText.indexOf('🦞');
              if (lobsterIndex !== -1) responseText = responseText.split('🦞').slice(1).join('🦞').trim();

              const finalTask = { ...updatedTask, chatHistory: [...updatedTask.chatHistory, { role: 'agent' as const, content: responseText }], hasBotResponded: true, isGenerating: false };
              saveTasks(tasks.map(t => t.id === task.id ? finalTask : t));
            } catch (err) {
              const errorTask = { ...updatedTask, chatHistory: [...updatedTask.chatHistory, { role: 'agent' as const, content: 'Connection error.' }], isGenerating: false };
              setTasks(tasks.map(t => t.id === task.id ? errorTask : t));
            }
          }}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// Kanban Components
// ----------------------------------------------------
function KanbanColumn({ title, icon, status, tasks, onDrop, onCardClick, onStart, onDone, onAddClick, onAssignHuman, onAssignAgent }: {
  title: string,
  icon: React.ReactNode,
  status: Task['status'],
  tasks: Task[],
  onDrop: (id: string, status: Task['status']) => void,
  onCardClick: (t: Task) => void,
  onStart: (t: Task) => void,
  onDone: (id: string) => void,
  onAddClick: () => void,
  onAssignHuman: (taskId: string, h: any) => void,
  onAssignAgent: (taskId: string) => void
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: monitor => ({ isOver: !!monitor.isOver() })
  });

  return (
    <div 
      ref={dropRef as any} 
      className={cn(
        "flex flex-col w-[350px] bg-slate-200/40 backdrop-blur-[2px] rounded-2xl p-4 border border-slate-200 transition-all duration-300 shrink-0 max-h-full", 
        isOver && "bg-indigo-50/80 border-indigo-200 ring-2 ring-indigo-500/10"
      )}
    >
       <div className="flex items-center justify-between mb-5 px-1">
         <div className="flex items-center gap-2.5">
           <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-indigo-600">
             {icon}
           </div>
           <h2 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h2>
         </div>
         <span className="bg-white/80 shadow-sm border border-slate-200 text-slate-600 text-[11px] px-2.5 py-1 rounded-full font-bold tabular-nums">
           {tasks.length}
         </span>
       </div>

       <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 pb-4">
         <AnimatePresence>
           {tasks.map(task => (
             <TaskCard 
               key={task.id} 
               task={task} 
               onClick={() => onCardClick(task)} 
               onStart={(e) => { e.stopPropagation(); onStart(task); }} 
               onDone={(e) => { e.stopPropagation(); onDone(task.id); }} 
               onAssignHuman={(h) => onAssignHuman(task.id, h)}
               onAssignAgent={() => onAssignAgent(task.id)}
             />
           ))}
         </AnimatePresence>
       </div>
       
       <button 
         onClick={onAddClick}
         className="w-full mt-3 rounded-xl flex items-center justify-center text-[13px] text-slate-500 py-3 px-4 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:border-slate-200 border border-dashed border-slate-300 transition-all duration-200 font-semibold group"
       >
         <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
         Add New Card
       </button>
    </div>
  );
}

function TaskCard({ task, onClick, onStart, onDone, onAssignHuman, onAssignAgent }: { task: Task, onClick: () => void, onStart: (e: React.MouseEvent) => void, onDone: (e: React.MouseEvent) => void, onAssignHuman: (h: any) => void, onAssignAgent: () => void }) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      ref={dragRef as any}
      onClick={onClick}
      className={cn(
        "bg-[#FAFAFA] rounded-xl cursor-pointer transition-all border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col relative group overflow-hidden min-h-[280px]",
        isDragging && "opacity-40 grayscale"
      )}
    >
      {/* Top Header exactly like Harvey */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
        <FileText className="w-[18px] h-[18px] text-gray-400" />
        <span className="text-[14px] font-medium text-gray-500 capitalize tracking-tight">{task.status.replace('todo', 'To Do')}</span>
      </div>

      {/* Main Body */}
      <div className="flex flex-col flex-1 p-5 pb-6">
        <div className="flex-1"></div>
        
        {task.assignee?.type === 'agent' && (
          <span className="text-[14px] font-medium text-[#9CA3AF] mb-2">{task.assignee.name}</span>
        )}
        <h3 className="text-[20px] font-medium text-[#1F2937] leading-tight tracking-tight">
          {task.title}
        </h3>
        
        {task.assignee?.type === 'human' && (
          <div className="mt-4">
            <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full shadow-sm border border-gray-200" title={task.assignee.name} />
          </div>
        )}
      </div>

      {!task.assignee && (
        <div className="px-5 pb-5">
          {isAssigning ? (
            <div className="flex flex-col gap-1 p-2 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-1 px-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assign to</div>
                <button onClick={() => setIsAssigning(false)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
              </div>
              {DUMMY_HUMANS.map(h => (
                <button key={h.id} onClick={() => { onAssignHuman(h); setIsAssigning(false); }} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors text-left text-xs font-semibold text-gray-700">
                  <img src={h.avatar} alt="" className="w-5 h-5 rounded-full" /> {h.name}
                </button>
              ))}
              <div className="h-px bg-gray-100 my-0.5 mx-1" />
              <button onClick={() => { onAssignAgent(); setIsAssigning(false); }} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors text-left text-xs font-semibold text-gray-700">
                <div className="w-5 h-5 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-gray-400" /></div>
                Assign to Agent
              </button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" className="w-full text-[12px] font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setIsAssigning(true); }}>
              Assign Task
            </Button>
          )}
        </div>
      )}

      {task.assignee?.type === 'agent' && task.status !== 'done' && task.chatHistory.length === 0 && (
        <div className="px-5 pb-5">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50 border-indigo-100 shadow-none text-[11px] font-bold tracking-widest uppercase transition-all" 
            onClick={onStart}
          >
            <Play className="w-3 h-3 mr-2" /> Execute Agent
          </Button>
        </div>
      )}
      
      {task.status === 'doing' && task.hasBotResponded && (
        <div className="px-5 pb-5">
          <Button 
            size="sm" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all" 
            onClick={onDone}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Finalize Task
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ----------------------------------------------------
// Modals
// ----------------------------------------------------
function AddTaskModal({ onClose, onAdd, defaultStatus }: { onClose: () => void, onAdd: (t: Task) => void, defaultStatus: Task['status'] }) {
  const INITIAL_TEMPLATE = `* Title: 
* Description: 
* Image URL (Optional): 
* Status: ${defaultStatus.charAt(0).toUpperCase() + defaultStatus.slice(1).replace('todo', 'To Do')}`;

  const [chatInput, setChatInput] = useState(INITIAL_TEMPLATE);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'agent', content: string}[]>([
    { role: 'agent', content: "What kind of task would you like me to set up for you? Please edit the template below and send it to me." }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isGenerating]);

  // Focus input automatically
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;
    
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsGenerating(true);
    
    try {
      const res = await fetch(TARGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      let responseText = data.response || 'No response.';
      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) responseText = responseText.split('🦞').slice(1).join('🦞').trim();

      setChatHistory(prev => [...prev, { role: 'agent', content: responseText }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'agent', content: 'Connection error.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = () => {
    // Find the last user message to extract fields
    const lastUserMsg = chatHistory.slice().reverse().find(m => m.role === 'user')?.content || chatInput;
    
    // Extract using regex
    const titleMatch = lastUserMsg.match(/\*\s*Title:\s*(.*)/i);
    const descMatch = lastUserMsg.match(/\*\s*Description:\s*(.*)/i);
    const imageMatch = lastUserMsg.match(/\*\s*Image URL(?:\s*\(Optional\))?:\s*(http[^\s]*)/i);
    const statusMatch = lastUserMsg.match(/\*\s*Status:\s*(Scheduled|To Do|Done)/i);
    const intervalMatch = lastUserMsg.match(/\*\s*Interval:\s*(.*)/i);

    const title = titleMatch ? titleMatch[1].trim() : 'New Agent Task';
    const description = descMatch ? descMatch[1].trim() : lastUserMsg;
    const image = imageMatch ? imageMatch[1].trim() : '';
    const extractedStatusStr = statusMatch ? statusMatch[1].toLowerCase().replace('to do', 'todo') : defaultStatus;
    const allowedStatuses = ['todo', 'doing', 'done', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const status = allowedStatuses.includes(extractedStatusStr) ? extractedStatusStr as Task['status'] : defaultStatus;
    const interval = intervalMatch ? intervalMatch[1].trim() : (status === 'todo' ? 'One-time' : undefined);

    onAdd({
      id: Math.random().toString(36).substring(7),
      title,
      description,
      image,
      status,
      interval,
      comments: [],
      chatHistory,
      hasBotResponded: false,
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 w-full max-w-3xl h-[85vh] max-h-[800px] min-h-[500px] animate-in zoom-in-95 slide-in-from-bottom-10 duration-300"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Create New Task
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/50">
          {chatHistory.map((msg, i) => (
            <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl px-5 py-3 text-sm bg-gray-100 text-gray-900 rounded-br-none shadow-sm">
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div className="flex flex-col w-full justify-start relative group pl-2">
                  <div className="prose prose-lg max-w-none w-full text-[#111827] prose-p:my-2 prose-headings:my-2 prose-p:leading-[2.1] prose-li:leading-[2.1] prose-a:text-blue-600 prose-pre:bg-gray-800 prose-pre:text-gray-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                    <button 
                      onClick={() => downloadAsWord(msg.content, 'Report')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm transition-all hover:bg-gray-50"
                      title="Download as Word"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isGenerating && (
            <div className="flex w-full justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3.5 shadow-sm bg-white border border-gray-200 rounded-bl-none flex items-center gap-1.5 h-[38px]">
                <span className="text-gray-500 text-sm font-medium"><ThinkingTimer /></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white flex flex-col gap-3 shrink-0">
          <div className="relative">
            <textarea 
              ref={inputRef}
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
              placeholder="Edit template or reply to agent... (Cmd+Enter to send)" 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner resize-none h-32" 
            />
            <Button onClick={handleSendChat} disabled={isGenerating || !chatInput.trim()} className="absolute bottom-3 right-3 rounded-lg w-9 h-9 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-md disabled:opacity-50">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-end pt-1">
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Approve & Create Task
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose, onUpdate, onDelete, onChatSend }: { task: Task, onClose: () => void, onUpdate: (t: Task) => void, onDelete: () => void, onChatSend: (m: string) => void }) {
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task.chatHistory, task.isGenerating]);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    onChatSend(chatInput);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20 rounded-t-2xl">
          <h2 className="font-semibold text-lg">{task.title}</h2>
          <div className="flex items-center gap-2">
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 flex items-center gap-1.5 text-xs font-medium transition-colors border border-transparent hover:border-red-200" title="Delete Task">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(task.status) ? "bg-purple-100 text-purple-800" :
                  task.status === 'done' ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-800"
              )}>
                {task.status}
              </span>
              {task.interval && <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {task.interval}</span>}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          {task.image && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Attachment</h3>
              <img src={task.image} alt="Attachment" className="w-full rounded-lg border border-gray-200 shadow-sm" />
            </div>
          )}

          {/* Embedded Chat Flow */}
          <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white mt-8 mb-4 min-h-[400px]">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Agent Thread</h3>
                <p className="text-xs text-gray-500">Task execution and discussion history</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/30">
              {task.chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 py-12">
                  <p>No conversation yet. Send a message to start.</p>
                  <Button onClick={() => {
                    const initialMsg = `Task: ${task.title}\nDescription: ${task.description}\n\nPlease execute this task.`;
                    onChatSend(initialMsg);
                  }} className="bg-stone-900 hover:bg-stone-950 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Start Bot with Task Details
                  </Button>
                </div>
              ) : (
                task.chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    {msg.role === 'user' ? (
                      <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm bg-gray-100 text-gray-900 rounded-br-none shadow-sm">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full justify-start relative group pl-2">
                        <div className="prose prose-lg font-sans tracking-tight max-w-none w-full text-[#111827] prose-p:leading-[2.1] prose-p:text-[17px] prose-li:text-[17px] prose-li:leading-[2.1] prose-headings:font-semibold prose-a:text-blue-600 prose-pre:bg-gray-800 prose-pre:text-gray-100">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                          <button 
                            onClick={() => downloadAsWord(msg.content, 'Report')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm transition-all hover:bg-gray-50"
                            title="Download as Word"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {task.isGenerating && (
                <div className="flex w-full justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm bg-white border border-stone-100 rounded-bl-none flex items-center gap-2 text-stone-600 font-medium h-[38px]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <ThinkingTimer label="Agent is thinking" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={handleSendChat} className="relative flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={task.isGenerating}
                  placeholder="Ask a follow-up..."
                  className="flex-1 min-w-0 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-stone-500 focus:border-stone-500 block w-full px-5 py-3 pr-12 transition-all"
                />
                <Button
                  type="submit"
                  disabled={task.isGenerating || !chatInput.trim()}
                  className="absolute right-1.5 p-2 bg-stone-900 hover:bg-stone-950 text-white rounded-full w-9 h-9 flex items-center justify-center transition-transform disabled:opacity-50 disabled:hover:scale-100 hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
