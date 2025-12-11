-- users
INSERT INTO users (email, password_hash, full_name, role)
VALUES
  ('demo1@example.local', 'noop', 'Demo User 1', 'user'),
  ('demo2@example.local', 'noop', 'Demo User 2', 'user');

-- equipment
INSERT INTO equipment (name) VALUES ('Camera A'), ('Sensor B');

-- violations
INSERT INTO violations (user_id, description) VALUES (1, 'Demo violation #1'), (2, 'Demo violation #2');
