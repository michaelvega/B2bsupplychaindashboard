import { useState, useEffect } from 'react';
import { ShareClient } from "@azure/storage-file-share";
import { Folder, FileText, Loader2, Download, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../components/ui/button';

interface FileItem {
  kind: 'file' | 'directory';
  name: string;
}

const SAS_URL = "https://membrainagent.file.core.windows.net/picoclaw-workspace?sp=rl&st=2026-04-08T21:58:33Z&se=2027-04-09T06:13:00Z&spr=https&sv=2025-11-05&sig=DuGd3wa3gmJYMdTjDy7Vmd5vhzOJQNqUFmwKa3GNbs8%3D&sr=s";

export function AgentFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFiles() {
      setIsLoadingList(true);
      setError(null);
      try {
        const shareClient = new ShareClient(SAS_URL);
        const directoryClient = shareClient.getDirectoryClient(currentPath);
        
        const fileList: FileItem[] = [];
        for await (const entity of directoryClient.listFilesAndDirectories()) {
          fileList.push({
            kind: entity.kind,
            name: entity.name,
          });
        }
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
    }
    
    loadFiles();
  }, [currentPath]);

  const handleFileClick = async (filename: string) => {
    setSelectedFile(filename);
    setIsLoadingFile(true);
    setError(null);
    try {
      const shareClient = new ShareClient(SAS_URL);
      const directoryClient = shareClient.getDirectoryClient(currentPath);
      const fileClient = directoryClient.getFileClient(filename);
      
      const downloadResponse = await fileClient.download();
      const blob = await downloadResponse.blobBody;
      if (blob) {
        const text = await blob.text();
        setFileContent(text);
      } else {
        setFileContent("Empty file.");
      }
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
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Agent Workspace</h2>
          <p className="text-xs text-gray-600 mt-0.5">Read-only view</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {currentPath !== '' && (
            <button
              onClick={() => {
                const parts = currentPath.split('/');
                parts.pop();
                setCurrentPath(parts.join('/'));
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
            <div className="flex-1 overflow-y-auto bg-gray-50 relative p-6">
              {isLoadingFile ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white/50">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : selectedFile.endsWith('.md') ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[200px]">
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
                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words bg-white border border-gray-200 rounded-lg p-4 shadow-sm min-h-[200px]">
                  {fileContent}
                </pre>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <p>Select a file to view its contents</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
