const mongoose = require('mongoose');
const { settlePayment } = require('../controllers/collabController');
const User = require('../models/User');
const Collaboration = require('../models/Collaboration');
const CollabTransaction = require('../models/CollabTransaction');

// Mock Express Request/Response
const mockReq = (body, user, params) => ({
    body,
    user,
    params
});

const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

const runTest = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/expense-tracker');
        console.log('Connected to DB');

        // Cleanup previous test data
        const testEmail1 = 'test_payer@example.com';
        const testEmail2 = 'test_receiver@example.com';
        await User.deleteMany({ email: { $in: [testEmail1, testEmail2] } });
        
        // Create Users
        const user1 = await User.create({ name: 'Payer', email: testEmail1, password: 'password123' });
        const user2 = await User.create({ name: 'Receiver', email: testEmail2, password: 'password123' });
        console.log('Users created');

        // Create Collaboration
        const collab = await Collaboration.create({
            users: [user1._id, user2._id],
            createdBy: user1._id,
            invitedUser: user2._id,
            status: 'active'
        });
        console.log('Collaboration created:', collab._id);

        // Add Expense to create debt (User 2 paid 100, split 50/50, so User 1 owes 50)
        await CollabTransaction.create({
            collaborationId: collab._id,
            userId: user2._id,
            amount: 100,
            type: 'expense',
            category: 'Food',
            description: 'Dinner',
            date: new Date()
        });
        console.log('Expense transaction created');

        // Test Settle Payment
        // User 1 pays User 2 the owed 50
        const req = mockReq(
            { payerId: user1._id.toString(), receiverId: user2._id.toString(), amount: 50, method: 'UPI' },
            { id: user1._id.toString() },
            { id: collab._id.toString() }
        );
        const res = mockRes();

        console.log('Calling settlePayment...');
        await settlePayment(req, res);

        if (res.statusCode && res.statusCode !== 200) {
            console.error('Failed:', res.data);
        } else {
            console.log('Success:', res.data.message);
            console.log('Balance:', res.data.balance.final_statement);
            
            if (res.data.balance.owedAmount === 0 && res.data.balance.final_statement === 'Both are settled') {
                console.log('VERIFICATION PASSED: Balance is settled.');
            } else {
                console.error('VERIFICATION FAILED: Balance not settled.');
            }
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

runTest();
