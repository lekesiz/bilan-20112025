-- ============================================
-- Bilan de Compétences Database Schema
-- ============================================
-- This schema creates all necessary tables for the assessment system
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Extends auth.users with additional profile information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'consultant', 'client')),
  avatar_url TEXT,
  phone TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ASSESSMENTS TABLE
-- ============================================
-- Stores bilan de compétences assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  current_step INTEGER DEFAULT 1,
  data JSONB DEFAULT '{}'::JSONB,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- 3. ASSESSMENT RESPONSES TABLE
-- ============================================
-- Stores individual responses to assessment questions
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  question_id TEXT NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, question_id)
);

-- ============================================
-- 4. REPORTS TABLE
-- ============================================
-- Stores generated reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  generated_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  pdf_url TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. ACTIVITY LOGS TABLE
-- ============================================
-- Tracks user activity and system events
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_assessments_client ON assessments(client_id);
CREATE INDEX idx_assessments_consultant ON assessments(consultant_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessment_responses_assessment ON assessment_responses(assessment_id);
CREATE INDEX idx_reports_assessment ON reports(assessment_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ASSESSMENTS POLICIES
CREATE POLICY "Users can view their own assessments"
  ON assessments FOR SELECT
  USING (
    client_id = auth.uid() OR
    consultant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can create assessments"
  ON assessments FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own assessments"
  ON assessments FOR UPDATE
  USING (
    client_id = auth.uid() OR
    consultant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ASSESSMENT RESPONSES POLICIES
CREATE POLICY "Users can view responses for their assessments"
  ON assessment_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE id = assessment_id AND (
        client_id = auth.uid() OR
        consultant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Users can manage responses for their assessments"
  ON assessment_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE id = assessment_id AND client_id = auth.uid()
    )
  );

-- REPORTS POLICIES
CREATE POLICY "Users can view reports for their assessments"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE id = assessment_id AND (
        client_id = auth.uid() OR
        consultant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Consultants and admins can create reports"
  ON reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'consultant')
    )
  );

-- ACTIVITY LOGS POLICIES
CREATE POLICY "Users can view their own activity"
  ON activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can create activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_responses_updated_at BEFORE UPDATE ON assessment_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to insert sample admin user
-- INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'admin@bilancompetence.ai');
-- INSERT INTO profiles (id, email, full_name, role) VALUES ('00000000-0000-0000-0000-000000000001', 'admin@bilancompetence.ai', 'Admin User', 'admin');
