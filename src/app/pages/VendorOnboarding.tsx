import { useState } from 'react';
import { vendorOnboardingItems } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { DetailPane } from '../components/DetailPane';
import { WorkItem } from '../data/mockData';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export function VendorOnboarding() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const fileNames = files.map(f => f.name);
    setUploadedFiles([...uploadedFiles, ...fileNames]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileNames = files.map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vendor Onboarding and Analytics</h1>
        <p className="text-gray-600 mt-1">
          Automated vendor qualification, onboarding, and performance tracking
        </p>
      </div>

      {/* File Upload Dropzone */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Upload Vendor Documents</h2>
        <p className="text-sm text-gray-600 mb-4">
          Drop PDF or Excel files to automatically parse vendor information (W-9, banking details, certifications)
        </p>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF, Excel (.xlsx, .xls), and CSV files
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Select Files
          </label>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-sm text-gray-900">{fileName}</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Parsing...</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              The agent is extracting vendor information and will create action items for review.
            </p>
          </div>
        )}
      </div>

      {/* Action Items */}
      <h2 className="font-semibold text-gray-900 mb-4">Pending Vendor Approvals</h2>
      <div className="space-y-4">
        {vendorOnboardingItems.map((item) => (
          <WorkCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      <DetailPane
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}