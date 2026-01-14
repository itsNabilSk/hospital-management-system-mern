import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Calendar, User, Clock, Heart, Mail, Phone, Activity, CheckCircle, ArrowRight } from 'lucide-react';


const CityHospitalWebsite = () => {
  const [patientId, setPatientId] = useState(localStorage.getItem("patientId"));
  const [step, setStep] = useState(1);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    disease: ''
  });

  const [appointmentForm, setAppointmentForm] = useState({
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });

  const doctors = [
    { name: 'Dr. Sharma', specialization: 'Cardiologist', icon: '❤️' },
    { name: 'Dr. Patel', specialization: 'General Physician', icon: '🩺' },
    { name: 'Dr. Kumar', specialization: 'Eye Specialist', icon: '👁️' },
    { name: 'Dr. Singh', specialization: 'Orthopedic', icon: '🦴' },
    { name: 'Dr. Mehta', specialization: 'Neurologist', icon: '🧠' }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

 
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientForm),
      });

      const data = await response.json();

      if (data.success) {
        const newPatientId = data.data._id;
        
        setCurrentPatient(data.data);
        setPatientId(newPatientId);
        localStorage.setItem("patientId", newPatientId);
        
        setStep(2);
        setAppointmentForm({
          ...appointmentForm,
          reason: patientForm.disease
        });
        
        console.log("Patient created with ID:", newPatientId);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    patientId,
    doctorName: appointmentForm.doctorName,
    appointmentDate: new Date(appointmentForm.appointmentDate),
    timeSlot: appointmentForm.appointmentTime,
    reason: appointmentForm.reason,
  };

  console.log("🔥 FINAL APPOINTMENT PAYLOAD 👉", payload);

  try {
    await axios.post(
      "http://localhost:5000/api/appointments/book",
      payload
    );

    setStep(3); // ✅ move to confirmation step
  } catch (error) {
    console.error("❌ APPOINTMENT ERROR", error.response?.data || error.message);
    alert(error.response?.data?.message || "Appointment booking failed");
  } finally {
    setLoading(false);
  }
};


  const resetFlow = () => {
    setStep(1);
    setCurrentPatient(null);
    setPatientId(null);
    localStorage.removeItem("patientId");
    setPatientForm({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      disease: ''
    });
    setAppointmentForm({
      doctorName: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue-900">🏥 CITY HOSPITAL</h1>
              <p className="text-gray-600 mt-1">Hospital Management System</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <span className="font-semibold">Patient Registration</span>
          </div>
          
          <ArrowRight className={step >= 2 ? 'text-blue-600' : 'text-gray-400'} />
          
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className="font-semibold">Book Appointment</span>
          </div>
          
          <ArrowRight className={step >= 3 ? 'text-green-600' : 'text-gray-400'} />
          
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
            <span className="font-semibold">Confirmed</span>
          </div>
        </div>

        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
              <div className="text-center mb-8">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">🧾 Create Patient Form</h2>
                <p className="text-gray-600"></p>
              </div>

              <form onSubmit={handlePatientSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={patientForm.age}
                      onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                    <select
                      required
                      value={patientForm.gender}
                      onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Disease / Problem *</label>
                  <textarea
                    required
                    value={patientForm.disease}
                    onChange={(e) => setPatientForm({ ...patientForm, disease: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jaise: fever, heart pain, eye issue, etc."
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Creating Patient...
                    </>
                  ) : (
                    <>
                      Create Patient
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && patientId && currentPatient && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-600">
              <div className="text-center mb-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">🗓️ Book Appointment</h2>
                <p className="text-gray-600">Welcome, <strong>{currentPatient.name}</strong>! 👋</p>
                <p className="text-sm text-gray-500 mt-1">Patient ID: {patientId}</p>
              </div>

              <form onSubmit={handleAppointmentSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Doctor *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {doctors.map((doctor) => (
                      <label
                        key={doctor.name}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          appointmentForm.doctorName === doctor.name
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="doctor"
                          value={doctor.name}
                          checked={appointmentForm.doctorName === doctor.name}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                          className="w-5 h-5"
                          required
                        />
                        <span className="text-2xl">{doctor.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentForm.appointmentDate}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Time Slot *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <label
                        key={time}
                        className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                          appointmentForm.appointmentTime === time
                            ? 'border-green-600 bg-green-50 font-semibold'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={time}
                          checked={appointmentForm.appointmentTime === time}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentTime: e.target.value })}
                          className="hidden"
                          required
                        />
                        <Clock className="w-4 h-4 inline-block mr-1" />
                        {time}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit *</label>
                  <textarea
                    required
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="General checkup / Eye pain / Heart problem"
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 3 && currentPatient && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-600">
              <div className="text-center mb-8">
                <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-green-600 mb-4">✅ Appointment Confirmed!</h2>
                <p className="text-xl text-gray-700 mb-2">Congratulations, {currentPatient.name}!</p>
                <p className="text-gray-600">Your appointment has been successfully booked.</p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Appointment Details:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Patient Name</p>
                      <p className="font-semibold text-gray-900">{currentPatient.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-semibold text-gray-900">{appointmentForm.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(appointmentForm.appointmentDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">{appointmentForm.appointmentTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Email Confirmation Sent</p>
                      <p className="font-semibold text-gray-900">{currentPatient.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 mb-6 border-l-4 border-blue-600">
                <p className="text-sm text-blue-900">
                  📧 <strong>Email Confirmation:</strong> A confirmation email has been sent to your email address with all appointment details.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-sm text-yellow-900">
                    ⚠️ <strong>Important:</strong> Please arrive 15 minutes before your appointment time.
                  </p>
                </div>
                
                <button
                  onClick={resetFlow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">🏥 CITY HOSPITAL</h3>
          <p className="text-gray-400 mb-4">Your Health, Our Priority</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>📞 Emergency: +91 1234567890</span>
            <span>📧 info@cityhospital.com</span>
            <span>📍 Mumbai, Maharashtra</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CityHospitalWebsite;