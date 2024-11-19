const express = require('express');
const { registerPatient, addAppointment,getPatientProfile } = require('../controllers/patientController');

const router = express.Router();

// Patient Registration Route
router.post('/register', registerPatient);


// Add Appointment Route
router.post('/appointments', addAppointment); // New route for adding appointments


// Get Patient Profile Route
router.get('/:id', getPatientProfile);  // Route to get the patient profile by ID


module.exports = router;
