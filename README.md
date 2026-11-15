# SunnyCourts Club – Court Booking System

## 1. Project Overview

SunnyCourts Club is a backend-based Court Booking System developed using Node.js, Express.js and SQLite.

The system allows users to manage sports courts, create reservations, view reservation details and return courts. It also prevents double booking by ensuring that a court cannot have more than one active reservation at a time.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Postman
- Visual Studio Code

## 3. Project Structure

```text
SunnyCourts-Club/
│
├── middleware/
├── postman/
│   └── SunnyCourts-Club-API.postman_collection.json
│
├── routes/
│   ├── courts.js
│   └── reservations.js
│
├── database.js
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## 4. Installation and Setup

### Prerequisites
- Node.js and npm installed
- Visual Studio Code

### Installation

Clone or download the project.

Open the project folder in the terminal and run:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## 5. API Endpoints

### Court Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/courts` | Get all courts |
| GET | `/courts/:id` | Get court by ID |
| POST | `/courts` | Add a new court |
| PUT | `/courts/:id` | Update a court |
| DELETE | `/courts/:id` | Delete a court |

### Reservation Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reservations` | Get all reservations with player and court details |
| POST | `/reservations` | Create a reservation |
| PUT | `/reservations/:court_id/return` | Return a reserved court |

### Court Search

```text
GET /courts?sport=Badminton
```

Filters courts by sport.

## 6. Sample Request Bodies

### Add Court

```json
{
  "name": "Court 5",
  "sport": "Tennis"
}
```

### Create Reservation

```json
{
  "player_id": 1,
  "court_id": 3
}
```

## 7. Database Tables

The project uses three SQLite tables:

- **Players:** Stores player details.
- **Courts:** Stores court names and sports.
- **Reservations:** Stores player IDs, court IDs, reservation status and creation time.

## 8. Double-Booking Prevention

The system prevents a court from having multiple active reservations.

A SQLite partial unique index is used on the court ID for reservations with active status.

If a player tries to reserve an already reserved court, the API returns:

**HTTP 409 – Conflict**

Example response:

```json
{
  "success": false,
  "message": "Court 2 is already reserved"
}
```

After a court is returned, another player can reserve it.

## 9. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 404 | Resource not found |
| 409 | Booking conflict |
| 500 | Internal server error |

## 10. Postman Testing

The project includes a Postman collection containing eight API requests.

Collection file:

`postman/SunnyCourts-Club-API.postman_collection.json`

The requests cover court management, reservation creation, reservation retrieval and court returns.

## 11. Team Contributions

| Student | Assigned Contribution |
|---|---|
| G. Chaitanya Vardhan | Part 1 – Server and routes setup; Part 5 – No-double-booking logic |
| J. Mohammad Shakeer | Part 3 – REST endpoints and SQL JOIN |
| D. Thanishka | Part 2 – SQLite database |
| A. Vignan | Part 4 – Validation and search |
| K.J. Deepika | Part 6 – Postman collection and README documentation |

## 12. Conclusion

The SunnyCourts Club Court Booking System demonstrates backend development using Node.js, Express.js and SQLite. It provides court management, reservation handling, search functionality and protection against double booking through database constraints.