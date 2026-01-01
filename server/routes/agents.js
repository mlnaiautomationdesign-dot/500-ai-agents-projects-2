const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Sample agents data
const agents = [
    {
        id: 1,
        name: 'Email Auto Responder',
        framework: 'crewai',
        industry: 'Customer Service',
        description: 'Automates email responses based on predefined criteria to enhance communication efficiency.',
        price: 29,
        githubUrl: 'https://github.com/crewAIInc/crewAI-examples/tree/main/flows/email_auto_responder_flow'
    },
    {
        id: 2,
        name: 'Stock Analysis Tool',
        framework: 'crewai',
        industry: 'Finance',
        description: 'Provides tools for analyzing stock market data to assist in financial decision-making.',
        price: 49,
        githubUrl: 'https://github.com/crewAIInc/crewAI-examples/tree/main/crews/stock_analysis'
    },
    {
        id: 3,
        name: 'Customer Support Agent',
        framework: 'langgraph',
        industry: 'Customer Service',
        description: 'Build a customer support agent that can handle customer inquiries and provide automated support.',
        price: 39,
        githubUrl: 'https://github.com/langchain-ai/langgraph'
    },
    {
        id: 4,
        name: 'Finance Agent',
        framework: 'agno',
        industry: 'Finance',
        description: 'An advanced AI-powered market analyst that delivers real-time stock market insights and recommendations.',
        price: 59,
        githubUrl: 'https://github.com/agno-agi/agno'
    }
];

// Get all agents
router.get('/', (req, res) => {
    const { framework, industry, search } = req.query;
    
    let filteredAgents = [...agents];
    
    if (framework) {
        filteredAgents = filteredAgents.filter(a => a.framework === framework);
    }
    
    if (industry) {
        filteredAgents = filteredAgents.filter(a => 
            a.industry.toLowerCase().includes(industry.toLowerCase())
        );
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredAgents = filteredAgents.filter(a =>
            a.name.toLowerCase().includes(searchLower) ||
            a.description.toLowerCase().includes(searchLower)
        );
    }
    
    res.json({ agents: filteredAgents, total: filteredAgents.length });
});

// Get single agent
router.get('/:id', (req, res) => {
    const agent = agents.find(a => a.id === parseInt(req.params.id));
    
    if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent);
});

// Purchase agent (protected route)
router.post('/purchase', authenticateToken, (req, res) => {
    try {
        const { agentId } = req.body;
        const { users } = require('./auth');
        
        const agent = agents.find(a => a.id === parseInt(agentId));
        
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        
        // Find user
        const userEmail = req.user.email;
        const user = Array.from(users.values()).find(u => u.email === userEmail);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check if already purchased
        if (user.purchasedAgents.some(a => a.id === agent.id)) {
            return res.status(400).json({ error: 'Agent already purchased' });
        }
        
        // Add to purchased agents
        user.purchasedAgents.push({
            ...agent,
            purchasedAt: new Date().toISOString()
        });
        
        res.json({
            message: 'Agent purchased successfully',
            agent: agent
        });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ error: 'Purchase failed' });
    }
});

// Execute agent (protected route)
router.post('/:id/execute', authenticateToken, async (req, res) => {
    try {
        const { input } = req.body;
        const agentId = parseInt(req.params.id);
        
        const agent = agents.find(a => a.id === agentId);
        
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        
        // Simulate agent execution
        const output = `Processed by ${agent.name}: ${input}\n\nThis is a simulated response. In production, this would execute the actual AI agent.`;
        
        res.json({
            agentId: agent.id,
            agentName: agent.name,
            input: input,
            output: output,
            executedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Execute error:', error);
        res.status(500).json({ error: 'Execution failed' });
    }
});

module.exports = router;
