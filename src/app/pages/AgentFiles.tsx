import { useState, useEffect, useCallback } from 'react';
import { Folder, FileText, Loader2, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FileItem {
  kind: 'file' | 'directory';
  name: string;
}

export function AgentFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  
  // Loading states
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const pathSuffix = currentPath ? `${currentPath}?comp=list&restype=directory` : '?comp=list&restype=directory';
      const response = await fetch(`/api/azure/${pathSuffix}`);
      
      if (!response.ok) throw new Error("Failed to fetch from proxy");
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const fileList: FileItem[] = [];
      
      const directories = xmlDoc.querySelectorAll("Entries > Directory > Name");
      directories.forEach((dir) => {
        if (dir.textContent) fileList.push({ kind: 'directory', name: dir.textContent });
      });
      
      const filesNodes = xmlDoc.querySelectorAll("Entries > File > Name");
      filesNodes.forEach((file) => {
        if (file.textContent) fileList.push({ kind: 'file', name: file.textContent });
      });

      setFiles(fileList.sort((a, b) => {
        if (a.kind === b.kind) return a.name.localeCompare(b.name);
        return a.kind === 'directory' ? -1 : 1;
      }));
    } catch (err: any) {
      console.error("Error loading files:", err);
      setError("Failed to load files from Azure.");
    } finally {
      setIsLoadingList(false);
    }
  }, [currentPath]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileClick = async (filename: string) => {
    setSelectedFile(filename);
    setIsLoadingFile(true);
    setError(null);
    try {
      const filePath = currentPath ? `${currentPath}/${filename}` : filename;
      const response = await fetch(`/api/azure/${filePath}`);
      
      if (!response.ok) throw new Error("Failed to download file");
      
      const text = await response.text();
      setFileContent(text || "");
    } catch (err: any) {
      console.error("Error downloading file:", err);
      setFileContent("Failed to read file.");
    } finally {
      setIsLoadingFile(false);
    }
  };

  return (
    <div className="flex h-full p-8 max-w-6xl mx-auto gap-6">
      
      {/* Sidebar: File List */}
      <div className="w-1/3 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Agent Workspace</h2>
            <p className="text-xs text-gray-500 mt-0.5">Read-only access</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {currentPath !== '' && (
            <button
              onClick={() => {
                const parts = currentPath.split('/');
                parts.pop();
                setCurrentPath(parts.join('/'));
                setSelectedFile(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mb-2 text-left font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          {isLoadingList ? (
            <div className="flex items-center justify-center p-8 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading files...
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 p-4 rounded bg-red-50">
              {error}
            </div>
          ) : files.length === 0 ? (
            <div className="text-sm text-gray-500 p-4 text-center">
              No files in this folder.
            </div>
          ) : (
            files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (file.kind === 'file') {
                    handleFileClick(file.name);
                  } else {
                    const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
                    setCurrentPath(newPath);
                    setSelectedFile(null);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  selectedFile === file.name 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                } ${file.kind === 'directory' ? 'font-medium' : ''}`}
              >
                {file.kind === 'directory' ? (
                  <Folder className="w-4 h-4 text-blue-500" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-400" />
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content: File Viewer */}
      <div className="w-2/3 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm h-full overflow-hidden">
        {selectedFile ? (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
              <h2 className="font-medium text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                {selectedFile}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 relative p-6 flex flex-col">
              {isLoadingFile ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white/50 z-10">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : selectedFile.endsWith('.md') ? (
                <div className="shrink-0 bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[200px]">
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200"><table className="w-full text-sm text-left" {...props} /></div>,
                        thead: ({ node, ...props }) => <thead className="text-xs text-gray-700 uppercase bg-gray-50" {...props} />,
                        tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
                        tr: ({ node, ...props }) => <tr className="bg-white" {...props} />,
                        th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold text-gray-900" {...props} />,
                        td: ({ node, ...props }) => <td className="px-4 py-3 text-gray-700" {...props} />,
                        p: ({ node, ...props }) => <p className="leading-relaxed mb-4 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-4" {...props} />,
                        li: ({ node, ...props }) => <li {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 pb-2 border-b border-gray-200" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                        code: ({node, ...props}) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 break-words" {...props} />,
                        pre: ({node, ...props}) => <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4" {...props} />,
                      }}
                    >
                      {fileContent}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <pre className="shrink-0 min-h-full text-sm font-mono text-gray-800 whitespace-pre-wrap break-words bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  {fileContent || "Empty file."}
                </pre>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <p>Select a file to view</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
