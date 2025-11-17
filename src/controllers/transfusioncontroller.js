const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ------------------- 🩸 Créer une transfusion -------------------
exports.createTransfusion = async (req, res) => {
  try {
    const { patientId, bloodBagId } = req.body;

    const transfusion = await prisma.transfusion.create({
      data: {
        patientId,
        bloodBagId,
        status: "disponible", // statut initial
        date: new Date(),
      },
      include: {
        patient: true,
        bloodBag: { include: { donor: true } },
      },
    });

    // ⚡ Notifier en temps réel
    const io = req.app.get("io");
    if (io) io.emit("update", { type: "newTransfusion", data: transfusion });

    return res.status(201).json(transfusion);
  } catch (error) {
    console.error("Erreur création transfusion :", error);
    return res.status(500).json({ error: error.message });
  }
};

// ------------------- 📋 Récupérer toutes les transfusions -------------------
exports.getAllTransfusions = async (req, res) => {
  try {
    const transfusions = await prisma.transfusion.findMany({
      include: {
        patient: true,
        bloodBag: { include: { donor: true } },
      },
      orderBy: { date: "desc" },
    });
    return res.status(200).json(transfusions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ------------------- 🔎 Récupérer une transfusion par ID -------------------
exports.getTransfusionById = async (req, res) => {
  try {
    const transfusion = await prisma.transfusion.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        patient: true,
        bloodBag: { include: { donor: true } },
      },
    });

    if (!transfusion)
      return res.status(404).json({ message: "Transfusion introuvable" });

    return res.status(200).json(transfusion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ------------------- ❌ Supprimer une transfusion -------------------
exports.deleteTransfusion = async (req, res) => {
  try {
    await prisma.transfusion.delete({
      where: { id: parseInt(req.params.id) },
    });

    const io = req.app.get("io");
    if (io) io.emit("update", { type: "deleteTransfusion", id: req.params.id });

    return res
      .status(200)
      .json({ message: "Transfusion supprimée avec succès" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ------------------- ✅ Finaliser une transfusion -------------------
exports.finalizeTransfusion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    // 1️⃣ Vérifier si la transfusion existe
    const transfusion = await prisma.transfusion.findUnique({
      where: { id: parseInt(id) },
      include: { bloodBag: true, patient: true },
    });

    if (!transfusion) {
      return res.status(404).json({ error: "Transfusion non trouvée." });
    }

    // 2️⃣ Mettre à jour la transfusion et la poche liée en une seule requête
    const updated = await prisma.transfusion.update({
      where: { id: parseInt(id) },
      data: {
        status: "finalisée",
        bloodBag: {
          update: { status: "utilisée" },
        },
      },
      include: {
        patient: true,
        bloodBag: { include: { donor: true } },
      },
    });

    // 3️⃣ Notifier le front (laborantin + médecin)
    const io = req.app.get("io");
    if (io)
      io.emit("update", {
        type: "finalizeTransfusion",
        data: updated,
      });

    return res
      .status(200)
      .json({ message: "Transfusion finalisée", transfusion: updated });
  } catch (error) {
    console.error("Erreur lors de la finalisation :", error);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de la finalisation." });
  }
};

// ------------------- 🔄 Annuler une transfusion -------------------
exports.cancelTransfusion = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.transfusion.update({
      where: { id: parseInt(id) },
      data: {
        status: "annulée",
        bloodBag: {
          update: { status: "disponible" },
        },
      },
      include: {
        patient: true,
        bloodBag: { include: { donor: true } },
      },
    });

    const io = req.app.get("io");
    if (io)
      io.emit("update", { type: "cancelTransfusion", data: updated });

    return res.status(200).json({
      message: "Transfusion annulée et poche redevenue disponible",
      transfusion: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
