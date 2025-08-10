-- Fix security warning: Set search_path for the generate_receipt_number function
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.receipt_number := 'LLM-' || EXTRACT(YEAR FROM NEW.receipt_date) || '-' || LPAD(nextval('receipt_sequence')::text, 6, '0');
  RETURN NEW;
END;
$$;