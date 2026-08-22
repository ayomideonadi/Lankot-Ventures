'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, RFQ, Order, SavedList, UserRole, UserProfile, RFQItem, OrderStatus, RFQStatus } from '../types/b2b';
import { INITIAL_PRODUCTS, INITIAL_RFQS, INITIAL_ORDERS, INITIAL_SAVED_LISTS, INITIAL_USER } from '../data/mock-data';

interface AppContextType {
  userRole: UserRole;
  userProfile: UserProfile;
  setUserRole: (role: UserRole) => void;
  products: Product[];
  rfqs: RFQ[];
  orders: Order[];
  rfqCart: RFQItem[];
  savedLists: SavedList[];
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // RFQ actions
  addToRFQCart: (productId: string, quantity: number, notes?: string) => void;
  removeFromRFQCart: (productId: string) => void;
  updateRFQCartQuantity: (productId: string, quantity: number) => void;
  clearRFQCart: () => void;
  submitRFQ: (targetDeliveryDate: string, notes: string) => RFQ;
  updateRFQStatus: (rfqId: string, status: RFQStatus, quoteAmount?: number, quoteNotes?: string) => void;
  // Order actions
  placeOrderFromRFQ: (rfqId: string, poNumber: string, shippingAddress: string) => Order;
  placeQuickOrder: (items: { productId: string; quantity: number }[], poNumber: string, shippingAddress: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  // Saved Lists
  createSavedList: (name: string, description: string, items: { productId: string; quantity: number }[]) => void;
  reorderListToCart: (listId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>('buyer');
  const [userProfile] = useState<UserProfile>(INITIAL_USER);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [rfqCart, setRfqCart] = useState<RFQItem[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>(INITIAL_SAVED_LISTS);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('lankot_role');
      if (savedRole === 'buyer' || savedRole === 'admin') setUserRoleState(savedRole);

      const savedProducts = localStorage.getItem('lankot_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedRfqs = localStorage.getItem('lankot_rfqs');
      if (savedRfqs) setRfqs(JSON.parse(savedRfqs));

      const savedOrders = localStorage.getItem('lankot_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem('lankot_rfq_cart');
      if (savedCart) setRfqCart(JSON.parse(savedCart));

      const savedListsLocal = localStorage.getItem('lankot_saved_lists');
      if (savedListsLocal) setSavedLists(JSON.parse(savedListsLocal));
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('lankot_role', role);
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('lankot_products', JSON.stringify(updated));
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProducts(updated);
    localStorage.setItem('lankot_products', JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('lankot_products', JSON.stringify(updated));
  };

  const addToRFQCart = (productId: string, quantity: number, notes?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setRfqCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === productId);
      let updated: RFQItem[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
      } else {
        updated = [...prev, { productId, quantity, notes, product }];
      }
      localStorage.setItem('lankot_rfq_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromRFQCart = (productId: string) => {
    setRfqCart(prev => {
      const updated = prev.filter(item => item.productId !== productId);
      localStorage.setItem('lankot_rfq_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateRFQCartQuantity = (productId: string, quantity: number) => {
    setRfqCart(prev => {
      const updated = prev.map(item => item.productId === productId ? { ...item, quantity } : item);
      localStorage.setItem('lankot_rfq_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRFQCart = () => {
    setRfqCart([]);
    localStorage.removeItem('lankot_rfq_cart');
  };

  const submitRFQ = (targetDeliveryDate: string, notes: string): RFQ => {
    const newRfq: RFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientCompany: userProfile.companyName,
      clientContact: userProfile.contactPerson,
      email: userProfile.email,
      phone: userProfile.phone,
      items: [...rfqCart],
      status: 'pending',
      targetDeliveryDate,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newRfq, ...rfqs];
    setRfqs(updated);
    localStorage.setItem('lankot_rfqs', JSON.stringify(updated));
    clearRFQCart();
    return newRfq;
  };

  const updateRFQStatus = (rfqId: string, status: RFQStatus, quoteAmount?: number, quoteNotes?: string) => {
    const updated = rfqs.map(rfq => {
      if (rfq.id === rfqId) {
        return {
          ...rfq,
          status,
          ...(quoteAmount !== undefined && { quoteAmount }),
          ...(quoteNotes !== undefined && { quoteNotes })
        };
      }
      return rfq;
    });
    setRfqs(updated);
    localStorage.setItem('lankot_rfqs', JSON.stringify(updated));
  };

  const placeOrderFromRFQ = (rfqId: string, poNumber: string, shippingAddress: string): Order => {
    const rfq = rfqs.find(r => r.id === rfqId);
    if (!rfq) throw new Error('RFQ not found');

    const orderItems = rfq.items.map(item => {
      const p = products.find(prod => prod.id === item.productId) || item.product;
      return {
        productId: item.productId,
        productName: p?.name || 'Item',
        sku: p?.sku || 'SKU-UNKNOWN',
        unitPrice: rfq.quoteAmount ? rfq.quoteAmount / rfq.items.reduce((sum, i) => sum + i.quantity, 0) : (p?.price || 0),
        quantity: item.quantity,
        unit: p?.unit || 'Units'
      };
    });

    const totalAmount = rfq.quoteAmount || orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-LNK-${Math.floor(10000 + Math.random() * 90000)}`,
      clientCompany: rfq.clientCompany,
      clientContact: rfq.clientContact,
      email: rfq.email,
      poNumber: poNumber || `PO-APX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      shippingAddress: shippingAddress || userProfile.address,
      items: orderItems,
      totalAmount,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('lankot_orders', JSON.stringify(updatedOrders));

    // Update RFQ status to accepted
    updateRFQStatus(rfqId, 'accepted');

    return newOrder;
  };

  const placeQuickOrder = (items: { productId: string; quantity: number }[], poNumber: string, shippingAddress: string): Order => {
    const orderItems = items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        productName: p?.name || 'B2B Item',
        sku: p?.sku || 'SKU-LNK',
        unitPrice: p?.price || 0,
        quantity: item.quantity,
        unit: p?.unit || 'Units'
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-LNK-${Math.floor(10000 + Math.random() * 90000)}`,
      clientCompany: userProfile.companyName,
      clientContact: userProfile.contactPerson,
      email: userProfile.email,
      poNumber: poNumber || `PO-APX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      shippingAddress: shippingAddress || userProfile.address,
      items: orderItems,
      totalAmount,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('lankot_orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const updated = orders.map(ord => {
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

  const createSavedList = (name: string, description: string, items: { productId: string; quantity: number }[]) => {
    const newList: SavedList = {
      id: `list-${Date.now()}`,
      name,
      description,
      items,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newList, ...savedLists];
    setSavedLists(updated);
    localStorage.setItem('lankot_saved_lists', JSON.stringify(updated));
  };

  const reorderListToCart = (listId: string) => {
    const list = savedLists.find(l => l.id === listId);
    if (!list) return;
    list.items.forEach(item => {
      addToRFQCart(item.productId, item.quantity);
    });
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        userProfile,
        setUserRole,
        products,
        rfqs,
        orders,
        rfqCart,
        savedLists,
        addProduct,
        updateProduct,
        deleteProduct,
        addToRFQCart,
        removeFromRFQCart,
        updateRFQCartQuantity,
        clearRFQCart,
        submitRFQ,
        updateRFQStatus,
        placeOrderFromRFQ,
        placeQuickOrder,
        updateOrderStatus,
        createSavedList,
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
