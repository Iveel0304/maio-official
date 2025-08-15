-- Database fixes for Maio Official
-- Run this in your Supabase SQL Editor to fix the issues

-- 1. Add missing rankings column to results table
ALTER TABLE results ADD COLUMN IF NOT EXISTS rankings JSONB DEFAULT '[]'::jsonb;

-- 1.1. Add missing columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin';
-- Add summary column as JSONB for multilingual support
ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary JSONB DEFAULT '{"en":"","mn":""}'::jsonb;

-- 2. Add missing tier constraint to sponsors table
-- First add the tier column if it doesn't exist
ALTER TABLE sponsors ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'supporter';

-- Add constraint for tier values
DO $$ 
BEGIN 
    -- Drop constraint if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'sponsors' AND constraint_name = 'sponsors_tier_check') THEN
        ALTER TABLE sponsors DROP CONSTRAINT sponsors_tier_check;
    END IF;
    
    -- Add new constraint
    ALTER TABLE sponsors ADD CONSTRAINT sponsors_tier_check 
        CHECK (tier IN ('organizer', 'main', 'sponsor', 'supporter'));
END $$;

-- 3. Update indexes for better performance
CREATE INDEX IF NOT EXISTS idx_results_rankings ON results USING GIN (rankings);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);

-- 4. Fix location field in events table (should be JSONB for multilingual support)
ALTER TABLE events ALTER COLUMN location TYPE JSONB USING 
    CASE 
        WHEN location IS NULL THEN '{"en":"","mn":""}'::jsonb
        ELSE jsonb_build_object('en', location, 'mn', location)
    END;

-- 5. Add missing participants column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS participants INTEGER DEFAULT 0;

-- 6. Update RLS policies to allow more specific access if needed
-- (These are already quite permissive, but we can make them more granular later)

-- Success message
SELECT 'Database fixes applied successfully!' AS message;
