-- Migration: Create aspirations table
-- Run this if the table doesn't exist yet

CREATE TABLE IF NOT EXISTS aspirations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    status ENUM('unread', 'read', 'addressed') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_anonymous (is_anonymous)
);

