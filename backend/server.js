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
  console.log("Doctors loaded:", doctors.length);
} catch (err) {
  console.error("Error loading doctors:", err.message);
}

// In-memory storage
let bookings = [];

// --- API Routes ---

app.get('/', (req, res) => res.json({ status: "Backend is running!" }));

app.get('/api/doctors', (req, res) => res.json(doctors));

app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => String(d.id) === String(req.params.id));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

// ✅ GET all bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// ✅ GET user bookings (REQUIRED for MyBookings.jsx)
app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userBookings = bookings.filter(b => String(b.userId).toLowerCase() === String(userId).toLowerCase());
  res.json(userBookings);
});

// ✅ GET doctor bookings (REQUIRED for Dashboard.jsx)
app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  console.log(`Backend: Fetching bookings for doctor ID: "${doctorId}"`);
  console.log(`Backend: Total bookings in memory: ${bookings.length}`);
  
  const doctorBookings = bookings.filter(b => {
    const match = String(b.doctorId) === String(doctorId);
    if (match) console.log("Backend: Found matching booking:", b);
    return match;
  });
  
  console.log(`Backend: Returning ${doctorBookings.length} bookings for doctor ${doctorId}`);
  res.json(doctorBookings);
});

// ✅ POST new booking
app.post("/api/bookings", (req, res) => {
  const newBooking = req.body;
  console.log("Backend: Incoming POST /api/bookings body:", newBooking);
  
  if (!newBooking || Object.keys(newBooking).length === 0) {
    console.log("Backend: Error - No booking data provided");
    return res.status(400).json({ error: "No booking data" });
  }

  const bookingWithId = { 
    id: Date.now(), 
    status: "pending",
    ...newBooking 
  };

  bookings.push(bookingWithId);
  console.log("Backend: Booking saved successfully. ID:", bookingWithId.id);
  console.log("Backend: Total bookings now:", bookings.length);

  res.json({
    success: true,
    message: "Booking successful",
    booking: bookingWithId
  });
});

// --- AI Chat ---
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, doctorName, specialty } = req.body;
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Give safe, clear advice.`
      : "You are a professional doctor AI assistant. Give safe advice.";

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
    res.json({ reply: data.choices?.[0]?.message?.content || "No response" });
  } catch (err) {
    res.json({ reply: "AI Doctor unavailable" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
