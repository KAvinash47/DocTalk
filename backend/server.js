const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. JSON Middleware
app.use(express.json());

// 2. CORS setup
app.use(cors({
  origin: "*"
}));

// ✅ Load doctors.json
const doctorsPath = path.join(__dirname, '../public/Data/doctors.json');
let doctors = [];
try {
  doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf8'));
  console.log("Doctors loaded:", doctors.length);
} catch (err) {
  console.error("Error loading doctors:", err.message);
}

// Temporary in-memory storage
let bookings = [];

// GET all bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// POST new booking
app.post("/api/bookings", (req, res) => {
  const newBooking = req.body;

  if (!newBooking || Object.keys(newBooking).length === 0) {
    return res.status(400).json({ error: "No booking data" });
  }

  // Adding a unique ID for the demo UI
  const bookingWithId = { 
    id: Date.now(), 
    status: "pending",
    ...newBooking 
  };

  bookings.push(bookingWithId);

  res.json({
    success: true,
    message: "Booking successful",
    booking: bookingWithId
  });
});

// Helper routes for specific filters (kept for UI compatibility)
app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userBookings = bookings.filter(b => String(b.userId).toLowerCase() === String(userId).toLowerCase());
  res.json(userBookings);
});

app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const doctorBookings = bookings.filter(b => String(b.doctorId) === String(doctorId));
  res.json(doctorBookings);
});

// --- Doctors API ---
app.get('/api/doctors', (req, res) => res.json(doctors));
app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => String(d.id) === String(req.params.id));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

// --- OPENROUTER AI INTEGRATION ---
const callOpenRouter = async (message, doctorName, specialty) => {
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Give safe, clear medical guidance. Short responses.`
      : "You are a professional doctor AI assistant. Give safe advice.";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
          })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response";
    } catch (err) {
        return "AI Service Error";
    }
};

app.post('/api/ai-chat', async (req, res) => {
  const { message, doctorName, specialty } = req.body;
  const reply = await callOpenRouter(message, doctorName, specialty);
  res.json({ reply });
});

app.post('/api/ai-doctor', async (req, res) => {
  const { message } = req.body;
  const reply = await callOpenRouter(message);
  res.json({ response: reply });
});

app.get('/', (req, res) => res.json({ status: "Backend is running!" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
