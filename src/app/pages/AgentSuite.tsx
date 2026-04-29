import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Loader2, Plus, MessageSquare, Clock, Play, CheckCircle, Bot, X, Send, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ITEM_TYPE = 'TASK_CARD';
const AZURE_FILE = 'agent-tasks.json';
const TARGET_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/chat';

export interface Task {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: 'scheduled' | 'todo' | 'done';
  interval?: string;
  comments: { text: string; timestamp: number }[];
  hasBotResponded: boolean;
  isGenerating?: boolean;
  timestamp: number;
}

export function AgentSuite() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState<Task['status']>('todo');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch(`/api/azure/${AZURE_FILE}`);
        if (res.ok) {
          const text = await res.text();
          if (text) {
            setTasks(JSON.parse(text));
          }
        }
      } catch (err) {
        console.error('Failed to load tasks', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      await fetch(`/api/azure/${AZURE_FILE}`, {
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const scheduledTasks = tasks.filter(t => t.status === 'scheduled');
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Agent Suite
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage, schedule, and execute autonomous agent workflows.</p>
        </div>
        <Button onClick={() => openAddModal('todo')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 h-full min-w-[1000px]">
          <KanbanColumn 
            title="Scheduled" 
            status="scheduled" 
            tasks={scheduledTasks} 
            onDrop={handleDrop} 
            onCardClick={t => setSelectedTaskId(t.id)} 
            onStart={handleStartConversation} 
            onDone={handleMoveToDone} 
            onAddClick={() => openAddModal('scheduled')}
          />
          <KanbanColumn 
            title="To Do" 
            status="todo" 
            tasks={todoTasks} 
            onDrop={handleDrop} 
            onCardClick={t => setSelectedTaskId(t.id)} 
            onStart={handleStartConversation} 
            onDone={handleMoveToDone}
            onAddClick={() => openAddModal('todo')} 
          />
          <KanbanColumn 
            title="Done" 
            status="done" 
            tasks={doneTasks} 
            onDrop={handleDrop} 
            onCardClick={t => setSelectedTaskId(t.id)} 
            onStart={handleStartConversation} 
            onDone={handleMoveToDone} 
            onAddClick={() => openAddModal('done')}
          />
        </div>
      </div>

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
function KanbanColumn({ title, status, tasks, onDrop, onCardClick, onStart, onDone, onAddClick }: { 
  title: string, 
  status: Task['status'], 
  tasks: Task[], 
  onDrop: (id: string, status: Task['status']) => void,
  onCardClick: (t: Task) => void,
  onStart: (t: Task) => void,
  onDone: (id: string) => void,
  onAddClick: () => void
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: monitor => ({ isOver: !!monitor.isOver() })
  });

  return (
    <div ref={dropRef as any} className={cn("flex flex-col flex-1 bg-gray-50/80 rounded-xl p-4 border border-gray-200 transition-colors", isOver && "bg-blue-50 border-blue-200")}>
       <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
         {title}
         <span className="bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-medium">{tasks.length}</span>
       </h2>
       <div className="flex flex-col gap-3 overflow-y-auto pb-4 h-full">
         {tasks.map(task => (
           <TaskCard 
             key={task.id} 
             task={task} 
             onClick={() => onCardClick(task)} 
             onStart={(e) => { e.stopPropagation(); onStart(task); }} 
             onDone={(e) => { e.stopPropagation(); onDone(task.id); }} 
           />
         ))}
         
         {/* Always show Add Card button instead of "Drop here" box */}
         <button 
           onClick={onAddClick}
           className="w-full mt-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500 py-3 hover:text-blue-600 hover:border-blue-300 transition-colors bg-white hover:bg-blue-50/50"
         >
           <Plus className="w-4 h-4 mr-2" /> Add Card
         </button>
       </div>
    </div>
  );
}

function TaskCard({ task, onClick, onStart, onDone }: { task: Task, onClick: () => void, onStart: (e: React.MouseEvent) => void, onDone: (e: React.MouseEvent) => void }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  });

  return (
    <div 
      ref={dragRef as any} 
      onClick={onClick} 
      className={cn("bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 flex flex-col", isDragging && "opacity-50")}
    >
       <div className="flex items-start justify-between mb-2">
         <h3 className="font-semibold text-gray-900 leading-tight flex-1">{task.title}</h3>
         {task.status === 'scheduled' && task.interval && (
           <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1 shrink-0">
             <Clock className="w-3 h-3" /> {task.interval}
           </span>
         )}
       </div>
       
       <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
       
       {task.image && (
         <div className="w-full h-24 mb-3 rounded-md overflow-hidden border border-gray-100">
           <img src={task.image} alt="Task attachment" className="w-full h-full object-cover" />
         </div>
       )}
       
       <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium mt-auto">
         <div className="flex items-center gap-1.5" title="Comments">
           <MessageSquare className="w-3.5 h-3.5" />
           {task.comments.length}
         </div>
         <div className="flex items-center gap-1.5" title="Chat Messages">
           <Bot className="w-3.5 h-3.5" />
           {task.chatHistory.length}
         </div>
       </div>

       <div className="flex flex-col gap-2 mt-2 border-t border-gray-100 pt-3">
         {task.status !== 'done' && (
           <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-1.5 h-8 text-xs bg-gray-50 hover:bg-gray-100 shrink-0" onClick={onStart}>
             <Play className="w-3 h-3 text-blue-600" /> Start Bot
           </Button>
         )}
         {task.status === 'todo' && task.hasBotResponded && (
           <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1.5 h-8 text-xs text-white shrink-0" onClick={onDone}>
             <CheckCircle className="w-3 h-3" /> Move to Done
           </Button>
         )}
       </div>
    </div>
  );
}

// ----------------------------------------------------
// Modals
// ----------------------------------------------------
function AddTaskModal({ onClose, onAdd, defaultStatus }: { onClose: () => void, onAdd: (t: Task) => void, defaultStatus: Task['status'] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<Task['status']>(defaultStatus);
  const [intervalOption, setIntervalOption] = useState('Daily');
  const [customInterval, setCustomInterval] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const interval = status === 'scheduled' ? (intervalOption === 'Custom' ? customInterval : intervalOption) : undefined;
    onAdd({
      id: Math.random().toString(36).substring(7),
      title,
      description,
      image,
      status,
      interval,
      comments: [],
      chatHistory: [],
      hasBotResponded: false,
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Create New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Analyze Q3 Financials" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" placeholder="Details about what the agent should do..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="https://..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="todo">To Do</option>
                <option value="scheduled">Scheduled</option>
                <option value="done">Done</option>
              </select>
            </div>
            {status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
                <select value={intervalOption} onChange={e => setIntervalOption(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white mb-2">
                  <option value="5 Min">Every 5 Min</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                  <option value="Custom">Custom...</option>
                </select>
                {intervalOption === 'Custom' && (
                  <input required type="text" value={customInterval} onChange={e => setCustomInterval(e.target.value)} placeholder="e.g. Every Tuesday" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose, onUpdate, onDelete, onChatSend }: { task: Task, onClose: () => void, onUpdate: (t: Task) => void, onDelete: () => void, onChatSend: (m: string) => void }) {
  const [chatInput, setChatInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task.chatHistory]);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    onChatSend(chatInput);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex">
        
        {/* Left Side: Details & Comments */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col h-full shrink-0">
          <div className="p-6 overflow-y-auto flex-1 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                  task.status === 'scheduled' ? "bg-purple-100 text-purple-800" :
                  task.status === 'done' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                )}>
                  {task.status}
                </span>
                {task.interval && <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {task.interval}</span>}
              </div>
              <button onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 flex items-center gap-1.5 text-xs font-medium transition-colors border border-transparent hover:border-red-200" title="Delete Task">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap mb-6">{task.description}</p>
            {task.image && (
              <img src={task.image} alt="Attachment" className="w-full rounded-lg border border-gray-200 shadow-sm mb-6" />
            )}
          </div>
          
          <div className="h-1/2 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 flex items-center gap-2 shrink-0">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              Comments
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {task.comments.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">No comments yet.</div>
              ) : (
                task.comments.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                    <p className="text-gray-800">{c.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(c.timestamp).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!commentInput.trim()) return;
              onUpdate({
                ...task,
                comments: [...task.comments, { text: commentInput, timestamp: Date.now() }]
              });
              setCommentInput('');
            }} className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2 shrink-0">
              <input type="text" value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Add a comment..." className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <Button type="submit" size="sm">Post</Button>
            </form>
          </div>
        </div>

        {/* Right Side: Agent Chat History */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white z-10 shadow-sm shrink-0">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Agent Thread
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/50">
            {task.chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                <Bot className="w-12 h-12 text-gray-300" />
                <p>No conversation yet. Send a message to start.</p>
                <Button onClick={() => {
                  const initialMsg = `Task: ${task.title}\nDescription: ${task.description}\n\nPlease execute this task.`;
                  onChatSend(initialMsg);
                }} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Bot with Task Details
                </Button>
              </div>
            ) : (
              task.chatHistory.map((msg, i) => (
                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm",
                    msg.role === 'user' ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  )}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {task.isGenerating && (
              <div className="flex w-full justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3.5 shadow-sm bg-white border border-gray-200 rounded-bl-none flex items-center gap-1.5 h-[38px]">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSendChat} className="p-4 border-t border-gray-200 bg-white flex gap-3 shrink-0">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              placeholder="Send message to agent..." 
              className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
            />
            <Button type="submit" className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-md">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
