import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/config";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0 });

  const fetchBookings = async () => {
    if (!user || user.role !== "doctor") return;

    setLoading(true);
    try {
      // Use the doctor-specific endpoint we just created
      const doctorId = user.id || "1";
      const res = await fetch(`${API_BASE_URL}/api/bookings/doctor/${doctorId}`);
      const data = await res.json();

      setAppointments(data);
      setStats({ total: data.length });
    } catch (error) {
      console.error("Dashboard: Fetch error:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        toast.success(`Appointment ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
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
          PulseTalk Dashboard
        </h2>
        <div className="mt-4 flex flex-col items-center gap-2">
            <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase">
                Dr. {user?.name || "Professional"} (ID: {user?.id || "1"})
            </span>
            <button
                onClick={fetchBookings}
                className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-colors"
            >
                [ Sync Live Data ]
            </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-16 rounded-[40px] shadow-xl text-center border border-transparent dark:border-slate-800">
            <div className="text-6xl mb-6">📅</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-bold uppercase tracking-tight">
              No Pending Consultations
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">
                New bookings will appear here in real-time.
            </p>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 border border-transparent dark:border-slate-800 hover:border-blue-500/30 transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-blue-600">
                        {app.userId?.[0]?.toUpperCase() || "G"}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Patient: {app.userId}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Token ID: {app.id}</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-400 mt-4">
                    <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">📅 {app.appointmentDate}</div>
                    <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">⏰ {app.timeSlot}</div>
                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">💰 ₹{app.fee}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {app.status === "pending" ? (
                    <>
                        <button onClick={() => updateStatus(app.id, "accepted")} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95">Accept Session</button>
                        <button onClick={() => updateStatus(app.id, "rejected")} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Decline</button>
                    </>
                ) : (
                    <span className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center ${
                        app.status === "accepted" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                        {app.status}
                    </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
};

export default Dashboard;
