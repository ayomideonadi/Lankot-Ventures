'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupplyRequest, Order, UserRole, UserProfile, ClientItemDrop, QuoteLineItem, OrderStatus, Product, Notification } from '../types/b2b';
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
  authReady: boolean;
  userRole: UserRole;
  userProfile: UserProfile;
  setUserRole: (role: UserRole) => void;
  signIn: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  registerAccount: (profile: Pick<UserProfile, 'companyName' | 'taxId' | 'industry' | 'contactPerson' | 'email'>, password: string) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>;
  supplyRequests: SupplyRequest[];
  rfqs: SupplyRequest[];
  orders: Order[];
  notifications: Notification[];
  products: Product[];
  rfqCart: LegacyRFQCartItem[];
  savedLists: LegacySavedList[];
  // Actions
  submitSupplyRequest: (items: Omit<ClientItemDrop, 'id'>[], targetDeliveryDate: string, generalNotes?: string) => Promise<SupplyRequest>;
  removeSupplyRequest: (requestId: string) => void;
  submitAdminQuote: (requestId: string, quoteItems: { itemId: string; unitPrice: number }[], freightTerms: string, adminNotes?: string) => void;
  clearAdminQuote: (requestId: string) => void;
  acceptQuoteAndOrder: (requestId: string, poNumber: string, shippingAddress: string) => Order;
  removeOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  markNotificationRead: (notificationId: string) => void;
  addToRFQCart: (productId: string, quantity: number) => void;
  removeFromRFQCart: (productId: string) => void;
  updateRFQCartQuantity: (productId: string, quantity: number) => void;
  addCustomToRFQCart: (itemName: string, quantity: number, unit: string) => void;
  submitRFQ: (targetDeliveryDate: string, generalNotes?: string) => Promise<SupplyRequest>;
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
  const [authReady, setAuthReady] = useState(false);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>(INITIAL_REQUESTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products] = useState<Product[]>([]);
  const [rfqCart, setRfqCart] = useState<LegacyRFQCartItem[]>([]);
  const [savedLists] = useState<LegacySavedList[]>([]);
  const rfqs = supplyRequests;
  const storageVersion = '2';

  const applyNotification = (notification: Notification) => {
    setNotifications((current) => current.some((item) => item.id === notification.id) ? current : [notification, ...current]);
    const payload = notification.payload as Partial<Order> & { status?: OrderStatus; trackingNumber?: string };
    if (notification.type === 'order_created' && payload.id) {
      setOrders((current) => current.some((order) => order.id === payload.id) ? current : [payload as Order, ...current]);
    }
    if (notification.type === 'order_status' && notification.order_id) {
      setOrders((current) => current.map((order) => order.id === notification.order_id
        ? { ...order, status: payload.status || order.status, ...(payload.trackingNumber !== undefined && { trackingNumber: payload.trackingNumber }), updatedAt: new Date().toISOString().split('T')[0] }
        : order));
    }
  };

  const sendNotification = async (notification: Omit<Notification, 'id' | 'read_at' | 'created_at'>) => {
    if (!supabase) return;
    const { error } = await supabase.from('notifications').insert(notification);
    if (error) console.error('Failed to send notification:', error);
  };

  useEffect(() => {
    const loadSession = async () => {
      let loadedRequestsFromSupabase = false;
      try {
        if (supabase) {
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
          if (session?.user.email) {
            const { data: savedRequests } = await supabase.from('supply_requests').select('*').order('created_at', { ascending: false });
            if (savedRequests) {
              loadedRequestsFromSupabase = true;
              setSupplyRequests(savedRequests.map((request) => ({
                ...request,
                requestNumber: request.request_number,
                clientCompany: request.client_company,
                clientContact: request.client_contact,
                targetDeliveryDate: request.target_delivery_date,
                generalNotes: request.general_notes,
                quoteLineItems: request.quote_line_items,
                totalQuoteAmount: request.total_quote_amount,
                freightTerms: request.freight_terms,
                adminNotes: request.admin_notes,
                quotedAt: request.quoted_at,
                createdAt: request.created_at
              })) as SupplyRequest[]);
            }
            const { data: existingNotifications } = await supabase.from('notifications').select('*').eq('recipient_email', session.user.email).order('created_at', { ascending: false }).limit(30);
            existingNotifications?.forEach((notification) => applyNotification(notification as Notification));
          }
        }
        if (localStorage.getItem('lankot_data_version') !== storageVersion) {
        localStorage.removeItem('lankot_supply_requests');
        localStorage.removeItem('lankot_orders');
        localStorage.setItem('lankot_data_version', storageVersion);
      }
        const savedProfile = localStorage.getItem('lankot_user_profile');
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));

        const localRequests = localStorage.getItem('lankot_supply_requests');
        if (!loadedRequestsFromSupabase && localRequests) setSupplyRequests(JSON.parse(localRequests));

        const savedOrders = localStorage.getItem('lankot_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load authentication and storage state:', error);
      } finally {
        setAuthReady(true);
      }
    };

    void loadSession();
    if (!supabase) return;
    const supabaseClient = supabase;
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });
    const channel = supabaseClient.channel('notifications-live').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
      applyNotification(payload.new as Notification);
    }).subscribe();
    return () => { subscription.unsubscribe(); void supabaseClient.removeChannel(channel); };
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
      options: {
        data: updatedProfile,
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
      }
    });
    if (error) return { success: false, error: error.message };
    setUserProfile(updatedProfile);
    setUserRoleState('buyer');
    setIsAuthenticated(Boolean(data.session));
    return { success: true, requiresConfirmation: !data.session };
  };

  const submitSupplyRequest = async (
    rawItems: Omit<ClientItemDrop, 'id'>[],
    targetDeliveryDate: string,
    generalNotes?: string
  ): Promise<SupplyRequest> => {
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
    if (supabase) {
      const { error } = await supabase.from('supply_requests').insert({
        id: newReq.id,
        request_number: newReq.requestNumber,
        client_company: newReq.clientCompany,
        client_contact: newReq.clientContact,
        email: newReq.email,
        phone: newReq.phone,
        items: newReq.items,
        target_delivery_date: newReq.targetDeliveryDate,
        general_notes: newReq.generalNotes,
        status: newReq.status,
        created_at: newReq.createdAt
      });
      if (error) throw new Error(`Unable to save request: ${error.message}`);
    }
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
    const quotedRequest = updated.find((request) => request.id === requestId);
    if (quotedRequest) {
      void supabase?.from('supply_requests').update({
        status: quotedRequest.status,
        quote_line_items: quotedRequest.quoteLineItems,
        total_quote_amount: quotedRequest.totalQuoteAmount,
        freight_terms: quotedRequest.freightTerms,
        admin_notes: quotedRequest.adminNotes,
        quoted_at: quotedRequest.quotedAt
      }).eq('id', requestId);
    }
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
    void sendNotification({
      recipient_email: adminEmail,
      type: 'order_created',
      title: 'New client order received',
      message: `${newOrder.clientCompany} placed order ${newOrder.orderNumber}.`,
      order_id: newOrder.id,
      payload: newOrder as unknown as Record<string, unknown>
    });

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
    const changedOrder = updated.find((order) => order.id === orderId);
    if (changedOrder) {
      void sendNotification({
        recipient_email: changedOrder.email,
        type: 'order_status',
        title: `Order ${changedOrder.orderNumber} updated`,
        message: `Your order is now ${status}.`,
        order_id: changedOrder.id,
        payload: { status, trackingNumber }
      });
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((current) => current.map((notification) => notification.id === notificationId ? { ...notification, read_at: new Date().toISOString() } : notification));
    void supabase?.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', notificationId);
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

  const submitRFQ = async (targetDeliveryDate: string, generalNotes?: string): Promise<SupplyRequest> => {
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
    void sendNotification({
      recipient_email: adminEmail,
      type: 'order_created',
      title: 'New client order received',
      message: `${order.clientCompany} placed order ${order.orderNumber}.`,
      order_id: order.id,
      payload: order as unknown as Record<string, unknown>
    });
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
        authReady,
        userRole,
        userProfile,
        setUserRole,
        signIn,
        signOut,
        registerAccount,
        supplyRequests,
        rfqs,
        orders,
        notifications,
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
        markNotificationRead,
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
