const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientcontroller");
const { verifyToken, verifyRole } = require("../middleware/auth");

// Ajouter un patient → laborantin uniquement
router.post('/', verifyToken, verifyRole(['laborantin']), patientController.createPatient);

// Liste des patients → laborantin et médecin
router.get('/', verifyToken, verifyRole(['laborantin','medecin']), patientController.getAllPatients);

// Récupérer un patient par ID → laborantin et médecin
router.get('/:id', verifyToken, verifyRole(['laborantin','medecin']), patientController.getPatientById);

// Mise à jour d'un patient → laborantin uniquement
router.put('/:id', verifyToken, verifyRole(['laborantin']), patientController.updatePatient);

// Suppression d'un patient → laborantin uniquement
router.delete('/:id', verifyToken, verifyRole(['laborantin']), patientController.deletePatient);

module.exports = router;
