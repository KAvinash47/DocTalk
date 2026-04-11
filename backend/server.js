const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// ✅ Load doctors.json
const doctorsPath = path.join(__dirname, '../public/Data/doctors.json');
let doctors = [];
try {
  doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf8'));
} catch (err) {
  console.error("Error loading doctors:", err.message);
}

// 100% Clean In-memory storage
let bookings = [];

// --- API Routes ---

app.get('/', (req, res) => res.json({ status: "Backend is running!", total_bookings: bookings.length }));

app.get('/api/doctors', (req, res) => res.json(doctors));

// ✅ GET all bookings (The one Dashboard.jsx uses now)
app.get("/api/bookings", (req, res) => {
  console.log(`GET /api/bookings - Returning all ${bookings.length} items`);
  res.json(bookings);
});

// ✅ POST new booking
app.post("/api/bookings", (req, res) => {
  const { doctorId, userId, appointmentDate, timeSlot } = req.body;
  
  if (!doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const doctor = doctors.find(d => String(d.id) === String(doctorId));
  
  const booking = { 
    id: Date.now() + Math.random(), // Extra unique
    status: "pending",
    doctorId: String(doctorId), 
    userId: userId || "guest",
    appointmentDate,
    timeSlot,
    doctorName: doctor ? doctor.name : "Doctor",
    speciality: doctor ? doctor.specialization : "General",
    fee: doctor ? doctor.consultationFee : 500
  };

  bookings.push(booking);
  console.log(`SUCCESS: Booking saved for Doctor ${doctorId}. Total on server: ${bookings.length}`);
  res.json({ success: true, message: "Booking successful", booking });
});

// Helper routes
app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(bookings.filter(b => String(b.userId).toLowerCase() === String(userId).toLowerCase()));
});

app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  res.json(bookings.filter(b => String(b.doctorId) === String(doctorId)));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
