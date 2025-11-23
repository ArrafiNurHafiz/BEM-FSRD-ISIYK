const db = require('../config/database');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const { status, upcoming, limit } = req.query;
        const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'editor');

        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];

        // Only filter by status if specified, or if not admin, default to published
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        } else if (!isAdmin) {
            query += ' AND status = ?';
            params.push('published');
        }

        if (upcoming === 'true') {
            query += ' AND start_datetime >= NOW()';
        }

        query += ' ORDER BY start_datetime ASC';

        if (limit) {
            const limitNum = parseInt(limit, 10);
            if (!isNaN(limitNum) && limitNum > 0) {
                query += ' LIMIT ?';
                params.push(limitNum);
            }
        }

        const [events] = await db.query(query, params);

        // Get RSVP count for each event
        if (events.length > 0) {
            const eventIds = events.map(e => e.id);
            const placeholders = eventIds.map(() => '?').join(',');
            const [rsvpCounts] = await db.query(
                `SELECT event_id, COUNT(*) as count 
                 FROM rsvps 
                 WHERE event_id IN (${placeholders}) AND status = 'confirmed'
                 GROUP BY event_id`,
                eventIds
            );

            const rsvpMap = {};
            rsvpCounts.forEach(r => {
                rsvpMap[r.event_id] = r.count;
            });

            events.forEach(event => {
                event.rsvp_count = rsvpMap[event.id] || 0;
            });
        }

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single event
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const [events] = await db.query('SELECT * FROM events WHERE id = ?', [id]);

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get RSVPs count
        const [rsvps] = await db.query(
            'SELECT COUNT(*) as count FROM rsvps WHERE event_id = ? AND status = ?',
            [id, 'confirmed']
        );

        res.json({
            success: true,
            data: {
                ...events[0],
                rsvp_count: rsvps[0].count
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

// Create event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, start_datetime, end_datetime, location, max_participants, status } = req.body;
        const image = req.file ? `/uploads/events/${req.file.filename}` : null;

        const [result] = await db.query(
            `INSERT INTO events (title, description, start_datetime, end_datetime, location, image, max_participants, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, start_datetime, end_datetime, location, image, max_participants, status || 'draft']
        );

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
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

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, start_datetime, end_datetime, location, max_participants, status } = req.body;

        const [existing] = await db.query('SELECT id FROM events WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
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
        if (start_datetime) {
            updateFields.push('start_datetime = ?');
            params.push(start_datetime);
        }
        if (end_datetime) {
            updateFields.push('end_datetime = ?');
            params.push(end_datetime);
        }
        if (location) {
            updateFields.push('location = ?');
            params.push(location);
        }
        if (max_participants) {
            updateFields.push('max_participants = ?');
            params.push(max_participants);
        }
        if (status) {
            updateFields.push('status = ?');
            params.push(status);
        }
        if (req.file) {
            updateFields.push('image = ?');
            params.push(`/uploads/events/${req.file.filename}`);
        }

        params.push(id);

        await db.query(
            `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Event updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// RSVP to event
exports.rsvpEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        // Check if event exists and is published
        const [events] = await db.query(
            'SELECT id, max_participants FROM events WHERE id = ? AND status = ?',
            [id, 'published']
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found or not available'
            });
        }

        // Check if already RSVPed
        const [existing] = await db.query(
            'SELECT id FROM rsvps WHERE event_id = ? AND email = ?',
            [id, email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already RSVPed to this event'
            });
        }

        // Check capacity
        if (events[0].max_participants) {
            const [rsvps] = await db.query(
                'SELECT COUNT(*) as count FROM rsvps WHERE event_id = ? AND status = ?',
                [id, 'confirmed']
            );

            if (rsvps[0].count >= events[0].max_participants) {
                return res.status(400).json({
                    success: false,
                    message: 'Event is full'
                });
            }
        }

        const [result] = await db.query(
            'INSERT INTO rsvps (event_id, name, email, phone) VALUES (?, ?, ?, ?)',
            [id, name, email, phone]
        );

        res.status(201).json({
            success: true,
            message: 'RSVP successful',
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

// Get RSVPs for an event (admin only)
exports.getEventRsvps = async (req, res) => {
    try {
        const { id } = req.params;

        const [rsvps] = await db.query(
            `SELECT r.*, e.title as event_title 
             FROM rsvps r 
             JOIN events e ON r.event_id = e.id 
             WHERE r.event_id = ? 
             ORDER BY r.created_at DESC`,
            [id]
        );

        res.json({
            success: true,
            data: rsvps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all RSVPs (admin only)
exports.getAllRsvps = async (req, res) => {
    try {
        const { event_id, status } = req.query;

        let query = `
            SELECT r.*, e.title as event_title, e.start_datetime 
            FROM rsvps r 
            JOIN events e ON r.event_id = e.id 
            WHERE 1=1
        `;
        const params = [];

        if (event_id) {
            query += ' AND r.event_id = ?';
            params.push(event_id);
        }

        if (status) {
            query += ' AND r.status = ?';
            params.push(status);
        }

        query += ' ORDER BY r.created_at DESC';

        const [rsvps] = await db.query(query, params);

        res.json({
            success: true,
            data: rsvps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

