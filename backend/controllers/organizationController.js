const db = require('../config/database');
const path = require('path');

// Get all organization structure
exports.getAllStructure = async (req, res) => {
    try {
        const { status = 'active' } = req.query;

        const [structure] = await db.query(
            'SELECT * FROM organization_structure WHERE status = ? ORDER BY order_index ASC, position ASC, name ASC',
            [status]
        );

        res.json({
            success: true,
            data: structure
        });
    } catch (error) {
        console.error('Error fetching organization structure:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single member
exports.getMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        const [members] = await db.query(
            'SELECT * FROM organization_structure WHERE id = ?',
            [id]
        );

        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.json({
            success: true,
            data: members[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create member
exports.createMember = async (req, res) => {
    try {
        const { name, position, division, bio, email, phone, order_index, status } = req.body;
        const photo = req.file ? `/uploads/organization/${req.file.filename}` : null;

        const [result] = await db.query(
            `INSERT INTO organization_structure (name, position, division, bio, photo, email, phone, order_index, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, position, division, bio, photo, email, phone, order_index || 0, status || 'active']
        );

        res.status(201).json({
            success: true,
            message: 'Member created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update member
exports.updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, division, bio, email, phone, order_index, status } = req.body;

        const [existing] = await db.query('SELECT id FROM organization_structure WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

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
        if (division) {
            updateFields.push('division = ?');
            params.push(division);
        }
        if (bio) {
            updateFields.push('bio = ?');
            params.push(bio);
        }
        if (email) {
            updateFields.push('email = ?');
            params.push(email);
        }
        if (phone) {
            updateFields.push('phone = ?');
            params.push(phone);
        }
        if (order_index !== undefined) {
            updateFields.push('order_index = ?');
            params.push(order_index);
        }
        if (status) {
            updateFields.push('status = ?');
            params.push(status);
        }
        if (req.file) {
            updateFields.push('photo = ?');
            params.push(`/uploads/organization/${req.file.filename}`);
        }

        params.push(id);

        await db.query(
            `UPDATE organization_structure SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Member updated successfully'
        });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete member
exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM organization_structure WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.json({
            success: true,
            message: 'Member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

