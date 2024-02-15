const express = require('express');
const router = express.Router();

const recordsController = require('../controllers/medical-records');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// PATIENT
router.get('/', recordsController.getAllRecords);
router.get('/:id', recordsController.getSingleRecords);
router.post('/', isAuthenticated, validation.saveAppointment, recordsController.createRecords);
router.put('/:id', isAuthenticated, validation.saveAppointment, recordsController.updateRecords);
router.delete('/:id', recordsController.deleteRecords);

module.exports = router;