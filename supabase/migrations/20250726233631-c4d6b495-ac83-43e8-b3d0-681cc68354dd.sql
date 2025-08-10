-- Fix security warnings: Set search_path for existing functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_donor_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update or insert donor record
  INSERT INTO public.donors (email, first_name, last_name, phone, address, total_donated, donation_count, first_donation_date, last_donation_date, user_id)
  VALUES (
    NEW.donor_email,
    SPLIT_PART(NEW.donor_name, ' ', 1),
    SPLIT_PART(NEW.donor_name, ' ', 2),
    NEW.donor_phone,
    NEW.donor_address,
    NEW.amount,
    1,
    NEW.created_at,
    NEW.created_at,
    NEW.user_id
  )
  ON CONFLICT (email) DO UPDATE SET
    total_donated = donors.total_donated + NEW.amount,
    donation_count = donors.donation_count + 1,
    last_donation_date = NEW.created_at,
    phone = COALESCE(NEW.donor_phone, donors.phone),
    address = COALESCE(NEW.donor_address, donors.address),
    user_id = COALESCE(NEW.user_id, donors.user_id);
    
  RETURN NEW;
END;
$$;