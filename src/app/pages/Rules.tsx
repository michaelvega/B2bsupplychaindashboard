import { useState } from 'react';
import { Switch } from '../components/ui/switch';

interface Rule {
  id: string;
  category: string;
  name: string;
  description: string;
  autoApprove: boolean;
}

const initialRules: Rule[] = [
  {
    id: 'r1',
    category: 'Order Errors',
    name: 'Lead Time Variance',
    description: 'Automatically update SAP lead times when variance is less than 5 days',
    autoApprove: false,
  },
  {
    id: 'r2',
    category: 'Order Errors',
    name: 'Price Discrepancies',
    description: 'Auto-reject invoices with price variance greater than 5%',
    autoApprove: true,
  },
  {
    id: 'r3',
    category: 'Order Errors',
    name: 'Shortage Claims',
    description: 'Automatically draft vendor claims for shortages under $500',
    autoApprove: true,
  },
  {
    id: 'r4',
    category: 'Forecasting',
    name: 'Stockout Alerts',
    description: 'Send customer notifications when stockout risk is detected',
    autoApprove: false,
  },
  {
    id: 'r5',
    category: 'Forecasting',
    name: 'Emergency POs',
    description: 'Automatically create expedited POs for critical stockouts',
    autoApprove: false,
  },
  {
    id: 'r6',
    category: 'Vendor Onboarding',
    name: 'Vendor Creation',
    description: 'Auto-create vendor records when all required fields are validated',
    autoApprove: false,
  },
];

export function Rules() {
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, autoApprove: !rule.autoApprove } : rule
    ));
  };

  const rulesByCategory = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, Rule[]>);

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Rules</h1>
        <p className="text-gray-600 mt-1">
          Control what the agent can do automatically versus what needs approval
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(rulesByCategory).map(([category, categoryRules]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">{category}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {categoryRules.map((rule) => (
                <div key={rule.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm text-gray-600">
                      {rule.autoApprove ? 'Auto-approve' : 'Requires approval'}
                    </span>
                    <Switch
                      checked={rule.autoApprove}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
