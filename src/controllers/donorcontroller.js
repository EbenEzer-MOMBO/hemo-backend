const prisma = require('../prisma'); // Prisma client

// Créer un donneur
exports.createDonor = async (req, res) => {
  try {
    const donor = await prisma.donor.create({
      data: {
        name: req.body.name,
        bloodType: req.body.bloodType,
        phone: req.body.phone || "non renseigné", 
        email: req.body.email || "non renseigné"  
      }
    });

    // ⚡ Socket.io : notification aux clients connectés
    const io = req.app.get('io');
    if (io) io.emit('newDonor', donor);

    res.json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les donneurs
exports.getDonors = async (req, res) => {
  try {
    const donors = await prisma.donor.findMany();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un donneur
exports.updateDonor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const updatedDonor = await prisma.donor.update({
      where: { id: Number(id) },
      data: {
        name: req.body.name,
        bloodType: req.body.bloodType,
        phone: req.body.phone || "non renseigné",
        email: req.body.email || "non renseigné"
      }
    });
    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un donneur
exports.deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.donor.delete({ where: { id: Number(id) } });
    res.json({ message: 'Donor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
