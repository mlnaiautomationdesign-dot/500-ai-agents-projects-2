// Catalog Page JavaScript
const API_URL = 'http://localhost:3000/api';

// Sample agent data - In production, this would come from the API
const sampleAgents = [
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
    },
    {
        id: 5,
        name: 'Code Generation Assistant',
        framework: 'autogen',
        industry: 'Software Development',
        description: 'Demonstrates automated task-solving by generating, executing, and debugging code.',
        price: 69,
        githubUrl: 'https://github.com/microsoft/autogen'
    },
    {
        id: 6,
        name: 'Virtual Travel Assistant',
        framework: 'crewai',
        industry: 'Travel',
        description: 'Plans travel itineraries based on preferences and manages travel details.',
        price: 35,
        githubUrl: 'https://github.com/crewAIInc/crewAI-examples'
    },
    {
        id: 7,
        name: 'Legal Document Analyzer',
        framework: 'agno',
        industry: 'Legal',
        description: 'Analyzes legal documents and provides insights based on a knowledge base.',
        price: 89,
        githubUrl: 'https://github.com/agno-agi/agno'
    },
    {
        id: 8,
        name: 'Content Generator',
        framework: 'crewai',
        industry: 'Marketing',
        description: 'Generates marketing content, social media posts, and blog articles automatically.',
        price: 45,
        githubUrl: 'https://github.com/crewAIInc/crewAI-examples'
    }
];

let filteredAgents = [...sampleAgents];

function renderAgents() {
    const catalogGrid = document.getElementById('catalogGrid');
    
    if (!catalogGrid) return;
    
    if (filteredAgents.length === 0) {
        catalogGrid.innerHTML = '<p class="empty-state">No agents found matching your criteria.</p>';
        return;
    }
    
    catalogGrid.innerHTML = filteredAgents.map(agent => `
        <div class="agent-card" onclick="viewAgent(${agent.id})">
            <span class="badge ${agent.framework}">${agent.framework.toUpperCase()}</span>
            <h3>${agent.name}</h3>
            <p class="industry">📊 ${agent.industry}</p>
            <p class="description">${agent.description}</p>
            <div class="price">$${agent.price}<span>/month</span></div>
            <button class="btn btn-primary" onclick="event.stopPropagation(); purchaseAgent(${agent.id})">
                Purchase
            </button>
        </div>
    `).join('');
}

function filterAgents() {
    const frameworkFilter = document.getElementById('frameworkFilter').value;
    const industryFilter = document.getElementById('industryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    filteredAgents = sampleAgents.filter(agent => {
        const matchesFramework = frameworkFilter === 'all' || agent.framework === frameworkFilter;
        const matchesIndustry = industryFilter === 'all' || 
            agent.industry.toLowerCase().includes(industryFilter.toLowerCase());
        const matchesSearch = searchInput === '' || 
            agent.name.toLowerCase().includes(searchInput) ||
            agent.description.toLowerCase().includes(searchInput);
        
        return matchesFramework && matchesIndustry && matchesSearch;
    });
    
    renderAgents();
}

function viewAgent(agentId) {
    const agent = sampleAgents.find(a => a.id === agentId);
    if (agent) {
        // In production, navigate to agent detail page
        alert(`Viewing details for: ${agent.name}\n\nFramework: ${agent.framework}\nIndustry: ${agent.industry}\n\n${agent.description}\n\nPrice: $${agent.price}/month`);
    }
}

async function purchaseAgent(agentId) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert('Please login to purchase agents');
        window.location.href = 'login.html';
        return;
    }
    
    const agent = sampleAgents.find(a => a.id === agentId);
    
    if (confirm(`Purchase ${agent.name} for $${agent.price}/month?`)) {
        try {
            const response = await fetch(`${API_URL}/agents/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ agentId })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Purchase failed');
            }
            
            alert('Purchase successful! Agent added to your dashboard.');
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert(`Purchase failed: ${error.message}`);
        }
    }
}

// Initialize catalog page
document.addEventListener('DOMContentLoaded', () => {
    const catalogGrid = document.getElementById('catalogGrid');
    
    if (catalogGrid) {
        renderAgents();
        
        // Add event listeners for filters
        document.getElementById('frameworkFilter').addEventListener('change', filterAgents);
        document.getElementById('industryFilter').addEventListener('change', filterAgents);
        document.getElementById('searchInput').addEventListener('input', filterAgents);
    }
});
