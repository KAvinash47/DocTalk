import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { RiRegisteredLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDocumentTitle from '../hooks/useDocumentTitle';

const DoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [hasBooked, setHasBooked] = useState(false);
    const [loading, setLoading] = useState(true);

    useDocumentTitle(doctor ? `${doctor.name}` : 'Doctor Details');

    useEffect(() => {
        setLoading(true);
        // Check if user has already booked
        const bookings = JSON.parse(localStorage.getItem('appointments')) || [];
        const existingBooking = bookings.find(booking => booking.doctorId === parseInt(id));
        setHasBooked(!!existingBooking);

        fetch('/Data/doctors.json')
            .then(res => res.json())
            .then(data => {
                const selectedDoctor = data.find(doc => doc.id === parseInt(id));
                setDoctor(selectedDoctor);
                setLoading(false);
            });
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
                <p className="text-gray-600">The doctor you are looking for with this id: <span className='text-red-400'>{id}</span> does not exist.</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Check if doctor is available today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = doctor.workingDays.includes(today);

    const handleBooking = () => {
        if (!isAvailableToday) {
            toast.error('Doctor is unavailable today');
            return;
        }

        if (hasBooked) {
            toast.error('You have already booked an appointment with this doctor!');
            return;
        }

        // Create new booking with all required fields
        const newBooking = {
            id: Date.now(), // Unique ID for the appointment
            doctorId: doctor.id,
            doctorName: doctor.name,
            education: doctor.qualification,
            speciality: doctor.specialization,
            fee: doctor.consultationFee,
            bookingDate: new Date().toISOString()
        };

        // Save to localStorage
        const bookings = JSON.parse(localStorage.getItem('appointments')) || [];
        localStorage.setItem('appointments', JSON.stringify([...bookings, newBooking]));

        // Show success message
        toast.success(`Appointment booked successfully with ${doctor.name}`);

        // Navigate to bookings page
        setTimeout(() => navigate('/my-bookings'), 2000);
    };

    return (
        <div>
            <div className="w-11/12 mx-auto py-16 space-y-4">
                {/* Profile Details Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-4">Doctor's Profile Details</h2>
                    <p className="text-gray-600 text-center">Welcome to our doctor's detailed profile page, where you can find comprehensive information about our healthcare professional. Here you'll discover their qualifications, specialization, working hours, and consultation details. We ensure transparency in our booking process to provide you with a seamless healthcare experience.</p>
                </div>

                {/* Doctor Information Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <div className="overflow-hidden rounded-2xl">
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover object-top" />
                            </div>
                        </div>
                        <div className="md:w-2/3 space-y-4 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold text-gray-800">{doctor.name}</h3>
                            <p className="text-gray-600">{doctor.qualification}</p>
                            <p className="text-gray-600">{doctor.specialization}</p>

                            <div className="space-y-2">
                                <p className="text-gray-700">Working at</p>
                                <p className="font-semibold">{doctor.hospital}</p>
                            </div>

                            <div className="flex items-center gap-2 border-t-2 py-4 border-b-2 border-dashed border-gray-300">
                                <span><RiRegisteredLine className='text-sm' /></span>
                                <span>Reg No:</span>
                                <span className="font-medium">{doctor.registration.split(': ')[1]}</span>
                            </div>

                            <div className="space-y-2">
                                <p>Availability</p>
                                <div className="flex gap-2">
                                    {doctor.workingDays.map((day, index) => (
                                        <span key={index} className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm">{day}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1 flex gap-2">
                                <p>Consultation Fee:</p>
                                <p className="text-blue-600 font-semibold">Rupees : {doctor.consultationFee} <span className="text-gray-500 text-sm">(Incl. VAT) Per consultation</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book Appointment Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-t-2 py-4 border-b-2 border-dashed border-gray-300">
                            <span>Availability</span>
                            <span className={`${isAvailableToday ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-4 py-1 rounded-full text-sm`}>
                                {isAvailableToday ? 'Doctor Available Today' : 'Doctor Unavailable Today'}
                            </span>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <p className="text-orange-800 text-sm">
                                {isAvailableToday 
                                    ? 'Due to high patient volume, we are currently accepting appointments for today only. We appreciate your understanding and cooperation.'
                                    : 'The doctor is not available for appointments today. Please check the working days schedule and book on an available day.'}
                            </p>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={!isAvailableToday || hasBooked}
                            className={`btn w-full py-4 rounded-full text-lg font-medium transition-colors ${
                                !isAvailableToday || hasBooked
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {!isAvailableToday ? 'Doctor Unavailable' : hasBooked ? 'Already Booked' : 'Book Appointment Now'}
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default DoctorDetails;