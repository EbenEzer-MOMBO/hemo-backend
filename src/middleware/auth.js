const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // contient id, email, role
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle
// roles = array des rôles autorisés ['superadmin', 'laborantin', 'medecin']
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Utilisateur non identifié' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé pour ce rôle' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
