-- Create rate_alerts table for storing user currency alert preferences
CREATE TABLE public.rate_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  target_rate DECIMAL(15,6) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rate_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rate alerts
CREATE POLICY "Users can view their own rate alerts" 
ON public.rate_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rate alerts" 
ON public.rate_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rate alerts" 
ON public.rate_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rate alerts" 
ON public.rate_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_rate_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rate_alerts_updated_at
BEFORE UPDATE ON public.rate_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_rate_alerts_updated_at();