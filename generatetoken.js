import jwt from 'jsonwebtoken';

// Payload de ton utilisateur (id, email, rôle, etc.)
const payload = {
  id: 1,
  email: 'admin@example.com',
  role: 'admin'
};

// Clé secrète
const secret = process.env.JWT_SECRET || 'secret';

// Générer un token qui expire dans 7 jours
const token = jwt.sign(payload, secret, { expiresIn: '7d' });

console.log('Token JWT:', token);
