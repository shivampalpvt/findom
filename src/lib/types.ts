export type UserRole = 'supplier' | 'retailer' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface UserProfile {
  id: string;
  role: UserRole;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  address?: string;
  business_doc_url?: string;
  verification_status: VerificationStatus;
  rating: number;
  review_count: number;
  created_at: string;
  gstin?: string;
  hub?: string;
  bank_account?: string;
  bank_ifsc?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface MasterProduct {
  id: string;
  category_id: string;
  scientific_name: string;
  common_name: string;
  slug: string;
  description: string;
  care_level: 'Easy' | 'Moderate' | 'Advanced';
  water_type: 'Freshwater' | 'Marine' | 'Brackish';
  default_image: string;
}

export interface SupplierListing {
  id: string;
  supplier_id: string;
  supplier?: UserProfile;
  product_id: string;
  product?: MasterProduct;
  variety: string;
  size_grade: string;
  price_per_unit: number; // in INR ₹
  min_order_qty: number;
  available_qty: number;
  images: string[];
  is_active: boolean;
  location_city?: string;
  location_state?: string;
}

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready_for_dispatch'
  | 'photos_uploaded'
  | 'photos_approved'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'escrow_hold'
  | 'payout_processed'
  | 'refunded';

export interface OrderItem {
  id: string;
  listing_id: string;
  product_name: string;
  size_grade: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  retailer_id: string;
  retailer?: UserProfile;
  supplier_id: string;
  supplier?: UserProfile;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  shipping_address: {
    shop_name: string;
    contact_person: string;
    phone: string;
    address_line: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    delivery_mode?: string;
  };
  delivery_mode?: 'porter_bike' | 'porter_tempo' | 'borzo_express' | 'direct_courier';
  tracking_courier?: string;
  tracking_number?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_number?: string;
  estimated_transit_minutes?: number;
  delivery_otp?: string;
  supplier_notes?: string;
  retailer_notes?: string;
  created_at: string;
  items: OrderItem[];
  dispatch_verification?: DispatchVerification;
  delivery_confirmation?: DeliveryConfirmation;
}

export interface DispatchVerification {
  id: string;
  order_id: string;
  supplier_id: string;
  photo_urls: string[];
  notes?: string;
  retailer_approved: boolean | null;
  retailer_feedback?: string;
  uploaded_at: string;
  reviewed_at?: string;
}

export type DeliveryCondition =
  | 'all_healthy'
  | 'minor_issues'
  | 'dead_on_arrival'
  | 'damaged_or_missing';

export interface DeliveryConfirmation {
  id: string;
  order_id: string;
  retailer_id: string;
  condition: DeliveryCondition;
  doa_count: number;
  issue_description?: string;
  evidence_photos: string[];
  confirmed_at: string;
  admin_flagged: boolean;
}

export interface Review {
  id: string;
  order_id: string;
  retailer_id: string;
  retailer_name: string;
  retailer_location: string;
  supplier_id: string;
  rating: number;
  comment: string;
  photos?: string[];
  is_verified_purchase: boolean;
  created_at: string;
}

export type TicketStatus =
  | 'new'
  | 'under_review'
  | 'waiting_for_supplier'
  | 'waiting_for_retailer'
  | 'escalated'
  | 'resolved'
  | 'closed';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  order_id?: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  subject: string;
  category: string;
  description: string;
  evidence_urls: string[];
  status: TicketStatus;
  admin_notes?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  type: 'order' | 'dispatch' | 'delivery' | 'payment' | 'dispute' | 'system';
  is_read: boolean;
  created_at: string;
}
