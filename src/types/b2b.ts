export type UserRole = 'buyer' | 'admin';

export interface UserProfile {
  companyName: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  address: string;
  role: UserRole;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number; // Base price per unit ($)
  tierPrices?: { minQty: number; price: number }[];
  unit: string;
  stock: number;
  minOrderQty: number;
  leadTime: string;
  isFeatured?: boolean;
  specs: Record<string, string>;
  image: string;
}

export interface RFQItem {
  productId: string;
  quantity: number;
  targetPrice?: number;
  notes?: string;
  product?: Product;
}

export type RFQStatus = 'pending' | 'quoted' | 'accepted' | 'rejected';

export interface RFQ {
  id: string;
  rfqNumber: string;
  clientCompany: string;
  clientContact: string;
  email: string;
  phone: string;
  items: RFQItem[];
  status: RFQStatus;
  targetDeliveryDate: string;
  notes: string;
  quoteAmount?: number;
  quoteNotes?: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientCompany: string;
  clientContact: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  poNumber: string;
  trackingNumber?: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedList {
  id: string;
  name: string;
  description: string;
  items: { productId: string; quantity: number }[];
  updatedAt: string;
}
