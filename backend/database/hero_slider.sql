-- Hero Slider Table
CREATE TABLE IF NOT EXISTS hero_slider (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_path VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    link_text VARCHAR(100) DEFAULT 'Lihat Program',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (order_index),
    INDEX idx_active (is_active)
);

