const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get user profile (protected)
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const { users } = require('./auth');
        const userEmail = req.user.email;
        const user = Array.from(users.values()).find(u => u.email === userEmail);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return user data without password
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            apiKey: user.apiKey,
            apiCalls: user.apiCalls,
            purchasedAgents: user.purchasedAgents || [],
            recentActivity: user.recentActivity || [],
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Get user purchases (protected)
router.get('/purchases', authenticateToken, (req, res) => {
    try {
        const { users } = require('./auth');
        const userEmail = req.user.email;
        const user = Array.from(users.values()).find(u => u.email === userEmail);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            purchases: user.purchasedAgents || [],
            total: user.purchasedAgents?.length || 0
        });
    } catch (error) {
        console.error('Purchases error:', error);
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
});

// Regenerate API key (protected)
router.post('/regenerate-key', authenticateToken, (req, res) => {
    try {
        const { users } = require('./auth');
        const userEmail = req.user.email;
        const user = Array.from(users.values()).find(u => u.email === userEmail);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Generate new API key
        const newApiKey = 'sk_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        user.apiKey = newApiKey;
        
        res.json({
            apiKey: newApiKey,
            message: 'API key regenerated successfully'
        });
    } catch (error) {
        console.error('Regenerate key error:', error);
        res.status(500).json({ error: 'Failed to regenerate API key' });
    }
});

module.exports = router;
