import React, { useState } from "react";
import axios from "axios";

const CreatePatient = ({ onPatientCreated }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    disease: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:5000/api/patients",
      form
    );

    // 🔥 REAL patientId
    const patientId = res.data.data._id;

    // 🔥 SAVE FOR APPOINTMENT
    localStorage.setItem("patientId", patientId);

    console.log("Patient saved with ID:", patientId);

    // optional callback
    if (onPatientCreated) {
      onPatientCreated(patientId);
    }

    alert("Patient created successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Patient</h2>

      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="age" placeholder="Age" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="disease" placeholder="Disease" onChange={handleChange} required />

      <select name="gender" value={form.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit">Create Patient</button>
      <hr />
    </form>
  );
};

export default CreatePatient;
