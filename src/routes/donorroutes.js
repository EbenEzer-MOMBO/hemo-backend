// src/routes/donor.js
const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorcontroller');
const { verifyToken, verifyRole } = require('../middleware/auth'); 

// Création d'un donneur → uniquement laborantin
router.post('/', verifyToken, verifyRole(['laborantin']), donorController.createDonor);

// Récupération des donneurs → laborantin et médecin
router.get('/', verifyToken, verifyRole(['laborantin','medecin']), donorController.getDonors);

// Mise à jour d'un donneur → uniquement laborantin
router.put('/:id', verifyToken, verifyRole(['laborantin']), donorController.updateDonor);

// Suppression d'un donneur → uniquement laborantin
router.delete('/:id', verifyToken, verifyRole(['laborantin']), donorController.deleteDonor);

module.exports = router;