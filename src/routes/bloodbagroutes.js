// src/routes/bloodbagroutes.js
const express = require('express');
const router = express.Router();
const bloodbagController = require('../controllers/bloodbagcontroller');
const { verifyToken, verifyRole } = require('../middleware/auth');

// 🩸 Création d'une poche de sang → uniquement laborantin
router.post('/', verifyToken, verifyRole(['laborantin']), bloodbagController.createBloodBag);

// 🧠 Récupération de toutes les poches → laborantin et médecin
router.get('/', verifyToken, verifyRole(['laborantin', 'medecin']), bloodbagController.getBloodBags);

// 🩸 Récupération des poches "disponibles" uniquement → laborantin et médecin
router.get('/available', verifyToken, verifyRole(['laborantin', 'medecin']), bloodbagController.getAvailableBloodBags);

// 🔄 Mettre à jour une poche → uniquement laborantin
router.put('/:id', verifyToken, verifyRole(['laborantin']), bloodbagController.updateBloodBag);

// ✅ Mettre une poche à "utilisée" (lorsque le médecin finalise la transfusion)
router.put('/use/:id', verifyToken, verifyRole(['medecin', 'laborantin']), bloodbagController.useBloodBag);

// ❌ Suppression d'une poche → uniquement laborantin
router.delete('/:id', verifyToken, verifyRole(['laborantin']), bloodbagController.deleteBloodBag);

module.exports = router;
