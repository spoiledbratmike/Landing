-- Database schema for Lightworker Welcome page forms
-- Run this on your Neon PostgreSQL database

-- Self-check form submissions
CREATE TABLE IF NOT EXISTS self_check_submissions (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  marketing_consent BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_self_check_email UNIQUE (email)
);

-- Free call request submissions
CREATE TABLE IF NOT EXISTS call_requests (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  help_with TEXT,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_call_request_email UNIQUE (email)
);

-- Founding members submissions
CREATE TABLE IF NOT EXISTS founding_members (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address_1 VARCHAR(255) NOT NULL,
  address_2 VARCHAR(255),
  town VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  letter_topics TEXT,
  reserve_confirm BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_founding_member_email UNIQUE (email)
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_self_check_email ON self_check_submissions(email);
CREATE INDEX IF NOT EXISTS idx_call_requests_email ON call_requests(email);
CREATE INDEX IF NOT EXISTS idx_founding_members_email ON founding_members(email);
CREATE INDEX IF NOT EXISTS idx_self_check_submitted_at ON self_check_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_call_requests_submitted_at ON call_requests(submitted_at);
CREATE INDEX IF NOT EXISTS idx_founding_members_submitted_at ON founding_members(submitted_at);
