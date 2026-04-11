const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// ✅ GLOBAL REQUEST LOGGER (Helpful for Render Debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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

app.get('/', (req, res) => res.json({ 
    status: "Backend is running!", 
    time: new Date(),
    env_check: process.env.OPENROUTER_API_KEY ? "API Key Found ✅" : "API Key MISSING ❌"
}));

app.get('/api/doctors', (req, res) => res.json(doctors));

app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => String(d.id) === String(req.params.id));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { doctorId, userId, appointmentDate, timeSlot } = req.body;
  if (!doctorId || !appointmentDate || !timeSlot) return res.status(400).json({ error: "Missing fields" });

  const doctor = doctors.find(d => String(d.id) === String(doctorId));
  const booking = { 
    id: Date.now() + Math.random(), 
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
  res.json({ success: true, message: "Booking successful", booking });
});

app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(bookings.filter(b => String(b.userId).toLowerCase() === String(userId).toLowerCase()));
});

app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  res.json(bookings.filter(b => String(b.doctorId) === String(doctorId)));
});

// --- AI Chat ---
app.post('/api/ai-chat', async (req, res) => {
  const { message, doctorName, specialty } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;

  console.log(`AI Chat Request: "${message}" for doctor: ${doctorName || "Generic"}`);

  if (!API_KEY) {
    console.error("CRITICAL: OPENROUTER_API_KEY is missing from environment variables!");
    return res.status(500).json({ reply: "AI Service Error: API Key not configured on server." });
  }

  try {
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Give safe, clear advice. Short responses. Mention you are an AI representing ${doctorName}.`
      : "You are a professional doctor AI assistant. Give safe advice. Always include a disclaimer.";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://doctalk-master.vercel.app", // Optional for OpenRouter
        "X-Title": "DocTalk"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        console.error("OpenRouter API Error:", data.error);
        return res.status(500).json({ reply: `AI Error: ${data.error.message}` });
    }

    const aiReply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    res.json({ reply: aiReply });

  } catch (err) {
    console.error("AI Server Crash:", err);
    res.status(500).json({ reply: "AI Doctor currently unavailable due to a connection error." });
  }
});

// Sync AI Assistant route
app.post('/api/ai-doctor', async (req, res) => {
    const { message } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) return res.status(500).json({ response: "API Key missing" });

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [{ role: "system", content: "You are a helpful doctor AI. Give safe advice." }, { role: "user", content: message }]
        })
      });
      const data = await response.json();
      res.json({ response: data.choices?.[0]?.message?.content || "No response" });
    } catch (err) {
      res.json({ response: "AI Doctor unavailable" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
