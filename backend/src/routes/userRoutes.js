const express = require('express');
const { getSavingsGoal,updateSavingsGoal,updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/savings-goal',protect,getSavingsGoal);
router.put('/savings-goal',protect,updateSavingsGoal);
router.put('/profile',protect,updateUserProfile);

module.exports = router;
