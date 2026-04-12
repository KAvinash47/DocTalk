const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// ✅ Global Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper to read JSON files safely
const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
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

// ✅ GET all diseases (Fixed Route)
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
    // In-memory or database logic here
    res.json([]); 
});

// ✅ POST AI Symptom Check
app.post('/api/ai-check', async (req, res) => {
    const { symptoms, diseaseName } = req.body;
    // ... existing AI logic ...
    res.json({ reply: "AI analysis results..." });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
