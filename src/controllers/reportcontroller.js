const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Nombre total de donneurs → médecin et laborantin
exports.totalDonors = async (req, res) => {
  try {
    const count = await prisma.donor.count();
    res.json({ totalDonors: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Statut des poches (disponible, utilisée, périmée) → médecin et laborantin
exports.bloodBagStats = async (req, res) => {
  try {
    const available = await prisma.bloodBag.count({ where: { status: "available" } });
    const used = await prisma.bloodBag.count({ where: { status: "used" } });
    const expired = await prisma.bloodBag.count({ where: { status: "expired" } });

    res.json({ available, used, expired });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Répartition par groupe sanguin → médecin et laborantin
exports.bloodGroupDistribution = async (req, res) => {
  try {
    const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const result = {};

    for (const g of groups) {
      result[g] = await prisma.bloodBag.count({ where: { bloodType: g } });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nombre de patients et transfusions → médecin et laborantin
exports.patientTransfusionStats = async (req, res) => {
  try {
    const patients = await prisma.patient.count();
    const transfusions = await prisma.transfusion.count();

    res.json({ totalPatients: patients, totalTransfusions: transfusions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
