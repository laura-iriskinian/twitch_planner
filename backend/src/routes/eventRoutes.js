const express = require('express');
const {
    getEventsByPlanning, 
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/planning/:planningId', authenticate, getEventsByPlanning);
router.post('/planning/:planningId', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;