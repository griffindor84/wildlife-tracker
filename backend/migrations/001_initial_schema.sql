-- Wildlife Tracker
-- Initial database schema
-- Migration: 001_initial_schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    supabase_id UUID UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Ranger',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wildlife (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(255),
    description TEXT,
    habitat VARCHAR(255),
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wildlife_id INTEGER REFERENCES wildlife(id) ON DELETE SET NULL,
    location VARCHAR(255),
    notes TEXT,
    observed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(100) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);