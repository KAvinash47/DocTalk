const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { callDoctorAI } = require('./ai');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// ✅ Global Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// In-memory storage for bookings
let bookings = [];

// Helper to read JSON files safely
const readJsonFile = (filePath) => {
    try {
        const fullPath = path.join(__dirname, filePath);
        if (!fs.existsSync(fullPath)) {
            console.error(`File not found: ${fullPath}`);
            return [];
        }
        return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err.message);
        return [];
    }
};

// --- API Routes ---

app.get('/', (req, res) => res.json({ status: "Backend is running!", engine: "PulseTalk AI" }));

// ✅ GET all doctors
app.get('/api/doctors', (req, res) => {
    const doctors = readJsonFile('../public/Data/doctors.json');
    res.json(doctors);
});

// ✅ GET all diseases
app.get('/api/diseases', (req, res) => {
    const diseases = readJsonFile('../public/Data/diseases.json');
    res.json(diseases);
});

app.get('/api/diseases/:id', (req, res) => {
    const diseases = readJsonFile('../public/Data/diseases.json');
    const disease = diseases.find(d => String(d.id) === String(req.params.id));
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.json(disease);
});

// ✅ GET all bookings (for dashboard debugging/filtering)
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// ✅ GET user bookings
app.get('/api/bookings/user/:userId', (req, res) => {
    const { userId } = req.params;
    const userBookings = bookings.filter(b => b.userId === userId);
    res.json(userBookings);
});

// ✅ GET doctor bookings
app.get('/api/bookings/doctor/:doctorId', (req, res) => {
    const { doctorId } = req.params;
    const doctorBookings = bookings.filter(b => String(b.doctorId) === String(doctorId));
    res.json(doctorBookings);
});

// ✅ POST new booking
app.post('/api/bookings', (req, res) => {
    const { doctorId, userId, appointmentDate, timeSlot } = req.body;
    
    if (!doctorId || !appointmentDate || !timeSlot) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const doctors = readJsonFile('../public/Data/doctors.json');
    const doctor = doctors.find(d => String(d.id) === String(doctorId));
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const newBooking = {
        id: Date.now().toString(),
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
    console.log("New booking created:", newBooking);
    res.status(201).json(newBooking);
});

// ✅ PATCH update booking status (Accept/Reject)
app.patch('/api/bookings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) return res.status(404).json({ message: "Booking not found" });

    bookings[bookingIndex].status = status;
    res.json(bookings[bookingIndex]);
});

// ✅ POST AI Chat
app.post('/api/ai-chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message is required." });
    
    try {
        const reply = await callDoctorAI(message);
        res.json({ reply });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ reply: "The AI engine reported an error. Please try again in a moment." });
    }
});

// ✅ POST AI Symptom Check
app.post('/api/ai-check', async (req, res) => {
    const { symptoms, diseaseName } = req.body;
    if (!symptoms) return res.status(400).json({ reply: "Symptoms are required." });
    
    try {
        const prompt = diseaseName 
            ? `Analyze these symptoms for a patient potentially having ${diseaseName}: ${symptoms}. Give helpful advice.`
            : `Analyze these symptoms: ${symptoms}. Give helpful advice.`;
        
        const reply = await callDoctorAI(prompt);
        res.json({ reply });
    } catch (error) {
        console.error("AI Check Error:", error);
        res.status(500).json({ reply: "The AI engine reported an error. Please try again in a moment." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
