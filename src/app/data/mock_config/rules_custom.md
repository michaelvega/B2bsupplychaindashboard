# Custom Rules

## Vendor Preferences
- Preferred supplier for fasteners: Supplier 200 (Acme Fasteners)
- Backup supplier for bearings: Supplier 201 (Precision Parts Inc)

## Approval Thresholds
- PO under $5,000: auto-approve
- PO $5,000-$25,000: manager approval required
- PO over $25,000: director approval required

## Notification Preferences
- Email alerts: enabled for critical stockouts
- Slack channel: #procurement-alerts
- Daily digest: 7:00 AM EST

## Custom Workflows
1. When a new vendor packet is detected in OneDrive, automatically extract W9 data and pre-fill SAP Vendor Master
2. Invoice matching tolerance: ±3% before flagging
3. Safety stock formula: (max daily usage × max lead time) + 20% buffer
