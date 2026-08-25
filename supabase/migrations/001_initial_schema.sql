-- ============================================================
-- HERWELL DATABASE SCHEMA
-- Migration: 001_initial_schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id      TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'woman' CHECK (role IN ('woman', 'man')),
  age_group     TEXT CHECK (age_group IN ('under_18','18_24','25_34','35_44','45_54','55_plus')),
  lifestyle     TEXT CHECK (lifestyle IN ('sedentary','lightly_active','moderately_active','very_active')),
  avatar_url    TEXT,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HEALTH PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS health_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_length         INTEGER, -- days
  period_duration      INTEGER, -- days
  last_period_start    DATE,
  is_cycle_regular     BOOLEAN,
  conditions           TEXT[] NOT NULL DEFAULT '{}',
  dietary_type         TEXT CHECK (dietary_type IN ('vegetarian','vegan','non_vegetarian','pescatarian','other')),
  dietary_restrictions TEXT[] NOT NULL DEFAULT '{}',
  dietary_goals        TEXT[] NOT NULL DEFAULT '{}',
  sleep_hours          NUMERIC(3,1),
  activity_level       TEXT CHECK (activity_level IN ('sedentary','lightly_active','moderately_active','very_active')),
  stress_level         INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  hydration_goal_ml    INTEGER NOT NULL DEFAULT 2000,
  health_concerns      TEXT[] NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- SYMPTOM LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS symptom_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symptom_name   TEXT NOT NULL,
  category       TEXT NOT NULL CHECK (category IN ('menstrual','uti','pcos_pcod','digestive','emotional','physical','other')),
  severity       TEXT NOT NULL CHECK (severity IN ('mild','moderate','severe')),
  duration_hours NUMERIC(6,1),
  notes          TEXT,
  logged_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_symptom_logs_user_id ON symptom_logs(user_id);
CREATE INDEX idx_symptom_logs_logged_at ON symptom_logs(logged_at DESC);
CREATE INDEX idx_symptom_logs_category ON symptom_logs(category);

-- ============================================================
-- CYCLE LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS cycle_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_start   DATE NOT NULL,
  period_end     DATE,
  flow           TEXT CHECK (flow IN ('light','moderate','heavy','spotting')),
  cramps         TEXT CHECK (cramps IN ('mild','moderate','severe')),
  mood           TEXT CHECK (mood IN ('very_low','low','neutral','good','great')),
  energy         TEXT CHECK (energy IN ('very_low','low','moderate','high','very_high')),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cycle_logs_user_id ON cycle_logs(user_id);
CREATE INDEX idx_cycle_logs_period_start ON cycle_logs(period_start DESC);

-- ============================================================
-- WATER LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS water_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml  INTEGER NOT NULL CHECK (amount_ml > 0),
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_water_logs_user_id ON water_logs(user_id);
CREATE INDEX idx_water_logs_logged_at ON water_logs(logged_at DESC);

-- ============================================================
-- WATER REMINDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS water_reminders (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  time         TIME NOT NULL,
  enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  days_of_week INTEGER[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MEAL REMINDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS meal_reminders (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast','morning_snack','lunch','evening_snack','dinner')),
  time      TIME NOT NULL,
  enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, meal_type)
);

-- ============================================================
-- MEALS
-- ============================================================

CREATE TABLE IF NOT EXISTS meals (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type  TEXT NOT NULL CHECK (meal_type IN ('breakfast','morning_snack','lunch','evening_snack','dinner')),
  items      TEXT[] NOT NULL DEFAULT '{}',
  notes      TEXT,
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_logged_at ON meals(logged_at DESC);

-- ============================================================
-- NUTRITION PREFERENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS nutrition_preferences (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_type         TEXT CHECK (dietary_type IN ('vegetarian','vegan','non_vegetarian','pescatarian','other')),
  dietary_restrictions TEXT[] NOT NULL DEFAULT '{}',
  dietary_goals        TEXT[] NOT NULL DEFAULT '{}',
  calorie_target       INTEGER,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- AI CONVERSATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_type  TEXT NOT NULL CHECK (user_type IN ('woman','man')),
  title      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);

-- ============================================================
-- AI MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON ai_messages(created_at);

-- ============================================================
-- INSIGHTS
-- ============================================================

CREATE TABLE IF NOT EXISTS insights (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('cycle','symptom','hydration','nutrition','lifestyle')),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  data         JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_insights_generated_at ON insights(generated_at DESC);

-- ============================================================
-- LOVED ONES
-- ============================================================

CREATE TABLE IF NOT EXISTS loved_ones (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  partner_user_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  partner_name     TEXT NOT NULL,
  partner_email    TEXT NOT NULL,
  relationship     TEXT NOT NULL CHECK (relationship IN ('partner','parent','sibling','other')),
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','revoked')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loved_ones_user_id ON loved_ones(user_id);

-- ============================================================
-- PARTNER REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requester_name   TEXT NOT NULL,
  requester_email  TEXT NOT NULL,
  target_email     TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','revoked')),
  message          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partner_requests_target_email ON partner_requests(target_email);
CREATE INDEX idx_partner_requests_requester_id ON partner_requests(requester_id);

-- ============================================================
-- PARTNER CONSENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_consents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  woman_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  man_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(woman_id, man_id)
);

-- ============================================================
-- SHARED DATA PERMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS shared_data_permissions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consent_id UUID NOT NULL REFERENCES partner_consents(id) ON DELETE CASCADE,
  category   TEXT NOT NULL CHECK (category IN (
    'cycle_status','period_dates','uti_information',
    'pcos_pcod_details','nutrition_plan','hydration',
    'selected_symptoms','selected_insights'
  )),
  allowed    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(consent_id, category)
);

-- ============================================================
-- OTP VERIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS otp_verifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  purpose       TEXT NOT NULL DEFAULT 'partner_access',
  hashed_otp    TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  used_at       TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_verifications_user_id ON otp_verifications(user_id);
CREATE INDEX idx_otp_verifications_expires_at ON otp_verifications(expires_at);

-- ============================================================
-- TRIGGERS — Auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON health_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cycle_logs_updated_at BEFORE UPDATE ON cycle_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loved_ones_updated_at BEFORE UPDATE ON loved_ones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_requests_updated_at BEFORE UPDATE ON partner_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE loved_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_data_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES — profiles
-- ============================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- ============================================================
-- RLS POLICIES — health_profiles
-- ============================================================

CREATE POLICY "Users can view own health profile"
  ON health_profiles FOR SELECT
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can manage own health profile"
  ON health_profiles FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — symptom_logs
-- ============================================================

CREATE POLICY "Users can manage own symptom logs"
  ON symptom_logs FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — cycle_logs
-- ============================================================

CREATE POLICY "Users can manage own cycle logs"
  ON cycle_logs FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — water_logs
-- ============================================================

CREATE POLICY "Users can manage own water logs"
  ON water_logs FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — water_reminders
-- ============================================================

CREATE POLICY "Users can manage own water reminders"
  ON water_reminders FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — meal_reminders
-- ============================================================

CREATE POLICY "Users can manage own meal reminders"
  ON meal_reminders FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — meals
-- ============================================================

CREATE POLICY "Users can manage own meals"
  ON meals FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — nutrition_preferences
-- ============================================================

CREATE POLICY "Users can manage own nutrition preferences"
  ON nutrition_preferences FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — ai_conversations
-- ============================================================

CREATE POLICY "Users can manage own ai conversations"
  ON ai_conversations FOR ALL
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — ai_messages
-- ============================================================

CREATE POLICY "Users can view messages in own conversations"
  ON ai_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM ai_conversations
      WHERE user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON ai_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM ai_conversations
      WHERE user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    )
  );

-- ============================================================
-- RLS POLICIES — insights
-- ============================================================

CREATE POLICY "Users can view own insights"
  ON insights FOR SELECT
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Service can insert insights"
  ON insights FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — loved_ones
-- ============================================================

CREATE POLICY "Users can view own loved ones"
  ON loved_ones FOR SELECT
  USING (
    user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    OR
    partner_user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can manage own loved ones list"
  ON loved_ones FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own loved ones"
  ON loved_ones FOR UPDATE
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- RLS POLICIES — partner_requests
-- ============================================================

CREATE POLICY "Requesters can see own requests"
  ON partner_requests FOR SELECT
  USING (
    requester_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    OR
    target_email = (SELECT email FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can create partner requests"
  ON partner_requests FOR INSERT
  WITH CHECK (requester_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Target or requester can update request status"
  ON partner_requests FOR UPDATE
  USING (
    requester_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    OR
    target_email = (SELECT email FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- ============================================================
-- RLS POLICIES — partner_consents
-- ============================================================

CREATE POLICY "Parties can view own consents"
  ON partner_consents FOR SELECT
  USING (
    woman_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    OR
    man_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- ============================================================
-- RLS POLICIES — shared_data_permissions
-- ============================================================

CREATE POLICY "Woman can view and manage own permissions"
  ON shared_data_permissions FOR ALL
  USING (
    consent_id IN (
      SELECT id FROM partner_consents
      WHERE woman_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Man can view permitted categories"
  ON shared_data_permissions FOR SELECT
  USING (
    consent_id IN (
      SELECT id FROM partner_consents
      WHERE man_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub')
        AND active = TRUE
    )
    AND allowed = TRUE
  );

-- ============================================================
-- RLS POLICIES — otp_verifications
-- ============================================================

CREATE POLICY "Users can view own OTP records"
  ON otp_verifications FOR SELECT
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = auth.jwt() ->> 'sub'));
