const db = require('../config/database');

// Get kabinet sasmita description (only one record)
exports.getKabinetSasmita = async (req, res) => {
    try {
        const [descriptions] = await db.query(
            'SELECT * FROM kabinet_sasmita ORDER BY id DESC LIMIT 1'
        );

        if (descriptions.length === 0) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: descriptions[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create/Update kabinet sasmita description (only one record allowed)
exports.upsertKabinetSasmita = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!description) {
            return res.status(400).json({
                success: false,
                message: 'Deskripsi wajib diisi'
            });
        }

        // Check if description exists
        const [existing] = await db.query(
            'SELECT id FROM kabinet_sasmita ORDER BY id DESC LIMIT 1'
        );

        if (existing.length > 0) {
            // Update
            const existingId = existing[0].id;
            
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

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada data yang diperbarui'
                });
            }

            params.push(existingId);

            await db.query(
                `UPDATE kabinet_sasmita SET ${updateFields.join(', ')} WHERE id = ?`,
                params
            );

            res.json({
                success: true,
                message: 'Deskripsi Kabinet Sasmita berhasil diperbarui'
            });
        } else {
            // Create
            const [result] = await db.query(
                'INSERT INTO kabinet_sasmita (title, description) VALUES (?, ?)',
                [title || 'Mengenal Kabinet Sasmita', description]
            );

            res.status(201).json({
                success: true,
                message: 'Deskripsi Kabinet Sasmita berhasil dibuat',
                data: { id: result.insertId }
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

