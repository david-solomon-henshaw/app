// controllers/patientController.js
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const bcrypt = require('bcrypt');
const ActionLog = require('../models/action')
// Patient registration
exports.registerPatient = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, phoneNumber, gender } = req.body;

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {

      // Log failure when patient already exists
      await ActionLog.create({
        userId: null,  // If there's an authenticated user (admin), log their ID
        userRole: 'admin',  // Assuming the user performing this action is an admin
        action: 'register_patient',
        description: `Attempted to register patient with email ${email}, but the patient already exists.`,
        entity: 'patient',
        entityId: null,  // No new patient created
        status: 'failed',
      });
 

      return res.status(400).json({ message: 'Patient already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      dateOfBirth,
      gender
    });
    await newPatient.save();

    // Log successful patient registration
    await ActionLog.create({
      userId: newPatient._id || null,  // If there's an authenticated user (admin), log their ID
      userRole: 'patient',  // Assuming the user performing this action is an admin
      action: 'register_patient',
      description: `Successfully registered new patient with email ${email}`,
      entity: 'patient',
      entityId: newPatient._id,  // The newly created patient's ID
      status: 'success',
    });



    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    // Log errors during patient registration
    await ActionLog.create({
      userId: null,  // If there's an authenticated user (admin), log their ID
      userRole: 'patient',  // Assuming the user performing this action is an admin
      action: 'register_patient',
      description: `Error occurred during patient registration: ${error.message}`,
      entity: 'patient',
      entityId: null,  // No patient created if an error occurs
      status: 'failed',
    });


    res.status(500).json({ message: 'Error registering patient', error });
  }
};

// Add an appointment to a patient
exports.addAppointment = async (req, res) => {
  const { patientRequestedDate, patientRequestedTime, department } = req.body;

  try {
    // Validate required fields
    if (!patientRequestedDate || !department || !patientRequestedTime) {
      return res.status(400).json({ message: 'Appointment date, department, and time are required' });
    }

    // Assuming patientId is extracted from a JWT or passed in the request body
    const patientId = req.body.patientId


    const patient = await Patient.findById(patientId);
    if (!patient) {

      // Log failure if patient is not found
      await ActionLog.create({
        userId: patientId,  // Patient ID who attempted to make the appointment
        userRole: 'patient', // Role is 'patient'
        action: 'add_appointment',
        description: `Patient with ID ${patientId} not found`,
        entity: 'appointment',
        entityId: null, // No appointment created
        status: 'failed',
      });

      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      patient: patientId,
      patientRequestedDate,
      patientRequestedTime, // Patient's preferred time for the appointment
      department,
      status: 'pending', // Default status for a new appointment
      createdAt: Date.now(),
    });


    await newAppointment.save();


    // Push the appointment reference to the patient's appointments array
    patient.appointments.push(newAppointment._id);
    await patient.save();

    // Log successful appointment creation
    await ActionLog.create({
      userId: patientId,  // Patient ID who requested the appointment
      userRole: 'patient', // Role is 'patient'
      action: 'add_appointment',
      description: `Appointment requested by patient with ID ${patientId} for department ${department} on ${patientRequestedDate} at ${patientRequestedTime}`,
      entity: 'appointment',
      entityId: newAppointment._id,  // The new appointment ID
      status: 'success',
    });


    res.status(201).json({ message: 'Appointment requested successfully', appointment: newAppointment });
  } catch (error) {
    const patientId = req.body.patientId


    await ActionLog.create({
      userId: patientId,  // Patient ID who requested the appointment
      userRole: 'patient', // Role is 'patient'
      action: 'add_appointment',
      description: `Error requesting appointment: ${error.message}`,
      entity: 'error',
      entityId: null, // No appointment created due to error
      status: 'failed',
    });

    res.status(500).json({ message: 'Error requesting appointment', error });
  }
};

exports.getPatientProfile = async (req, res) => {
  const patientId = req.params.id;

  try {
    // Find the patient by ID and populate the appointments
    const patient = await Patient.findById(patientId).populate('appointments');

    if (!patient) {

      // Log failure if patient is not found
      await ActionLog.create({
        userId: patientId,  // Use the logged-in user's ID (admin in this case)
        userRole: 'patient', // Role is 'admin' 
        action: 'view_patient_profile',
        description: `Patient with ID ${patientId} not found`,
        entity: 'patient',
        entityId: null, // No patient found
        status: 'failed',
      });

      return res.status(404).json({ message: 'Patient not found' });
    }

    // 1. Total Appointments Booked
    const totalAppointments = patient.appointments.length;

    // 2. Total Caregivers (distinct caregivers associated with this patient's appointments)
    const caregiverCount = await Appointment.distinct('caregiver', {
      patient: patientId,
      caregiver: { $exists: true } // Only count assigned caregivers
    });
    const totalCaregivers = caregiverCount.length;

    // 3. Total Medications Prescribed (count completed appointments)
    const completedAppointmentsCount = await Appointment.countDocuments({
      patient: patientId,
      status: 'completed'
    });

    // Log successful retrieval of patient profile and statistics
    await ActionLog.create({
      userId: patientId,  // Use the logged-in user's ID (admin in this case)
      userRole: 'patient', // Role is 'admin'
      action: 'view_patient_profile',
      description: `Successfully retrieved profile and statistics for patient with ID ${patientId}`,
      entity: 'patient',
      entityId: patientId,  // The patient ID
      status: 'success',
    });


    // Return both the profile data and statistics
    res.status(200).json({
      profile: patient,
      statistics: {
        totalAppointments,
        totalCaregivers,
        totalMedicationsPrescribed: completedAppointmentsCount,
      }
    });
  } catch (error) {

    await ActionLog.create({
      userId: patientId,  // Use the logged-in user's ID (admin in this case)
      userRole: 'admin', // Role is 'admin'
      action: 'view_patient_profile',
      description: `Error retrieving patient profile and statistics: ${error.message}`,
      entity: 'patient',
      entityId: patientId,  // The patient ID in question
      status: 'failed',
    });


    res.status(500).json({ message: 'Error fetching patient profile and statistics', error });
  }
};