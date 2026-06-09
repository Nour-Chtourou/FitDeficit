const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { updateProfile, getProfile } = require('../controllers/userController');

router.put('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;