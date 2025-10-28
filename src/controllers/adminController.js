const complaintService = require('../services/complaintService');

function approve(req, res) {
  const id = req.params.id;
  const updated = complaintService.approveComplaint(id);
  if (!updated) return res.status(404).json({ error: 'Complaint not found' });
  return res.json({ message: 'approved', complaint: updated });
}

function remove(req, res) {
  const id = req.params.id;
  const ok = complaintService.deleteComplaint(id);
  if (!ok) return res.status(404).json({ error: 'Complaint not found' });
  return res.json({ message: 'deleted' });
}

function pending(req, res) {
  const pendingList = complaintService.getPending();
  return res.json(pendingList);
}

module.exports = { approve, remove, pending };
