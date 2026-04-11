const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ✅ Load doctors.json properly
// Corrected path for backend/server.js to public/Data/doctors.json
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

// ✅ GET doctors
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// ✅ GET single doctor
app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

// ✅ POST booking
app.post('/api/bookings', (req, res) => {
  console.log("Incoming Booking Request:", req.body);

  const { doctorId, userId, appointmentDate, timeSlot } = req.body;

  if (!doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ message: "Missing fields (doctorId, appointmentDate, or timeSlot)" });
  }

  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  // Create booking object
  const booking = {
    id: Date.now(),
    doctorId: parseInt(doctorId),
    userId: userId || "guest", // Capture the userId from the frontend
    doctorName: doctor.name,
    speciality: doctor.specialization,
    fee: doctor.consultationFee,
    appointmentDate,
    timeSlot,
    status: "pending"
  };

  bookings.push(booking);

  console.log("Booking saved successfully:", booking);
  res.json({ message: "Booking successful", booking });
});

// ✅ GET user bookings
app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`GET bookings for user: "${userId}"`);
  
  const userBookings = bookings.filter(b => 
    String(b.userId).toLowerCase() === String(userId).toLowerCase()
  );
  
  console.log(`Found ${userBookings.length} matches out of ${bookings.length} total bookings`);
  res.json(userBookings);
});

// ✅ GET doctor bookings
app.get('/api/bookings/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  console.log(`GET bookings for doctor ID: ${doctorId}`);
  
  const doctorBookings = bookings.filter(b => b.doctorId === parseInt(doctorId));
  console.log(`Found ${doctorBookings.length} matches`);
  res.json(doctorBookings);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test doctors at: http://localhost:5001/api/doctors`);
});
