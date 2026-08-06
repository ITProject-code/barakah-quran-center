-- Create database
CREATE DATABASE barakah_db;

-- Connect to database
\c barakah_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher')),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES (
  'Admin',
  'admin@barakah.com',
  '$2a$10$Yk5jKmQyMH.6QcpP2.LKXOOvLyTFE7JX4Cw9t5GvUZ5l8Y5WxQ6iK',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert default teacher user (password: teacher123)
INSERT INTO users (name, email, password, role) 
VALUES (
  'Teacher',
  'teacher@barakah.com',
  '$2a$10$Zk5jKmQyMH.6QcpP2.LKXOOvLyTFE7JX4Cw9t5GvUZ5l8Y5WxQ6iL',
  'teacher'
) ON CONFLICT (email) DO NOTHING;