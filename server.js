import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for bookings
let bookings = [];

// Load doctors from the public data folder
const doctorsPath = path.join(__dirname, 'public/Data/doctors.json');
let doctors = [];
try {
    doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf8'));
    console.log(`Successfully loaded ${doctors.length} doctors.`);
} catch (err) {
    console.error("Could not load doctors.json, using empty array");
}

// GET all doctors
app.get('/api/doctors', (req, res) => {
    res.json(doctors);
});

// GET doctor by ID
app.get('/api/doctors/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (doctor) res.json(doctor);
    else res.status(404).json({ message: "Doctor not found" });
});

// GET bookings for a specific user
app.get('/api/bookings/user/:userId', (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching bookings for user: ${userId}`);
    
    // Ensure we are working with an array (in case we switch to Map later)
    const allBookings = Array.isArray(bookings) ? bookings : Array.from(bookings.values());
    const userBookings = allBookings.filter(b => b.userId === userId);
    
    console.log(`Found ${userBookings.length} bookings for user ${userId}`);
    res.json(userBookings);
});

// POST new booking
app.post('/api/bookings', (req, res) => {
    console.log("Incoming Booking POST Request Body:", req.body);
    
    const { doctorId, userId, appointmentDate, timeSlot } = req.body;
    
    if (!doctorId || !appointmentDate || !timeSlot) {
        console.error("Validation failed: Missing required fields");
        return res.status(400).json({ message: "Missing required fields (doctorId, appointmentDate, or timeSlot)" });
    }

    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    if (!doctor) {
        console.error(`Validation failed: Doctor with ID ${doctorId} not found`);
        return res.status(404).json({ message: "Doctor not found" });
    }

    const newBooking = {
        id: Date.now(),
        doctorId: parseInt(doctorId),
        userId: userId || "guest",
        doctorName: doctor.name,
        speciality: doctor.specialization,
        fee: doctor.consultationFee,
        appointmentDate,
        timeSlot,
        status: "pending"
    };

    bookings.push(newBooking);
    console.log("New booking saved successfully:", newBooking);
    res.status(201).json(newBooking);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Backend running at http://localhost:${PORT}`);
    console.log(`POST /api/bookings is ready`);
    console.log(`GET /api/bookings/user/:userId is ready`);
    console.log(`========================================`);
});
