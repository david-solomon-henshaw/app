const express = require('express');
const caregiverController = require('../controllers/caregiverController'); 

const router = express.Router();

// Caregiver Routes
router.get('/:id/appointments', caregiverController.viewAppointments); // Get appointments assigned to a caregiver
router.put('/:id/appointment', caregiverController.updateAppointment); // Update an appointment completion

// Define the route for fetching a caregiver profile
router.get('/:id', caregiverController.getCaregiverProfile);

module.exports = router;
