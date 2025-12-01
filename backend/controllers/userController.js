const User = require('../models/User');

// @desc    Get user's savings goal
// @route   GET /api/users/savings-goal
// @access  Private
const getSavingsGoal = async (req,res) => {
    try {
        console.log('Get savings goal - User:',req.user);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.user._id).select('savingsGoal');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ savingsGoal: user.savingsGoal || 0 });
    } catch (error) {
        console.error('Error fetching savings goal:',error);
        res.status(500).json({ message: 'Server error',error: error.message });
    }
};

// @desc    Update user's savings goal
// @route   PUT /api/users/savings-goal
// @access  Private
const updateSavingsGoal = async (req,res) => {
    try {
        console.log('Update savings goal request:',req.body);
        console.log('User from request:',req.user);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { savingsGoal } = req.body;

        if (savingsGoal < 0) {
            return res.status(400).json({ message: 'Savings goal must be a positive number' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.savingsGoal = savingsGoal;
        await user.save();

        console.log('Savings goal updated successfully:',user.savingsGoal);
        res.json({ savingsGoal: user.savingsGoal });
    } catch (error) {
        console.error('Error updating savings goal:',error);
        res.status(500).json({ message: 'Server error',error: error.message });
    }
};

module.exports = { getSavingsGoal,updateSavingsGoal };
