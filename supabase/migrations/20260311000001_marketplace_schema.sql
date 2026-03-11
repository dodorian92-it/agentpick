-- ============================================================
-- AgentPick Marketplace Schema
-- Migration: 20260311000001_marketplace_schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase Auth)
-- ============================================================
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  website     TEXT,
  type        TEXT NOT NULL DEFAULT 'buyer' CHECK (type IN ('buyer', 'creator', 'both')),
  stripe_customer_id TEXT UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Marketplace user profiles, extends Supabase Auth';

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'type', 'buyer')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- LISTINGS
-- ============================================================
CREATE TABLE public.listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT NOT NULL,
  short_desc      TEXT,
  type            TEXT NOT NULL CHECK (type IN ('agent', 'skill')),
  price_monthly   NUMERIC(10,2),
  price_once      NUMERIC(10,2),
  tags            TEXT[] DEFAULT '{}',
  thumbnail_url   TEXT,
  demo_url        TEXT,
  docs_url        TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  stripe_price_id_monthly TEXT,
  stripe_price_id_once    TEXT,
  install_count   INTEGER NOT NULL DEFAULT 0,
  avg_rating      NUMERIC(3,2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.listings IS 'AI agents and skills available in the marketplace';

-- Slug generation helper
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$;

-- ============================================================
-- LISTING VERSIONS (versioning/changelog)
-- ============================================================
CREATE TABLE public.listing_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  version     TEXT NOT NULL,
  changelog   TEXT,
  snapshot    JSONB NOT NULL,  -- full listing data at this version
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.listing_versions IS 'Version history for listings';

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

COMMENT ON TABLE public.reviews IS 'User reviews for listings (one per user per listing)';

-- Auto-update listing avg_rating
CREATE OR REPLACE FUNCTION public.update_listing_avg_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.listings
  SET avg_rating = (
    SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id)
  )
  WHERE id = COALESCE(NEW.listing_id, OLD.listing_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_listing_avg_rating();

-- ============================================================
-- PURCHASES
-- ============================================================
CREATE TABLE public.purchases (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id              UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  type                    TEXT NOT NULL CHECK (type IN ('subscription', 'once')),
  stripe_payment_intent_id TEXT,
  stripe_subscription_id  TEXT,
  status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'refunded', 'failed')),
  amount_paid             NUMERIC(10,2),
  currency                TEXT NOT NULL DEFAULT 'eur',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.purchases IS 'Purchase records for listings (one-time or subscription)';

-- ============================================================
-- SUBSCRIPTIONS (buyer platform plans)
-- ============================================================
CREATE TABLE public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT UNIQUE NOT NULL,
  stripe_customer_id      TEXT NOT NULL,
  plan                    TEXT NOT NULL DEFAULT 'buyer_monthly',
  status                  TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'unpaid')),
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.subscriptions IS 'Platform-level buyer subscriptions';

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_users_updated_at       BEFORE UPDATE ON public.users       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_listings_updated_at    BEFORE UPDATE ON public.listings    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_reviews_updated_at     BEFORE UPDATE ON public.reviews     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_purchases_updated_at   BEFORE UPDATE ON public.purchases   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_listings_creator_id  ON public.listings(creator_id);
CREATE INDEX idx_listings_status      ON public.listings(status);
CREATE INDEX idx_listings_type        ON public.listings(type);
CREATE INDEX idx_listings_tags        ON public.listings USING GIN(tags);
CREATE INDEX idx_reviews_listing_id   ON public.reviews(listing_id);
CREATE INDEX idx_reviews_user_id      ON public.reviews(user_id);
CREATE INDEX idx_purchases_user_id    ON public.purchases(user_id);
CREATE INDEX idx_purchases_listing_id ON public.purchases(listing_id);
CREATE INDEX idx_purchases_status     ON public.purchases(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- USERS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view any profile"         ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"       ON public.users FOR UPDATE USING (auth.uid() = id);

-- LISTINGS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published listings" ON public.listings FOR SELECT USING (status = 'published' OR auth.uid() = creator_id);
CREATE POLICY "Creators can insert listings"       ON public.listings FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own listings"   ON public.listings FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete own listings"   ON public.listings FOR DELETE USING (auth.uid() = creator_id);

-- LISTING VERSIONS
ALTER TABLE public.listing_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view versions of published listings" ON public.listing_versions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.status = 'published' OR l.creator_id = auth.uid())));
CREATE POLICY "Creators can insert versions"      ON public.listing_versions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.creator_id = auth.uid()));

-- REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews"            ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers who purchased can review"    ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.purchases p
    WHERE p.user_id = auth.uid() AND p.listing_id = reviews.listing_id AND p.status = 'active'
  ));
CREATE POLICY "Users can update own reviews"       ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews"       ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- PURCHASES
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases"       ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage purchases"  ON public.purchases FOR ALL USING (auth.role() = 'service_role');

-- SUBSCRIPTIONS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions"   ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions FOR ALL USING (auth.role() = 'service_role');
