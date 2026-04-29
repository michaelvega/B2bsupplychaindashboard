import { useState, useEffect } from 'react';
import { Save, Loader2, BookOpen, PenLine } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ThinkingTimer } from '../components/ThinkingTimer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AGENT_MD_URL = '/api/azure/agent.md';
const CUSTOM_RULES_URL = '/api/azure/rules_custom.md';
const SEPARATOR = '\n\n--- CUSTOM RULES ---\n\n';

const MarkdownComponents = {
  table: ({ node, ...props }: any) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200"><table className="w-full text-sm text-left" {...props} /></div>,
  thead: ({ node, ...props }: any) => <thead className="text-xs text-gray-700 uppercase bg-gray-50" {...props} />,
  tbody: ({ node, ...props }: any) => <tbody className="divide-y divide-gray-200" {...props} />,
  tr: ({ node, ...props }: any) => <tr className="bg-white" {...props} />,
  th: ({ node, ...props }: any) => <th className="px-4 py-3 font-semibold text-gray-900" {...props} />,
  td: ({ node, ...props }: any) => <td className="px-4 py-3 text-gray-700" {...props} />,
  p: ({ node, ...props }: any) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-1 mb-4" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-1 mb-4" {...props} />,
  li: ({ node, ...props }: any) => <li {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-semibold text-gray-900" {...props} />,
  a: ({ node, ...props }: any) => <a className="text-blue-600 hover:underline" {...props} />,
  h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold mt-6 mb-4 border-b border-gray-200 pb-2" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
  code: ({node, ...props}: any) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 break-words" {...props} />,
  pre: ({node, ...props}: any) => <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4" {...props} />,
};

export function Rules() {
  const [baseContent, setBaseContent] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const resBase = await fetch(AGENT_MD_URL);
        if (resBase.ok) {
          const text = await resBase.text();
          if (text.includes(SEPARATOR)) {
            const parts = text.split(SEPARATOR);
            setBaseContent(parts[0]);
            setCustomContent(parts.slice(1).join(SEPARATOR));
          } else {
            setBaseContent(text);
            
            // Fallback: load rules_custom.md if no separator found in agent.md
            const resCustom = await fetch(CUSTOM_RULES_URL);
            if (resCustom.ok) {
              setCustomContent(await resCustom.text());
            }
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Could not load agent instructions.');
      } finally {
        setIsLoading(false);
      }
    };
    loadRules();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // 1. Save rules_custom.md as requested
      await fetch(CUSTOM_RULES_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: customContent,
      });

      // 2. Append to agent.md so the backend sees it
      const combinedText = baseContent + SEPARATOR + customContent;
      const res = await fetch(AGENT_MD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: combinedText,
      });

      if (!res.ok) throw new Error('Failed to save concatenated rules');
      
      setSuccess('Custom rules updated successfully.');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setError('Could not save custom rules.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2 p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-gray-500 font-medium"><ThinkingTimer label="Loading agent rules" /></span>
      </div>
    );
  }

  return (
    <div className="h-full p-8 max-w-6xl mx-auto flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Agent Master Prompt
          </h1>
          <p className="text-gray-600 mt-1">
            Review the base instructions and append your own custom rules.
          </p>
        </div>
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (isEditing ? <Save className="w-4 h-4 mr-2" /> : <PenLine className="w-4 h-4 mr-2" />)}
          {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Custom Rules')}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
          {success}
        </div>
      )}

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
          <span className="text-sm font-semibold text-gray-700 font-mono flex items-center gap-2">
            agent.md <span className="text-gray-400 font-normal">+</span> rules_custom.md
          </span>
          {isEditing && (
            <button onClick={() => setIsEditing(false)} className="text-xs font-medium text-gray-500 hover:text-gray-700">
              Cancel Edit
            </button>
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Base Content (Read-only) */}
          <div className="p-6 bg-gray-50/50 shrink-0">
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Base Instructions (Read-Only)</span>
            </div>
            <div className="prose prose-sm max-w-none prose-slate opacity-80">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                {baseContent || "No base instructions provided."}
              </ReactMarkdown>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center border-t border-gray-200 bg-gray-50 shrink-0">
            <span className="absolute bg-gray-50 px-3 text-xs font-bold uppercase tracking-wider text-indigo-500 border border-gray-200 rounded-full py-0.5 transform -translate-y-1/2">
              rules_custom.md
            </span>
          </div>
          
          {/* Custom Content */}
          {isEditing ? (
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              className="flex-1 w-full p-6 pt-8 text-sm font-mono text-gray-800 bg-white resize-none focus:outline-none focus:ring-0 leading-relaxed min-h-[300px]"
              placeholder="Add your custom rules and instructions here in markdown..."
              spellCheck={false}
              autoFocus
            />
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="flex-1 p-6 pt-8 bg-white cursor-text hover:bg-indigo-50/30 transition-colors min-h-[300px]"
            >
              <div className="prose prose-sm max-w-none prose-slate">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                  {customContent || "*No custom rules yet. Click here to add some.*"}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
