import { useEffect, useState } from "react";

const Dashboard = () => {

  const [appointments, setAppointments] = useState([]);

  // Load appointments from localStorage
  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(storedAppointments);
  }, []);

  // Accept appointment
  const handleAccept = (id) => {

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === id) {
        return { ...appointment, status: "Accepted" };
      }
      return appointment;
    });

    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
  };

  // Reject appointment
  const handleReject = (id) => {

    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== id
    );

    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">

      <h2 className="text-3xl font-bold text-center mb-10">
        Doctor Appointment Dashboard
      </h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">
          No appointments booked yet
        </p>
      ) : (
        appointments.map((appointment) => (

          <div
            key={appointment.id}
            className="bg-white shadow-md rounded-xl p-6 mb-6 flex justify-between items-center"
          >

            <div className="space-y-1">

              <p>
                <b>Doctor:</b> {appointment.doctorName}
              </p>

              <p>
                <b>Speciality:</b> {appointment.speciality}
              </p>

              <p>
                <b>Consultation Fee:</b> ₹{appointment.fee}
              </p>

              <p>
                <b>Booked At:</b>{" "}
                {new Date(appointment.bookingDate).toLocaleString()}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  className={
                    appointment.status === "Accepted"
                      ? "text-green-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {appointment.status || "Pending"}
                </span>
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => handleAccept(appointment.id)}
                disabled={appointment.status === "Accepted"}
                className={`px-4 py-2 rounded text-white ${
                  appointment.status === "Accepted"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Accept
              </button>

              <button
                onClick={() => handleReject(appointment.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>

        ))
      )}

    </div>
  );
};

export default Dashboard;