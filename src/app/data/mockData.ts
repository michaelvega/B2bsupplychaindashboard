export interface WorkItem {
  id: string;
  type: 'order-error' | 'forecasting' | 'vendor-onboarding';
  priority: 'high' | 'medium' | 'low';
  title: string;
  discrepancy: string;
  suggestedAction: string;
  status: 'pending' | 'approved' | 'denied';
  timestamp: string;
  preview?: { before?: string; after: string }[];
  details: {
    summary: string;
    metrics?: { label: string; value: string | number }[];
    sourceData?: { label: string; value: string }[];
    stagedActions?: { id: string; type: string; description: string }[];
    chartData?: { name: string; stock?: number; day?: number }[];
    attachments?: string[];
  };
}

export const orderErrorItems: WorkItem[] = [
  {
    id: 'oe-1',
    type: 'order-error',
    priority: 'high',
    title: 'Stale Lead Time Alert: Supplier B',
    discrepancy: 'Supplier B is averaging 45 days delivery, but SAP Master Data is set to 30 days',
    suggestedAction: 'Update SAP Master Data lead time to 45 days and increase safety stock by 10%',
    status: 'pending',
    timestamp: '2026-03-18T09:15:00Z',
    preview: [
      { before: 'Lead Time: 30 days', after: 'Lead Time: 45 days' },
      { before: 'Safety Stock: 100 units', after: 'Safety Stock: 110 units' },
    ],
    details: {
      summary: 'Analysis of the last 10 email confirmations and actual receiving receipts shows the supplier is consistently delivering in 45 days, not the 30 days stated in SAP Master Data. This will cause a 15-day production halt if not corrected before the next MRP run.',
      metrics: [
        { label: 'SAP Lead Time', value: '30 days' },
        { label: 'Actual Avg Lead Time', value: '45 days' },
        { label: 'Variance', value: '+15 days' },
        { label: 'Risk', value: 'Production halt' },
      ],
      sourceData: [
        { label: 'Data Source', value: 'Last 10 email confirmations + receiving logs' },
        { label: 'Supplier', value: 'Supplier B' },
        { label: 'Material', value: 'Critical Component #4521' },
        { label: 'Next Expected Delivery', value: 'May 1, 2026 (SAP) vs May 16, 2026 (Actual)' },
      ],
      stagedActions: [
        { id: 'a1', type: 'SAP Update', description: 'Update Material Master lead time from 30 to 45 days' },
        { id: 'a2', type: 'SAP Update', description: 'Increase safety stock by 10% to cover variance' },
        { id: 'a3', type: 'Alert', description: 'Notify planning team of updated parameters' },
      ],
    },
  },
  {
    id: 'oe-2',
    type: 'order-error',
    priority: 'high',
    title: 'ERP-WMS Mismatch: PO #7821',
    discrepancy: 'Shipping address changed in ERP but not mirrored in 3PL WMS',
    suggestedAction: 'Hold fulfillment and send structured update to warehouse contact',
    status: 'pending',
    timestamp: '2026-03-18T08:42:00Z',
    preview: [
      { before: 'WMS Address: 450 Oak Ave, Oakland, CA', after: 'WMS Address: 1250 Market St, San Francisco, CA' },
      { after: 'Fulfillment Status: ON HOLD' },
    ],
    details: {
      summary: 'User changed the shipping address for PO #7821 in the ERP system. The system detected that the same change is not reflected in the 3PL WMS. Fulfillment has been placed on hold to prevent wrong shipment.',
      metrics: [
        { label: 'PO Number', value: '#7821' },
        { label: 'ERP Ship-To', value: '1250 Market St, San Francisco, CA' },
        { label: 'WMS Ship-To', value: '450 Oak Ave, Oakland, CA' },
        { label: 'Fulfillment Status', value: 'ON HOLD' },
      ],
      sourceData: [
        { label: 'Change Made By', value: 'Sarah Chen (Procurement)' },
        { label: 'Change Timestamp', value: '2026-03-18 08:35 PST' },
        { label: 'Warehouse Contact', value: 'operations@acme3pl.com' },
        { label: 'Original Address', value: '450 Oak Ave, Oakland, CA 94612' },
      ],
      stagedActions: [
        { id: 'a1', type: 'Hold Order', description: 'Place fulfillment hold on PO #7821' },
        { id: 'a2', type: 'Email Notification', description: 'Send structured update to operations@acme3pl.com with new address details' },
        { id: 'a3', type: 'Release Hold', description: 'Release order once acknowledgment is received from warehouse' },
      ],
    },
  },
  {
    id: 'oe-3',
    type: 'order-error',
    priority: 'medium',
    title: 'Vendor Shortage Detected: PO #1099',
    discrepancy: 'Warehouse received 450 units against expected 500 units (50 unit shortage)',
    suggestedAction: 'Draft vendor claim email with photo proof and place AP invoice on hold',
    status: 'pending',
    timestamp: '2026-03-18T07:20:00Z',
    preview: [
      { before: 'Goods Receipt Qty: 500 units', after: 'Goods Receipt Qty: 450 units' },
      { after: 'AP Invoice: BLOCKED ($1,250 withheld)' },
    ],
    details: {
      summary: 'The warehouse received a shipment and logged a 50-unit shortage in the WMS, with photo documentation of the half-empty pallet. A complete credit claim packet has been prepared including the original PO, receipt variance, calculated dollar value ($1,250), and warehouse photo.',
      metrics: [
        { label: 'PO Quantity', value: 500 },
        { label: 'Received Quantity', value: 450 },
        { label: 'Shortage', value: 50 },
        { label: 'Shortage Value', value: '$1,250' },
      ],
      sourceData: [
        { label: 'PO Number', value: '#1099' },
        { label: 'Vendor', value: 'Industrial Supply Co.' },
        { label: 'SKU', value: '#8932 - Steel Brackets' },
        { label: 'Unit Price', value: '$25.00' },
      ],
      stagedActions: [
        { id: 'a1', type: 'Email Draft', description: 'Draft vendor claim email with PO and photo attachments' },
        { id: 'a2', type: 'AP Hold', description: 'Block AP invoice payment for missing 50 units ($1,250)' },
        { id: 'a3', type: 'SAP Update', description: 'Update goods receipt to reflect actual quantity received' },
      ],
      attachments: ['warehouse_photo_shortage.jpg', 'PO_1099.pdf'],
    },
  },
  {
    id: 'oe-4',
    type: 'order-error',
    priority: 'high',
    title: 'Invoice Price Discrepancy: Supplier C',
    discrepancy: 'Invoice price is $12.50/unit but PO price is $10.00/unit (Total variance: $2,500)',
    suggestedAction: 'Reject invoice via email and request revised copy at PO price',
    status: 'pending',
    timestamp: '2026-03-18T06:55:00Z',
    preview: [
      { after: 'Invoice #88A Status: REJECTED' },
      { after: 'Email to Supplier: Request corrected invoice at $10.00/unit' },
    ],
    details: {
      summary: 'Supplier C sent an invoice via email billing at $12.50/unit for 1,000 units. The agreed-upon PO price in SAP is $10.00/unit. This represents a $2,500 overcharge that would cause margin leakage if paid.',
      metrics: [
        { label: 'PO Price', value: '$10.00/unit' },
        { label: 'Invoice Price', value: '$12.50/unit' },
        { label: 'Variance per Unit', value: '+$2.50' },
        { label: 'Total Variance', value: '$2,500' },
      ],
      sourceData: [
        { label: 'PO Number', value: '#442' },
        { label: 'Invoice Number', value: '#88A' },
        { label: 'Supplier', value: 'Supplier C Manufacturing' },
        { label: 'Quantity', value: '1,000 units' },
      ],
      stagedActions: [
        { id: 'a1', type: 'Email Response', description: 'Reply to vendor email thread: "We cannot process Invoice #88A as it bills at $12.50/unit. Our PO was issued at $10.00/unit. Please send a corrected invoice."' },
        { id: 'a2', type: 'AP Block', description: 'Block invoice #88A from payment processing' },
        { id: 'a3', type: 'Log Dispute', description: 'Create dispute record in history with full documentation' },
      ],
      attachments: ['Invoice_88A.pdf'],
    },
  },
];

export const forecastingItems: WorkItem[] = [
  {
    id: 'fc-1',
    type: 'forecasting',
    priority: 'high',
    title: 'Impending Stockout: SKU #8842',
    discrepancy: 'Industrial Bearings will stock out in 6.6 days, but supplier lead time is 10 days',
    suggestedAction: 'Expedite emergency PO via air-freight and send allocation warnings to top 3 buyers',
    status: 'pending',
    timestamp: '2026-03-18T05:30:00Z',
    preview: [
      { after: 'Create Emergency PO: 500 units via Air Freight' },
      { after: 'Send allocation alerts to top 3 customers' },
    ],
    details: {
      summary: 'Recent order volume has spiked. You have 200 units on hand and are currently selling 30 units per day. You will stock out in 6.6 days, but your supplier lead time is 10 days. An intervention is required to prevent missed shipments.',
      metrics: [
        { label: 'Current Stock', value: 200 },
        { label: 'Burn Rate', value: '30/day' },
        { label: 'Days to Zero', value: 6.6 },
        { label: 'Supplier Lead Time', value: '10 days' },
      ],
      sourceData: [
        { label: 'SKU', value: '#8842 - Industrial Bearings' },
        { label: 'Units in Transit', value: '0' },
        { label: '14-day Sales Velocity', value: '30 units/day' },
        { label: 'Preferred Supplier', value: 'Supplier A' },
      ],
      stagedActions: [
        { id: 'a1', type: 'SAP PO Creation', description: 'Draft expedited PO for 500 units using Air Freight routing code (instead of standard ocean)' },
        { id: 'a2', type: 'Customer Email', description: 'Send allocation warning to top 3 customers: "Due to unexpected demand, SKU #8842 is currently on allocation. We are expediting a new shipment but want to give you advance notice to manage your timelines."' },
        { id: 'a3', type: 'Lead Time Update', description: 'Log updated lead time projection in SAP' },
      ],
      chartData: [
        { day: 0, stock: 200 },
        { day: 1, stock: 170 },
        { day: 2, stock: 140 },
        { day: 3, stock: 110 },
        { day: 4, stock: 80 },
        { day: 5, stock: 50 },
        { day: 6, stock: 20 },
        { day: 7, stock: 0 },
        { day: 8, stock: 0 },
        { day: 9, stock: 0 },
        { day: 10, stock: 0 },
      ],
    },
  },
];

export const vendorOnboardingItems: WorkItem[] = [
  {
    id: 'vo-1',
    type: 'vendor-onboarding',
    priority: 'medium',
    title: 'New Vendor Packet Ready: Acme Corp',
    discrepancy: 'Vendor submitted onboarding documents via email (messy PDFs and photos)',
    suggestedAction: 'Create new Vendor Master Record in SAP with extracted data',
    status: 'pending',
    timestamp: '2026-03-17T14:20:00Z',
    preview: [
      { after: 'Create Vendor: Acme Corp' },
      { after: 'Tax ID: **-***4521 | Routing: 021000021' },
    ],
    details: {
      summary: 'Vendor Acme Corp emailed back a messy PDF W-9 and a photo of a voided check. The agent has extracted all necessary data including Tax ID, routing number, and payment terms, and staged them for SAP vendor master creation.',
      metrics: [
        { label: 'Vendor Name', value: 'Acme Corp' },
        { label: 'Tax ID', value: '**-***4521' },
        { label: 'Routing Number', value: '021000021' },
        { label: 'Payment Terms', value: 'Net 30' },
      ],
      sourceData: [
        { label: 'Submitted By', value: 'accounts@acmecorp.com' },
        { label: 'Submission Date', value: '2026-03-17' },
        { label: 'Documents', value: 'W-9 Form (PDF), Voided Check (Photo)' },
        { label: 'Account Number', value: '****1234' },
      ],
      stagedActions: [
        { id: 'a1', type: 'SAP Vendor Creation', description: 'Create new Vendor Master Record with extracted banking and tax details' },
        { id: 'a2', type: 'Verification Email', description: 'Send "Welcome, you are approved" email to vendor contact' },
        { id: 'a3', type: 'Compliance Check', description: 'File W-9 in compliance folder and mark vendor as active' },
      ],
      attachments: ['W9_AcmeCorp.pdf', 'VoidedCheck_Photo.jpg'],
    },
  },
];

export const historyItems: WorkItem[] = [
  {
    id: 'hist-1',
    type: 'order-error',
    priority: 'medium',
    title: 'Price Update Approved: Supplier D',
    discrepancy: 'Supplier price increase from $5.00 to $5.50/unit',
    suggestedAction: 'Updated SAP pricing conditions',
    status: 'approved',
    timestamp: '2026-03-15T11:20:00Z',
    details: {
      summary: 'Supplier D notified us of a price increase. After approval, the agent updated SAP pricing conditions and notified the planning team.',
      metrics: [],
      sourceData: [],
      stagedActions: [],
    },
  },
  {
    id: 'hist-2',
    type: 'forecasting',
    priority: 'high',
    title: 'Emergency Replenishment: SKU #2201',
    discrepancy: 'Stockout risk detected',
    suggestedAction: 'Expedited PO created',
    status: 'approved',
    timestamp: '2026-03-14T09:15:00Z',
    details: {
      summary: 'Emergency PO was expedited to prevent stockout of SKU #2201. Crisis averted.',
      metrics: [],
      sourceData: [],
      stagedActions: [],
    },
  },
];