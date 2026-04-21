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
];
