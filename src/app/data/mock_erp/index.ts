import BusinessPartners from './BusinessPartners.json';
import Products from './Products.json';
import PricingConditions from './PricingConditions.json';
import SalesOrders from './SalesOrders.json';
import SalesOrderItems from './SalesOrderItems.json';
import Deliveries from './Deliveries.json';
import PurchaseOrders from './PurchaseOrders.json';
import PurchaseOrderItems from './PurchaseOrderItems.json';
import PurchasingInfoRecords from './PurchasingInfoRecords.json';
import InventorySnapshots from './InventorySnapshots.json';

export const MOCK_ERP_DATA: Record<string, any[]> = {
  BusinessPartners,
  Products,
  PricingConditions,
  SalesOrders,
  SalesOrderItems,
  Deliveries,
  PurchaseOrders,
  PurchaseOrderItems,
  PurchasingInfoRecords,
  InventorySnapshots,
};

export default MOCK_ERP_DATA;
