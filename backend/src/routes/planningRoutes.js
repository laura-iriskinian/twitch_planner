const express = require('express');
const {
    getAllPlannings,
    getPlanningById,
    createPlanning,
    updatePlanning,
    deletePlanning
} = require('../controllers/planningController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, getAllPlannings);
router.get('/:id', authenticate, getPlanningById);
router.post('/', authenticate, createPlanning);
router.put('/:id', authenticate, updatePlanning);
router.delete('/:id', authenticate, deletePlanning);

module.exports = router;