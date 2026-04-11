import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
    useDocumentTitle('My Appointments');
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const colors = ['#0088FE', '#FFBB28', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}
                C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
                ${x + width / 2}, ${y}
                C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
                Z`;
    };

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    const processChartData = (appointments) => {
        const doctorGroups = appointments.reduce((acc, app) => {
            if (!acc[app.doctorName]) {
                acc[app.doctorName] = [];
            }
            acc[app.doctorName].push(app);
            return acc;
        }, {});

        const doctors = Object.keys(doctorGroups);
        return doctors.map(doctor => {
            const totalFee = doctorGroups[doctor].reduce((sum, app) => sum + parseInt(app.fee), 0);
            return { name: doctor, fee: totalFee };
        });
    };

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:5001/api/bookings/user/${user.email}`);
                const data = await response.json();
                setAppointments(data);
                setChartData(processChartData(data));
            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast.error("Failed to load appointments from server");
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, [user]);

    const handleCancelAppointment = (appointmentId) => {
        // Simple filter for the demo UI
        const canceledAppointment = appointments.find(app => app.id === appointmentId);
        const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
        setAppointments(updatedAppointments);
        setChartData(processChartData(updatedAppointments));
        toast.warning(`Appointment with ${canceledAppointment.doctorName} cancelled`);
    };

    if (loading) {
        return (
            <div className="py-16 text-center">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="w-11/12 mx-auto py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">My Booked Appointments</h2>
                    <p className="text-gray-600">List of your recent consultations with our verified doctors.</p>
                </div>

                {appointments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Bookings List */}
                        <div className="lg:col-span-2 space-y-6">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center border border-gray-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{appointment.doctorName}</h3>
                                        <p className="text-blue-600 font-medium mb-2">{appointment.speciality}</p>
                                        <p className="text-gray-500 font-medium">Date: <span className="text-gray-800">{appointment.appointmentDate}</span></p>
                                        <p className="text-gray-500 font-medium">Time: <span className="text-gray-800">{appointment.timeSlot}</span></p>
                                        <p className="text-gray-800 font-bold mt-2">Fee: ₹{appointment.fee}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                        className="btn bg-red-50 text-red-600 border-none hover:bg-red-100 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Chart View */}
                        <div className="bg-white p-6 rounded-2xl shadow-md h-fit border border-gray-100">
                            <h3 className="text-lg font-bold mb-6">Spending Distribution</h3>
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Bar dataKey="fee" shape={<TriangleBar />} label={{ position: 'top', fontSize: 10 }}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-400 mb-6">No Bookings Found</h3>
                        <button
                            onClick={() => navigate('/')}
                            className="btn bg-blue-600 text-white px-8 rounded-full"
                        >
                            Book Your First Appointment
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default MyBookings;
