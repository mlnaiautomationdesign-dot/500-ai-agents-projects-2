// Configuration
const API_URL = 'http://localhost:3000/api';

// Utility Functions
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

function isAuthenticated() {
    return !!getAuthToken();
}

// Update navigation based on authentication status
function updateNavigation() {
    const authLink = document.getElementById('authLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isAuthenticated()) {
        if (authLink) {
            authLink.textContent = 'Dashboard';
            authLink.href = 'dashboard.html';
        }
    } else {
        if (authLink) {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
        }
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

function logout() {
    removeAuthToken();
    window.location.href = 'index.html';
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Demo functionality
function initializeDemo() {
    const runDemoBtn = document.getElementById('runDemo');
    
    if (runDemoBtn) {
        runDemoBtn.addEventListener('click', async () => {
            const agentSelect = document.getElementById('demoAgent');
            const inputTextarea = document.getElementById('demoInput');
            const resultDiv = document.getElementById('demoResult');
            
            const agentId = agentSelect.value;
            const input = inputTextarea.value.trim();
            
            if (!input) {
                resultDiv.innerHTML = '<p style="color: var(--danger-color);">Please enter a query.</p>';
                return;
            }
            
            // Show loading state
            resultDiv.innerHTML = '<div class="loading"></div><p>Processing your request...</p>';
            runDemoBtn.disabled = true;
            
            try {
                const response = await apiRequest('/demo/execute', {
                    method: 'POST',
                    body: JSON.stringify({ agentId, input })
                });
                
                resultDiv.innerHTML = `
                    <div style="margin-bottom: 1rem;">
                        <strong>Agent:</strong> ${response.agentName}<br>
                        <strong>Status:</strong> <span style="color: var(--success-color);">Success</span>
                    </div>
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color);">
                        ${response.output || 'Demo completed successfully!'}
                    </div>
                `;
            } catch (error) {
                resultDiv.innerHTML = `
                    <p style="color: var(--danger-color);">
                        <strong>Error:</strong> ${error.message}
                    </p>
                `;
            } finally {
                runDemoBtn.disabled = false;
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    initializeDemo();
});
