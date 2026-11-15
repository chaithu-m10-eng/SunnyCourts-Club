
const express = require("express");
const router = express.Router();
const db = require("../database");

// 1. GET all reservations with player and court details (SQL JOIN)
router.get("/", (req, res) => {
    try {
        const reservations = db.prepare(`
            SELECT
                reservations.id,
                players.name AS player_name,
                courts.name AS court_name,
                courts.sport,
                reservations.status,
                reservations.created_at
            FROM reservations
            JOIN players
                ON reservations.player_id = players.id
            JOIN courts
                ON reservations.court_id = courts.id
            ORDER BY reservations.id DESC
        `).all();

        res.status(200).json({
            success: true,
            count: reservations.length,
            reservations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 2. POST - Create a reservation

router.post("/", (req, res) => {
    try {
        const { player_id, court_id } = req.body;

        // Validate player ID and court ID
        if (
            !Number.isInteger(Number(player_id)) ||
            !Number.isInteger(Number(court_id)) ||
            Number(player_id) <= 0 ||
            Number(court_id) <= 0 ||
            player_id === "" ||
            court_id === "" ||
            player_id === null ||
            court_id === null
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid positive Player ID and Court ID are required"
            });
        }

        const result = db.prepare(`
            INSERT INTO reservations (player_id, court_id)
            VALUES (?, ?)
        `).run(Number(player_id), Number(court_id));

        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            reservation_id: result.lastInsertRowid
        });

    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                success: false,
                message: `Court ${req.body.court_id} is already reserved`
            });
        }

        if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            return res.status(400).json({
                success: false,
                message: "Invalid player ID or court ID"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 3. PUT - Return a court (mark reservation as returned)
router.put("/:court_id/return", (req, res) => {
    try {
        const reservation = db.prepare(`
            SELECT id
            FROM reservations
            WHERE court_id = ? AND status = 'active'
        `).get(req.params.court_id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "No active reservation found for this court"
            });
        }

        db.prepare(`
            UPDATE reservations
            SET status = 'returned'
            WHERE id = ?
        `).run(reservation.id);

        res.status(200).json({
            success: true,
            message: "Court returned successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
