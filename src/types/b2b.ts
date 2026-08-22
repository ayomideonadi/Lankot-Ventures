export type UserRole = 'buyer' | 'admin';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  minOrderQty: number;
  leadTime: string;
  isFeatured?: boolean;
  specs?: Record<string, string>;
  image?: string;
}

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

export interface ClientItemDrop {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  specificRequirements?: string; // Brand, grade, dimensions, certs
}

export interface QuoteLineItem {
  id: string;
  itemName: string;
  productName?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export type RequestStatus = 'pending' | 'quoted' | 'accepted' | 'declined';

export interface SupplyRequest {
  id: string;
  requestNumber: string;
  clientCompany: string;
  clientContact: string;
  email: string;
  phone: string;
  items: ClientItemDrop[];
  targetDeliveryDate: string;
  generalNotes?: string;
  status: RequestStatus;
  createdAt: string;
  // Admin Quote Response fields
  quoteLineItems?: QuoteLineItem[];
  totalQuoteAmount?: number;
  freightTerms?: string;
  adminNotes?: string;
  quotedAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  requestId: string;
  clientCompany: string;
  clientContact: string;
  email: string;
  items: QuoteLineItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  poNumber: string;
  invoiceNumber?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}
