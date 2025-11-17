const express = require('express');
const router = express.Router();
const transfusionController = require('../controllers/transfusioncontroller');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Ajouter une transfusion → laborantin uniquement
router.post('/', verifyToken, verifyRole(['laborantin']), transfusionController.createTransfusion);

// Liste des transfusions → laborantin et médecin
router.get('/', verifyToken, verifyRole(['laborantin','medecin']), transfusionController.getAllTransfusions);

// Transfusion par ID → laborantin et médecin
router.get('/:id', verifyToken, verifyRole(['laborantin','medecin']), transfusionController.getTransfusionById);

// Supprimer une transfusion → laborantin uniquement
router.delete('/:id', verifyToken, verifyRole(['laborantin']), transfusionController.deleteTransfusion);

// Annuler une transfusion → laborantin uniquement
router.put('/cancel/:id', verifyToken, verifyRole(['laborantin']), transfusionController.cancelTransfusion);
// Finaliser une transfusion → laborantin uniquement
router.put('/finalize/:id', verifyToken, verifyRole(['laborantin', 'medecin']), transfusionController.finalizeTransfusion);


module.exports = router;
