-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program TEXT NOT NULL,
  cohort TEXT,
  has_internship BOOLEAN DEFAULT FALSE,
  payment_id TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  payment_amount INTEGER NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations(email);

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS registrations_payment_id_idx ON registrations(payment_id);

-- Add RLS policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Only allow admins to see all registrations
CREATE POLICY "Admins can see all registrations" 
  ON registrations 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Users can see their own registrations
CREATE POLICY "Users can see their own registrations" 
  ON registrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only allow server-side inserts (from webhooks, etc.)
CREATE POLICY "Server can insert registrations" 
  ON registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
