-- Migration: 001_initial_schema
-- Description: Create initial database schema for fetisch-dating-platform
-- Date: 2025-01-24

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "earthdistance" CASCADE;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Basic (anonymous)
  pseudonym VARCHAR(50) NOT NULL UNIQUE,
  age_range VARCHAR(20) NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lon DECIMAL(11, 8),
  search_radius_km INTEGER DEFAULT 50,
  
  -- Authentication
  email_hash VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP,
  
  -- Privacy
  privacy_level INTEGER DEFAULT 3 CHECK (privacy_level BETWEEN 1 AND 5),
  reveal_photo_after_match BOOLEAN DEFAULT TRUE,
  reveal_sensitive_tags_after_match BOOLEAN DEFAULT TRUE,
  
  -- Constraints
  CONSTRAINT valid_age_range CHECK (age_range IN (
    '18-25', '25-30', '30-35', '35-40', '40-45', '45-50', '50-55', '55-60', '60+'
  ))
);

-- User photos table
CREATE TABLE user_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(20) NOT NULL DEFAULT 'object',
  order_index INTEGER DEFAULT 0,
  
  -- Object recognition results
  detected_objects JSONB,
  suggested_tags JSONB,
  user_confirmed_tags TEXT[],
  
  is_primary BOOLEAN DEFAULT FALSE,
  is_nsfw BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_photo_type CHECK (photo_type IN ('object', 'face', 'body'))
);

-- User tags table
CREATE TABLE user_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tag_id VARCHAR(100) NOT NULL,
  tag_type VARCHAR(20) NOT NULL,
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  role VARCHAR(20),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, tag_id),
  CONSTRAINT valid_tag_type CHECK (tag_type IN ('must', 'nice', 'interest', 'limit')),
  CONSTRAINT valid_role CHECK (role IN ('active', 'passive', 'both', 'viewer', NULL))
);

-- User personality table
CREATE TABLE user_personality (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Big 5 Personality (0-100 scale)
  openness INTEGER CHECK (openness BETWEEN 0 AND 100),
  conscientiousness INTEGER CHECK (conscientiousness BETWEEN 0 AND 100),
  extraversion INTEGER CHECK (extraversion BETWEEN 0 AND 100),
  agreeableness INTEGER CHECK (agreeableness BETWEEN 0 AND 100),
  neuroticism INTEGER CHECK (neuroticism BETWEEN 0 AND 100),
  
  -- Generated Character
  archetype_id VARCHAR(100),
  archetype_name VARCHAR(100),
  archetype_description TEXT,
  
  -- Lifestyle, interests, values, aesthetics (JSONB for flexibility)
  lifestyle JSONB,
  interests JSONB,
  values JSONB,
  aesthetics JSONB,
  communication JSONB,
  availability JSONB,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Seeking
  seeking_gender TEXT[],
  seeking_age_min INTEGER,
  seeking_age_max INTEGER,
  seeking_role TEXT[],
  seeking_intent TEXT[],
  
  -- Filters
  must_have_tags TEXT[],
  nice_to_have_tags TEXT[],
  deal_breaker_tags TEXT[],
  
  -- Personality preferences
  prefer_extraversion_min INTEGER,
  prefer_extraversion_max INTEGER,
  prefer_openness_min INTEGER,
  prefer_openness_max INTEGER,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Match scoring
  overall_score DECIMAL(5, 2),
  fetish_score DECIMAL(5, 2),
  personality_score DECIMAL(5, 2),
  lifestyle_score DECIMAL(5, 2),
  values_score DECIMAL(5, 2),
  aesthetics_score DECIMAL(5, 2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  user1_interested BOOLEAN DEFAULT FALSE,
  user2_interested BOOLEAN DEFAULT FALSE,
  
  -- Reveal stages
  user1_revealed_photo BOOLEAN DEFAULT FALSE,
  user2_revealed_photo BOOLEAN DEFAULT FALSE,
  user1_revealed_sensitive BOOLEAN DEFAULT FALSE,
  user2_revealed_sensitive BOOLEAN DEFAULT FALSE,
  
  matched_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected', 'expired'))
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message content
  message_type VARCHAR(20) DEFAULT 'text',
  content_encrypted TEXT,
  template_id VARCHAR(100),
  
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'template', 'reveal'))
);

-- Indexes for performance
CREATE INDEX idx_users_location ON users USING GIST (ll_to_earth(location_lat, location_lon));
CREATE INDEX idx_users_pseudonym ON users(pseudonym);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_user_photos_user ON user_photos(user_id);
CREATE INDEX idx_user_photos_type ON user_photos(photo_type);

CREATE INDEX idx_user_tags_user ON user_tags(user_id);
CREATE INDEX idx_user_tags_tag_id ON user_tags(tag_id);
CREATE INDEX idx_user_tags_type ON user_tags(tag_type);
CREATE INDEX idx_user_tags_composite ON user_tags(user_id, tag_id, tag_type);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_score ON matches(overall_score DESC);

CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_timestamp ON messages(sent_at DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personality_updated_at BEFORE UPDATE ON user_personality
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'Core user accounts with anonymous profiles';
COMMENT ON TABLE user_photos IS 'Object-based profile photos with AI recognition';
COMMENT ON TABLE user_tags IS 'Fetisch tags selected by users (5000+ taxonomy)';
COMMENT ON TABLE user_personality IS 'AI-generated character profiles';
COMMENT ON TABLE matches IS 'Multi-dimensional compatibility matches';
COMMENT ON TABLE messages IS 'Encrypted chat messages between matches';
