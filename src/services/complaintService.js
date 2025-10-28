const db = require('../models/db');
const { geocodeAddress } = require('../utils/geocode');
const { findById: findResidentById } = require('./residentService');

function createComplaint(payload, reporterId) {
  const id = (db.complaints.length + 1).toString();
  const fullAddress = `${payload.address} ${payload.number} ${payload.complement || ''}`;
  const coord = geocodeAddress(fullAddress + (reporterId || ''));
  const complaint = {
    id,
    type: payload.type,
    address: payload.address,
    number: payload.number,
    complement: payload.complement || null,
    description: payload.description,
    anonymous: !!payload.anonymous,
    reporterId: payload.anonymous ? null : reporterId,
    coordinates: coord,
    approved: false,
    likes: [],
    createdAt: new Date().toISOString()
  };
  db.complaints.push(complaint);
  return complaint;
}

function likeComplaint(complaintId, residentId) {
  const c = db.complaints.find(x => x.id === complaintId);
  if (!c) return null;
  if (c.likes.includes(residentId)) return c;
  c.likes.push(residentId);
  return c;
}

function approveComplaint(complaintId) {
  const c = db.complaints.find(x => x.id === complaintId);
  if (!c) return null;
  c.approved = true;
  return c;
}

function deleteComplaint(complaintId) {
  const idx = db.complaints.findIndex(x => x.id === complaintId);
  if (idx === -1) return false;
  db.complaints.splice(idx, 1);
  return true;
}

function getApprovedByType(type) {
  return db.complaints.filter(c => c.approved && c.type === type).map(formatComplaintForPublic);
}

function getApprovedByReporterName(name) {
  const lower = (name || '').toLowerCase();
  return db.complaints
    .filter(c => c.approved)
    .filter(c => {
      if (!c.reporterId) return false;
      const r = findResidentById(c.reporterId);
      return r && r.name.toLowerCase().includes(lower);
    })
    .map(formatComplaintForPublic);
}

function getPending() {
  return db.complaints.filter(c => !c.approved);
}

function findById(id) {
  return db.complaints.find(c => c.id === id);
}

function formatComplaintForPublic(c) {
  return {
    id: c.id,
    type: c.type,
    location: {
      address: c.address,
      number: c.number,
      complement: c.complement,
      coordinates: c.coordinates
    },
    likes: c.likes.length,
    description: c.description,
    createdAt: c.createdAt
  };
}

module.exports = {
  createComplaint,
  likeComplaint,
  approveComplaint,
  deleteComplaint,
  getApprovedByType,
  getApprovedByReporterName,
  getPending,
  findById,
  formatComplaintForPublic
};
