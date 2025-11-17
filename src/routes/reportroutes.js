const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportcontroller');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Routes de report ici
router.get('/stats', verifyToken, verifyRole(['superadmin','laborantin','medecin']), reportController.totalDonors);

module.exports = router;
