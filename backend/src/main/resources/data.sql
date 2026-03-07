-- Insert a test user
INSERT INTO users (id, email, name) VALUES ('user_2ngG67X9jJtX1b3XmR5k8y2', 'test@example.com', 'Test User') ON CONFLICT DO NOTHING;

-- Insert assessments
INSERT INTO assessments (id, title, type, duration, schedule, description, college, date) 
VALUES 
(1, 'React Quiz', 'ASSESSMENT', 60, '10:00 AM - 11:00 AM', 'Advanced React concepts including Context and Hooks.', 'ALL', '2026-03-08'), 
(2, 'Next.js Practice', 'PRACTICE', 45, 'Anytime', 'Practice your basic Next.js routing skills.', 'KMIT', '2026-03-05'),
(3, 'Java Spring Boot Core', 'ASSESSMENT', 90, '09:00 AM - 10:30 AM', 'Core Spring Boot concepts, JPA, and REST APIs.', 'CBIT', '2026-03-15')
ON CONFLICT DO NOTHING;

-- Insert attempts covering today and past
INSERT INTO user_attempts (id, user_id, assessment_id, score, right_answers, wrong_answers, attempt_date) 
VALUES 
(1, 'user_2ngG67X9jJtX1b3XmR5k8y2', 1, 100, 10, 0, CURRENT_TIMESTAMP),
(2, 'user_2ngG67X9jJtX1b3XmR5k8y2', 2, 80, 8, 2, CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Sync sequences for manually inserted IDs
SELECT setval('assessments_id_seq', (SELECT MAX(id) FROM assessments));
SELECT setval('user_attempts_id_seq', (SELECT MAX(id) FROM user_attempts));
