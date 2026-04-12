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
} catch (err) {
  console.error("Error loading doctors:", err.message);
}

// ✅ Load diseases.json
const diseasesPath = path.join(__dirname, '../public/Data/diseases.json');
let diseases = [];
try {
  diseases = JSON.parse(fs.readFileSync(diseasesPath, 'utf8'));
} catch (err) {
  console.error("Error loading diseases:", err.message);
}

// In-memory storage
let bookings = [];

// --- API Routes ---

app.get('/', (req, res) => res.json({ 
    status: "Backend is running!", 
    engine: "DeepSeek V3",
    last_update: "11:45 PM",
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

// ✅ GET diseases
app.get('/api/diseases', (req, res) => res.json(diseases));

app.get('/api/diseases/:id', (req, res) => {
    const disease = diseases.find(d => String(d.id) === String(req.params.id));
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.json(disease);
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

// --- OPENROUTER AI INTEGRATION ---

const callOpenRouter = async (message, systemPrompt) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) return "AI Key not configured on server.";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
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
        return data.choices?.[0]?.message?.content || "No response";
    } catch (err) {
        console.error("OpenRouter error:", err);
        return "AI Service Error";
    }
};

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, doctorName, specialty } = req.body;
    const systemPrompt = doctorName 
      ? `You are ${doctorName}, a professional ${specialty}. Give safe, clear advice. Short responses. Always mention you are an AI assistant representing ${doctorName}.`
      : "You are a professional doctor AI assistant. Give safe advice. Always include a disclaimer.";
    const reply = await callOpenRouter(message, systemPrompt);
    res.json({ reply });
  } catch (err) {
    res.json({ reply: "AI Doctor unavailable" });
  }
});

// ✅ NEW: AI Symptom Checker Route
app.post('/api/ai-check', async (req, res) => {
    const { symptoms, diseaseName } = req.body;
    const systemPrompt = `You are a professional medical assistant AI. 
    Based on the symptoms provided, estimate if the user might have ${diseaseName}.
    
    IMPORTANT:
    - Do not give strict diagnosis
    - Always suggest consulting a doctor
    - Keep language simple and human-friendly
    
    Respond STRICTLY in the following format:
    1. Match percentage: [X%]
    2. Severity: [Low/Medium/High]
    3. Possible explanation: [Short description]
    4. Immediate precautions: [List]
    5. When to see a doctor: [Advice]`;

    try {
        const reply = await callOpenRouter(`User symptoms: ${symptoms}`, systemPrompt);
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ reply: "Symptom checker is currently unavailable." });
    }
});

app.post('/api/ai-doctor', async (req, res) => {
    try {
      const { message } = req.body;
      const reply = await callOpenRouter(message, "You are a professional doctor AI assistant. Give safe advice.");
      res.json({ response: reply });
    } catch (err) {
      res.json({ response: "AI Doctor unavailable" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
