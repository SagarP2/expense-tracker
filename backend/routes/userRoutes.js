const express = require('express');
const { getSavingsGoal,updateSavingsGoal } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/savings-goal',protect,getSavingsGoal);
router.put('/savings-goal',protect,updateSavingsGoal);

module.exports = router;
