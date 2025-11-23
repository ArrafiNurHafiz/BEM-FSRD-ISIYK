const db = require('../config/database');

// Get chairman greeting (only one record)
exports.getChairmanGreeting = async (req, res) => {
    try {
        const [greetings] = await db.query(
            'SELECT * FROM chairman_greeting ORDER BY id DESC LIMIT 1'
        );

        if (greetings.length === 0) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: greetings[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create/Update chairman greeting (only one record allowed)
exports.upsertChairmanGreeting = async (req, res) => {
    try {
        const { name, position, greeting } = req.body;
        const photo = req.files?.photo ? `/uploads/chairman/${req.files.photo[0].filename}` : null;
        const signature = req.files?.signature ? `/uploads/chairman/${req.files.signature[0].filename}` : null;

        // Check if greeting exists
        const [existing] = await db.query(
            'SELECT id, photo, signature FROM chairman_greeting ORDER BY id DESC LIMIT 1'
        );

        if (existing.length > 0) {
            // Update
            let updateFields = [];
            let params = [];

            if (name) {
                updateFields.push('name = ?');
                params.push(name);
            }
            if (position) {
                updateFields.push('position = ?');
                params.push(position);
            }
            if (greeting) {
                updateFields.push('greeting = ?');
                params.push(greeting);
            }
            if (photo) {
                updateFields.push('photo = ?');
                params.push(photo);
            }
            if (signature) {
                updateFields.push('signature = ?');
                params.push(signature);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada data yang diperbarui'
                });
            }

            params.push(existing[0].id);

            await db.query(
                `UPDATE chairman_greeting SET ${updateFields.join(', ')} WHERE id = ?`,
                params
            );

            res.json({
                success: true,
                message: 'Sambutan ketua BEM berhasil diperbarui'
            });
        } else {
            // Create
            if (!name || !greeting) {
                return res.status(400).json({
                    success: false,
                    message: 'Nama dan sambutan wajib diisi'
                });
            }

            const [result] = await db.query(
                'INSERT INTO chairman_greeting (name, position, greeting, photo, signature) VALUES (?, ?, ?, ?, ?)',
                [name, position || 'Ketua BEM FSRD ISI Yogyakarta', greeting, photo, signature]
            );

            res.status(201).json({
                success: true,
                message: 'Sambutan ketua BEM berhasil dibuat',
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

// Delete chairman greeting
exports.deleteChairmanGreeting = async (req, res) => {
    try {
        // Check if greeting exists
        const [existing] = await db.query(
            'SELECT id FROM chairman_greeting ORDER BY id DESC LIMIT 1'
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sambutan ketua BEM tidak ditemukan'
            });
        }

        await db.query(
            'DELETE FROM chairman_greeting WHERE id = ?',
            [existing[0].id]
        );

        res.json({
            success: true,
            message: 'Sambutan ketua BEM berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

