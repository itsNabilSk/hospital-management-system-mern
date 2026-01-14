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

    // 🔒 validation
    if (!patientId || !doctorName || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        message: "Missing required appointment fields",
      });
    }

    // 🧑‍⚕️ get patient details (email, name)
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // 💾 save appointment
    const appointment = new Appointment({
      patientId,
      doctorName,
      appointmentDate,
      timeSlot,
      reason,
    });

    await appointment.save();

    // // 📧 SEND EMAIL (IMPORTANT PART)
    // await transporter.sendMail({
    //   from: `"City Hospital" <${process.env.EMAIL_USER}>`,
    //   to: patient.email,
    //   subject: "Appointment Confirmation - City Hospital",
    //   html: `
    //     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    //       <h2 style="color: #16a34a;">✅ Appointment Confirmed</h2>
    //       <p>Hello <b>${patient.name}</b>,</p>
    //       <p>Your appointment has been successfully booked.</p>

    //       <h3>📋 Appointment Details:</h3>
    //       <ul>
    //         <li><b>Doctor:</b> ${doctorName}</li>
    //         <li><b>Date:</b> ${new Date(appointmentDate).toDateString()}</li>
    //         <li><b>Time:</b> ${timeSlot}</li>
    //         <li><b>Reason:</b> ${reason || "General Consultation"}</li>
    //       </ul>

    //       <p style="margin-top: 15px;">
    //         ⚠️ Please arrive <b>15 minutes early</b>.
    //       </p>

    //       <p>Thank you,<br/>
    //       <b>City Hospital</b></p>
    //     </div>
    //   `,
    // });

    console.log("📧 Email sent to:", patient.email);

    return res.status(201).json({
      message: "Appointment booked successfully & email sent",
      appointment,
    });
  } catch (error) {
    console.error("BOOK APPOINTMENT SERVER ERROR 👉", error);
    return res.status(500).json({
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
};

module.exports = { bookAppointment };
