import { useState, useMemo } from 'react';
import { orderErrorItems } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { DetailPane } from '../components/DetailPane';
import { WorkItem } from '../data/mockData';
import { Search, Filter, Calendar, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  'All Types',
  'Lead Time Discrepancy',
  'Fulfillment Mismatch',
  'Quantity Shortage',
  'Pricing Issue',
  'Other'
];

const PRIORITIES = ['All Priorities', 'High', 'Medium', 'Low'];
const DATES = ['All Time', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];

export function OrderErrors() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Types');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [dateFilter, setDateFilter] = useState('All Time');

  // Helper to categorize item
  const getItemCategory = (item: WorkItem) => {
    const text = (item.title + ' ' + item.discrepancy).toLowerCase();
    if (text.includes('lead time')) return 'Lead Time Discrepancy';
    if (text.includes('mismatch') || text.includes('address')) return 'Fulfillment Mismatch';
    if (text.includes('shortage')) return 'Quantity Shortage';
    if (text.includes('price') || text.includes('invoice')) return 'Pricing Issue';
    return 'Other';
  };

  const filteredItems = useMemo(() => {
    return orderErrorItems.filter(item => {
      // 1. Text Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchLower) ||
        item.discrepancy.toLowerCase().includes(searchLower) ||
        item.details.summary.toLowerCase().includes(searchLower) ||
        item.details.sourceData?.some(d => d.value.toLowerCase().includes(searchLower));

      // 2. Category Filter
      const itemCategory = getItemCategory(item);
      const matchesCategory = categoryFilter === 'All Types' || itemCategory === categoryFilter;

      // 3. Priority Filter
      const matchesPriority = priorityFilter === 'All Priorities' || item.priority.toLowerCase() === priorityFilter.toLowerCase();

      // 4. Date Filter
      let matchesDate = true;
      if (dateFilter !== 'All Time') {
        const itemDate = new Date(item.timestamp);
        // For mock purposes, assume current date is relative to the mock data date 2026-03-18
        const mockCurrentDate = new Date('2026-03-18T12:00:00Z');
        const diffMs = mockCurrentDate.getTime() - itemDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffHours / 24;

        if (dateFilter === 'Last 24 Hours') matchesDate = diffHours <= 24;
        else if (dateFilter === 'Last 7 Days') matchesDate = diffDays <= 7;
        else if (dateFilter === 'Last 30 Days') matchesDate = diffDays <= 30;
      }

      return matchesSearch && matchesCategory && matchesPriority && matchesDate;
    });
  }, [searchQuery, categoryFilter, priorityFilter, dateFilter]);

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Order Errors</h1>
        <p className="text-gray-600 mt-1">
          Lead time changes, 3PL email certification, price changes, overages, shortages, and damages
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by vendor, PO, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 md:pb-0">
            <div className="relative flex items-center">
              <Filter className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="relative flex items-center">
              <AlertTriangle className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {DATES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        {/* Active Filter Indicators */}
        {(searchQuery || categoryFilter !== 'All Types' || priorityFilter !== 'All Priorities' || dateFilter !== 'All Time') && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-50 text-sm">
            <span className="text-gray-500">Active filters:</span>
            {searchQuery && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">"{searchQuery}"</span>}
            {categoryFilter !== 'All Types' && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">{categoryFilter}</span>}
            {priorityFilter !== 'All Priorities' && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">{priorityFilter}</span>}
            {dateFilter !== 'All Time' && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">{dateFilter}</span>}
            <button 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All Types');
                setPriorityFilter('All Priorities');
                setDateFilter('All Time');
              }}
              className="text-gray-400 hover:text-gray-600 ml-auto transition-colors font-medium text-xs uppercase cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <WorkCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium text-lg">No errors found</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn't find any order errors matching your current filter criteria. Try adjusting your filters or clearing them.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All Types');
                setPriorityFilter('All Priorities');
                setDateFilter('All Time');
              }}
              className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <DetailPane
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
