const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(adminOnly);

router.post('/complaints/:id/approve', adminController.approve);
router.delete('/complaints/:id', adminController.remove);
router.get('/complaints/pending', adminController.pending);

module.exports = router;
