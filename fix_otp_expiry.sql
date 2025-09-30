-- Fix OTP expiry security issue
-- This SQL should be run in your Supabase SQL editor

-- Update the auth configuration to set OTP expiry to 1 hour (3600 seconds)
-- Note: This is a simplified example - the exact table/column may vary
-- You may need to check the actual auth configuration table structure

-- Option 1: If there's a configuration table
UPDATE auth.config 
SET value = '3600' 
WHERE key = 'email_otp_expiry' 
OR key = 'otp_expiry';

-- Option 2: If using a different configuration approach
-- You might need to update the auth schema directly
-- This would typically be done through the Supabase dashboard

-- Verify the change
SELECT * FROM auth.config WHERE key LIKE '%otp%' OR key LIKE '%expiry%';

