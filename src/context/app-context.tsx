'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupplyRequest, Order, UserRole, UserProfile, ClientItemDrop, QuoteLineItem, OrderStatus, Product } from '../types/b2b';
import { INITIAL_REQUESTS, INITIAL_ORDERS, INITIAL_USER } from '../data/mock-data';
import { supabase } from '@/lib/supabase';

const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'lankotventures01@gmail.com').trim().toLowerCase();

interface LegacySavedList {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  items: { productId: string; quantity: number }[];
}

interface LegacyRFQCartItem {
  productId: string;
  quantity: number;
  itemName?: string;
  unit?: string;
  product?: Product;
}

interface AppContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userProfile: UserProfile;
  setUserRole: (role: UserRole) => void;
  signIn: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  registerAccount: (profile: Pick<UserProfile, 'companyName' | 'taxId' | 'industry' | 'contactPerson' | 'email'>, password: string) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>;
  supplyRequests: SupplyRequest[];
  rfqs: SupplyRequest[];
  orders: Order[];
  products: Product[];
  rfqCart: LegacyRFQCartItem[];
  savedLists: LegacySavedList[];
  // Actions
  submitSupplyRequest: (items: Omit<ClientItemDrop, 'id'>[], targetDeliveryDate: string, generalNotes?: string) => SupplyRequest;
  removeSupplyRequest: (requestId: string) => void;
  submitAdminQuote: (requestId: string, quoteItems: { itemId: string; unitPrice: number }[], freightTerms: string, adminNotes?: string) => void;
  clearAdminQuote: (requestId: string) => void;
  acceptQuoteAndOrder: (requestId: string, poNumber: string, shippingAddress: string) => Order;
  removeOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  addToRFQCart: (productId: string, quantity: number) => void;
  removeFromRFQCart: (productId: string) => void;
  updateRFQCartQuantity: (productId: string, quantity: number) => void;
  addCustomToRFQCart: (itemName: string, quantity: number, unit: string) => void;
  submitRFQ: (targetDeliveryDate: string, generalNotes?: string) => SupplyRequest;
  updateRFQStatus: (rfqId: string, status: SupplyRequest['status'], quoteAmount?: number, quoteNotes?: string) => void;
  placeOrderFromRFQ: (rfqId: string, poNumber: string, shippingAddress: string) => Order;
  placeQuickOrder: (items: { productId: string; quantity: number }[], poNumber: string, shippingAddress: string) => Order;
  reorderListToCart: (listId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>('buyer');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>(INITIAL_REQUESTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products] = useState<Product[]>([]);
  const [rfqCart, setRfqCart] = useState<LegacyRFQCartItem[]>([]);
  const [savedLists] = useState<LegacySavedList[]>([]);
  const rfqs = supplyRequests;
  const storageVersion = '2';

  useEffect(() => {
    const loadSession = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        const metadata = session?.user.user_metadata as Partial<UserProfile> | undefined;
        if (session?.user) {
          setIsAuthenticated(true);
          const sessionEmail = session.user.email?.toLowerCase();
          const sessionRole = sessionEmail === adminEmail ? 'admin' : 'buyer';
          setUserRoleState(sessionRole);
          if (metadata?.companyName && metadata?.contactPerson) {
            setUserProfile({ ...INITIAL_USER, ...metadata, email: session.user.email || metadata.email || '' } as UserProfile);
          }
        }
        if (localStorage.getItem('lankot_data_version') !== storageVersion) {
        localStorage.removeItem('lankot_supply_requests');
        localStorage.removeItem('lankot_orders');
        localStorage.setItem('lankot_data_version', storageVersion);
      }
        const savedProfile = localStorage.getItem('lankot_user_profile');
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));

        const savedRequests = localStorage.getItem('lankot_supply_requests');
        if (savedRequests) setSupplyRequests(JSON.parse(savedRequests));

        const savedOrders = localStorage.getItem('lankot_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load authentication and storage state:', error);
      }
    };

    void loadSession();
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  const setUserRole = (role: UserRole) => {
    if (role === 'admin') return;
    setUserRoleState(role);
    localStorage.setItem('lankot_role', role);
  };

  const signIn = async (email: string, password: string, role: UserRole) => {
    if (!email.trim() || password.length < 6) return { success: false, error: 'Enter a valid email and a password with at least 6 characters.' };
    if (!supabase) return { success: false, error: 'Authentication is not configured. Add the Supabase environment variables.' };
    if (role === 'admin' && email.trim().toLowerCase() !== adminEmail) {
      return { success: false, error: 'This email is not authorized for admin access.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { success: false, error: error.message };
    const accountRole = role === 'admin' ? 'admin' : 'buyer';
    if (role === 'admin' && accountRole !== 'admin') {
      await supabase.auth.signOut();
      return { success: false, error: 'This account is not authorized for admin access.' };
    }
    setUserRoleState(accountRole);
    setIsAuthenticated(Boolean(data.session));
    return { success: true, requiresConfirmation: !data.session };
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsAuthenticated(false);
    setUserRoleState('buyer');
  };

  const registerAccount = async (profile: Pick<UserProfile, 'companyName' | 'taxId' | 'industry' | 'contactPerson' | 'email'>, password: string) => {
    if (password.length < 6) return { success: false, error: 'Password must contain at least 6 characters.' };
    if (!supabase) return { success: false, error: 'Authentication is not configured. Add the Supabase environment variables.' };
    const updatedProfile: UserProfile = {
      ...userProfile,
      ...profile,
      role: 'buyer'
    };
    const { data, error } = await supabase.auth.signUp({
      email: profile.email.trim(),
      password,
      options: { data: updatedProfile }
    });
    if (error) return { success: false, error: error.message };
    setUserProfile(updatedProfile);
    setUserRoleState('buyer');
    setIsAuthenticated(Boolean(data.session));
    return { success: true };
  };

  const submitSupplyRequest = (
    rawItems: Omit<ClientItemDrop, 'id'>[],
    targetDeliveryDate: string,
    generalNotes?: string
  ): SupplyRequest => {
    const formattedItems: ClientItemDrop[] = rawItems.map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}`
    }));

    const newReq: SupplyRequest = {
      id: `req-${Date.now()}`,
      requestNumber: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientCompany: userProfile.companyName,
      clientContact: userProfile.contactPerson,
      email: userProfile.email,
      phone: userProfile.phone,
      items: formattedItems,
      targetDeliveryDate,
      generalNotes,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newReq, ...supplyRequests];
    setSupplyRequests(updated);
    localStorage.setItem('lankot_supply_requests', JSON.stringify(updated));
    return newReq;
  };

  const removeSupplyRequest = (requestId: string) => {
    const updated = supplyRequests.filter((request) => request.id !== requestId);
    setSupplyRequests(updated);
    localStorage.setItem('lankot_supply_requests', JSON.stringify(updated));
  };

  const submitAdminQuote = (
    requestId: string,
    quotePricing: { itemId: string; unitPrice: number }[],
    freightTerms: string,
    adminNotes?: string
  ) => {
    const updated = supplyRequests.map((req) => {
      if (req.id === requestId) {
        const quoteLineItems: QuoteLineItem[] = req.items.map((item) => {
          const matchPrice = quotePricing.find((p) => p.itemId === item.id);
          const price = matchPrice ? matchPrice.unitPrice : 10;
          return {
            id: item.id,
            itemName: item.itemName,
            productName: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: price,
            lineTotal: price * item.quantity
          };
        });

        const totalQuoteAmount = quoteLineItems.reduce((sum, line) => sum + line.lineTotal, 0);

        return {
          ...req,
          status: 'quoted' as const,
          quoteLineItems,
          totalQuoteAmount,
          freightTerms,
          adminNotes,
          quotedAt: new Date().toISOString().split('T')[0]
        };
      }
      return req;
    });

    setSupplyRequests(updated);
    localStorage.setItem('lankot_supply_requests', JSON.stringify(updated));
  };

  const clearAdminQuote = (requestId: string) => {
    const updated = supplyRequests.map((req) => {
      if (req.id !== requestId) return req;

      const {
        quoteLineItems: _quoteLineItems,
        totalQuoteAmount: _totalQuoteAmount,
        freightTerms: _freightTerms,
        adminNotes: _adminNotes,
        quotedAt: _quotedAt,
        ...requestWithoutQuote
      } = req;

      return { ...requestWithoutQuote, status: 'pending' as const };
    });

    setSupplyRequests(updated);
    localStorage.setItem('lankot_supply_requests', JSON.stringify(updated));
  };

  const acceptQuoteAndOrder = (requestId: string, poNumber: string, shippingAddress: string): Order => {
    const req = supplyRequests.find((r) => r.id === requestId);
    if (!req || !req.quoteLineItems) throw new Error('Request or quote not found');

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-LNK-${Math.floor(10000 + Math.random() * 90000)}`,
      requestId: req.id,
      clientCompany: req.clientCompany,
      clientContact: req.clientContact,
      email: req.email,
      items: req.quoteLineItems.map((item) => ({
        ...item,
        productName: item.productName || item.itemName
      })),
      totalAmount: req.totalQuoteAmount || 0,
      status: 'confirmed',
      shippingAddress: shippingAddress || userProfile.address,
      poNumber: poNumber || `PO-APX-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Update request status to accepted
    const updatedRequests = supplyRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    );
    setSupplyRequests(updatedRequests);
    localStorage.setItem('lankot_supply_requests', JSON.stringify(updatedRequests));

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('lankot_orders', JSON.stringify(updatedOrders));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          ...(trackingNumber !== undefined && { trackingNumber }),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return ord;
    });
    setOrders(updated);
    localStorage.setItem('lankot_orders', JSON.stringify(updated));
  };

  const removeOrder = (orderId: string) => {
    const updated = orders.filter((order) => order.id !== orderId);
    setOrders(updated);
    localStorage.setItem('lankot_orders', JSON.stringify(updated));
  };

  const addToRFQCart = (productId: string, quantity: number) => {
    setRfqCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, quantity, product: products.find((p) => p.id === productId) }];
    });
  };

  const addCustomToRFQCart = (itemName: string, quantity: number, unit: string) => {
    setRfqCart((prev) => [
      ...prev,
      { productId: `custom-${Date.now()}`, quantity, itemName, unit }
    ]);
  };

  const removeFromRFQCart = (productId: string) => {
    setRfqCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateRFQCartQuantity = (productId: string, quantity: number) => {
    setRfqCart((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const submitRFQ = (targetDeliveryDate: string, generalNotes?: string): SupplyRequest => {
    const items = rfqCart.map((entry, idx) => ({
      id: `req-item-${Date.now()}-${idx}`,
      itemName: entry.product?.name || entry.itemName || `Custom Item ${idx + 1}`,
      quantity: entry.quantity,
      unit: entry.product?.unit || entry.unit || 'Units',
      specificRequirements: generalNotes || 'Custom request submitted by buyer.'
    }));

    return submitSupplyRequest(items, targetDeliveryDate, generalNotes);
  };

  const updateRFQStatus = (rfqId: string, status: SupplyRequest['status'], quoteAmount?: number, quoteNotes?: string) => {
    const updated = supplyRequests.map((req) => {
      if (req.id !== rfqId) return req;
      return {
        ...req,
        status,
        totalQuoteAmount: quoteAmount ?? req.totalQuoteAmount,
        adminNotes: quoteNotes ?? req.adminNotes,
        quotedAt: status === 'quoted' ? new Date().toISOString().split('T')[0] : req.quotedAt
      };
    });
    setSupplyRequests(updated);
    localStorage.setItem('lankot_supply_requests', JSON.stringify(updated));
  };

  const placeOrderFromRFQ = (rfqId: string, poNumber: string, shippingAddress: string): Order => {
    return acceptQuoteAndOrder(rfqId, poNumber, shippingAddress);
  };

  const placeQuickOrder = (items: { productId: string; quantity: number }[], poNumber: string, shippingAddress: string): Order => {
    const itemRows: QuoteLineItem[] = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        itemName: product?.name || `Item ${item.productId}`,
        productName: product?.name || `Item ${item.productId}`,
        quantity: item.quantity,
        unit: product?.unit || 'Units',
        unitPrice: product?.price || 0,
        lineTotal: (product?.price || 0) * item.quantity
      };
    });

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-LNK-${Math.floor(10000 + Math.random() * 90000)}`,
      requestId: `quick-${Date.now()}`,
      clientCompany: userProfile.companyName,
      clientContact: userProfile.contactPerson,
      email: userProfile.email,
      items: itemRows,
      totalAmount: itemRows.reduce((sum, row) => sum + row.lineTotal, 0),
      status: 'confirmed',
      shippingAddress,
      poNumber: poNumber || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('lankot_orders', JSON.stringify(updatedOrders));
    return order;
  };

  const reorderListToCart = (listId: string) => {
    const list = savedLists.find((entry) => entry.id === listId);
    if (!list) return;
    setRfqCart(list.items.map((entry) => ({
      productId: entry.productId,
      quantity: entry.quantity,
      product: products.find((product) => product.id === entry.productId)
    })));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userProfile,
        setUserRole,
        signIn,
        signOut,
        registerAccount,
        supplyRequests,
        rfqs,
        orders,
        products,
        rfqCart,
        savedLists,
        submitSupplyRequest,
        removeSupplyRequest,
        submitAdminQuote,
        clearAdminQuote,
        acceptQuoteAndOrder,
        removeOrder,
        updateOrderStatus,
        addToRFQCart,
        addCustomToRFQCart,
        removeFromRFQCart,
        updateRFQCartQuantity,
        submitRFQ,
        updateRFQStatus,
        placeOrderFromRFQ,
        placeQuickOrder,
        reorderListToCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
