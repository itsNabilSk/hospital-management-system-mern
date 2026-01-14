import React, { useState } from "react";
import axios from "axios";

console.log("🔥 BookAppointment component LOADED");

const BookAppointment = ({ patientId, onSuccess }) => {
  const [form, setForm] = useState({
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const selectDoctor = (name) => {
    setForm((prev) => ({ ...prev, doctorName: name }));
  };

  const selectTime = (time) => {
    setForm((prev) => ({ ...prev, appointmentTime: time }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      patientId,
      doctorName: form.doctorName,
      appointmentDate: new Date(form.appointmentDate),
      timeSlot: form.appointmentTime,
      reason: form.reason,
    };

    console.log("FINAL PAYLOAD 👉", payload);

    try {
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        payload
      );
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (!patientId) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">Book Appointment</h2>

      {/* 👨‍⚕️ DOCTOR SELECTION */}
      <div className="space-y-2">
        <p className="font-semibold">Select Doctor *</p>

        {["Dr. Kumar", "Dr. Singh", "Dr. Mehta"].map((doc) => (
          <button
            key={doc}
            type="button"
            onClick={() => selectDoctor(doc)}
            className={`w-full p-3 border rounded ${
              form.doctorName === doc
                ? "border-green-500 bg-green-50"
                : ""
            }`}
          >
            {doc}
          </button>
        ))}
      </div>

      {/* 📅 DATE */}
      <input
        type="date"
        name="appointmentDate"
        value={form.appointmentDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      {/* ⏰ TIME SLOT */}
      <div className="grid grid-cols-3 gap-2">
        {[
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
        ].map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => selectTime(time)}
            className={`p-2 border rounded ${
              form.appointmentTime === time
                ? "border-green-500 bg-green-50"
                : ""
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* 📝 REASON */}
      <textarea
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason"
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default BookAppointment;
