-- ═══════════════════════════════════════════════════════════════════════════════
-- NEURAL BRIDGE - DATABASE SCHEMA
-- Required tables for 100% real data endpoints
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. CRYSTALS TABLE (Main knowledge storage)
CREATE TABLE IF NOT EXISTS crystals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    author TEXT,
    title TEXT,
    domain TEXT DEFAULT 'General',
    intent JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crystals_user_id ON crystals(user_id);
CREATE INDEX idx_crystals_created_at ON crystals(created_at DESC);
CREATE INDEX idx_crystals_domain ON crystals(domain);

-- 2. ANALYTICS_EVENTS TABLE (For tracking and fidelity)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_data JSONB,
    user_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);

-- 3. PROCESSING_QUEUE TABLE (For active jobs tracking)
CREATE TABLE IF NOT EXISTS processing_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    job_type TEXT NOT NULL,
    job_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_processing_queue_status ON processing_queue(status);
CREATE INDEX idx_processing_queue_created_at ON processing_queue(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA (Optional - for testing)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Insert sample crystals
INSERT INTO crystals (context_id, user_id, title, domain, intent, metadata) VALUES
('crystal_001', 'user_demo', 'Neural Architecture Patterns', 'AI', 
 '{"primary": "Understanding neural network design patterns"}',
 '{"tier": "gold", "verified": true}'),
 
('crystal_002', 'user_demo', 'React Performance Optimization', 'Development',
 '{"primary": "Best practices for React app performance"}',
 '{"tier": "silver", "verified": true}'),
 
('crystal_003', 'user_demo', 'Database Indexing Strategies', 'Database',
 '{"primary": "Effective database indexing techniques"}',
 '{"tier": "flash", "verified": false}'),
 
('crystal_004', 'user_demo', 'TypeScript Advanced Types', 'Development',
 '{"primary": "Advanced TypeScript type system features"}',
 '{"tier": "gold", "verified": true}'),
 
('crystal_005', 'user_demo', 'UX Design Principles', 'Design',
 '{"primary": "Core principles of user experience design"}',
 '{"tier": "silver", "verified": true}')
ON CONFLICT (context_id) DO NOTHING;

-- Insert sample analytics events
INSERT INTO analytics_events (event_name, event_data, user_id) VALUES
('verification_complete', '{"score": 0.95, "fidelity": 0.95}', 'user_demo'),
('verification_complete', '{"score": 0.92, "fidelity": 0.92}', 'user_demo'),
('verification_complete', '{"score": 0.97, "fidelity": 0.97}', 'user_demo'),
('verification_complete', '{"score": 0.89, "fidelity": 0.89}', 'user_demo'),
('verification_complete', '{"score": 0.93, "fidelity": 0.93}', 'user_demo'),
('crystallization_complete', '{"duration_ms": 1200}', 'user_demo'),
('crystallization_complete', '{"duration_ms": 980}', 'user_demo');

-- Insert sample processing jobs
INSERT INTO processing_queue (status, job_type, job_data) VALUES
('processing', 'crystallization', '{"crystal_id": "pending_001"}'),
('processing', 'verification', '{"crystal_id": "pending_002"}'),
('completed', 'crystallization', '{"crystal_id": "crystal_003"}');

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Check crystals count
-- SELECT COUNT(*) as total_crystals FROM crystals;

-- Check recent crystals
-- SELECT context_id, title, domain, created_at 
-- FROM crystals 
-- ORDER BY created_at DESC 
-- LIMIT 5;

-- Check fidelity score
-- SELECT AVG((event_data->>'score')::float) * 100 as avg_fidelity
-- FROM analytics_events
-- WHERE event_name = 'verification_complete'
-- AND created_at > NOW() - INTERVAL '7 days';

-- Check active jobs
-- SELECT COUNT(*) as active_jobs 
-- FROM processing_queue 
-- WHERE status = 'processing';
