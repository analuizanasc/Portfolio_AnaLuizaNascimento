const jwt = require('jsonwebtoken');
const { findByEmail, findById, hashPassword } = require('../services/residentService');

const SECRET = process.env.JWT_SECRET || 'denuncias-secret';

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token missing or malformed' });
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  return next();
}

module.exports = { generateToken, authMiddleware, adminOnly };
