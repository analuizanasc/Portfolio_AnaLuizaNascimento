const db = require('../models/db');
const { geocodeAddress } = require('../utils/geocode');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createResident(payload) {
  const id = (db.residents.length + 1).toString();
  const coord = geocodeAddress(`${payload.cep} ${payload.address} ${payload.number}`);
  const resident = {
    id,
    name: payload.name,
    cpf: payload.cpf,
    cep: payload.cep,
    address: payload.address,
    number: payload.number,
    complement: payload.complement || null,
    householdCount: payload.householdCount || null,
    email: payload.email,
    passwordHash: hashPassword(payload.password),
    coordinates: coord
  };
  db.residents.push(resident);
  return { ...resident, passwordHash: undefined };
}

function findByEmail(email) {
  return db.residents.find(r => r.email === email);
}

function findById(id) {
  return db.residents.find(r => r.id === id);
}

module.exports = { createResident, findByEmail, findById, hashPassword };
