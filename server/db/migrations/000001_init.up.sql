CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT, -- Nullable for OAuth users
    provider VARCHAR(50) DEFAULT 'local', -- 'local', 'google', 'apple'
    provider_id VARCHAR(255), -- Unique identifier from OAuth provider
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (provider, provider_id) -- Ensure uniqueness for provider + provider_id
);

CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);