-- ============================================================
-- AgentPick Helper Functions
-- Migration: 20260311000002_helper_functions
-- ============================================================

-- RPC: increment install count (called from webhook)
CREATE OR REPLACE FUNCTION public.increment_install_count(listing_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.listings SET install_count = install_count + 1 WHERE id = listing_id;
END;
$$;
