import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import {
  Send,
  Loader2,
  Plus,
  MessageSquare,
  MoreHorizontal,
  PenLine,
  Trash2,
  Share,
  Check,
  Download,
  PanelRightClose,
  PanelRightOpen,
  X,
  FileText,
  BrainCircuit,
  Zap,
} from 'lucide-react';
interface Message {
  role: 'user' | 'agent';
  content: string;
  attachments?: AttachedFile[];
  tokens?: number;
  thinking?: string;
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const TARGET_URL = 'https://membrain-agent.jollygrass-e659853e.eastus2.azurecontainerapps.io/api/chat';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const estimateTokens = (text: string): number => {
  // Rough estimate: ~4 chars per token for English text
  return Math.max(1, Math.round(text.length / 4));
};

const downloadAsWord = async (text: string, title: string) => {
  const htmlContent = await marked.parse(text);
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  const footer = '</body></html>';
  const html = header + htmlContent + footer;
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface AssistantPanelProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border border-blue-100/60 rounded-xl animate-in fade-in duration-300">
      <div className="relative">
        <BrainCircuit className="w-4 h-4 text-blue-500 animate-pulse" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-400 animate-ping" />
      </div>
      <span className="text-xs font-medium text-blue-600">Thinking</span>
      <span className="flex gap-1 items-end pb-0.5">
        <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
      </span>
    </div>
  );
}

export function AssistantPanel({ collapsed, onToggleCollapse }: AssistantPanelProps) {
  const [chats, setChats] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('agent_chats');
      if (saved) return JSON.parse(saved);
      const oldMessages = localStorage.getItem('agent_messages');
      if (oldMessages) {
        const parsed = JSON.parse(oldMessages);
        if (parsed.length > 0) {
          const migratedChat: ChatSession = {
            id: crypto.randomUUID(),
            title: 'Imported Chat',
            messages: parsed,
            updatedAt: Date.now(),
          };
          return [migratedChat];
        }
      }
    } catch (e) {
      console.error('Failed to load chats', e);
    }
    return [];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persist chats to localStorage
  useEffect(() => {
    localStorage.setItem('agent_chats', JSON.stringify(chats));
  }, [chats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showThinking]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: AttachedFile[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if ((!text && attachedFiles.length === 0) || isLoading) return;

    let targetChatId = activeChatId;
    let isNewChat = false;

    if (!activeChat) {
      targetChatId = crypto.randomUUID();
      isNewChat = true;
    }

    const userMessage = text || attachedFiles.map((f) => f.name).join(', ');
    setInput('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);
    setIsLoading(true);
    setShowThinking(true);
    setHistoryOpen(false);

    const userTokens = estimateTokens(userMessage);

    setChats((prev) => {
      if (isNewChat) {
        return [
          {
            id: targetChatId!,
            title: userMessage.slice(0, 40) + (userMessage.length > 40 ? '...' : ''),
            messages: [{ role: 'user', content: userMessage, tokens: userTokens, attachments: filesToSend.length > 0 ? filesToSend : undefined }],
            updatedAt: Date.now(),
          },
          ...prev,
        ];
      } else {
        return prev.map((c) =>
          c.id === targetChatId
            ? {
                ...c,
                messages: [...c.messages, { role: 'user', content: userMessage, tokens: userTokens, attachments: filesToSend.length > 0 ? filesToSend : undefined }],
                updatedAt: Date.now(),
              }
            : c,
        );
      }
    });

    if (isNewChat) {
      setActiveChatId(targetChatId);
    }

    try {
      const response = await fetch(TARGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.response || 'No response from agent.';

      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) {
        const parts = responseText.split('🦞');
        responseText = parts.slice(1).join('🦞').trim();
      }

      const agentTokens = estimateTokens(responseText);

      setShowThinking(false);
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? {
                ...c,
                messages: [...c.messages, { role: 'agent', content: responseText, tokens: agentTokens }],
                updatedAt: Date.now(),
              }
            : c,
        ),
      );
    } catch (error) {
      console.error('Connection Failed:', error);
      setShowThinking(false);
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    role: 'agent',
                    content: `Error connecting to agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    tokens: 0,
                  },
                ],
                updatedAt: Date.now(),
              }
            : c,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setInput('');
    setAttachedFiles([]);
    setHistoryOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setHistoryOpen(false);
  };

  const handleRenameSubmit = (id: string) => {
    if (editTitle.trim()) {
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c)),
      );
    }
    setEditingChatId(null);
  };

  const handleDelete = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
    setMenuOpenId(null);
  };

  const handleShare = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    const text = chat.messages
      .map((m) => `${m.role === 'user' ? 'You' : 'Mira'}: ${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setMenuOpenId(null);
  };

  const hasContent = input.trim().length > 0 || attachedFiles.length > 0;

  // Highlight file references in text (e.g., "file: report.pdf", filenames with extensions)
  const highlightFileReferences = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\b[\w\-.]+\.(?:pdf|docx?|xlsx?|csv|png|jpg|jpeg|svg|json|xml|txt|md|html|css|js|ts|tsx|jsx|py)\b)/gi);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // This is a filename with extension
        return (
          <span key={i} className="inline-flex items-baseline gap-0.5 px-1 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
            <FileText className="w-3 h-3 inline -mt-px" />
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // ---- Collapsed state (toggle strip) ----
  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center bg-gray-50/80 border-l border-gray-200/60">
        <button
          onClick={onToggleCollapse}
          className="mt-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/70 transition-colors"
          title="Open Mira"
          aria-label="Open Mira"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-gray-400 text-[10px] font-medium tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-600 transition-colors"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            onClick={onToggleCollapse}
          >
            MIRO
          </span>
        </div>
        {chats.length > 0 && (
          <div className="mb-4 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title={`${chats.length} chats`} />
        )}
        {chats.length === 0 && <div className="mb-4" />}
      </div>
    );
  }

  // ---- Expanded state ----
  return (
    <div className="h-full flex flex-col bg-gray-50/30 backdrop-blur-[2px] border-l border-gray-200/60">
      {/* Header Bar */}
      <div className="flex-shrink-0 border-b border-gray-200/60 bg-white/70 backdrop-blur-sm">
        {/* Top row: branding + actions */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/procept-logo-light.jpg"
              alt="Procept"
              className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-100"
            />
            <span className="text-sm font-semibold text-gray-800">Mira</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleNewChat}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 transition-colors"
              title="New Chat"
              aria-label="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                historyOpen
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/80'
              }`}
              title="Chat History"
              aria-label="Chat History"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-colors"
              title="Close Mira"
              aria-label="Close Mira"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active chat indicator bar */}
        {activeChat && (
          <div className="px-3 pb-2 flex items-center gap-2">
            <span className="text-xs text-gray-400 truncate">{activeChat.title}</span>
          </div>
        )}

        {/* Chat History Dropdown — boxed */}
        {historyOpen && (
          <div className="border-t border-gray-200/60 px-3 py-3 bg-white/80">
            <div className="border border-gray-200/80 rounded-xl shadow-sm overflow-hidden bg-white">
              {chats.length === 0 ? (
                <div className="px-4 py-6 text-xs text-gray-400 text-center">
                  No chats yet. Start a conversation.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
                  {chats
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((chat) => (
                      <div
                        key={chat.id}
                        className={`relative group flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors ${
                          activeChatId === chat.id
                            ? 'bg-blue-50/70 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectChat(chat.id)}
                      >
                        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${activeChatId === chat.id ? 'text-blue-500' : 'text-gray-400'}`} />

                        {editingChatId === chat.id ? (
                          <input
                            autoFocus
                            className="flex-1 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleRenameSubmit(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameSubmit(chat.id);
                              if (e.key === 'Escape') setEditingChatId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="flex-1 truncate text-xs font-medium">{chat.title}</span>
                        )}

                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>

                        {editingChatId !== chat.id && (
                          <div
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                              menuOpenId === chat.id ? 'opacity-100' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                            }}
                          >
                            <button className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>

                            {menuOpenId === chat.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-3 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(chat.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  {copiedId === chat.id ? (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <Share className="w-3.5 h-3.5" />
                                  )}
                                  {copiedId === chat.id ? 'Copied!' : 'Share'}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditTitle(chat.title);
                                    setEditingChatId(chat.id);
                                    setMenuOpenId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <PenLine className="w-3.5 h-3.5" />
                                  Rename
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(chat.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {!activeChat || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-6 text-center">
              <div className="relative mb-4">
                <img
                  src="/procept-logo-light.jpg"
                  alt="Procept"
                  className="w-10 h-10 rounded-full object-cover opacity-90 ring-2 ring-blue-100"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Mira</h3>
              <p className="text-xs text-gray-400 mb-6">Ask me anything about your supply chain.</p>

              <div className="space-y-2 w-full">
                {[
                  'List my recent purchase orders',
                  'Check inventory for SKU #8842',
                  'Create a new purchase order for 500 units',
                  'Summarize the latest vendor delays',
                ].map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(cmd)}
                    className="w-full px-3 py-2.5 text-xs text-left text-gray-500 bg-white/80 border border-gray-200/60 rounded-xl hover:bg-white hover:border-gray-300 hover:text-gray-700 transition-all shadow-sm flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{cmd}</span>
                    <Send className="w-3 h-3 text-gray-300 group-hover:text-gray-500 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[90%]">
                      <div className="bg-gray-800 text-gray-50 px-3.5 py-2.5 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 justify-end">
                          {msg.attachments.map((file, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 border border-gray-200/60 rounded-lg text-xs"
                            >
                              <FileText className="w-3 h-3 text-gray-400" />
                              <span className="max-w-[120px] truncate text-blue-600 font-medium">{file.name}</span>
                              <span className="text-gray-400">{formatFileSize(file.size)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.tokens && (
                        <p className="text-right mt-0.5 text-[10px] text-gray-400">
                          ~{msg.tokens} tokens
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full group">
                      <div className="prose prose-sm font-sans max-w-none text-gray-700 prose-p:leading-relaxed prose-p:text-sm prose-li:text-sm prose-headings:font-semibold prose-a:text-blue-600 prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:text-xs">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-3 rounded-lg border border-gray-200/60">
                                <table className="w-full text-xs text-left" {...props} />
                              </div>
                            ),
                            thead: ({ node, ...props }) => (
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50" {...props} />
                            ),
                            tbody: ({ node, ...props }) => (
                              <tbody className="divide-y divide-gray-200" {...props} />
                            ),
                            tr: ({ node, ...props }) => <tr className="bg-white" {...props} />,
                            th: ({ node, ...props }) => (
                              <th className="px-3 py-2 font-semibold text-gray-900" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="px-3 py-2 text-gray-700" {...props} />
                            ),
                            p: ({ node, children, ...props }) => {
                              // Check children for file references to highlight
                              const text = typeof children === 'string' ? children : '';
                              if (text && /\.(pdf|docx?|xlsx?|csv|png|jpg|jpeg|svg|json|xml|txt|md)($|\s)/i.test(text)) {
                                return (
                                  <p className="mb-2 last:mb-0" {...props}>
                                    {highlightFileReferences(text)}
                                  </p>
                                );
                              }
                              return <p className="mb-2 last:mb-0" {...props}>{children}</p>;
                            },
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4 space-y-0.5 mb-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal pl-4 space-y-0.5 mb-2" {...props} />
                            ),
                            li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold text-gray-900" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                              <a className="text-blue-600 hover:underline" {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                              <h1 className="text-lg font-bold mt-6 mb-3 border-b border-gray-200/60 pb-1" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2 className="text-base font-bold mt-4 mb-2" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="text-sm font-bold mt-4 mb-2" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-pink-600 break-words"
                                {...props}
                              />
                            ),
                            pre: ({ node, ...props }) => (
                              <pre
                                className="bg-gray-50 border border-gray-200/60 rounded-lg p-3 font-mono text-xs overflow-x-auto mb-3"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* Token trace */}
                      {msg.tokens && msg.tokens > 0 && (
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" />
                            ~{msg.tokens} tokens
                          </span>
                          <span className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-2.5 h-2.5" />
                            <button
                              onClick={() => downloadAsWord(msg.content, 'Report')}
                              className="hover:text-gray-600 transition-colors"
                            >
                              Download
                            </button>
                          </span>
                        </div>
                      )}

                      {/* Approve/Deny */}
                      {index === messages.length - 1 &&
                        msg.role === 'agent' &&
                        msg.content.includes('Approve/Deny') && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleSend('Approve.')}
                              className="px-4 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSend('Deny.')}
                              className="px-4 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Thinking indicator — Claude-style */}
          {showThinking && <ThinkingDots />}

          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* File Input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200/60 p-3 bg-white/60 backdrop-blur-sm">
        {/* Attached file chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200/60 rounded-lg text-xs group/file"
              >
                <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <span className="max-w-[140px] truncate text-blue-700 font-medium">{file.name}</span>
                <span className="text-blue-400 flex-shrink-0">{formatFileSize(file.size)}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-0.5 p-0.5 rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`relative bg-white border rounded-xl transition-all duration-200 overflow-hidden ${
            isFocused
              ? 'border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
              : 'border-gray-200/80 shadow-sm hover:border-gray-300'
          }`}
        >
          {/* Plus button for file upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-2 bottom-2 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Attach files"
            aria-label="Attach files"
          >
            <Plus className="w-4 h-4" />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message Mira..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-transparent py-2.5 pl-10 pr-10 focus:outline-none disabled:opacity-50 text-sm min-h-[42px] max-h-36 overflow-y-auto text-gray-700 placeholder:text-gray-400"
            style={{ fieldSizing: 'content' } as any}
          />
          <button
            onClick={() => handleSend()}
            disabled={!hasContent || isLoading}
            className={`absolute right-2 bottom-2 rounded-lg w-7 h-7 flex items-center justify-center transition-all duration-200 ${
              hasContent && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-center mt-2 text-[10px] text-gray-400">
          Mira can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
