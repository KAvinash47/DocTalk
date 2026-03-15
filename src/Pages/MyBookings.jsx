import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MyBookings = () => {
    useDocumentTitle('My Appointments');
    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const navigate = useNavigate();

    // Colors for triangle bars
    const colors = ['#0088FE', '#FFBB28', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Custom triangle shape generator function
    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}
                C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
                ${x + width / 2}, ${y}
                C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
                Z`;
    };

    // Custom Triangle Bar component
    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    const processChartData = (appointments) => {
        // Group appointments by doctor
        const doctorGroups = appointments.reduce((acc, app) => {
            if (!acc[app.doctorName]) {
                acc[app.doctorName] = [];
            }
            acc[app.doctorName].push(app);
            return acc;
        }, {});

        // Create data points for each doctor
        const doctors = Object.keys(doctorGroups);

        // Create a data point for each doctor
        return doctors.map(doctor => {
            const totalFee = doctorGroups[doctor].reduce((sum, app) => sum + parseInt(app.fee), 0);
            return {
                name: doctor,
                fee: totalFee
            };
        });
    };

    useEffect(() => {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
            const parsedAppointments = JSON.parse(storedAppointments);
            setAppointments(parsedAppointments);
            setChartData(processChartData(parsedAppointments));
        }
    }, []);

    const handleCancelAppointment = (appointmentId) => {
        const canceledAppointment = appointments.find(app => app.id === appointmentId);
        const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
        setAppointments(updatedAppointments);
        setChartData(processChartData(updatedAppointments));
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        toast.warning(`Appointment with ${canceledAppointment.doctorName} cancelled`);
    };

    return (
        <div>
            <div className="min-h-[calc(100vh-400px)] w-11/12 mx-auto py-12">

                {appointments.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                        <h3 className="text-xl font-semibold mb-6">Appointment Fees Distribution</h3>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                                    <Bar
                                        dataKey="fee"
                                        shape={<TriangleBar />}
                                        label={{ position: 'top' }}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-2">My Today Appointments</h2>
                    <p className="text-gray-600 text-center mb-12">Our platform connects you with well-verified, experienced doctors across various specialties — all at your convenience.</p>
                </div>
                {appointments.length > 0 ? (
                    <div className="space-y-6">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold">{appointment.doctorName}</h3>
                                    <span className="text-gray-500 font-medium">Appointment Fee: {appointment.fee} Rupees</span>
                                </div>
                                <div className="space-y-2 mb-4 border-b-2 border-dashed border-gray-300 pb-2">
                                    <p className="text-gray-600">{appointment.education}</p>
                                    <p className="text-gray-600">{appointment.speciality}</p>
                                </div>
                                <button
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="btn w-full py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                                >
                                    Cancel Appointment
                                </button>
                            </div>
                        ))}
                        <div className='mt-4 flex flex-col justify-center'>
                            <button
                                onClick={() => navigate('/')}
                                className='btn bg-blue-400 text-white hover:bg-blue-500 rounded-2xl'
                            >
                                Book Another Doctor
                            </button>
                        </div>
                    </div>

                ) : (
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">No Appointments Found</h3>
                        <button
                            onClick={() => navigate('/')}
                            className="btn bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Book an Appointment
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
                toastClassName="!bg-yellow-100 !text-yellow-900"
            />
        </div>
    );
};

export default MyBookings;