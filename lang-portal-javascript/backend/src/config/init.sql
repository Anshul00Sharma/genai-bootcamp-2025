-- Create tables for language learning portal

-- Words table to store vocabulary
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    german VARCHAR(255) NOT NULL,
    phonetic VARCHAR(255) NOT NULL,
    english VARCHAR(255) NOT NULL,
    parts JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Groups table for thematic word groups
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE(name)
);

-- Join table for words and groups (many-to-many)
CREATE TABLE words_groups (
    id SERIAL PRIMARY KEY,
    word_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE(word_id, group_id)
);

-- Create index for faster word-group lookups
CREATE INDEX idx_words_groups_word_id ON words_groups(word_id);
CREATE INDEX idx_words_groups_group_id ON words_groups(group_id);

-- Study sessions table (created first since study_activities references it)
CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    study_activity_id INTEGER,  -- Will be updated after study_activities creation
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Study activities table
CREATE TABLE study_activities (
    id SERIAL PRIMARY KEY,
    study_session_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_session_id) REFERENCES study_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Add foreign key constraint for study_sessions.study_activity_id
ALTER TABLE study_sessions 
ADD CONSTRAINT fk_study_sessions_study_activity 
FOREIGN KEY (study_activity_id) 
REFERENCES study_activities(id) ON DELETE CASCADE;

-- Create indexes for faster lookups
CREATE INDEX idx_study_sessions_group_id ON study_sessions(group_id);
CREATE INDEX idx_study_sessions_study_activity_id ON study_sessions(study_activity_id);
CREATE INDEX idx_study_sessions_created_at ON study_sessions(created_at DESC);
CREATE INDEX idx_study_activities_study_session_id ON study_activities(study_session_id);
CREATE INDEX idx_study_activities_group_id ON study_activities(group_id);

-- Word review items table
CREATE TABLE word_review_items (
    word_id INTEGER NOT NULL,
    study_session_id INTEGER NOT NULL,
    correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (word_id, study_session_id),
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    FOREIGN KEY (study_session_id) REFERENCES study_sessions(id) ON DELETE CASCADE
);

-- Create index for faster word review lookups
CREATE INDEX idx_word_review_items_study_session_id ON word_review_items(study_session_id);
CREATE INDEX idx_word_review_items_created_at ON word_review_items(created_at DESC);

-- Add comments to tables for better documentation
COMMENT ON TABLE words IS 'Stores vocabulary words with their translations and phonetics';
COMMENT ON TABLE groups IS 'Thematic groups of words';
COMMENT ON TABLE words_groups IS 'Join table connecting words to their groups';
COMMENT ON TABLE study_sessions IS 'Records of study sessions';
COMMENT ON TABLE study_activities IS 'Study activities linking to study sessions and groups';
COMMENT ON TABLE word_review_items IS 'Records of word practice attempts and their correctness';
