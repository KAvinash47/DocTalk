import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api/config";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorBookings = async () => {
      console.log("Dashboard: Checking user...", user);
      if (!user) {
        console.log("Dashboard: No user found in context");
        return;
      }
      if (user.role !== "doctor") {
        console.log("Dashboard: User is not a doctor. Role:", user.role);
        return;
      }
      
      setLoading(true);
      try {
        const doctorId = String(user.id || "1");
        const url = `${API_BASE_URL}/api/bookings/doctor/${doctorId}`;
        console.log("Dashboard: Fetching from...", url);
        
        const res = await fetch(url);
        const data = await res.json();
        console.log("Dashboard: Received data:", data);
        setAppointments(data);
      } catch (error) {
        console.error("Dashboard: Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorBookings();
  }, [user]);

  const handleAccept = (id) => {
    const updated = appointments.map((app) =>
      app.id === id ? { ...app, status: "accepted" } : app
    );
    setAppointments(updated);
    // Note: In this in-memory demo, status updates are local-only unless we add a PUT route
  };

  const handleReject = (id) => {
    const updated = appointments.map((app) =>
      app.id === id ? { ...app, status: "rejected" } : app
    );
    setAppointments(updated);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-4">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Doctor Dashboard
        </h2>
        <p className="text-gray-500 mt-2">
          Manage all your appointments in one place
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto space-y-6">

        {appointments.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-lg">
              No appointments yet 📅
            </p>
          </div>
        ) : (
          appointments.map((app) => (

            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >

              {/* LEFT INFO */}
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  Patient ID: {app.userId}
                </h3>

                <p className="text-gray-600">
                  Appointment Date: {app.appointmentDate}
                </p>

                <p className="text-gray-600">
                  Time Slot: <span className="font-medium">{app.timeSlot}</span>
                </p>

                <p className="text-gray-600">
                  Fee: <span className="font-medium">₹{app.fee}</span>
                </p>

                {/* STATUS BADGE */}
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status || "pending"}
                </span>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(app.id)}
                  disabled={app.status === "accepted"}
                  className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                    app.status === "accepted"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 hover:scale-105"
                  }`}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(app.id)}
                  disabled={app.status === "rejected"}
                  className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                    app.status === "rejected"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 hover:scale-105"
                  }`}
                >
                  Reject
                </button>
              </div>

            </div>

          ))
        )}

      </div>
    </div>
  );
};

export default Dashboard;
