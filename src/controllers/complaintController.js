const complaintService = require('../services/complaintService');
const residentService = require('../services/residentService');
const { haversineDistance } = require('../utils/distance');

function createComplaint(req, res) {
  const body = req.body || {};
  const required = ['type', 'address', 'number', 'description'];
  for (const f of required) if (!body[f]) return res.status(400).json({ error: `field ${f} is required` });
  const reporterId = req.user && req.user.role === 'resident' ? req.user.id : null;
  const c = complaintService.createComplaint(body, reporterId);
  return res.status(201).json(c);
}

function likeComplaint(req, res) {
  const id = req.params.id;
  if (!req.user || req.user.role !== 'resident') return res.status(403).json({ error: 'Resident access required' });
  const updated = complaintService.likeComplaint(id, req.user.id);
  if (!updated) return res.status(404).json({ error: 'Complaint not found' });
  return res.json({ id: updated.id, likes: updated.likes.length });
}

function searchByType(req, res) {
  const type = req.query.type;
  if (!type) return res.status(400).json({ error: 'type query param required' });
  const results = complaintService.getApprovedByType(type);
  return res.json(results);
}

function searchByReporter(req, res) {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'name query param required' });
  const results = complaintService.getApprovedByReporterName(name);
  return res.json(results);
}

function searchByRegion(req, res) {
  // uses the logged resident's CEP coordinates
  if (!req.user || req.user.role !== 'resident') return res.status(403).json({ error: 'Resident access required' });
  const resident = residentService.findById(req.user.id);
  if (!resident) return res.status(404).json({ error: 'Resident not found' });
  const center = resident.coordinates;
  const results = require('../models/db').complaints
    .filter(c => c.approved)
    .filter(c => haversineDistance(center, c.coordinates) <= 10)
    .map(complaintService.formatComplaintForPublic);
  return res.json(results);
}

module.exports = {
  createComplaint,
  likeComplaint,
  searchByType,
  searchByReporter,
  searchByRegion
};
