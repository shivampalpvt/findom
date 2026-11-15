-- ==============================================================================
-- FINDOM: B2B FISH MARKETPLACE DATABASE SCHEMA (SUPABASE POSTGRESQL + RLS)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. USER PROFILES & ROLES
create type user_role as enum ('supplier', 'retailer', 'admin');
create type verification_status as enum ('pending', 'approved', 'rejected', 'suspended');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'retailer',
  business_name text not null,
  owner_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  state text not null,
  pincode text not null,
  address text,
  business_doc_url text,
  verification_status verification_status default 'pending',
  rating numeric(3,2) default 5.0,
  review_count int default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Public can read verified supplier/retailer public cards; users can update their own profile; admins can manage all
create policy "Public can view approved suppliers & retailers" on public.profiles
  for select using (verification_status = 'approved' or auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 3. CATEGORIES
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;
create policy "Categories are viewable by all" on public.categories for select using (true);

-- 4. GLOBAL PRODUCTS (Master Catalog of Species & Supplies)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete set null,
  scientific_name text,
  common_name text not null,
  slug text not null unique,
  description text,
  care_level text default 'Easy',
  water_type text default 'Freshwater',
  default_image text,
  created_at timestamptz default now() not null
);

alter table public.products enable row level security;
create policy "Products catalog is viewable by all" on public.products for select using (true);

-- 5. SUPPLIER LISTINGS (Specific Inventory & Pricing per Supplier)
create table public.supplier_listings (
  id uuid default uuid_generate_v4() primary key,
  supplier_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  variety text,
  size_grade text not null,
  price_per_unit numeric(10,2) not null,
  min_order_qty int default 10 not null,
  available_qty int default 100 not null,
  images text[] default array[]::text[],
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.supplier_listings enable row level security;

create policy "Active listings viewable by all" on public.supplier_listings
  for select using (is_active = true or auth.uid() = supplier_id);

create policy "Suppliers manage own listings" on public.supplier_listings
  for all using (auth.uid() = supplier_id);

-- 6. ORDERS & ORDER ITEMS
create type order_status as enum (
  'new',
  'accepted',
  'preparing',
  'ready_for_dispatch',
  'photos_uploaded',
  'photos_approved',
  'dispatched',
  'delivered',
  'completed',
  'disputed',
  'cancelled'
);

create type payment_status as enum (
  'pending',
  'paid',
  'escrow_hold',
  'payout_processed',
  'refunded'
);

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  retailer_id uuid references public.profiles(id) on delete cascade not null,
  supplier_id uuid references public.profiles(id) on delete cascade not null,
  status order_status default 'new' not null,
  payment_status payment_status default 'pending' not null,
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) default 0.00,
  total_amount numeric(10,2) not null,
  shipping_address jsonb not null,
  tracking_courier text,
  tracking_number text,
  supplier_notes text,
  retailer_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.orders enable row level security;

create policy "Retailer and Supplier view their own orders" on public.orders
  for select using (auth.uid() = retailer_id or auth.uid() = supplier_id);

create policy "Retailer can insert order" on public.orders
  for insert with check (auth.uid() = retailer_id);

create policy "Participants can update order state" on public.orders
  for update using (auth.uid() = retailer_id or auth.uid() = supplier_id);

create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  listing_id uuid references public.supplier_listings(id) on delete set null,
  product_name text not null,
  size_grade text not null,
  unit_price numeric(10,2) not null,
  quantity int not null,
  total_price numeric(10,2) not null
);

alter table public.order_items enable row level security;

create policy "Order items viewable by order parties" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.retailer_id = auth.uid() or o.supplier_id = auth.uid())
    )
  );

-- 7. DISPATCH PHOTO VERIFICATION
create table public.dispatch_verifications (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade unique not null,
  supplier_id uuid references public.profiles(id) on delete cascade not null,
  photo_urls text[] not null,
  notes text,
  retailer_approved boolean,
  retailer_feedback text,
  uploaded_at timestamptz default now() not null,
  reviewed_at timestamptz
);

alter table public.dispatch_verifications enable row level security;

create policy "Parties can view dispatch verification" on public.dispatch_verifications
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = dispatch_verifications.order_id
      and (o.retailer_id = auth.uid() or o.supplier_id = auth.uid())
    )
  );

create policy "Supplier can upload dispatch photos" on public.dispatch_verifications
  for insert with check (auth.uid() = supplier_id);

create policy "Retailer can review dispatch photos" on public.dispatch_verifications
  for update using (
    exists (
      select 1 from public.orders o
      where o.id = dispatch_verifications.order_id and o.retailer_id = auth.uid()
    )
  );

-- 8. DELIVERY CONFIRMATIONS & DAMAGE / DOA REPORTS
create type delivery_condition as enum (
  'all_healthy',
  'minor_issues',
  'dead_on_arrival',
  'damaged_or_missing'
);

create table public.delivery_confirmations (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade unique not null,
  retailer_id uuid references public.profiles(id) on delete cascade not null,
  condition delivery_condition not null,
  doa_count int default 0,
  issue_description text,
  evidence_photos text[] default array[]::text[],
  confirmed_at timestamptz default now() not null,
  admin_flagged boolean default false
);

alter table public.delivery_confirmations enable row level security;

create policy "Parties can view delivery confirmations" on public.delivery_confirmations
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = delivery_confirmations.order_id
      and (o.retailer_id = auth.uid() or o.supplier_id = auth.uid())
    )
  );

create policy "Retailer can confirm delivery" on public.delivery_confirmations
  for insert with check (auth.uid() = retailer_id);

-- 9. VERIFIED REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade unique not null,
  retailer_id uuid references public.profiles(id) on delete cascade not null,
  supplier_id uuid references public.profiles(id) on delete cascade not null,
  rating int check (rating >= 1 and rating <= 5) not null,
  comment text not null,
  photos text[] default array[]::text[],
  is_verified_purchase boolean default true,
  created_at timestamptz default now() not null
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by all" on public.reviews for select using (true);
create policy "Retailer can submit verified review" on public.reviews
  for insert with check (auth.uid() = retailer_id);

-- 10. SUPPORT TICKETS & DISPUTES
create type ticket_status as enum (
  'new',
  'under_review',
  'waiting_for_supplier',
  'waiting_for_retailer',
  'escalated',
  'resolved',
  'closed'
);

create table public.support_tickets (
  id uuid default uuid_generate_v4() primary key,
  ticket_number text unique not null,
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  category text not null,
  description text not null,
  evidence_urls text[] default array[]::text[],
  status ticket_status default 'new' not null,
  admin_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.support_tickets enable row level security;

create policy "Users can view own tickets" on public.support_tickets
  for select using (auth.uid() = user_id);

create policy "Users can create tickets" on public.support_tickets
  for insert with check (auth.uid() = user_id);

-- 11. IN-PLATFORM NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  link text,
  type text default 'system',
  is_read boolean default false,
  created_at timestamptz default now() not null
);

alter table public.notifications enable row level security;

create policy "Users can read own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- 12. ADMIN AUDIT LOGS
create table public.admin_audit_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  action_type text not null,
  target_id text,
  details jsonb,
  created_at timestamptz default now() not null
);

alter table public.admin_audit_logs enable row level security;

-- Admin policies (Admins have access to all tables)
create policy "Admins have full access to profiles" on public.profiles
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins have full access to orders" on public.orders
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins have full access to tickets" on public.support_tickets
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins have full access to logs" on public.admin_audit_logs
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
