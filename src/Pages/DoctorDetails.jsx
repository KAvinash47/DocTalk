import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { RiRegisteredLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';

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
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950">
                <h2 className="text-2xl font-bold">No Doctor Found</h2>
                <button onClick={() => navigate('/')} className="btn bg-blue-600 text-white px-8 rounded-full border-none shadow-lg">Back to Home</button>
            </div>
        );
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = doctor.workingDays.includes(today);

    const handleBooking = async () => {
        if (!user) {
            toast.warn("Please login to book an appointment");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        if (!selectedDate || !selectedSlot) {
            toast.error("Please select both a date and a time slot");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: parseInt(id),
                    userId: user.email,
                    appointmentDate: selectedDate,
                    timeSlot: selectedSlot
                })
            });

            if (response.ok) {
                toast.success(`Appointment booked with ${doctor.name}`);
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
        <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            <div className="w-11/12 mx-auto py-16 space-y-6">
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-transparent dark:border-slate-800">
                    <h2 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-white">Doctor's Profile Details</h2>
                    <p className="text-gray-600 dark:text-slate-400 text-center font-medium">View doctor details, availability and book your appointment easily.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-transparent dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <img src={doctor.image} alt={doctor.name} className="rounded-2xl w-full object-cover shadow-2xl" />
                        </div>
                        <div className="md:w-2/3 space-y-4 text-slate-900 dark:text-slate-100">
                            <h3 className="text-3xl font-bold">{doctor.name}</h3>
                            <p className="text-gray-600 dark:text-slate-400 font-bold">{doctor.qualification}</p>
                            <p className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm">{doctor.specialization}</p>
                            <p className="font-medium"><b>Hospital:</b> {doctor.hospital}</p>
                            <div className="flex gap-2 flex-wrap pt-2">
                                {doctor.workingDays.map((day, i) => (
                                    <span key={i} className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-1.5 rounded-full text-xs font-black">{day}</span>
                                ))}
                            </div>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 pt-2">₹{doctor.consultationFee}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-transparent dark:border-slate-800">
                    <h3 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white tracking-tight">Schedule Your Appointment</h3>
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Select Date</label>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700 dark:text-slate-200" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Select Time Slot</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {timeSlots.map((slot, i) => (
                                    <button key={i} onClick={() => setSelectedSlot(slot)}
                                        className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${selectedSlot === slot ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-200"}`}>{slot}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleBooking} className="w-full py-5 rounded-full text-lg font-black bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xl hover:scale-[1.02] active:scale-95 mt-4">Book Appointment Now</button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
        </div>
    );
};

export default DoctorDetails;
