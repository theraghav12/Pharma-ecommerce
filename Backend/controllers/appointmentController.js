import Appointment from "../models/Appointment.js";
import User from "../models/users.js";


// List all doctors with their details
export const listAllDoctors = async (req, res) => {
  try {
    // Find all users with role 'doctor'
    const doctors = await User.find({ role: 'doctor' })
      .select('name email specialization qualification contact')
      .lean();

    // Add hardcoded experience and format the response
    const formattedDoctors = doctors.map(doctor => ({
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization || 'General Physician',
      qualification: doctor.qualification || 'MBBS',
      experience: '3 years', // Hardcoded as requested
      contact: doctor.contact || 'Not provided',
      id: doctor._id
    }));

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      data: formattedDoctors
    });
  } catch (error) {
    console.error("Error fetching doctors list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors list",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id; // Get patient ID from authenticated user

    // Input validation
    if (!doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please provide doctorId, date, and time"
      });
    }

    // Check if the patient already has a scheduled appointment with this doctor
    const existingAppointment = await Appointment.findOne({
      patientId,
      doctorId,
      status: 'Scheduled'
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You already have a scheduled appointment with this doctor"
      });
    }

    // Check if doctor exists (optional but recommended)
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date: new Date(date),
      time,
      status: 'Scheduled' // Add default status
    });

    await newAppointment.save();

    // Populate doctor details in the response
    await newAppointment.populate('doctorId', 'name email specialization');

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment
    });

  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create appointment",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        select: 'name email contact specialization qualification',
        model: 'User'
      })
      .select('date time status')
      .sort({ date: 1, time: 1 }); // Sort by date and time

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found",
        data: []
      });
    }

    // Format the response
    const formattedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      doctor: {
        name: appointment.doctorId?.name || 'Doctor',
        email: appointment.doctorId?.email || '',
        phone: appointment.doctorId?.contact || '',
        specialization: appointment.doctorId?.specialization || '',
        qualification: appointment.doctorId?.qualification || ''
      }
    }));

    res.status(200).json({
      success: true,
      count: formattedAppointments.length,
      data: formattedAppointments
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get all patients who have appointments with the doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can view patient appointments."
      });
    }

    // Get all appointments for this doctor with only necessary fields
    const appointments = await Appointment.find(
      { 
        doctorId: req.user.id,
        status: 'Scheduled || Cancelled || Completed'
      },
      'patientId'  // Only fetch patientId field from appointments
    )
    .populate({
      path: 'patientId',
      select: 'name email contact age address',
      model: 'User'
    })
    .lean();

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No patients found with appointments",
        data: []
      });
    }

    // Extract and format patient data
    const uniquePatients = [];
    const patientIds = new Set();

    appointments.forEach(appt => {
      if (appt.patientId && !patientIds.has(appt.patientId._id.toString())) {
        patientIds.add(appt.patientId._id.toString());
        
        const { name, email, contact, age, address } = appt.patientId;
        uniquePatients.push({
          name: name || 'Patient',
          email: email || '',
          phone: contact || '',
          age: age || '',
          address: address || {}
        });
      }
    });

    res.status(200).json({
      success: true,
      count: uniquePatients.length,
      data: uniquePatients
    });

  } catch (error) {
    console.error("Error in getDoctorAppointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient list",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the current user is either the patient or the doctor of this appointment
    const isPatient = appointment.patientId.toString() === req.user.id;
    const isDoctor = appointment.doctorId.toString() === req.user.id;

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this appointment'
      });
    }

    // Only allow cancelling if appointment is in Scheduled state
    if (appointment.status !== 'Scheduled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an appointment that was already ${appointment.status.toLowerCase()}!`
      });
    }

    // Update the appointment status to Cancelled
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled', cancelledBy: req.user.role },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {
        id: updatedAppointment._id,
        status: updatedAppointment.status,
        cancelledBy: updatedAppointment.cancelledBy
      }
    });

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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


// Delete an appointment permanently
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the current user is either the patient or the doctor of this appointment
    const isPatient = appointment.patientId.toString() === req.user.id;
    const isDoctor = appointment.doctorId.toString() === req.user.id;

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this appointment'
      });
    }

    // Only allow deleting appointments that are either cancelled or in the past
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    
    if (appointment.status === 'Scheduled' && appointmentDate > today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a scheduled future appointment. Please cancel it first.'
      });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: { id: req.params.id }
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark an appointment as completed (Doctor only)
export const completeAppointment = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can complete appointments'
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: req.user.id  // Ensure the doctor owns this appointment
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you are not authorized'
      });
    }

    // Only allow completing scheduled appointments
    if (appointment.status !== 'Scheduled') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete an appointment that is ${appointment.status.toLowerCase()}`
      });
    }

    // Update the appointment status to Completed
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Completed',
        completedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: {
        id: updatedAppointment._id,
        status: updatedAppointment.status,
        completedAt: updatedAppointment.completedAt
      }
    });

  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
