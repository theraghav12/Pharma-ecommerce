import Appointment from "../models/Appointment.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      time
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all appointments for a doctor
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id }).populate("patientId");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all appointments for a patient
export const getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id }).populate("doctorId");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: "Cancelled" });
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAppointmentsByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const appointments = await Appointment.find({
      $or: [{ doctorId: id }, { patientId: id }]
    })
    .populate("doctorId", "name email specialization")
    .populate("patientId", "name email age");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
