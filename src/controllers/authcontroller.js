const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../prisma');

// connexion utilisateur avec vérification du rôle
const login = async (req, res) => {
  const { username, password, role } = req.body; // <-- on prend aussi le rôle

  try {
    // Chercher l'utilisateur en DB par username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Vérifier le rôle
    if (user.role !== role) {
      return res.status(403).json({ error: 'Rôle incorrect pour cet utilisateur' });
    }

    // Générer token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    // Réponse : token et rôle réel de l'utilisateur
    res.json({ token, role: user.role });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };
