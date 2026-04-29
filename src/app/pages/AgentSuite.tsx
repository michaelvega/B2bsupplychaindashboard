import { useState, useRef, useEffect } from 'react';
import { Bot, Plus, X, Play, Clock, Pencil, Send, Loader2, Minus, Square } from 'lucide-react';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CustomAgent {
  id: string;
  name: string;
  masterPrompt: string;
  schedule: string;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
}

const TARGET_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/chat';

export function AgentSuite() {
  const [agents, setAgents] = useState<CustomAgent[]>(() => {
    try {
      const saved = localStorage.getItem('custom_agents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [newAgentSchedule, setNewAgentSchedule] = useState('1h');
  
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('custom_agents', JSON.stringify(agents));
  }, [agents]);

  const openWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    setFocusedWindow(id);
  };

  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter(w => w !== id));
    if (focusedWindow === id) {
      setFocusedWindow(openWindows[openWindows.length - 2] || null);
    }
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim() || !newAgentPrompt.trim()) return;
    const newAgent: CustomAgent = {
      id: crypto.randomUUID(),
      name: newAgentName.trim(),
      masterPrompt: newAgentPrompt.trim(),
      schedule: newAgentSchedule
    };
    setAgents([...agents, newAgent]);
    setShowCreateModal(false);
    setNewAgentName('');
    setNewAgentPrompt('');
    setNewAgentSchedule('1h');
    openWindow(newAgent.id);
  };

  const handleSaveEdit = () => {
    if (editingAgentId && newAgentPrompt.trim()) {
      setAgents(agents.map(a => a.id === editingAgentId ? { ...a, masterPrompt: newAgentPrompt.trim(), schedule: newAgentSchedule } : a));
    }
    setEditingAgentId(null);
    setNewAgentPrompt('');
  };

  return (
    <div className="h-full w-full bg-slate-900 relative overflow-hidden flex flex-col font-sans">
      {/* Desktop Background & Icons */}
      <div className="flex-1 p-6 relative z-0">
        <div className="flex flex-col gap-6 flex-wrap content-start h-full">
          
          {/* General Agent Icon */}
          <div 
            className="flex flex-col items-center gap-2 w-24 group cursor-pointer"
            onClick={() => openWindow('general')}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-600/80 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-blue-500/90 transition-all">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-xs font-medium text-center drop-shadow-md">General Agent</span>
          </div>

          {/* Custom Agents Icons */}
          {agents.map(agent => (
            <div 
              key={agent.id} 
              className="flex flex-col items-center gap-2 w-24 group cursor-pointer relative"
              onClick={() => openWindow(agent.id)}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-600/80 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-emerald-500/90 transition-all">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-xs font-medium text-center drop-shadow-md px-1 truncate w-full">{agent.name}</span>
              
              {/* Edit overlay */}
              <div 
                className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewAgentPrompt(agent.masterPrompt);
                  setNewAgentSchedule(agent.schedule);
                  setEditingAgentId(agent.id);
                }}
              >
                <Pencil className="w-3.5 h-3.5 text-gray-700" />
              </div>
            </div>
          ))}

          {/* Create New Agent Icon */}
          <div 
            className="flex flex-col items-center gap-2 w-24 group cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center border-dashed shadow-lg group-hover:bg-white/20 transition-all">
              <Plus className="w-8 h-8 text-white/80" />
            </div>
            <span className="text-white/80 text-xs font-medium text-center drop-shadow-md">Create New</span>
          </div>

        </div>
      </div>

      {/* Render Open Windows */}
      {openWindows.map(id => {
        const isGeneral = id === 'general';
        const agent = isGeneral ? null : agents.find(a => a.id === id);
        if (!isGeneral && !agent) return null;
        
        return (
          <AgentWindow 
            key={id}
            id={id}
            title={isGeneral ? 'General Agent' : agent!.name}
            masterPrompt={isGeneral ? null : agent!.masterPrompt}
            isActive={focusedWindow === id}
            onFocus={() => setFocusedWindow(id)}
            onClose={() => closeWindow(id)}
          />
        );
      })}

      {/* Taskbar */}
      <div className="h-12 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex items-center px-4 gap-2 z-50">
        {openWindows.map(id => {
          const isGeneral = id === 'general';
          const agent = isGeneral ? null : agents.find(a => a.id === id);
          if (!isGeneral && !agent) return null;
          
          return (
            <button
              key={id}
              onClick={() => setFocusedWindow(id)}
              className={`h-9 px-4 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                focusedWindow === id 
                  ? 'bg-white/20 text-white shadow-inner' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="truncate max-w-[120px]">{isGeneral ? 'General Agent' : agent!.name}</span>
            </button>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {(showCreateModal || editingAgentId) && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAgentId ? 'Edit Agent' : 'Create New Agent'}
              </h2>
              <button 
                onClick={() => { setShowCreateModal(false); setEditingAgentId(null); }}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              {!editingAgentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                  <input 
                    type="text" 
                    value={newAgentName}
                    onChange={e => setNewAgentName(e.target.value)}
                    placeholder="e.g. Invoice Processor"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Master Prompt</label>
                <textarea 
                  value={newAgentPrompt}
                  onChange={e => setNewAgentPrompt(e.target.value)}
                  placeholder="Enter the task instructions for the agent to repeat..."
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Schedule Interval
                </label>
                <select 
                  value={newAgentSchedule}
                  onChange={e => setNewAgentSchedule(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5m">Every 5 minutes</option>
                  <option value="15m">Every 15 minutes</option>
                  <option value="30m">Every 30 minutes</option>
                  <option value="1h">Every 1 hour</option>
                  <option value="1d">Every 1 day</option>
                  <option value="1w">Every 1 week</option>
                  <option value="1mo">Every 1 month</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); setEditingAgentId(null); }}>
                Cancel
              </Button>
              <Button onClick={editingAgentId ? handleSaveEdit : handleCreateAgent} className="bg-blue-600 hover:bg-blue-700 text-white">
                {editingAgentId ? 'Save Changes' : 'Create Agent'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentWindow({ id, title, masterPrompt, isActive, onFocus, onClose }: { id: string, title: string, masterPrompt: string | null, isActive: boolean, onFocus: () => void, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(`agent_history_${id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`agent_history_${id}`, JSON.stringify(messages));
  }, [messages, id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Run master prompt on very first open for custom agents
  useEffect(() => {
    if (masterPrompt && messages.length === 0) {
      handleSend(`[System Init: Executing Master Prompt]\n\n${masterPrompt}`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;
    const userMessage = messageText.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(TARGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      
      const data = await response.json();
      let responseText = data.response || 'No response from agent.';

      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) {
        responseText = responseText.split('🦞').slice(1).join('🦞').trim();
      }

      setMessages(prev => [...prev, { role: 'agent', content: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'agent', content: `Error: ${error instanceof Error ? error.message : 'Unknown'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`absolute inset-4 sm:inset-10 md:inset-20 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-opacity duration-200 ${isActive ? 'z-40 opacity-100 scale-100' : 'z-30 opacity-0 scale-95 pointer-events-none'}`}
      onMouseDown={onFocus}
    >
      {/* Window Header */}
      <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 select-none shrink-0 cursor-default">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><Minus className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><Square className="w-3.5 h-3.5" /></button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-500 hover:text-white rounded text-gray-500 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-400">
              <Bot className="w-12 h-12 mb-4 text-gray-200" />
              <p>Ready to assist.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm">
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </div>
                ) : (
                  <div className="flex w-full text-sm leading-relaxed text-gray-800 gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm max-w-none prose-slate">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex w-full gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="max-w-4xl mx-auto relative bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-gray-400">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Talk to the agent..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-transparent py-3 pl-4 pr-12 focus:outline-none disabled:opacity-50 min-h-[48px] max-h-32 overflow-y-auto text-sm"
          />
          <button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg w-8 h-8 flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
