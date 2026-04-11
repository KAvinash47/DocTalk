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

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { doctorId, userId, appointmentDate, timeSlot } = req.body;
  
  if (!doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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

// --- OPENROUTER AI INTEGRATION ---

const callOpenRouter = async (message, doctorName, specialty) => {
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Give safe, clear advice. Short responses. Always mention you are an AI assistant representing ${doctorName}.`
      : "You are a professional doctor AI assistant. Give safe advice. Always include a disclaimer.";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
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
        return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (err) {
        console.error("OpenRouter error:", err);
        return "AI Doctor is currently unavailable. Please try again.";
    }
};

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, doctorName, specialty } = req.body;
    const reply = await callOpenRouter(message, doctorName, specialty);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "AI Doctor unavailable" });
  }
});

app.post('/api/ai-doctor', async (req, res) => {
    try {
      const { message } = req.body;
      const reply = await callOpenRouter(message);
      res.json({ response: reply });
    } catch (err) {
      res.json({ response: "AI Doctor unavailable" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
