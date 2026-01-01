const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Note: In production, use the actual Stripe SDK
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent (protected)
router.post('/create-intent', authenticateToken, async (req, res) => {
    try {
        const { amount, agentId } = req.body;
        
        if (!amount || !agentId) {
            return res.status(400).json({ error: 'Amount and agent ID are required' });
        }
        
        // In production, create actual Stripe payment intent
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: amount * 100, // Convert to cents
        //     currency: 'usd',
        //     metadata: { agentId, userId: req.user.id }
        // });
        
        // For demo purposes, return mock payment intent
        const mockPaymentIntent = {
            id: 'pi_' + Math.random().toString(36).substring(2),
            client_secret: 'pi_secret_' + Math.random().toString(36).substring(2),
            amount: amount * 100,
            currency: 'usd',
            status: 'requires_payment_method'
        };
        
        res.json({
            clientSecret: mockPaymentIntent.client_secret,
            paymentIntentId: mockPaymentIntent.id
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

// Confirm payment (webhook in production)
router.post('/confirm', authenticateToken, async (req, res) => {
    try {
        const { paymentIntentId, agentId } = req.body;
        
        if (!paymentIntentId || !agentId) {
            return res.status(400).json({ error: 'Payment intent ID and agent ID are required' });
        }
        
        // In production, verify payment with Stripe
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // if (paymentIntent.status !== 'succeeded') {
        //     return res.status(400).json({ error: 'Payment not completed' });
        // }
        
        // Mock successful payment
        res.json({
            success: true,
            message: 'Payment processed successfully',
            paymentId: paymentIntentId,
            agentId: agentId
        });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

// Get payment history (protected)
router.get('/history', authenticateToken, async (req, res) => {
    try {
        // In production, fetch from database
        const mockHistory = [
            {
                id: 'pay_' + Date.now(),
                agentName: 'Email Auto Responder',
                amount: 29,
                currency: 'usd',
                status: 'succeeded',
                createdAt: new Date().toISOString()
            }
        ];
        
        res.json({ payments: mockHistory });
    } catch (error) {
        console.error('Payment history error:', error);
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

module.exports = router;
