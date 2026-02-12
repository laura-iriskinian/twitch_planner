const express = require('express');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/profileController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.delete('/', authenticate, deleteAccount);

module.exports = router;