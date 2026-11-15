'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SupplierListing,
  Order,
  Review,
  SupportTicket,
  NotificationItem,
  UserRole,
  OrderStatus,
  DeliveryCondition,
} from './types';
import {
  INITIAL_PROFILES,
  SUPPLIER_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
} from './mock-data';

export interface CartItem {
  listing: SupplierListing;
  quantity: number;
}

interface MarketplaceContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchRole: (role: UserRole | 'visitor') => void;
  allProfiles: UserProfile[];
  listings: SupplierListing[];
  orders: Order[];
  reviews: Review[];
  tickets: SupportTicket[];
  notifications: NotificationItem[];
  cart: CartItem[];
  addToCart: (listing: SupplierListing, qty?: number) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  updateCartQty: (listingId: string, qty: number) => void;
  placeOrder: (shippingAddress: any, notes?: string) => Promise<string[]>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderTracking: (
    orderId: string,
    courier: string,
    trackingNumber: string,
    details?: {
      driver_name?: string;
      driver_phone?: string;
      vehicle_number?: string;
      estimated_transit_minutes?: number;
      delivery_otp?: string;
    }
  ) => void;
  uploadDispatchPhotos: (orderId: string, photos: string[], notes: string) => void;
  reviewDispatchPhotos: (orderId: string, approved: boolean, comments?: string) => void;
  confirmDelivery: (
    orderId: string,
    condition: DeliveryCondition,
    doaCount: number,
    issueDescription: string,
    evidencePhotos: string[]
  ) => void;
  addReview: (orderId: string, rating: number, comment: string, photos?: string[]) => void;
  addListing: (listing: Omit<SupplierListing, 'id' | 'created_at' | 'updated_at'>) => void;
  updateListing: (id: string, updates: Partial<SupplierListing>) => void;
  deleteListing: (id: string) => void;
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticket_number' | 'created_at' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status'], adminNotes?: string) => void;
  resolveDispute: (
    ticketId: string,
    orderId: string | undefined,
    resolution: 'retailer_refund' | 'supplier_release' | 'split',
    adminNotes: string
  ) => void;
  signOut: () => Promise<void>;
  loginUser: (
    email: string,
    password?: string,
    role?: UserRole
  ) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  registerUser: (profile: UserProfile) => void;
  updateUserVerification: (userId: string, status: UserProfile['verification_status']) => void;
  markNotificationRead: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); // Start as unauthenticated visitor
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [listings, setListings] = useState<SupplierListing[]>(SUPPLIER_LISTINGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // User session persistence
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('findom_session_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id && parsed.email) {
          setCurrentUser(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    // Clean legacy key
    localStorage.removeItem('findom_user_role');
    setCurrentUser(null);
  }, []);

  const registerUser = (profile: UserProfile) => {
    setCurrentUser(profile);
    setAllProfiles((prev) => [profile, ...prev.filter((p) => p.email.toLowerCase() !== profile.email.toLowerCase())]);
    try {
      localStorage.setItem('findom_session_user', JSON.stringify(profile));
      localStorage.removeItem('findom_user_role');
    } catch (e) {}
  };

  const loginUser = async (
    email: string,
    password?: string,
    role?: UserRole
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Supabase Auth
    try {
      const { supabase } = await import('@/lib/supabase');
      if (supabase && password) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (authError) {
          console.warn('Supabase signIn notice:', authError.message);
        } else if (authData?.user) {
          const meta = authData.user.user_metadata || {};
          const matchedProfile: UserProfile = {
            id: authData.user.id,
            role: (meta.role as UserRole) || role || 'retailer',
            business_name: meta.business_name || cleanEmail.split('@')[0],
            owner_name: meta.owner_name || 'Business Owner',
            email: cleanEmail,
            phone: meta.phone || '',
            city: meta.city || 'India',
            state: meta.state || 'India',
            pincode: meta.pincode || '',
            verification_status: 'approved',
            rating: 5.0,
            review_count: 0,
            created_at: new Date().toISOString(),
          };
          registerUser(matchedProfile);
          return { success: true, user: matchedProfile };
        }
      }
    } catch (err) {
      console.warn('Supabase auth catch:', err);
    }

    // 2. Check registered accounts
    const existing = allProfiles.find((p) => p.email.toLowerCase() === cleanEmail);
    if (!existing) {
      return {
        success: false,
        error: `No account registered with "${cleanEmail}". Please check your email or register a new account.`,
      };
    }

    // If role was specified and doesn't match:
    if (role === 'admin' && existing.role !== 'admin') {
      return {
        success: false,
        error: 'This account does not have administrator clearance.',
      };
    }

    if (role && role !== 'admin' && existing.role === 'admin') {
      // User entered admin credentials while on supplier/retailer tab - allow seamless admin login!
    } else if (role && existing.role !== role) {
      return {
        success: false,
        error: `This account is registered as a ${existing.role.toUpperCase()}, not a ${role.toUpperCase()}. Please switch role tab to ${existing.role.toUpperCase()} or use the appropriate account.`,
      };
    }

    registerUser(existing);
    return { success: true, user: existing };
  };

  const signOut = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem('findom_session_user');
    localStorage.removeItem('findom_user_role');
  };

  const switchRole = (role: UserRole | 'visitor') => {
    if (role === 'visitor') {
      setCurrentUser(null);
      localStorage.removeItem('findom_session_user');
      localStorage.setItem('findom_user_role', 'visitor');
    } else {
      const matched = allProfiles.find((p) => p.role === role);
      if (matched) {
        setCurrentUser(matched);
        localStorage.setItem('findom_session_user', JSON.stringify(matched));
      }
    }
  };

  const addToCart = (listing: SupplierListing, qty = listing.min_order_qty) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { listing, quantity: qty }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart((prev) => prev.filter((item) => item.listing.id !== listingId));
  };

  const updateCartQty = (listingId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(listingId);
    setCart((prev) =>
      prev.map((item) => (item.listing.id === listingId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Place Order: Automatically splits orders supplier-wise per PRD!
  const placeOrder = async (shippingAddress: any, notes?: string): Promise<string[]> => {
    if (!currentUser) throw new Error('Must be registered/logged in to purchase');

    // Group cart by supplier
    const supplierGroups: { [supplierId: string]: CartItem[] } = {};
    cart.forEach((item) => {
      const sId = item.listing.supplier_id;
      if (!supplierGroups[sId]) supplierGroups[sId] = [];
      supplierGroups[sId].push(item);
    });

    const newOrderIds: string[] = [];
    const generatedOrders: Order[] = [];

    Object.entries(supplierGroups).forEach(([supplierId, items]) => {
      const supplier = allProfiles.find((p) => p.id === supplierId) || items[0].listing.supplier;
      const subtotal = items.reduce((acc, it) => acc + it.listing.price_per_unit * it.quantity, 0);
      const shippingFee = subtotal > 4999 ? 0 : 199; // Hyperlocal 1-Hour Porter Delivery: Free on orders > ₹4,999, else flat ₹199
      const total = subtotal + shippingFee;
      const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const orderNum = `FD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: Order = {
        id: orderId,
        order_number: orderNum,
        retailer_id: currentUser.id,
        retailer: currentUser,
        supplier_id: supplierId,
        supplier: supplier,
        status: 'new',
        payment_status: 'escrow_hold',
        subtotal,
        shipping_fee: shippingFee,
        total_amount: total,
        shipping_address: shippingAddress,
        delivery_mode: 'porter_bike',
        delivery_otp: `${Math.floor(1000 + Math.random() * 9000)}`,
        estimated_transit_minutes: 45,
        retailer_notes: notes,
        created_at: new Date().toISOString(),
        items: items.map((it) => ({
          id: `item-${Date.now()}-${Math.random()}`,
          listing_id: it.listing.id,
          product_name: it.listing.product?.common_name || it.listing.variety || 'Aquatic Specimen',
          size_grade: it.listing.size_grade,
          unit_price: it.listing.price_per_unit,
          quantity: it.quantity,
          total_price: it.listing.price_per_unit * it.quantity,
          image_url: it.listing.images[0],
        })),
      };

      generatedOrders.push(newOrder);
      newOrderIds.push(orderId);

      // Add supplier notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-${Math.random()}`,
          user_id: supplierId,
          title: '🛒 New Wholesale Order Received',
          message: `Order #${orderNum} placed by ${currentUser.business_name} for ₹${total.toLocaleString('en-IN')}`,
          link: `/supplier/orders/${orderId}`,
          type: 'order',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    setOrders((prev) => [...generatedOrders, ...prev]);
    clearCart();
    return newOrderIds;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateOrderTracking = (
    orderId: string,
    courier: string,
    trackingNumber: string,
    details?: {
      driver_name?: string;
      driver_phone?: string;
      vehicle_number?: string;
      estimated_transit_minutes?: number;
      delivery_otp?: string;
    }
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              tracking_courier: courier,
              tracking_number: trackingNumber,
              driver_name: details?.driver_name || o.driver_name || 'Porter Assigned Driver',
              driver_phone: details?.driver_phone || o.driver_phone || '+91 98201 54321',
              vehicle_number: details?.vehicle_number || o.vehicle_number || 'MH-02-EE-4129',
              estimated_transit_minutes: details?.estimated_transit_minutes || 45,
              delivery_otp: details?.delivery_otp || o.delivery_otp || `${Math.floor(1000 + Math.random() * 9000)}`,
              status: 'dispatched',
            }
          : o
      )
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const driverDesc = details?.driver_name
        ? `${details.driver_name} (${courier})`
        : courier;
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: targetOrder.retailer_id,
          title: '🛵 Porter Express: Out for 1-Hour Local Delivery',
          message: `Order #${targetOrder.order_number} has been picked up by ${driverDesc}. ETA: ~35-45 mins. Have shop tanks ready for acclimation!`,
          link: `/retailer/orders/${orderId}`,
          type: 'order',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const uploadDispatchPhotos = (orderId: string, photos: string[], notes: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'photos_uploaded',
            dispatch_verification: {
              id: `disp-${Date.now()}`,
              order_id: orderId,
              supplier_id: o.supplier_id,
              photo_urls: photos,
              notes,
              retailer_approved: null,
              uploaded_at: new Date().toISOString(),
            },
          };
        }
        return o;
      })
    );

    // Notify retailer
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: targetOrder.retailer_id,
          title: '📸 Pre-Dispatch Photos Ready for Inspection',
          message: `${targetOrder.supplier?.business_name || 'Supplier'} uploaded inspection photos for Order #${targetOrder.order_number}. Please review.`,
          link: `/retailer/orders/${orderId}`,
          type: 'dispatch',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const reviewDispatchPhotos = (orderId: string, approved: boolean, comments?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.dispatch_verification) {
          return {
            ...o,
            status: approved ? 'photos_approved' : 'disputed',
            dispatch_verification: {
              ...o.dispatch_verification,
              retailer_approved: approved,
              retailer_feedback: comments,
              reviewed_at: new Date().toISOString(),
            },
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: targetOrder.supplier_id,
          title: approved ? '✅ Dispatch Photos Approved' : '⚠️ Dispatch Photos Flagged',
          message: `${targetOrder.retailer?.business_name} ${approved ? 'approved photos. You may proceed with dispatch.' : 'raised concern: ' + (comments || 'Discrepancy noted.')}`,
          link: `/supplier/orders/${orderId}`,
          type: 'dispatch',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const confirmDelivery = (
    orderId: string,
    condition: DeliveryCondition,
    doaCount: number,
    issueDescription: string,
    evidencePhotos: string[]
  ) => {
    const isProblem = condition !== 'all_healthy';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: isProblem ? 'disputed' : 'completed',
            payment_status: isProblem ? 'escrow_hold' : 'payout_processed',
            delivery_confirmation: {
              id: `del-${Date.now()}`,
              order_id: orderId,
              retailer_id: o.retailer_id,
              condition,
              doa_count: doaCount,
              issue_description: issueDescription,
              evidence_photos: evidencePhotos,
              confirmed_at: new Date().toISOString(),
              admin_flagged: isProblem,
            },
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (isProblem && targetOrder) {
      // Auto-open Support Ticket for Admin investigation per PRD!
      const newTicket: SupportTicket = {
        id: `tkt-${Date.now()}`,
        ticket_number: `TKT-DOA-${Math.floor(1000 + Math.random() * 9000)}`,
        order_id: orderId,
        user_id: targetOrder.retailer_id,
        user_name: `${targetOrder.retailer?.owner_name} (${targetOrder.retailer?.business_name})`,
        user_role: 'retailer',
        subject: `DOA / Damage Claim for Order #${targetOrder.order_number}`,
        category: 'doa_dispute',
        description: `Condition: ${condition}. DOA Count: ${doaCount}. Details: ${issueDescription}`,
        evidence_urls: evidencePhotos,
        status: 'under_review',
        admin_notes: 'Automated claim ticket created upon delivery confirmation with damage report.',
        created_at: new Date().toISOString(),
      };
      setTickets((prev) => [newTicket, ...prev]);

      // Notify Admin
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: 'admin-1',
          title: '🚨 DOA / Delivery Dispute Flagged',
          message: `Claim filed for Order #${targetOrder.order_number} (${doaCount} DOA reported). Ticket created.`,
          link: '/admin/disputes',
          type: 'dispute',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const addReview = (orderId: string, rating: number, comment: string, photos?: string[]) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      order_id: orderId,
      retailer_id: targetOrder.retailer_id,
      retailer_name: targetOrder.retailer?.business_name || 'Verified Retailer',
      retailer_location: `${targetOrder.retailer?.city}, ${targetOrder.retailer?.state}`,
      supplier_id: targetOrder.supplier_id,
      rating,
      comment,
      photos,
      is_verified_purchase: true,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);
  };

  const addListing = (listing: Omit<SupplierListing, 'id' | 'created_at' | 'updated_at'>) => {
    const newL: SupplierListing = {
      ...listing,
      id: `list-${Date.now()}`,
    };
    setListings((prev) => [newL, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<SupplierListing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const createTicket = (ticket: Omit<SupportTicket, 'id' | 'ticket_number' | 'created_at' | 'status'>) => {
    const newT: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticket_number: `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    setTickets((prev) => [newT, ...prev]);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status'], adminNotes?: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, admin_notes: adminNotes || t.admin_notes } : t))
    );
  };

  const resolveDispute = (
    ticketId: string,
    orderId: string | undefined,
    resolution: 'retailer_refund' | 'supplier_release' | 'split',
    adminNotes: string
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              admin_notes: `[Resolution: ${resolution.toUpperCase()}] ${adminNotes}`,
            }
          : t
      )
    );

    if (orderId) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            const newPaymentStatus =
              resolution === 'retailer_refund'
                ? 'refunded'
                : 'payout_processed';
            return {
              ...o,
              payment_status: newPaymentStatus,
              status: resolution === 'retailer_refund' ? 'cancelled' : 'completed',
            };
          }
          return o;
        })
      );

      const targetOrder = orders.find((o) => o.id === orderId);
      if (targetOrder) {
        const textMsg =
          resolution === 'retailer_refund'
            ? 'Dispute resolved in Retailer favor. Full escrow refund processed.'
            : resolution === 'supplier_release'
            ? 'Dispute resolved in Supplier favor. Escrow payout released to bank.'
            : 'Dispute resolved with Split Settlement. Adjusted payout and refund released.';

        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}-ret`,
            user_id: targetOrder.retailer_id,
            title: '⚖️ Dispute Arbitration Concluded',
            message: `Order #${targetOrder.order_number}: ${textMsg}`,
            link: `/retailer/orders/${orderId}`,
            type: 'dispute',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: `notif-${Date.now()}-sup`,
            user_id: targetOrder.supplier_id,
            title: '⚖️ Dispute Arbitration Concluded',
            message: `Order #${targetOrder.order_number}: ${textMsg}`,
            link: `/supplier/orders/${orderId}`,
            type: 'dispute',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }
  };

  const updateUserVerification = (userId: string, status: UserProfile['verification_status']) => {
    setAllProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, verification_status: status } : p))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, verification_status: status } : prev));
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allProfiles,
        listings,
        orders,
        reviews,
        tickets,
        notifications,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQty,
        placeOrder,
        updateOrderStatus,
        updateOrderTracking,
        uploadDispatchPhotos,
        reviewDispatchPhotos,
        confirmDelivery,
        addReview,
        addListing,
        updateListing,
        deleteListing,
        createTicket,
        updateTicketStatus,
        resolveDispute,
        updateUserVerification,
        signOut,
        loginUser,
        registerUser,
        markNotificationRead,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
}
