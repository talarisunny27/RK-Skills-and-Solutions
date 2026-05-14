CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    college VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    type VARCHAR(50),
    module VARCHAR(100) NOT NULL DEFAULT 'Other',
    duration INTEGER,
    schedule VARCHAR(255),
    description TEXT,
    college VARCHAR(255),
    date VARCHAR(255)
);

ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS module VARCHAR(100) NOT NULL DEFAULT 'Other';

CREATE TABLE IF NOT EXISTS user_attempts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id),
    assessment_id INTEGER REFERENCES assessments(id),
    score INTEGER NOT NULL,
    right_answers INTEGER NOT NULL,
    wrong_answers INTEGER NOT NULL,
    attempt_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
    section VARCHAR(100) NOT NULL DEFAULT 'General',
    text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium'
);

