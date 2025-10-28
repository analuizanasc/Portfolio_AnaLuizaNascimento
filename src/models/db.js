// In-memory DB
const db = {
  residents: [], // { id, name, cpf, cep, address, number, complement, householdCount, email, passwordHash, coordinates }
  complaints: [] // { id, type, address, number, complement, description, anonymous, reporterId, coordinates, approved, likes: Set, createdAt }
};

module.exports = db;
