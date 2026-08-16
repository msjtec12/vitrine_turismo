-- =========================================================
-- 🧵 DESCUBRA ARTES - MIGRATION 002: MULTI-ACCOUNT & ONBOARDING
-- Full architecture for Multi-Stores, Self-Service & Admin-Assisted
-- =========================================================

-- 1. ARTISANS TABLE
CREATE TABLE IF NOT EXISTS public.artisans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    document VARCHAR(30), -- CPF or CNPJ
    bio TEXT,
    avatar_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    founding_member BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    onboarding_source VARCHAR(30) NOT NULL DEFAULT 'SELF_SERVICE' CHECK (onboarding_source IN ('SELF_SERVICE', 'ADMIN_ASSISTED', 'PARTNER')),
    invitation_token VARCHAR(128) UNIQUE,
    invitation_status VARCHAR(30) NOT NULL DEFAULT 'NOT_SENT' CHECK (invitation_status IN ('NOT_SENT', 'SENT', 'ACCEPTED', 'EXPIRED')),
    invited_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_artisans_user_id ON public.artisans(user_id);
CREATE INDEX IF NOT EXISTS idx_artisans_status ON public.artisans(status);
CREATE INDEX IF NOT EXISTS idx_artisans_source ON public.artisans(onboarding_source);
CREATE INDEX IF NOT EXISTS idx_artisans_invitation_token ON public.artisans(invitation_token);
CREATE INDEX IF NOT EXISTS idx_artisans_founding ON public.artisans(founding_member);

-- 2. ALTER STORES TABLE TO LINK WITH ARTISANS
ALTER TABLE public.stores
    ADD COLUMN IF NOT EXISTS artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS founding_member BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_stores_artisan ON public.stores(artisan_id);

-- 3. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'STORE_APPROVED',
        'STORE_REJECTED',
        'STORE_CHANGE_REQUESTED',
        'PRODUCT_APPROVED',
        'PRODUCT_REJECTED',
        'INVITATION',
        'FEATURED_APPROVED'
    )),
    read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.audit_logs(entity_type, entity_id);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) FOR NEW TABLES
-- =========================================================

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ARTISANS POLICIES:
-- Public can view approved artisans
CREATE POLICY "Public can view approved artisans" ON public.artisans
    FOR SELECT USING (status = 'APPROVED');

-- Artisans can view & update their own record
CREATE POLICY "Artisans can view their own profile" ON public.artisans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Artisans can update their own profile" ON public.artisans
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow new user registration
CREATE POLICY "Users can create artisan record on registration" ON public.artisans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS POLICIES:
CREATE POLICY "Users can read own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- AUDIT LOGS: Only Admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'ADMIN')
    );
