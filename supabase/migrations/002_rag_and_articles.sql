-- ============================================================
-- HERWELL — RAG & STUDY ARTICLES SCHEMA MIGRATION
-- ============================================================

-- 1. Enable pgvector extension (if supported by Supabase instance)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Article Category Enum
DO $$ BEGIN
  CREATE TYPE article_category AS ENUM (
    'uti',
    'pcos_pcod',
    'menstrual_health',
    'nutrition',
    'prevention',
    'general_women_health',
    'boys_uti_education'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Create Target Experience Enum
DO $$ BEGIN
  CREATE TYPE target_experience_type AS ENUM ('women', 'boys', 'both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Create Health Articles & RAG Knowledge Table
CREATE TABLE IF NOT EXISTS health_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category article_category NOT NULL,
  topics TEXT[] NOT NULL DEFAULT '{}',
  target_experience target_experience_type NOT NULL DEFAULT 'both',
  tags TEXT[] NOT NULL DEFAULT '{}',
  read_time_minutes INTEGER NOT NULL DEFAULT 4,
  source TEXT NOT NULL DEFAULT 'HerWell Medical Education Board',
  source_url TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  embedding vector(1536), -- Standard OpenAI/embedding vector dimensions (optional)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for category, experience, and full-text search
CREATE INDEX IF NOT EXISTS idx_articles_category ON health_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_experience ON health_articles(target_experience);
CREATE INDEX IF NOT EXISTS idx_articles_active ON health_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_articles_topics ON health_articles USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON health_articles USING GIN(tags);

-- 5. RLS Policy for Articles
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active health articles"
  ON health_articles FOR SELECT
  USING (is_active = true);

-- 6. Helper Function for Semantic/Vector Matching (RAG)
CREATE OR REPLACE FUNCTION match_articles (
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5,
  filter_experience target_experience_type DEFAULT NULL,
  filter_category article_category DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  summary TEXT,
  content TEXT,
  category article_category,
  topics TEXT[],
  target_experience target_experience_type,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ha.id,
    ha.title,
    ha.summary,
    ha.content,
    ha.category,
    ha.topics,
    ha.target_experience,
    1 - (ha.embedding <=> query_embedding) AS similarity
  FROM health_articles ha
  WHERE ha.is_active = true
    AND (filter_experience IS NULL OR ha.target_experience = filter_experience OR ha.target_experience = 'both')
    AND (filter_category IS NULL OR ha.category = filter_category)
    AND (ha.embedding IS NOT NULL AND 1 - (ha.embedding <=> query_embedding) > match_threshold)
  ORDER BY ha.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================
-- SEED DATA: TRUSTED CLINICAL EDUCATION ARTICLES
-- ============================================================

INSERT INTO health_articles (title, slug, summary, content, category, topics, target_experience, tags, read_time_minutes, source, source_url)
VALUES
-- 1. UTI in Women
(
  'Understanding Urinary Tract Infections (UTIs) in Women',
  'understanding-utis-in-women',
  'A comprehensive guide to UTI causes, anatomy, early symptoms, and evidence-based self-care.',
  'A urinary tract infection (UTI) occurs when bacteria—most commonly Escherichia coli from the digestive tract—enter the urethra and multiply within the urinary system. 

### Why Women Experience More UTIs
Women are anatomically more susceptible to UTIs due to a shorter urethra located closer to the anus. This reduced distance facilitates bacterial migration into the bladder.

### Common Symptoms
• Dysuria: A distinct burning or stinging sensation during urination.
• Urinary Frequency: Feeling an urgent need to urinate frequently, often producing only small amounts.
• Cloudy or Pungent Urine: Changes in urine clarity and odor.
• Pelvic Discomfort: Pressure or mild cramping in the lower abdomen or suprapubic area.

### Evidence-Informed Prevention
1. Hydration: Consuming 2–2.5L of water daily promotes regular bladder flushing.
2. Post-Coital Voiding: Urinating shortly after sexual intercourse clears bacteria introduced to the urethra.
3. Hygiene Direction: Always wiping front-to-back prevents transfer of enteric bacteria.
4. Breathable Fabric: Wearing cotton undergarments and changing damp workout gear promptly.

### When to Seek Medical Evaluation
If symptoms persist beyond 24–48 hours, or if you develop fever, chills, flank pain, or hematuria (blood in urine), seek prompt medical evaluation to prevent upper urinary tract (kidney) infection.',
  'uti',
  ARRAY['burning', 'frequency', 'cloudy urine', 'pelvic pain', 'urination', 'uti'],
  'women',
  ARRAY['UTI', 'Urinary Health', 'Bladder', 'Hygiene'],
  5,
  'American Urological Association & WHO Guidelines',
  'https://www.urologyhealth.org'
),

-- 2. Boys UTI Education
(
  'Male UTI Awareness: Symptoms, Causes, and Prevention',
  'male-uti-awareness-and-prevention',
  'Key facts on urinary tract infections in boys and men, common risk factors, and myth-busting.',
  'While urinary tract infections are less prevalent in males, they are a significant medical condition that warrants clear understanding, prompt recognition, and professional care.

### How UTIs Occur in Males
A male UTI typically develops when bacteria ascend through the urethra into the bladder. Because men have a longer urethra, UTIs in younger men are often linked to specific triggers such as dehydration, sexual activity, catheterization, or structural differences. In older men, benign prostatic hyperplasia (BPH) can cause incomplete bladder emptying.

### Common Symptoms
• Burning sensation or pain during urination
• Increased urinary frequency and urgency
• Discomfort in the lower abdomen or pelvic region
• Cloudy or strong-smelling urine
• Hesitancy or difficulty starting urine flow

### Common Misconceptions
• Myth: UTIs are exclusively a female health problem. (Fact: Anyone with a urinary tract can contract an infection.)
• Myth: Drinking cranberry juice alone cures a male UTI. (Fact: A bacterial UTI typically requires professional medical diagnosis and prescribed antibiotic therapy.)
• Myth: UTIs are always sexually transmitted. (Fact: Most UTIs are caused by gastrointestinal bacteria entering the urethra.)

### Prevention Principles
• Maintain high daily fluid intake (2–3 liters of water).
• Never delay urination when experiencing the urge.
• Urinate following sexual activity.
• Keep the genital region clean and dry.',
  'boys_uti_education',
  ARRAY['burning', 'frequency', 'difficulty urinating', 'male uti', 'cloudy urine'],
  'boys',
  ARRAY['Male Health', 'UTI', 'Urinary Education', 'Prevention'],
  4,
  'National Institute of Diabetes and Digestive and Kidney Diseases',
  'https://www.niddk.nih.gov'
),

-- 3. PCOS / PCOD
(
  'PCOS & PCOD: Hormonal Pathways, Symptoms, and Lifestyle Management',
  'pcos-pcod-hormonal-pathways-and-management',
  'Understanding polycystic ovary syndrome, insulin sensitivity, and holistic lifestyle strategies.',
  'Polycystic Ovary Syndrome (PCOS) is one of the most common endocrine disorders among reproductive-age women, characterized by hyperandrogenism, ovulatory dysfunction, and polycystic ovarian morphology.

### Key Manifestations
• Menstrual Irregularity: Oligomenorrhea (infrequent periods) or amenorrhea (absent periods).
• Androgenic Signs: Hirsutism (excess facial/body hair), persistent cystic acne, and androgenic alopecia (hair thinning).
• Metabolic Factors: Insulin resistance, weight management challenges, and energy fluctuations.

### Evidence-Based Lifestyle Support
1. Balanced Glycemic Nutrition: Incorporating low-glycemic complex carbohydrates (lentils, quinoa, vegetables) alongside healthy fats and protein moderates insulin spikes.
2. Progressive Resistance Training: Strength training improves muscular insulin sensitivity independently of weight loss.
3. Sleep Consistency: Ensuring 7–9 hours of restorative sleep aids cortisol regulation and hormonal homeostasis.
4. Stress Reduction: Chronic stress elevates adrenal androgens; mindfulness, yoga, and walking assist neuroendocrine balance.

### Professional Diagnosis
PCOS diagnosis requires clinical evaluation by a gynecologist or endocrinologist utilizing the Rotterdam Criteria (meeting at least 2 of 3 criteria). Self-monitoring supports consultation discussions.',
  'pcos_pcod',
  ARRAY['irregular periods', 'acne', 'facial hair', 'weight gain', 'hair loss', 'pcos', 'pcod'],
  'women',
  ARRAY['PCOS', 'PCOD', 'Hormones', 'Insulin Resistance', 'Metabolism'],
  6,
  'Endocrine Society Clinical Practice Guidelines',
  'https://www.endocrine.org'
),

-- 4. Menstrual Cycle Phases
(
  'The Four Cycle Phases: Connecting Energy, Mood, and Physiology',
  'four-menstrual-cycle-phases',
  'Explore the physiological shifts across menstrual, follicular, ovulatory, and luteal phases.',
  'A typical menstrual cycle spans 21 to 35 days and encompasses four distinct hormonal phases driven by estrogen, progesterone, luteinizing hormone (LH), and follicle-stimulating hormone (FSH).

### 1. Menstrual Phase (Days 1–5)
• Hormonal Status: Estrogen and progesterone are at baseline.
• Physiology: Shedding of the uterine endometrium.
• Self-Care Focus: Prioritize rest, hydration, iron-rich meals (spinach, lentils, seeds), and gentle restorative movement.

### 2. Follicular Phase (Days 6–13)
• Hormonal Status: Estrogen rises as ovarian follicles mature.
• Physiology: Endometrial lining thickens; energy and cognitive clarity often increase.
• Self-Care Focus: Ideal for progressive workouts, creative projects, and nutrient-dense, fiber-rich foods.

### 3. Ovulatory Phase (Day ~14)
• Hormonal Status: LH surge triggers the release of a mature egg; estrogen peaks.
• Physiology: Brief fertile window (~24–48 hours).
• Self-Care Focus: Peak cardiovascular energy, social engagement, and antioxidant-rich hydration.

### 4. Luteal Phase (Days 15–28)
• Hormonal Status: Progesterone rises and dominates; drops if fertilization does not occur.
• Physiology: Core temperature increases slightly; metabolic rate rises.
• Self-Care Focus: Magnesium-rich foods (dark chocolate, pumpkin seeds), B-vitamins, and stress management to soothe PMS symptoms.',
  'menstrual_health',
  ARRAY['cramps', 'mood', 'energy', 'period', 'cycle', 'ovulation', 'follicular', 'luteal'],
  'women',
  ARRAY['Menstrual Cycle', 'Hormones', 'Ovulation', 'Wellness', 'Self-Care'],
  5,
  'American College of Obstetricians and Gynecologists (ACOG)',
  'https://www.acog.org'
),

-- 5. Nutrition & Hydration
(
  'Nutritional Strategies for Urinary and Hormonal Health',
  'nutritional-strategies-urinary-hormonal-health',
  'How targeted dietary habits, probiotics, and hydration protect bladder health and hormonal balance.',
  'Dietary choices directly influence systemic inflammation, urinary pH, and the microbiome of the gut and urinary tract.

### Hydration as Primary Defense
Regular water intake dilutes urinary solutes, reduces bladder irritation, and physically flushes bacteria before colonization. Aim for a baseline of 2.0 to 2.5 liters daily.

### Gut & Vaginal Microbiome Support
• Probiotic Foods: Fermented foods (unsweetened yogurt, kefir, kimchi, sauerkraut) provide beneficial *Lactobacillus* strains that help maintain an acidic, protective vaginal environment.
• Prebiotic Fibers: Onions, garlic, leeks, oats, and asparagus nourish beneficial gut bacteria.

### Anti-Inflammatory Micronutrients
• Polyphenols: Berries, green tea, and dark leafy greens protect cellular integrity.
• Zinc & Magnesium: Essential for reproductive hormone synthesis and muscle relaxation.
• Cranberry Proanthocyanidins (PACs): Unsweetened cranberry PACs (A-type) may inhibit bacterial adhesion to urothelial cells in some individuals.

### Foods to Limit During Active Irritation
Caffeine, alcohol, carbonated drinks, artificial sweeteners, and highly acidic citrus foods can irritate the urothelium during bladder discomfort.',
  'nutrition',
  ARRAY['hydration', 'diet', 'probiotics', 'cranberry', 'water', 'inflammation'],
  'both',
  ARRAY['Nutrition', 'Hydration', 'Microbiome', 'Bladder Health'],
  4,
  'Academy of Nutrition and Dietetics',
  'https://www.eatright.org'
),

-- 6. Prevention & Red Flags
(
  'Urinary Health Prevention & Clinical Red Flags',
  'urinary-health-prevention-clinical-red-flags',
  'Actionable preventative measures and clear guidance on when to seek urgent medical care.',
  'Preventative health habits significantly reduce the incidence of recurrent urinary tract infections and promote long-term pelvic wellness.

### Daily Protective Habits
1. Urinate without holding: Prolonged retention creates a stagnant environment favorable for bacterial proliferation.
2. Hydrate systematically: Distribute water intake evenly throughout waking hours.
3. Avoid irritating hygiene products: Avoid fragranced soaps, feminine washes, and harsh chemical bubble baths.
4. Wear breathable clothing: Synthetic fabrics trap heat and moisture, encouraging microbial overgrowth.

### 🚨 Critical Red Flags: When to Seek Immediate Medical Evaluation
• High fever (>38.5°C / 101.3°F) with or without chills
• Flank, back, or kidney pain (often unilateral)
• Nausea and recurrent vomiting
• Visible blood in urine (hematuria)
• Confusion or altered mental state (particularly in older individuals)
• Symptoms that do not improve after 48 hours of medical intervention',
  'prevention',
  ARRAY['fever', 'back pain', 'flank pain', 'blood in urine', 'red flags', 'emergency'],
  'both',
  ARRAY['Prevention', 'Red Flags', 'Emergency Care', 'Safety'],
  4,
  'Centers for Disease Control and Prevention (CDC)',
  'https://www.cdc.gov'
)
ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  summary = EXCLUDED.summary,
  topics = EXCLUDED.topics,
  tags = EXCLUDED.tags,
  updated_at = NOW();
