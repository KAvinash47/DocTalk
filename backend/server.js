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

// ✅ GET user bookings (Case-Insensitive)
app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userBookings = bookings.filter(b => 
    String(b.userId).toLowerCase() === String(userId).toLowerCase()
  );
  res.json(userBookings);
});

// ✅ GET doctor bookings (Flexible ID matching)
app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const doctorBookings = bookings.filter(b => 
    String(b.doctorId) === String(doctorId)
  );
  res.json(doctorBookings);
});

// ✅ POST new booking (With Data Enrichment)
app.post("/api/bookings", (req, res) => {
  const { doctorId, userId, appointmentDate, timeSlot } = req.body;
  
  if (!doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Find doctor details to enrich the booking
  const doctor = doctors.find(d => String(d.id) === String(doctorId));
  
  const bookingWithId = { 
    id: Date.now(), 
    status: "pending",
    doctorId: parseInt(doctorId),
    userId: userId || "guest",
    appointmentDate,
    timeSlot,
    // Enriching data from doctors.json
    doctorName: doctor ? doctor.name : "Unknown Doctor",
    speciality: doctor ? doctor.specialization : "General",
    fee: doctor ? doctor.consultationFee : 500
  };

  bookings.push(bookingWithId);
  res.json({ success: true, message: "Booking successful", booking: bookingWithId });
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
