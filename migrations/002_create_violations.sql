CREATE TABLE IF NOT EXISTS violations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
