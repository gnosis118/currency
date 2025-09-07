-- Fix OTP expiry security issue
-- Set OTP expiry to 1 hour (3600 seconds) for better security

-- This migration addresses the security warning about OTP expiry exceeding 1 hour
-- The exact implementation depends on your Supabase version and configuration

-- Note: OTP expiry is typically configured through the Supabase dashboard
-- or via the Supabase API, not through SQL migrations
-- This file serves as documentation of the required change

-- If you have access to modify auth configuration via SQL:
-- UPDATE auth.config SET value = '3600' WHERE key = 'email_otp_expiry';

-- Recommended OTP expiry values:
-- 3600 seconds (1 hour) - Standard recommendation
-- 1800 seconds (30 minutes) - More secure  
-- 900 seconds (15 minutes) - Most secure

-- To apply this fix:
-- 1. Go to Supabase Dashboard → Authentication → Settings
-- 2. Find Email OTP settings
-- 3. Set expiry to 3600 seconds or less
-- 4. Save the configuration
