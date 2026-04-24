export interface ForecastingProduct {
  sku: string;
  name: string;
  currentStock: number;
  riskLevel: 'high' | 'medium' | 'low';
  reason: string;
}

export interface MonthlyStockData {
  month: string;
  'SKU #8842': number;
  'SKU #2201': number;
  'SKU #5512': number;
  'SKU #7734': number;
  'SKU #8842-predicted': number;
  'SKU #2201-predicted': number;
  'SKU #5512-predicted': number;
  'SKU #7734-predicted': number;
}

export const forecastingProducts: ForecastingProduct[] = [
  { sku: '#8842', name: 'Industrial Bearings', currentStock: 200, riskLevel: 'high', reason: 'High demand spike predicted, expected to exhaust available stock within 4 weeks.' },
  { sku: '#2201', name: 'Steel Fasteners', currentStock: 450, riskLevel: 'medium', reason: 'Supplier lead times have increased by 2 weeks, increasing stockout risk during June.' },
  { sku: '#5512', name: 'Hydraulic Seals', currentStock: 800, riskLevel: 'low', reason: 'Stable demand and reliable restock pipeline ensure steady inventory.' },
  { sku: '#7734', name: 'Drive Belts', currentStock: 320, riskLevel: 'medium', reason: 'Historical seasonality indicates an upcoming surge. Caution advised on safety stock.' },
];

export const monthlyStockData: MonthlyStockData[] = [
  {
    month: 'Jan',
    'SKU #8842': 350,
    'SKU #2201': 520,
    'SKU #5512': 950,
    'SKU #7734': 410,
    'SKU #8842-predicted': 350,
    'SKU #2201-predicted': 520,
    'SKU #5512-predicted': 950,
    'SKU #7734-predicted': 410,
  },
  {
    month: 'Feb',
    'SKU #8842': 280,
    'SKU #2201': 480,
    'SKU #5512': 920,
    'SKU #7734': 380,
    'SKU #8842-predicted': 280,
    'SKU #2201-predicted': 480,
    'SKU #5512-predicted': 920,
    'SKU #7734-predicted': 380,
  },
  {
    month: 'Mar',
    'SKU #8842': 200,
    'SKU #2201': 450,
    'SKU #5512': 800,
    'SKU #7734': 320,
    'SKU #8842-predicted': 200,
    'SKU #2201-predicted': 450,
    'SKU #5512-predicted': 800,
    'SKU #7734-predicted': 320,
  },
  {
    month: 'Apr',
    'SKU #8842': 0,
    'SKU #2201': 0,
    'SKU #5512': 0,
    'SKU #7734': 0,
    'SKU #8842-predicted': 90,
    'SKU #2201-predicted': 380,
    'SKU #5512-predicted': 750,
    'SKU #7734-predicted': 280,
  },
  {
    month: 'May',
    'SKU #8842': 0,
    'SKU #2201': 0,
    'SKU #5512': 0,
    'SKU #7734': 0,
    'SKU #8842-predicted': 20,
    'SKU #2201-predicted': 320,
    'SKU #5512-predicted': 680,
    'SKU #7734-predicted': 240,
  },
  {
    month: 'Jun',
    'SKU #8842': 0,
    'SKU #2201': 0,
    'SKU #5512': 0,
    'SKU #7734': 0,
    'SKU #8842-predicted': 0,
    'SKU #2201-predicted': 250,
    'SKU #5512-predicted': 620,
    'SKU #7734-predicted': 200,
  },
];

export interface MacroMetric {
  id: string;
  name: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  impact: string;
}

export const macroMetrics: MacroMetric[] = [
  { id: 'm1', name: 'Global Steel Prices', value: '+$124/MT', trend: 'up', impact: 'Increases Cost of Goods for Steel Fasteners' },
  { id: 'm2', name: 'Shipping Container Rates', value: '+$400/FEU', trend: 'up', impact: 'Delayed lead times across imported goods' },
  { id: 'm3', name: 'Copper Futures', value: '-2.4%', trend: 'down', impact: 'Favorable conditions for electrical components' },
  { id: 'm4', name: 'Energy Costs (Oil)', value: '+$3.50/BBL', trend: 'up', impact: 'Higher logistics and transport costs expected' },
  { id: 'w1', name: 'Typhoon Season (APAC)', value: 'Severe', trend: 'up', impact: 'Potential 10-15 day delays on Pacific routes' },
  { id: 'w2', name: 'European Winter Freeze', value: 'Mild', trend: 'stable', impact: 'No expected impact on continental transit' }
];

export interface ForecastScenario {
  id: string;
  name: string;
  description: string;
  status: 'Complete' | 'Running' | 'Failed';
  type: 'Auto' | 'Supervised';
  accuracy?: string;
  timeAgo: string;
  metrics: { label: string; value: string }[];
}

export const forecastScenarios: ForecastScenario[] = [
  {
    id: 'scen-1',
    name: 'Base Case (Stable Demand)',
    description: 'Standard LSTM model forecasting assuming no supply chain disruptions.',
    status: 'Complete',
    type: 'Auto',
    accuracy: '0.0421 RMSE',
    timeAgo: '12h ago',
    metrics: [{ label: 'Val RMSE', value: '0.0421' }, { label: 'MAE', value: '1.2%' }]
  },
  {
    id: 'scen-2',
    name: 'Supplier 2 Delay (15 Days)',
    description: 'Simulates a 15-day delay for Supplier 2 due to foreign government port restrictions.',
    status: 'Complete',
    type: 'Supervised',
    accuracy: '0.0511 RMSE',
    timeAgo: '2h ago',
    metrics: [{ label: 'Impact', value: 'High' }, { label: 'Shortage Risk', value: '3 SKUs' }]
  },
  {
    id: 'scen-3',
    name: 'Q3 Demand Spike (+20%)',
    description: 'Transformer encoder modeling a sudden 20% surge in global demand.',
    status: 'Running',
    type: 'Auto',
    timeAgo: 'Started 10m ago',
    metrics: [{ label: 'Progress', value: '45%' }]
  }
];

export interface HistoricalDataRow {
  date: string;
  sku: string;
  unitsSold: number;
  revenue: string;
  inventoryLevel: number;
  leadTime: number;
}

export const historicalDataRows: HistoricalDataRow[] = [
  { date: '2025-11-01', sku: '#8842', unitsSold: 120, revenue: '$14,400', inventoryLevel: 500, leadTime: 12 },
  { date: '2025-11-15', sku: '#2201', unitsSold: 340, revenue: '$8,500', inventoryLevel: 800, leadTime: 14 },
  { date: '2025-12-01', sku: '#8842', unitsSold: 180, revenue: '$21,600', inventoryLevel: 320, leadTime: 13 },
  { date: '2025-12-15', sku: '#5512', unitsSold: 410, revenue: '$32,800', inventoryLevel: 950, leadTime: 8 },
  { date: '2026-01-01', sku: '#7734', unitsSold: 200, revenue: '$18,000', inventoryLevel: 410, leadTime: 18 },
  { date: '2026-01-15', sku: '#2201', unitsSold: 280, revenue: '$7,000', inventoryLevel: 520, leadTime: 15 },
  { date: '2026-02-01', sku: '#8842', unitsSold: 210, revenue: '$25,200', inventoryLevel: 110, leadTime: 14 },
  { date: '2026-02-15', sku: '#5512', unitsSold: 390, revenue: '$31,200', inventoryLevel: 560, leadTime: 9 },
];

