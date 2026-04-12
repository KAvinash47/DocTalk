const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
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

// In-memory storage for bookings (mimicking root server.js)
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

app.get('/', (req, res) => res.json({ status: "Backend is running!", engine: "DeepSeek V3" }));

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

// ✅ GET user bookings
app.get('/api/bookings/user/:userId', (req, res) => {
    const { userId } = req.params;
    const userBookings = bookings.filter(b => b.userId === userId);
    res.json(userBookings);
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
    res.status(201).json(newBooking);
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
        res.status(500).json({ reply: "Doctor AI is currently unavailable." });
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
        res.status(500).json({ reply: "AI analysis is currently unavailable." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
