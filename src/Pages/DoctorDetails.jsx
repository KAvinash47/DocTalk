import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { AuthContext } from '../context/AuthContext';

const DoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    const timeSlots = [
        "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM"
    ];

    useDocumentTitle(doctor ? `${doctor.name}` : 'Doctor Details');

    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            try {
                // Fetch from local JSON file
                const res = await fetch('/Data/doctors.json');
                const data = await res.json();
                const selectedDoctor = data.find(doc => doc.id === parseInt(id));
                setDoctor(selectedDoctor);
            } catch (error) {
                console.error("Error fetching doctor:", error);
                toast.error("Failed to load doctor details");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) {
        return (
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 z-50 flex items-center justify-center">
                <span className="loading loading-bars loading-xl text-blue-600"></span>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">No Doctor Found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="btn bg-blue-600 text-white px-8 rounded-full"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please login first to book an appointment");
            return;
        }

        if (!selectedDate || !selectedSlot) {
            toast.error("Please select both a date and a time slot");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5001/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: parseInt(id),
                    userId: user.email, // Use actual logged in user email
                    appointmentDate: selectedDate,
                    timeSlot: selectedSlot
                })
            });

            if (response.ok) {
                toast.success(`Appointment booked with ${doctor.name}!`);
                setTimeout(() => navigate('/my-bookings'), 2000);
            } else {
                const data = await response.json();
                toast.error(data.message || "Booking failed");
            }
        } catch (error) {
            toast.error("Backend error. Make sure server.js is running!");
        }
    };

    return (
        <div>
            <div className="w-11/12 mx-auto py-16 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
                    <h2 className="text-3xl font-bold text-center mb-4">{doctor.name}</h2>
                    <p className="text-gray-600 text-center">{doctor.specialization} - {doctor.qualification}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <img src={doctor.image} alt={doctor.name} className="rounded-2xl w-full object-cover" />
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <h3 className="text-3xl font-bold">Profile Details</h3>
                            <p><b>Experience:</b> {doctor.experience}</p>
                            <p><b>Hospital:</b> {doctor.hospital}</p>
                            <p><b>Consultation Fee:</b> ₹{doctor.consultationFee}</p>
                            <p><b>Registration:</b> {doctor.registration}</p>
                            <div className="flex gap-2 flex-wrap">
                                <b>Working Days: </b>
                                {doctor.workingDays.map((day, i) => (
                                    <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-sm">{day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
                    <h3 className="text-2xl font-bold text-center mb-6">Schedule Your Appointment</h3>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4"
                    />
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {timeSlots.map((slot, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-2 rounded-lg border ${selectedSlot === slot ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleBooking}
                        className="w-full py-4 rounded-full text-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        Book Appointment
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default DoctorDetails;
