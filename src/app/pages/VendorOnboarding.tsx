import { useState } from 'react';
import { vendorOnboardingItems } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { DetailPane } from '../components/DetailPane';
import { WorkItem } from '../data/mockData';
import { Upload, FileText, CheckCircle, ShieldAlert, ShieldCheck, Shield, Activity } from 'lucide-react';

interface VendorMetric {
  name: string;
  value: string;
  status: 'green' | 'yellow' | 'red';
}

interface DummyVendor {
  id: string;
  name: string;
  blurb: string;
  score: number;
  metrics: VendorMetric[];
}

const dummyVendors: DummyVendor[] = [
  {
    id: 'v1',
    name: 'Apex Industrial Supplies',
    blurb: 'Primary supplier for hydraulic seals and specialized metal casings. Consistent delivery speed but pricing fluctuations recorded in last quarter.',
    score: 94,
    metrics: [
      { name: 'On-Time Rate', value: '98.5%', status: 'green' },
      { name: 'Avg Lead Time', value: '3 Days', status: 'green' },
      { name: 'Defect Rate', value: '0.4%', status: 'green' },
    ]
  },
  {
    id: 'v2',
    name: 'Global Logistics Co.',
    blurb: 'International freight forwarding partner focusing on trans-pacific routes. Currently under review for pending ISO 9001 compliance updates.',
    score: 72,
    metrics: [
      { name: 'On-Time Rate', value: '82.0%', status: 'yellow' },
      { name: 'Compliance Docs', value: 'Expired', status: 'red' },
      { name: 'Damage Rate', value: '1.2%', status: 'green' },
    ]
  },
  {
    id: 'v3',
    name: 'TechFab Manufacturing',
    blurb: 'Contract manufacturer for electronic sub-assemblies. Flagged by quality assurance for experiencing elevated defect return rates in Q3.',
    score: 58,
    metrics: [
      { name: 'Defect Rate', value: '8.4%', status: 'red' },
      { name: 'Cost Variance', value: '+14% YoY', status: 'red' },
      { name: 'Avg Lead Time', value: '21 Days', status: 'yellow' },
    ]
  },
];

function VendorCard({ vendor }: { vendor: DummyVendor }) {
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
    setUploadedFiles(prev => [...prev, ...fileNames]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileNames = files.map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const getMetricColor = (status: 'green' | 'yellow' | 'red') => {
    if (status === 'green') return 'bg-green-50 border-green-200 text-green-800';
    if (status === 'yellow') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-red-50 border-red-300 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight pr-4">{vendor.name}</h3>
          <div className="text-right flex-shrink-0">
            <div className={`text-2xl font-bold ${vendor.score >= 90 ? 'text-green-600' : vendor.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {vendor.score}
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider relative -top-1">Score</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-1">
          {vendor.blurb}
        </p>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          {vendor.metrics.map((metric, idx) => (
            <div key={idx} className={`flex flex-col p-2 border rounded-md justify-center ${getMetricColor(metric.status)}`}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-0.5 truncate">{metric.name}</span>
              <span className="text-sm font-semibold">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
        {uploadedFiles.length > 0 ? (
          <div className="space-y-2">
            {uploadedFiles.map((fileName, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-green-200 rounded-md shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs text-gray-700 truncate font-medium flex-1">{fileName}</span>
                <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Parsing...</span>
              </div>
            ))}
            <div className="text-center pt-2">
               <label htmlFor={`file-upload-${vendor.id}`} className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium hover:underline">
                 + Upload another document
               </label>
               <input type="file" multiple id={`file-upload-${vendor.id}`} className="hidden" onChange={handleFileInput} />
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400'
            }`}
          >
            <label htmlFor={`file-upload-${vendor.id}`} className="w-full h-full cursor-pointer block">
              <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium tracking-wide">
                Drag & Drop files or <span className="text-blue-600">Browse</span>
              </p>
              <input type="file" multiple id={`file-upload-${vendor.id}`} className="hidden" onChange={handleFileInput} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export function VendorOnboarding() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Vendor Management & Analytics</h1>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Active Vendor Scorecards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyVendors.map(v => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Pending Vendor Approvals Queue
        </h2>
        <div className="space-y-4 max-w-4xl">
          {vendorOnboardingItems.map((item) => (
            <WorkCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </div>

      <DetailPane
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}