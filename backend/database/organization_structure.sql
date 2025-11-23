-- Organization Structure Table
CREATE TABLE IF NOT EXISTS organization_structure (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    division VARCHAR(100),
    bio TEXT,
    photo VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    order_index INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_status (status),
    INDEX idx_order (order_index)
);

-- Insert sample structure (can be managed via admin)
INSERT INTO organization_structure (name, position, division, bio, order_index) VALUES
('Ketua BEM', 'Ketua', 'Pimpinan', 'Memimpin dan mengkoordinasikan seluruh kegiatan BEM FSRD ISI Yogyakarta', 1),
('Wakil Ketua', 'Wakil Ketua', 'Pimpinan', 'Membantu ketua dalam menjalankan tugas kepemimpinan', 2),
('Sekretaris', 'Sekretaris', 'Pimpinan', 'Mengelola administrasi dan dokumentasi organisasi', 3),
('Bendahara', 'Bendahara', 'Pimpinan', 'Mengelola keuangan organisasi', 4);

