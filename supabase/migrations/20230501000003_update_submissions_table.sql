-- Add missing columns to submissions table
ALTER TABLE IF EXISTS submissions 
ADD COLUMN IF NOT EXISTS radar_scores JSONB,
ADD COLUMN IF NOT EXISTS skill_breakdown JSONB,
ADD COLUMN IF NOT EXISTS recommended_certifications TEXT[],
ADD COLUMN IF NOT EXISTS career_path_suggestion TEXT;
