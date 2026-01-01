// Dashboard Page JavaScript
const API_URL = 'http://localhost:3000/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Load dashboard data
async function loadDashboard() {
    if (!checkAuth()) return;
    
    const token = localStorage.getItem('authToken');
    
    try {
        // Load user data
        const userData = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json());
        
        // Update stats
        document.getElementById('totalAgents').textContent = userData.purchasedAgents?.length || 0;
        document.getElementById('apiCalls').textContent = userData.apiCalls || 0;
        document.getElementById('currentPlan').textContent = userData.plan || 'Free';
        
        // Load API key
        document.getElementById('apiKey').value = userData.apiKey || 'No API key generated yet';
        
        // Load purchased agents
        if (userData.purchasedAgents && userData.purchasedAgents.length > 0) {
            const myAgentsDiv = document.getElementById('myAgents');
            myAgentsDiv.innerHTML = userData.purchasedAgents.map(agent => `
                <div class="agent-card">
                    <h3>${agent.name}</h3>
                    <p class="industry">${agent.framework} - ${agent.industry}</p>
                    <p class="description">${agent.description}</p>
                    <button class="btn btn-primary" onclick="useAgent(${agent.id})">Use Agent</button>
                </div>
            `).join('');
        }
        
        // Load recent activity
        if (userData.recentActivity && userData.recentActivity.length > 0) {
            const activityDiv = document.getElementById('recentActivity');
            activityDiv.innerHTML = userData.recentActivity.map(activity => `
                <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <strong>${activity.action}</strong> - ${activity.agentName}<br>
                    <small style="color: var(--text-secondary);">${new Date(activity.timestamp).toLocaleString()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        // If unauthorized, redirect to login
        if (error.message.includes('401')) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }
    }
}

// Copy API key to clipboard
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copyApiKey');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const apiKeyInput = document.getElementById('apiKey');
            apiKeyInput.select();
            document.execCommand('copy');
            
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });
    }
    
    // Regenerate API key
    const regenerateBtn = document.getElementById('regenerateKey');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to regenerate your API key? The old key will stop working.')) {
                const token = localStorage.getItem('authToken');
                try {
                    const response = await fetch(`${API_URL}/user/regenerate-key`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        document.getElementById('apiKey').value = data.apiKey;
                        alert('API key regenerated successfully!');
                    } else {
                        throw new Error(data.error || 'Failed to regenerate key');
                    }
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
        });
    }
    
    // Load dashboard data
    loadDashboard();
});

function useAgent(agentId) {
    alert(`This would open the agent execution interface for agent ${agentId}`);
    // In production, this would navigate to an agent execution page
}
