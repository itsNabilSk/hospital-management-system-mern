const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const transporter = require("../config/mailer");

const bookAppointment = async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);

    const {
      patientId,
      doctorName,
      appointmentDate,
      timeSlot,
      reason,
    } = req.body;


    if (!patientId || !doctorName || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        message: "Missing required appointment fields",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

 
    const appointment = new Appointment({
      patientId,
      doctorName,
      appointmentDate,
      timeSlot,
      reason,
    });

    await appointment.save();

  
    await transporter.sendMail({
      from: `"City Hospital" <${process.env.EMAIL_USER}>`,
      to: patient.email, // 
      subject: "Appointment Confirmation - City Hospital",
      html: `
        <h2>Appointment Confirmed ✅</h2>
        <p>Hello <b>${patient.name}</b>,</p>
        <p>Your appointment has been successfully booked.</p>
        <hr/>
        <p><b>Doctor:</b> ${doctorName}</p>
        <p><b>Date:</b> ${new Date(appointmentDate).toDateString()}</p>
        <p><b>Time:</b> ${timeSlot}</p>
        <p><b>Reason:</b> ${reason}</p>
        <hr/>
        <p>Please arrive 15 minutes early.</p>
        <p>Thank you for choosing City Hospital.</p>
      `,
    });

    console.log("📧 Email successfully sent to USER:", patient.email);

    return res.status(201).json({
      message: "Appointment booked successfully & email sent to user",
      appointment,
    });
  } catch (error) {
    console.error("❌ BOOK APPOINTMENT SERVER ERROR 👉", error);
    return res.status(500).json({
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
};

module.exports = { bookAppointment };

