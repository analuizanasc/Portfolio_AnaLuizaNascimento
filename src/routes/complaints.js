const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authMiddleware } = require('../middleware/authMiddleware');

// resident-only actions require auth (resident role will be checked in controllers)
router.post('/', authMiddleware, complaintController.createComplaint);
router.post('/:id/like', authMiddleware, complaintController.likeComplaint);

// public searches - but must be approved complaints only; require auth per spec
router.get('/', authMiddleware, complaintController.searchByType);
router.get('/by-reporter', authMiddleware, complaintController.searchByReporter);
router.get('/region', authMiddleware, complaintController.searchByRegion);

module.exports = router;
