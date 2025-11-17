const prisma = require('../prisma');

// 🩸 Créer une poche de sang → uniquement laborantin
exports.createBloodBag = async (req, res) => {
  try {
    const { donorId, bloodType, quantity, collectedAt, expiresAt, status } = req.body;

    // Validation des données requises
    if (!donorId || !bloodType || !quantity) {
      return res.status(400).json({ error: "DonorId, bloodType et quantity sont obligatoires" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "La quantité doit être positive" });
    }

    // Vérifier que le donneur existe
    const donor = await prisma.donor.findUnique({
      where: { id: parseInt(donorId) }
    });

    if (!donor) {
      return res.status(404).json({ error: "Donneur non trouvé" });
    }

    const bloodBag = await prisma.bloodBag.create({
      data: {
        donorId: parseInt(donorId),
        bloodType: bloodType.trim(),
        quantity: parseFloat(quantity),
        collectedAt: collectedAt ? new Date(collectedAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 jours par défaut
        status: status || "disponible",
      },
      include: { donor: true },
    });

    // ⚡ Socket.io : notifier les clients connectés
    const io = req.app.get("io");
    if (io) io.emit("newBloodBag", bloodBag);

    res.status(201).json({
      message: "Poche de sang créée avec succès",
      bloodBag
    });
  } catch (error) {
    console.error("CREATE BLOOD BAG ERROR:", error);
    res.status(500).json({ error: "Erreur lors de la création de la poche de sang" });
  }
};

// 🧠 Récupérer toutes les poches → laborantin et médecin
exports.getBloodBags = async (req, res) => {
  try {
    const bloodBags = await prisma.bloodBag.findMany({
      include: { donor: true },
      orderBy: { collectedAt: 'desc' }
    });
    res.json(bloodBags);
  } catch (error) {
    console.error("GET BLOOD BAGS ERROR:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des poches de sang" });
  }
};

// 🩸 Récupérer uniquement les poches disponibles (pour transfusion)
exports.getAvailableBloodBags = async (req, res) => {
  try {
    const availableBags = await prisma.bloodBag.findMany({
      where: { 
        status: "disponible",
        expiresAt: { gt: new Date() } // Poches non expirées
      },
      include: { donor: true },
      orderBy: { expiresAt: 'asc' } // Plus proches de l'expiration en premier
    });
    res.json(availableBags);
  } catch (error) {
    console.error("GET AVAILABLE BLOOD BAGS ERROR:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des poches disponibles" });
  }
};

// 🔄 Mettre à jour une poche (laborantin)
exports.updateBloodBag = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodBagId = parseInt(id);
    
    if (isNaN(bloodBagId)) {
      return res.status(400).json({ error: "ID poche de sang invalide" });
    }

    // Vérifier si la poche existe
    const existingBloodBag = await prisma.bloodBag.findUnique({
      where: { id: bloodBagId },
      include: { donor: true }
    });

    if (!existingBloodBag) {
      return res.status(404).json({ error: "Poche de sang non trouvée" });
    }

    // Construire dynamiquement les champs à mettre à jour
    const { bloodType, quantity, collectedAt, expiresAt, status } = req.body;
    const updateData = {};

    if (bloodType !== undefined) updateData.bloodType = bloodType.trim();
    if (quantity !== undefined) {
      const qty = parseFloat(quantity);
      if (qty <= 0) {
        return res.status(400).json({ error: "La quantité doit être positive" });
      }
      updateData.quantity = qty;
    }
    if (collectedAt !== undefined) updateData.collectedAt = new Date(collectedAt);
    if (expiresAt !== undefined) updateData.expiresAt = new Date(expiresAt);
    if (status !== undefined) updateData.status = status;

    // Vérifier qu'au moins un champ valide est fourni
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Aucune donnée valide fournie pour la mise à jour" });
    }

    const bloodBag = await prisma.bloodBag.update({
      where: { id: bloodBagId },
      data: updateData,
      include: { donor: true },
    });

    // ⚡ Socket.io : notifier la mise à jour
    const io = req.app.get("io");
    if (io) io.emit("bloodBagUpdated", bloodBag);

    res.json({
      message: "Poche de sang mise à jour avec succès",
      bloodBag
    });
  } catch (error) {
    console.error("UPDATE BLOOD BAG ERROR:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Poche de sang non trouvée" });
    }
    
    res.status(500).json({ error: "Erreur lors de la mise à jour de la poche de sang" });
  }
};

// ❌ Supprimer une poche
exports.deleteBloodBag = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodBagId = parseInt(id);
    
    if (isNaN(bloodBagId)) {
      return res.status(400).json({ error: "ID poche de sang invalide" });
    }

    // Vérifier que la poche existe
    const existingBloodBag = await prisma.bloodBag.findUnique({
      where: { id: bloodBagId }
    });

    if (!existingBloodBag) {
      return res.status(404).json({ error: "Poche de sang non trouvée" });
    }

    await prisma.bloodBag.delete({ 
      where: { id: bloodBagId } 
    });

    // ⚡ Socket.io : notifier la suppression
    const io = req.app.get("io");
    if (io) io.emit("bloodBagDeleted", { id: bloodBagId });

    res.json({ 
      message: "Poche de sang supprimée avec succès",
      deletedBloodBag: {
        id: existingBloodBag.id,
        bloodType: existingBloodBag.bloodType
      }
    });
  } catch (error) {
    console.error("DELETE BLOOD BAG ERROR:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Poche de sang non trouvée" });
    }
    
    if (error.code === 'P2003') {
      return res.status(409).json({ 
        error: "Impossible de supprimer cette poche car elle est liée à des transfusions" 
      });
    }
    
    res.status(500).json({ error: "Erreur lors de la suppression de la poche de sang" });
  }
};

// ✅ Mettre une poche à "utilisée" quand la transfusion est finalisée (médecin)
exports.useBloodBag = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodBagId = parseInt(id);
    
    if (isNaN(bloodBagId)) {
      return res.status(400).json({ error: "ID poche de sang invalide" });
    }

    // Vérifier que la poche existe et est disponible
    const existingBloodBag = await prisma.bloodBag.findUnique({
      where: { id: bloodBagId }
    });

    if (!existingBloodBag) {
      return res.status(404).json({ error: "Poche de sang non trouvée" });
    }

    if (existingBloodBag.status !== "disponible") {
      return res.status(400).json({ error: "Cette poche de sang n'est pas disponible" });
    }

    if (existingBloodBag.expiresAt < new Date()) {
      return res.status(400).json({ error: "Cette poche de sang est expirée" });
    }

    const updated = await prisma.bloodBag.update({
      where: { id: bloodBagId },
      data: { status: "utilisée" },
      include: { donor: true },
    });

    // ⚡ Socket.io : notifier l'utilisation
    const io = req.app.get("io");
    if (io) io.emit("bloodBagUsed", updated);

    res.json({
      message: "Poche de sang marquée comme utilisée",
      bloodBag: updated
    });
  } catch (error) {
    console.error("USE BLOOD BAG ERROR:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Poche de sang non trouvée" });
    }
    
    res.status(500).json({ error: "Erreur lors de l'utilisation de la poche de sang" });
  }
};