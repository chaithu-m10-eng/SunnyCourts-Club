
const express = require("express");
const db = require("./database");
const courtsRouter = require("./routes/courts");
const reservationsRouter = require("./routes/reservations");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

app.use("/courts", courtsRouter);

app.use("/reservations", reservationsRouter);

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to SunnyCourts Club API",
        project: "Court Booking System",
        status: "Running"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`SunnyCourts server running on port ${PORT}`);
});
