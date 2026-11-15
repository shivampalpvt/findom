# Project Guidelines: Supabase Full-Stack Architecture

## Overview
This repository contains a modern web application powered by **Supabase** (Database, Auth, Storage, Edge Functions) and a component-driven frontend styled with Tailwind CSS and Aura UI components.

## Architecture Standards

### 1. Supabase Backend & Database
- **Row Level Security (RLS)**: Always enable RLS on every Postgres table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
- **Policies**: Write explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies for authenticated and anon users.
- **Client Configuration**: Use `@supabase/supabase-js` or `@supabase/ssr` (for Next.js) with environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Database Functions & Triggers**: Use database triggers for profile creation on `auth.users` signup.

### 2. Frontend & Aura Components
- **Component Design**: Build modular, reusable components adhering to accessibility and responsive design standards.
- **Design Tokens**: Standardize colors, typography, and spacing with Tailwind CSS.
- **Aura MCP Integration**: Utilize Aura catalog search and scaffolding for layout, icons, and UI primitives.
