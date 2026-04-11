const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// ✅ GLOBAL REQUEST LOGGER
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
    key_debug: {
        present: !!process.env.OPENROUTER_API_KEY,
        length: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0,
        prefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 7) : "None"
    }
}));

app.get('/api/doctors', (req, res) => res.json(doctors));

app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => String(d.id) === String(req.params.id));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

app.get("/api/bookings", (req, res) => res.json(bookings));

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

// --- OPENROUTER AI INTEGRATION (DEEPSEEK V3 ONLY) ---

const callOpenRouter = async (message, doctorName, specialty) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) return "AI Key not configured on server.";

    // Using strictly DeepSeek V3 (deepseek/deepseek-chat)
    const model = "deepseek/deepseek-chat";
    
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Give safe, clear medical guidance. Keep it brief. Always mention you are an AI assistant representing ${doctorName}.`
      : "You are a professional doctor AI assistant. Give safe medical advice. Always include a disclaimer.";

    try {
        console.log(`Requesting DeepSeek V3...`);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "X-Title": "DocTalk"
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ]
          })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]?.message?.content) {
            console.log(`✅ Success with DeepSeek V3`);
            return data.choices[0].message.content;
        }
        
        const errorMsg = data.error?.message || "Model returned empty response.";
        console.error(`❌ DeepSeek V3 failed:`, errorMsg);
        return `AI Service Error: ${errorMsg}`;
    } catch (err) {
        console.error(`❌ Connection error: ${err.message}`);
        return "AI Doctor currently unavailable.";
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
