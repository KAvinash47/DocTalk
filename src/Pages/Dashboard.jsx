import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/config";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({ total: 0, matched: 0 });

  const fetchBookings = async () => {
    if (!user || user.role !== "doctor") return;

    setLoading(true);
    try {
      const doctorId = String(user.id || "1");
      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      const allData = await res.json();

      const matched = allData.filter(b => String(b.doctorId) === doctorId);

      setAppointments(matched);
      setStats({ total: allData.length, matched: matched.length });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Dashboard: Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleAccept = (id) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "accepted" } : app));
  };

  const handleReject = (id) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "rejected" } : app));
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Doctor Dashboard
        </h2>
        <div className="mt-4 flex justify-center gap-4">
            <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase">
                Logged in as ID: {user?.id || "1"}
            </span>
            <button
                onClick={fetchBookings}
                className="text-xs font-bold text-blue-500 underline hover:text-blue-700"
            >
                Refresh Data
            </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-16 rounded-[40px] shadow-xl text-center border border-transparent dark:border-slate-800">
            <div className="text-6xl mb-6">📅</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">
              No appointments found for your ID.
            </p>
            <p className="text-xs text-slate-400 mt-2">
                (Server has {stats.total} total bookings, but none match your ID)
            </p>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 border border-transparent dark:border-slate-800">
              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Patient: {app.userId}</h3>
                <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <p>Date: {app.appointmentDate}</p>
                    <p>Time: {app.timeSlot}</p>
                    <p className="text-blue-600">Fee: ₹{app.fee}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${app.status === "accepted" ? "bg-green-100 text-green-700" : app.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {app.status || "pending"}
                </span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleAccept(app.id)} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-blue-700 transition-all">Accept</button>
                <button onClick={() => handleReject(app.id)} className="px-8 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-sm border border-red-100 hover:bg-red-500 hover:text-white transition-all">Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
