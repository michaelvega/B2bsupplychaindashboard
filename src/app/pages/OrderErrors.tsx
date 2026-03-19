import { useState } from 'react';
import { orderErrorItems } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { DetailPane } from '../components/DetailPane';
import { WorkItem } from '../data/mockData';

export function OrderErrors() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Order Errors</h1>
        <p className="text-gray-600 mt-1">
          Lead time changes, 3PL email certification, price changes, overages, shortages, and damages
        </p>
      </div>

      <div className="space-y-4">
        {orderErrorItems.map((item) => (
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
