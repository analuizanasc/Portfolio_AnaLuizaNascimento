const { findByEmail, hashPassword } = require('../services/residentService');
const { generateToken } = require('../middleware/authMiddleware');

// Admin fixed credentials as per requirements
const ADMIN_EMAIL = 'ana@qa.com';
const ADMIN_PASSWORD = 'abc123';

function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  // admin login
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = generateToken({ role: 'admin', email: ADMIN_EMAIL });
    return res.json({ token, role: 'admin' });
  }

  const user = findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.passwordHash !== hashPassword(password)) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken({ role: 'resident', email: user.email, id: user.id });
  return res.json({ token, role: 'resident' });
}

module.exports = { login };
