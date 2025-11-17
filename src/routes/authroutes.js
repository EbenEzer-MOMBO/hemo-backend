const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authcontroller');

// Route POST pour le login
router.post('/login', login);

module.exports = router;
