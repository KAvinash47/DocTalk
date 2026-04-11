import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';

const MyBookings = () => {
    useDocumentTitle('My Appointments');
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const colors = ['#0088FE', '#FFBB28', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        const path = `M${x},${y + height} L${x + width / 2},${y} L${x + width},${y + height} Z`;
        return <path d={path} stroke="none" fill={fill} />;
    };

    const processChartData = (appointments) => {
        const doctorGroups = appointments.reduce((acc, app) => {
            const name = app.doctorName || "Unknown";
            if (!acc[name]) acc[name] = [];
            acc[name].push(app);
            return acc;
        }, {});
        return Object.keys(doctorGroups).map(doctor => ({
            name: doctor.split(' ')[1] || doctor,
            fee: doctorGroups[doctor].reduce((sum, app) => sum + parseInt(app.fee || 0), 0)
        }));
    };

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/bookings/user/${user.email}`);
                const data = await response.json();
                console.log("My Bookings Data:", data);
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
        const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
        setAppointments(updatedAppointments);
        setChartData(processChartData(updatedAppointments));
        toast.warning(`Appointment cancelled`);
    };

    if (loading) {
        return (
            <div className="py-16 text-center bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            <div className="w-11/12 mx-auto py-12">
                <div className="text-center mb-12 animate-fade-up">
                    <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">My Appointments</h2>
                    <p className="text-gray-600 dark:text-slate-400 font-medium">Connect with your doctors easily through our secure platform.</p>
                </div>

                {appointments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            {appointments.map((appointment, index) => (
                                <div key={appointment.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-2xl shadow-blue-100/20 dark:shadow-black/50 border border-transparent dark:border-slate-800 flex justify-between items-center animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{appointment.doctorName}</h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-3">{appointment.speciality || appointment.specialization}</p>
                                        <div className="space-y-1">
                                            <p className="text-gray-500 dark:text-slate-400 font-bold text-sm">Date: <span className="text-slate-900 dark:text-white">{appointment.appointmentDate}</span></p>
                                            <p className="text-gray-500 dark:text-slate-400 font-bold text-sm">Time: <span className="text-slate-900 dark:text-white">{appointment.timeSlot}</span></p>
                                        </div>
                                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-4">₹{appointment.fee}</p>
                                    </div>
                                    <button onClick={() => handleCancelAppointment(appointment.id)} className="btn btn-error btn-outline rounded-2xl px-8 font-bold border-2">Cancel</button>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-2xl shadow-blue-100/20 dark:shadow-black/50 border border-transparent dark:border-slate-800 sticky top-28">
                                <h3 className="text-xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">Fee Distribution</h3>
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} />
                                            <YAxis hide />
                                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="fee" shape={<TriangleBar />} label={{ position: 'top', fontSize: 10, fontWeight: 'bold' }}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] shadow-xl dark:shadow-2xl border border-transparent dark:border-slate-800 animate-fade-up">
                        <div className="text-8xl mb-8">🗓️</div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No Appointments Found</h3>
                        <p className="text-gray-500 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">Your health journey starts with a single click. Connect with top specialists today.</p>
                        <button onClick={() => navigate('/')} className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-12 rounded-full h-14 font-black shadow-xl">Find a Doctor</button>
                    </div>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
        </div>
    );
};

export default MyBookings;
