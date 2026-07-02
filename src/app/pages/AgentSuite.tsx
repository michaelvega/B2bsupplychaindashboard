import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import {
  Loader2, Plus, Clock, Play, X, Trash2, Calendar, CheckCircle2, ListTodo, Activity,
  FileText, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';
import { ThinkingTimer } from '../components/ThinkingTimer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ITEM_TYPE = 'TASK_CARD';
const AZURE_FILE = 'agent-tasks.json';
const WEEKLY_FILE = 'weekly-agent-tasks.json';

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
}

// Mock spreadsheet data
const SPREADSHEET_DATA = [
  { id: 'ORD-001', task: 'Order #1234 verification', sku: '#8842', status: 'In Progress', due: 'Mon' },
  { id: 'ORD-002', task: 'Vendor delay review', sku: '#2201', status: 'Pending', due: 'Tue' },
  { id: 'ORD-003', task: 'Inventory reconciliation', sku: '#5512', status: 'Done', due: 'Mon' },
  { id: 'ORD-004', task: 'Forecast accuracy check', sku: '#7734', status: 'In Progress', due: 'Wed' },
  { id: 'ORD-005', task: 'Quality audit report', sku: '#8842', status: 'Pending', due: 'Thu' },
  { id: 'ORD-006', task: 'Supplier contract review', sku: '#2201', status: 'Done', due: 'Fri' },
  { id: 'ORD-007', task: 'Shipping delay alert', sku: '#5512', status: 'In Progress', due: 'Tue' },
  { id: 'ORD-008', task: 'Stock level warning', sku: '#7734', status: 'Pending', due: 'Wed' },
];

const TASK_CHART_DATA = [
  { day: 'Mon', tasks: 12 },
  { day: 'Tue', tasks: 8 },
  { day: 'Wed', tasks: 15 },
  { day: 'Thu', tasks: 6 },
  { day: 'Fri', tasks: 10 },
];

export function AgentSuite() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  const handleAddTask = (status: Task['status']) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: 'New Task',
      description: '',
      status,
      comments: [],
      hasBotResponded: false,
      timestamp: Date.now(),
    };
    saveTasks([...tasks, newTask]);
  };

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
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Calendar
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
                className="w-full flex flex-col gap-8"
              >
                <DailyTaskGrid
                  tasks={tasks}
                  onCardClick={t => setSelectedTaskId(t.id)}
                  onAddClick={() => handleAddTask('todo')}
                />

                {/* Mock Spreadsheet + Chart */}
                <SpreadsheetWithChart />
              </motion.div>
            ) : (
              <motion.div
                key="weekly"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-8"
              >
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                  <KanbanColumn
                    key={day}
                    title={day.charAt(0).toUpperCase() + day.slice(1)}
                    icon={<Calendar className="w-4 h-4" />}
                    status={day as any}
                    tasks={tasks.filter(t => t.status === day)}
                    onDrop={handleDrop}
                    onCardClick={t => setSelectedTaskId(t.id)}
                    onDone={handleMoveToDone}
                    onAddClick={() => handleAddTask(day as any)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailModal
          task={tasks.find(t => t.id === selectedTaskId)!}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={(updated) => {
            saveTasks(tasks.map(t => t.id === updated.id ? updated : t));
          }}
          onDelete={() => handleDeleteTask(selectedTaskId)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// Spreadsheet + Chart Mock Visual
// ----------------------------------------------------
function SpreadsheetWithChart() {
  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 pb-8">
      {/* Excel-style Spreadsheet */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/80 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Task Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200">
                <th className="w-10 px-3 py-2 text-[10px] text-gray-400 font-medium border-r border-gray-200"></th>
                <th className="px-3 py-2 text-[10px] text-gray-400 font-medium border-r border-gray-200 text-left">A</th>
                <th className="px-3 py-2 text-[10px] text-gray-400 font-medium border-r border-gray-200 text-left">B</th>
                <th className="px-3 py-2 text-[10px] text-gray-400 font-medium border-r border-gray-200 text-left">C</th>
                <th className="px-3 py-2 text-[10px] text-gray-400 font-medium border-r border-gray-200 text-left">D</th>
                <th className="px-3 py-2 text-[10px] text-gray-400 font-medium text-left">E</th>
              </tr>
            </thead>
            <tbody>
              {SPREADSHEET_DATA.map((row, i) => (
                <tr key={row.id} className={cn(
                  "border-b border-gray-100 hover:bg-blue-50/30 transition-colors",
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                )}>
                  <td className="px-3 py-2 text-[10px] text-gray-400 border-r border-gray-200 text-center">{i + 1}</td>
                  <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 font-medium">{row.id}</td>
                  <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">{row.task}</td>
                  <td className="px-3 py-2 text-xs text-gray-500 border-r border-gray-200 font-mono">{row.sku}</td>
                  <td className="px-3 py-2 text-xs border-r border-gray-200">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium",
                      row.status === 'Done' ? 'bg-green-100 text-green-700' :
                      row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    )}>{row.status}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{row.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks by Day Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/80 flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Tasks by Day</h3>
        </div>
        <div className="p-4 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TASK_CHART_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Kanban Components
// ----------------------------------------------------
function KanbanColumn({ title, icon, status, tasks, onDrop, onCardClick, onDone, onAddClick }: {
  title: string,
  icon: React.ReactNode,
  status: Task['status'],
  tasks: Task[],
  onDrop: (id: string, status: Task['status']) => void,
  onCardClick: (t: Task) => void,
  onDone: (id: string) => void,
  onAddClick: () => void,
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
             <SimpleTaskCard
               key={task.id}
               task={task}
               onClick={() => onCardClick(task)}
               onDone={(e) => { e.stopPropagation(); onDone(task.id); }}
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

function SimpleTaskCard({ task, onClick, onDone }: { task: Task, onClick: () => void, onDone: (e: React.MouseEvent) => void }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: task.id },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  });

  const statusLabel = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(task.status)
    ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
    : task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done';

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
        "bg-white rounded-xl cursor-pointer transition-all border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col relative group overflow-hidden min-h-[180px]",
        isDragging && "opacity-40 grayscale"
      )}
    >
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
        <FileText className="w-[18px] h-[18px] text-gray-400" />
        <span className="text-[14px] font-medium text-gray-500 capitalize tracking-tight">{statusLabel}</span>
      </div>

      <div className="flex flex-col flex-1 p-5 pb-6">
        <div className="flex-1"></div>
        <h3 className="text-[20px] font-medium text-[#1F2937] leading-tight tracking-tight">
          {task.title}
        </h3>
      </div>

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
// Task Detail Modal (simplified — no agent chat)
// ----------------------------------------------------
function TaskDetailModal({ task, onClose, onUpdate, onDelete }: { task: Task, onClose: () => void, onUpdate: (t: Task) => void, onDelete: () => void }) {
  const statusLabel = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(task.status)
    ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
    : task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20 rounded-t-2xl">
          <h2 className="font-semibold text-lg">{task.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm("Reset this task to TODO?")) {
                  onUpdate({ ...task, status: 'todo', hasBotResponded: false });
                  onClose();
                }
              }}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded px-2 py-1 flex items-center gap-1.5 text-xs font-medium transition-colors"
              title="Reset to TODO"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 flex items-center gap-1.5 text-xs font-medium transition-colors" title="Delete Task">
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
                {statusLabel}
              </span>
              {task.interval && <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {task.interval}</span>}
              <span className="text-xs text-gray-400">
                {new Date(task.timestamp).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
          </div>

          {task.image && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Attachment</h3>
              <img src={task.image} alt="Attachment" className="w-full rounded-lg border border-gray-200 shadow-sm" />
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
            <span>Created: {new Date(task.timestamp).toLocaleString()}</span>
            <span>ID: {task.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Daily View Row-Based Components
// ----------------------------------------------------
function DailyTaskGrid({ tasks, onCardClick, onAddClick }: any) {
  const dailyTasks = tasks.filter((t: Task) => ['todo', 'doing', 'done'].includes(t.status));

  return (
    <div className="relative flex flex-col w-full max-w-6xl mx-auto h-full px-4">
      {/* Background Columns */}
      <div className="absolute inset-x-4 top-0 bottom-0 grid grid-cols-3 gap-8 pointer-events-none z-0 pb-20">
        <div className="relative h-full"><div className="absolute -inset-x-3 inset-y-0 bg-slate-200/40 backdrop-blur-[2px] rounded-2xl border border-slate-200"></div></div>
        <div className="relative h-full"><div className="absolute -inset-x-3 inset-y-0 bg-slate-200/40 backdrop-blur-[2px] rounded-2xl border border-slate-200"></div></div>
        <div className="relative h-full"><div className="absolute -inset-x-3 inset-y-0 bg-slate-200/40 backdrop-blur-[2px] rounded-2xl border border-slate-200"></div></div>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-8 mb-6 shrink-0 relative z-10 pt-4">
         <div className="flex items-center gap-2.5 px-2">
           <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-indigo-600"><ListTodo className="w-4 h-4" /></div>
           <h2 className="font-bold text-slate-800 text-sm tracking-tight">To Do</h2>
         </div>
         <div className="flex items-center gap-2.5 px-2">
           <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-indigo-600"><Activity className="w-4 h-4" /></div>
           <h2 className="font-bold text-slate-800 text-sm tracking-tight">In Progress</h2>
         </div>
         <div className="flex items-center gap-2.5 px-2">
           <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-indigo-600"><CheckCircle2 className="w-4 h-4" /></div>
           <h2 className="font-bold text-slate-800 text-sm tracking-tight">Completed</h2>
         </div>
      </div>

      {/* Task Rows */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-24 custom-scrollbar relative z-10">
        <AnimatePresence>
          {dailyTasks.map((task: Task) => (
            <div key={task.id} className="grid grid-cols-3 gap-8">
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={
                  task.status === 'todo' ? 'col-start-1' :
                  task.status === 'doing' ? 'col-start-2' :
                  'col-start-3'
                }
              >
                 <DailyTaskCard task={task} onClick={() => onCardClick(task)} onStart={() => {}} />
              </motion.div>
            </div>
          ))}
        </AnimatePresence>

        {/* Add Button at bottom of Todo column */}
        <div className="grid grid-cols-3 gap-8 mt-2">
           <div>
             <button
               onClick={onAddClick}
               className="w-full rounded-xl flex items-center justify-center text-[13px] text-slate-500 py-4 px-4 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:border-slate-200 border border-dashed border-slate-300 transition-all duration-200 font-semibold group"
             >
               <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
               Add New Task
             </button>
           </div>
           <div />
           <div />
        </div>
      </div>
    </div>
  );
}

function DailyTaskCard({ task, onClick, onStart }: { task: Task, onClick: () => void, onStart: () => void }) {
  const statusLabel = task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done';

  return (
    <motion.div
      layout
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-white rounded-xl cursor-pointer transition-all border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col relative overflow-hidden min-h-[140px]"
    >
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 shrink-0">
        <FileText className="w-[18px] h-[18px] text-gray-400" />
        <span className="text-[14px] font-medium text-gray-500 capitalize tracking-tight">
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 pb-6">
        <h3 className="text-[18px] font-medium text-[#1F2937] leading-tight tracking-tight mb-auto">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{task.description}</p>
        )}
      </div>
    </motion.div>
  );
}
