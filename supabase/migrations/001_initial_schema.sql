-- =========================================================
-- 🧵 DESCUBRA ARTES - SUPABASE POSTGRESQL SCHEMA
-- Multi-city tourism & artisan discovery platform
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    state VARCHAR(60) NOT NULL DEFAULT 'São Paulo',
    uf VARCHAR(2) NOT NULL DEFAULT 'SP',
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    banner_image TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cities_slug ON public.cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_active ON public.cities(is_active);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(60) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 3. USER PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'ARTISAN', 'CUSTOMER')),
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    artisan_name VARCHAR(150) NOT NULL,
    bio TEXT NOT NULL,
    story TEXT NOT NULL,
    process_description TEXT,
    logo_url TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    website VARCHAR(255),
    address TEXT NOT NULL,
    neighborhood VARCHAR(100),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    opening_hours VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    plan_type VARCHAR(30) NOT NULL DEFAULT 'FREE' CHECK (plan_type IN ('FREE', 'PRO', 'PREMIUM')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    featured_until TIMESTAMP WITH TIME ZONE,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 0,
    views_count INT NOT NULL DEFAULT 0,
    whatsapp_clicks_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stores_city ON public.stores(city_id);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_featured ON public.stores(is_featured);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    dimensions VARCHAR(100),
    weight VARCHAR(100),
    materials TEXT[],
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    promo_price NUMERIC(10,2) CHECK (promo_price IS NULL OR promo_price < price),
    is_promo BOOLEAN NOT NULL DEFAULT false,
    promo_starts_at TIMESTAMP WITH TIME ZONE,
    promo_ends_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    featured_starts_at TIMESTAMP WITH TIME ZONE,
    featured_ends_at TIMESTAMP WITH TIME ZONE,
    is_available BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INT DEFAULT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    images TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT NOT NULL,
    views_count INT NOT NULL DEFAULT 0,
    whatsapp_clicks_count INT NOT NULL DEFAULT 0,
    favorites_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_store ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_city ON public.products(city_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_promo ON public.products(is_promo);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

-- 6. PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    original_price NUMERIC(10,2) NOT NULL,
    promo_price NUMERIC(10,2) NOT NULL,
    discount_percentage INT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. FEATURED ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.featured_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(40) NOT NULL CHECK (type IN ('PRODUCT_FEATURED', 'STORE_FEATURED', 'CITY_FEATURED')),
    target_id UUID NOT NULL,
    city_id UUID REFERENCES public.cities(id),
    user_id UUID REFERENCES public.profiles(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. WHATSAPP CLICKS ANALYTICS
CREATE TABLE IF NOT EXISTS public.whatsapp_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
    referrer TEXT,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_store ON public.whatsapp_clicks(store_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_date ON public.whatsapp_clicks(created_at);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name VARCHAR(120) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('store', 'product')),
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- CITIES & CATEGORIES: Public read
CREATE POLICY "Public can view active cities" ON public.cities FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);

-- STORES: Public read approved stores
CREATE POLICY "Public can view approved stores" ON public.stores FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Artisans can view and edit their own store" ON public.stores FOR ALL USING (auth.uid() = user_id);

-- PRODUCTS: Public read approved products
CREATE POLICY "Public can view approved products" ON public.products FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Artisans can manage their store products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores WHERE public.stores.id = public.products.store_id AND public.stores.user_id = auth.uid())
);

-- PROMOTIONS: Public read
CREATE POLICY "Public can view promotions" ON public.promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Artisans can manage promotions" ON public.promotions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores WHERE public.stores.id = public.promotions.store_id AND public.stores.user_id = auth.uid())
);

-- WHATSAPP CLICKS: Anyone can insert
CREATE POLICY "Allow public insert for whatsapp clicks" ON public.whatsapp_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Artisans can view their own whatsapp clicks" ON public.whatsapp_clicks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stores WHERE public.stores.id = public.whatsapp_clicks.store_id AND public.stores.user_id = auth.uid())
);

-- REVIEWS: Public read approved reviews
CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Authenticated users can submit review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- FAVORITES: User manage their own
CREATE POLICY "Users can manage favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
