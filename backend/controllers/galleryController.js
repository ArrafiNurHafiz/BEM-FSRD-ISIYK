const db = require('../config/database');

// Get all gallery items
exports.getAllGallery = async (req, res) => {
    try {
        const { category, page = 1, limit = 20, group_by_batch = 'true' } = req.query;
        const offset = (page - 1) * limit;

        // If group_by_batch is true, show only one image per batch
        if (group_by_batch === 'true') {
            // Get first image from each batch (groups with batch_id)
            // And all single images (without batch_id)
            let query = `
                (
                    SELECT g.*, c.name as category_name, c.slug as category_slug,
                           (SELECT COUNT(*) FROM gallery g2 WHERE g2.batch_id = g.batch_id AND g2.batch_id IS NOT NULL) as batch_count
                    FROM gallery g
                    LEFT JOIN categories c ON g.category_id = c.id
                    WHERE g.batch_id IS NOT NULL
                    AND g.id = (
                        SELECT MIN(g3.id) 
                        FROM gallery g3 
                        WHERE g3.batch_id = g.batch_id
                    )
            `;
            const params = [];

            if (category) {
                query += ' AND c.slug = ?';
                params.push(category);
            }

            query += `
                )
                UNION
                (
                    SELECT g.*, c.name as category_name, c.slug as category_slug, 1 as batch_count
                    FROM gallery g
                    LEFT JOIN categories c ON g.category_id = c.id
                    WHERE g.batch_id IS NULL
            `;

            if (category) {
                query += ' AND c.slug = ?';
                params.push(category);
            }

            query += `
                )
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;
            params.push(parseInt(limit), parseInt(offset));

            const [gallery] = await db.query(query, params);

            // Get total count (unique batches + single images)
            let countQuery = `
                SELECT COUNT(*) as total FROM (
                    SELECT DISTINCT batch_id FROM gallery WHERE batch_id IS NOT NULL
                    UNION
                    SELECT CONCAT('single_', id) as batch_id FROM gallery WHERE batch_id IS NULL
                ) as grouped
            `;
            const countParams = [];

            // Note: Category filtering for grouped view needs to be done differently
            // For now, we'll get approximate count
            const [countResult] = await db.query(countQuery, countParams);
            const total = countResult[0].total;

            res.json({
                success: true,
                data: gallery,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } else {
            // Original query - return all items without grouping
            let query = `
                SELECT g.*, c.name as category_name, c.slug as category_slug
                FROM gallery g
                LEFT JOIN categories c ON g.category_id = c.id
                WHERE 1=1
            `;
            const params = [];

            if (category) {
                query += ' AND c.slug = ?';
                params.push(category);
            }

            query += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
            params.push(parseInt(limit), parseInt(offset));

            const [gallery] = await db.query(query, params);

            // Get total count
            let countQuery = 'SELECT COUNT(*) as total FROM gallery g LEFT JOIN categories c ON g.category_id = c.id WHERE 1=1';
            const countParams = [];

            if (category) {
                countQuery += ' AND c.slug = ?';
                countParams.push(category);
            }

            const [countResult] = await db.query(countQuery, countParams);
            const total = countResult[0].total;

            res.json({
                success: true,
                data: gallery,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single gallery item
exports.getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [gallery] = await db.query(
            `SELECT g.*, c.name as category_name, c.slug as category_slug
             FROM gallery g
             LEFT JOIN categories c ON g.category_id = c.id
             WHERE g.id = ?`,
            [id]
        );

        if (gallery.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.json({
            success: true,
            data: gallery[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all images in a batch
exports.getBatchImages = async (req, res) => {
    try {
        const { batch_id } = req.params;

        const [items] = await db.query(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM gallery g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.batch_id = ?
            ORDER BY g.id ASC
        `, [batch_id]);

        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create gallery item
exports.createGalleryItem = async (req, res) => {
    try {
        const { title, description, category_id, alt_text } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image is required'
            });
        }

        const image_path = `/uploads/gallery/${req.file.filename}`;

        const [result] = await db.query(
            'INSERT INTO gallery (title, description, image_path, category_id, alt_text) VALUES (?, ?, ?, ?, ?)',
            [title, description, image_path, category_id, alt_text]
        );

        res.status(201).json({
            success: true,
            message: 'Gallery item created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create bulk gallery items (multiple images)
exports.createBulkGalleryItems = async (req, res) => {
    try {
        const { category_id, default_title, description } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Images are required'
            });
        }

        // Generate unique batch_id for this upload batch
        const batch_id = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const insertPromises = req.files.map((file, index) => {
            const image_path = `/uploads/gallery/${file.filename}`;
            
            // Generate title with number if default_title provided
            let title;
            if (default_title) {
                // Remove file extension from original name for base
                const baseName = file.originalname.replace(/\.[^/.]+$/, '');
                if (req.files.length === 1) {
                    // Single file, use default_title as is
                    title = default_title;
                } else {
                    // Multiple files, add number
                    title = `${default_title} ${index + 1}`;
                }
            } else {
                // Use filename without extension
                title = file.originalname.replace(/\.[^/.]+$/, '');
            }
            
            // Use provided description for all images in batch
            const desc = description || '';
            
            // Use title as alt_text if not provided
            const alt_text = title;
            
            return db.query(
                'INSERT INTO gallery (title, description, image_path, category_id, alt_text, batch_id) VALUES (?, ?, ?, ?, ?, ?)',
                [title, desc, image_path, category_id || null, alt_text, batch_id]
            );
        });

        const results = await Promise.all(insertPromises);
        const insertedIds = results.map(result => result[0].insertId);

        res.status(201).json({
            success: true,
            message: `${req.files.length} gambar berhasil diupload sebagai satu batch`,
            data: { 
                ids: insertedIds,
                count: req.files.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category_id, alt_text } = req.body;

        const [existing] = await db.query('SELECT id FROM gallery WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        let updateFields = [];
        let params = [];

        if (title) {
            updateFields.push('title = ?');
            params.push(title);
        }
        if (description) {
            updateFields.push('description = ?');
            params.push(description);
        }
        if (category_id) {
            updateFields.push('category_id = ?');
            params.push(category_id);
        }
        if (alt_text) {
            updateFields.push('alt_text = ?');
            params.push(alt_text);
        }
        if (req.file) {
            updateFields.push('image_path = ?');
            params.push(`/uploads/gallery/${req.file.filename}`);
        }

        params.push(id);

        await db.query(
            `UPDATE gallery SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Gallery item updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM gallery WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

