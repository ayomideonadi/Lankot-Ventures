import { UserProfile, SupplyRequest, Order } from '../types/b2b';

export const INITIAL_USER: UserProfile = {
  companyName: 'Your Company',
  taxId: 'Account pending',
  contactPerson: 'Account owner',
  email: 'Add your email address',
  phone: 'Add your phone number',
  industry: 'Business operations',
  address: 'Add your delivery address',
  role: 'buyer',
};

export const INITIAL_REQUESTS: SupplyRequest[] = [];
export const INITIAL_ORDERS: Order[] = [];
