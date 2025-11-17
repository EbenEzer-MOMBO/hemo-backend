const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un patient → uniquement laborantin
exports.createPatient = async (req, res) => {
  try {
    const { name, age, bloodType, phone } = req.body;
    
    // Validation basique
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Le nom est obligatoire" });
    }
    if (!age || age < 0 || isNaN(age)) {
      return res.status(400).json({ error: "L'âge est invalide" });
    }

    const patient = await prisma.patient.create({
      data: { 
        name: name.trim(), 
        age: parseInt(age), 
        bloodType: bloodType?.trim() || null, 
        phone: phone?.trim() || null 
      },
    });
    
    res.status(201).json({
      message: "Patient créé avec succès",
      patient
    });
  } catch (error) {
    console.error("CREATE PATIENT ERROR:", error);
    res.status(500).json({ error: "Erreur lors de la création du patient" });
  }
};

// Récupérer tous les patients → laborantin et médecin
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(patients);
  } catch (error) {
    console.error("GET ALL PATIENTS ERROR:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des patients" });
  }
};

// Récupérer un patient par ID → laborantin et médecin
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = parseInt(id);
    
    if (isNaN(patientId)) {
      return res.status(400).json({ error: "ID patient invalide" });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    
    if (!patient) {
      return res.status(404).json({ error: "Patient non trouvé" });
    }
    
    res.json(patient);
  } catch (error) {
    console.error("GET PATIENT BY ID ERROR:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du patient" });
  }
};

// Mettre à jour un patient → uniquement laborantin
exports.updatePatient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID patient invalide" });
    }

    // Vérifier que le patient existe
    const existingPatient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!existingPatient) {
      return res.status(404).json({ error: "Patient non trouvé" });
    }

    // Filtrer et nettoyer les données
    const { name, age, bloodType, phone } = req.body;
    const updateData = {};
    
    if (name !== undefined && name.trim() !== '') updateData.name = name.trim();
    if (age !== undefined && age !== '' && !isNaN(age)) updateData.age = parseInt(age);
    if (bloodType !== undefined) updateData.bloodType = bloodType.trim() || null;
    if (phone !== undefined) updateData.phone = phone.trim() || null;

    // Vérifier qu'au moins un champ valide est fourni
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Aucune donnée valide fournie pour la mise à jour" });
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Patient mis à jour avec succès",
      patient
    });

  } catch (error) {
    console.error("UPDATE PATIENT ERROR:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Patient non trouvé" });
    }
    
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour du patient"
    });
  }
};

// Supprimer un patient → uniquement laborantin
exports.deletePatient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID patient invalide" });
    }

    // Vérifier que le patient existe
    const existingPatient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!existingPatient) {
      return res.status(404).json({ error: "Patient non trouvé" });
    }

    await prisma.patient.delete({
      where: { id },
    });
    
    res.json({ 
      message: "Patient supprimé avec succès",
      deletedPatient: {
        id: existingPatient.id,
        name: existingPatient.name
      }
    });
    
  } catch (error) {
    console.error("DELETE PATIENT ERROR:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Patient non trouvé" });
    }
    
    // Gestion des contraintes de clé étrangère
    if (error.code === 'P2003') {
      return res.status(409).json({ 
        error: "Impossible de supprimer ce patient car il est lié à des analyses médicales" 
      });
    }
    
    res.status(500).json({ error: "Erreur lors de la suppression du patient" });
  }
};