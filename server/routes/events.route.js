const express = require('express');
const db = require('../config/db.js');
const { authenticate, restrictTo } = require('../middleware/auth.middleware.js');
const router = express.Router();

// Create event (Organizers only)
router.post('/create', authenticate, restrictTo('organizer'), (req, res) => {
  const { title, type, event_date, location, price, availability } = req.body;

  if (
    !title ||
    !type ||
    !event_date ||
    !location ||
    !price ||
    price <= 0 ||
    !availability ||
    availability < 0
  ) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  if (isNaN(Date.parse(event_date))) {
    return res.status(400).json({ message: 'Invalid event date format' });
  }

  db.query(
    'INSERT INTO events (organizer_id, title, type, event_date, location, price, availability) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, title, type, event_date, location, price, availability],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Event created', eventId: result.insertId });
    }
  );
});

// Update event (Organizers only)
router.put('/:eventId', authenticate, restrictTo('organizer'), (req, res) => {
  const { eventId } = req.params;
  const { title, type, event_date, location, price, availability } = req.body;

  if (
    !title ||
    !type ||
    !event_date ||
    !location ||
    !price ||
    price <= 0 ||
    !availability ||
    availability < 0
  ) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  if (isNaN(Date.parse(event_date))) {
    return res.status(400).json({ message: 'Invalid event date format' });
  }

  db.query(
    'SELECT * FROM events WHERE id = ? AND organizer_id = ?',
    [eventId, req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) {
        return res.status(404).json({ message: 'Event not found or unauthorized' });
      }

      db.query(
        'UPDATE events SET title = ?, type = ?, event_date = ?, location = ?, price = ?, availability = ? WHERE id = ?',
        [title, type, event_date, location, price, availability, eventId],
        (err) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({ message: 'Event updated' });
        }
      );
    }
  );
});

// Delete event (Organizers only)
router.delete('/:eventId', authenticate, restrictTo('organizer'), (req, res) => {
  const { eventId } = req.params;

  db.query(
    'SELECT * FROM events WHERE id = ? AND organizer_id = ?',
    [eventId, req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) {
        return res.status(404).json({ message: 'Event not found or unauthorized' });
      }

      db.query('DELETE FROM events WHERE id = ?', [eventId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Event deleted' });
      });
    }
  );
});

// Get all events with filtering (Public)
router.get('/', (req, res) => {
  const { type, date, location, minPrice, maxPrice } = req.query;

  let query = 'SELECT id, title, type, event_date, location, price, availability, created_at FROM events WHERE 1=1';
  const queryParams = [];

  if (type) {
    query += ' AND type = ?';
    queryParams.push(type);
  }

  if (date) {
    query += ' AND DATE(event_date) = ?';
    queryParams.push(date);
  }

  if (location) {
    query += ' AND location LIKE ?';
    queryParams.push(`%${location}%`);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    queryParams.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    queryParams.push(parseFloat(maxPrice));
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Get organizer's events (Organizers only)
router.get('/my-events', authenticate, restrictTo('organizer'), (req, res) => {
  db.query(
    'SELECT id, title, type, event_date, location, price, availability, created_at FROM events WHERE organizer_id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
});

// Purchase tickets (Normal Users only)
router.post('/purchase/:eventId', authenticate, restrictTo('normal'), (req, res) => {
  const { eventId } = req.params;
  const { quantity } = req.body;

  // Validate quantity
  if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Lock event row and check availability
    db.query(
      'SELECT availability, price FROM events WHERE id = ? FOR UPDATE',
      [eventId],
      (err, results) => {
        if (err) {
          db.rollback(() => res.status(500).json({ message: 'Database error' }));
          return;
        }
        if (results.length === 0) {
          db.rollback(() => res.status(404).json({ message: 'Event not found' }));
          return;
        }

        const { availability, price } = results[0];
        if (availability < quantity) {
          db.rollback(() =>
            res.status(400).json({ message: `Only ${availability} tickets available` })
          );
          return;
        }

        // Insert tickets (one row per ticket)
        const ticketInserts = [];
        for (let i = 0; i < quantity; i++) {
          ticketInserts.push([req.user.id, eventId]);
        }

        db.query(
          'INSERT INTO tickets (user_id, event_id) VALUES ?',
          [ticketInserts],
          (err, result) => {
            if (err) {
              db.rollback(() => res.status(500).json({ message: 'Database error' }));
              return;
            }

            // Update availability
            db.query(
              'UPDATE events SET availability = availability - ? WHERE id = ?',
              [quantity, eventId],
              (err) => {
                if (err) {
                  db.rollback(() => res.status(500).json({ message: 'Database error' }));
                  return;
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    db.rollback(() => res.status(500).json({ message: 'Database error' }));
                    return;
                  }

                  // Calculate total cost
                  const totalCost = price * quantity;
                  res.status(201).json({
                    message: 'Tickets purchased successfully',
                    ticketCount: quantity,
                    totalCost,
                    eventId,
                  });
                });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;