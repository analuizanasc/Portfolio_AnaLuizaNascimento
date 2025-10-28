const residentService = require('../services/residentService');

function register(req, res) {
  const body = req.body || {};
  const required = ['name', 'cpf', 'cep', 'address', 'number', 'householdCount', 'email', 'password'];
  for (const f of required) if (!body[f]) return res.status(400).json({ error: `field ${f} is required` });
  const existing = residentService.findByEmail(body.email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const created = residentService.createResident({
    name: body.name,
    cpf: body.cpf,
    cep: body.cep,
    address: body.address,
    number: body.number,
    complement: body.complement,
    householdCount: body.householdCount,
    email: body.email,
    password: body.password
  });
  return res.status(201).json(created);
}

module.exports = { register };
