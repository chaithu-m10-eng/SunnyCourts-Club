
const express = require("express");
const router = express.Router();
const db = require("../database");

// 1. GET all courts

router.get("/", (req, res) => {
    try {
        const { sport } = req.query;

        let courts;

        if (sport) {
            courts = db.prepare(
                "SELECT * FROM courts WHERE LOWER(sport) = LOWER(?)"
            ).all(sport);
        } else {
            courts = db.prepare(
                "SELECT * FROM courts"
            ).all();
        }

        res.status(200).json({
            success: true,
            count: courts.length,
            courts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 2. GET a single court by ID
router.get("/:id", (req, res) => {
    try {
        const court = db.prepare(
            "SELECT * FROM courts WHERE id = ?"
        ).get(req.params.id);

        if (!court) {
            return res.status(404).json({
                success: false,
                message: "Court not found"
            });
        }

        res.status(200).json({
            success: true,
            court
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 3. POST - Add a new court

router.post("/", (req, res) => {
    try {
        const { name, sport } = req.body;

        // Validate input
        if (
            typeof name !== "string" ||
            typeof sport !== "string" ||
            !name.trim() ||
            !sport.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid court name and sport are required"
            });
        }

        const cleanName = name.trim();
        const cleanSport = sport.trim();

        const result = db.prepare(
            "INSERT INTO courts (name, sport) VALUES (?, ?)"
        ).run(cleanName, cleanSport);

        res.status(201).json({
            success: true,
            message: "Court added successfully",
            court: {
                id: result.lastInsertRowid,
                name: cleanName,
                sport: cleanSport
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 4. PUT - Update a court
router.put("/:id", (req, res) => {
    try {
        const existingCourt = db.prepare(
            "SELECT * FROM courts WHERE id = ?"
        ).get(req.params.id);

        if (!existingCourt) {
            return res.status(404).json({
                success: false,
                message: "Court not found"
            });
        }

        const name = req.body.name ?? existingCourt.name;
        const sport = req.body.sport ?? existingCourt.sport;

        db.prepare(
            "UPDATE courts SET name = ?, sport = ? WHERE id = ?"
        ).run(name, sport, req.params.id);

        res.status(200).json({
            success: true,
            message: "Court updated successfully",
            court: {
                id: Number(req.params.id),
                name,
                sport
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 5. DELETE - Delete a court
router.delete("/:id", (req, res) => {
    try {
        const result = db.prepare(
            "DELETE FROM courts WHERE id = ?"
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Court not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Court deleted successfully"
        });
    } catch (error) {
        res.status(409).json({
            success: false,
            message: "Cannot delete this court because it is referenced by a reservation"
        });
    }
});

module.exports = router;
