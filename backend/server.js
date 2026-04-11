const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ✅ Load doctors.json
const doctorsPath = path.join(__dirname, '../public/Data/doctors.json');
let doctors = [];
try {
  doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf8'));
  console.log("Doctors loaded:", doctors.length);
} catch (err) {
  console.error("Error loading doctors:", err.message);
}

// ✅ In-memory bookings
let bookings = [];

// --- API Routes ---

app.get('/', (req, res) => res.json({ status: "Backend is running!", time: new Date() }));

app.get('/api/doctors', (req, res) => res.json(doctors));

app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

app.post('/api/bookings', (req, res) => {
  const { doctorId, userId, appointmentDate, timeSlot } = req.body;
  if (!doctorId || !appointmentDate || !timeSlot) return res.status(400).json({ message: "Missing fields" });
  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const booking = { id: Date.now(), doctorId: parseInt(doctorId), userId: userId || "guest", doctorName: doctor.name, speciality: doctor.specialization, fee: doctor.consultationFee, appointmentDate, timeSlot, status: "pending" };
  bookings.push(booking);
  res.json({ message: "Booking successful", booking });
});

app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userBookings = bookings.filter(b => String(b.userId).toLowerCase() === String(userId).toLowerCase());
  res.json(userBookings);
});

app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const doctorBookings = bookings.filter(b => b.doctorId === parseInt(doctorId));
  res.json(doctorBookings);
});

// --- OPENROUTER AI INTEGRATION ---

const callOpenRouter = async (message, doctorName, specialty) => {
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Speak in a professional, empathetic tone. Give safe, clear medical guidance. Keep responses short. Always mention you are an AI assistant representing ${doctorName}.`
      : "You are a professional doctor AI assistant. Give helpful, safe, and simple medical advice. Always include a disclaimer that you are an AI.";

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
    return data.choices?.[0]?.message?.content || "No response";
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

app.get('/api/health', (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
