# Testing Guide - AI Agents Marketplace

This document provides comprehensive testing instructions for the AI Agents Marketplace SaaS platform.

## Quick Start Testing

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start
```

The server will be available at `http://localhost:3000`

## Manual Testing Checklist

### ✅ Homepage Testing

1. **Navigation Bar**
   - [ ] All navigation links work correctly
   - [ ] Logo/brand name is displayed
   - [ ] Mobile responsive menu works

2. **Hero Section**
   - [ ] Hero banner displays correctly
   - [ ] Call-to-action buttons are functional
   - [ ] Text is readable and properly formatted

3. **Features Section**
   - [ ] All 4 feature cards display correctly
   - [ ] Icons and text are aligned
   - [ ] Hover effects work on cards

4. **Frameworks Section**
   - [ ] All 4 framework cards (CrewAI, AutoGen, LangGraph, Agno) display
   - [ ] Cards have gradient backgrounds
   - [ ] Text is readable on gradient backgrounds

5. **Live Demo Section**
   - [ ] Demo agent selector works
   - [ ] Text input accepts queries
   - [ ] "Run Demo" button is clickable
   - [ ] Demo executes and returns results
   - [ ] Results display in the output area
   - [ ] Loading state shows while processing

6. **Pricing Section**
   - [ ] All 3 pricing tiers display correctly
   - [ ] "Most Popular" badge shows on Professional tier
   - [ ] Pricing features are listed correctly
   - [ ] CTA buttons work for each tier

### ✅ Catalog Page Testing

1. **Filters**
   - [ ] Framework filter dropdown works
   - [ ] Industry filter dropdown works
   - [ ] Search input filters agents in real-time
   - [ ] Multiple filters can be applied together
   - [ ] Filters reset correctly

2. **Agent Cards**
   - [ ] Agent cards display with correct information
   - [ ] Framework badges show correct colors
   - [ ] Price displays correctly
   - [ ] Purchase buttons are functional
   - [ ] Card hover effects work

3. **Purchase Flow**
   - [ ] Clicking purchase prompts for authentication if not logged in
   - [ ] Purchase confirmation dialog appears
   - [ ] Purchase completes successfully when authenticated

### ✅ Authentication Testing

1. **Signup Page**
   - [ ] All form fields are present (name, email, password, confirm password)
   - [ ] Password confirmation validation works
   - [ ] Password minimum length (8 chars) is enforced
   - [ ] Email validation works
   - [ ] Successful signup redirects to dashboard
   - [ ] Error messages display for invalid inputs
   - [ ] Link to login page works

2. **Login Page**
   - [ ] Email and password fields work
   - [ ] Login with valid credentials succeeds
   - [ ] Login with invalid credentials shows error
   - [ ] JWT token is stored correctly
   - [ ] Successful login redirects to dashboard
   - [ ] Link to signup page works

### ✅ Dashboard Testing

1. **Authentication Guard**
   - [ ] Unauthenticated users are redirected to login
   - [ ] Authenticated users can access dashboard

2. **Statistics Cards**
   - [ ] Total agents displays correctly
   - [ ] API calls count displays
   - [ ] Current plan displays

3. **API Key Management**
   - [ ] API key displays correctly
   - [ ] Copy button works
   - [ ] Regenerate button works
   - [ ] Confirmation dialog appears before regeneration

4. **Purchased Agents**
   - [ ] List displays all purchased agents
   - [ ] Empty state shows when no agents purchased
   - [ ] Agent cards are clickable

5. **Recent Activity**
   - [ ] Activity list displays correctly
   - [ ] Timestamps are formatted properly
   - [ ] Empty state shows when no activity

### ✅ Documentation Page Testing

1. **Navigation Sidebar**
   - [ ] All section links work
   - [ ] Clicking links scrolls to correct section
   - [ ] Active section is highlighted

2. **Content Sections**
   - [ ] Getting Started section is complete
   - [ ] API Reference with examples is present
   - [ ] User Guides are clear and helpful
   - [ ] Integration examples (Node.js, Python) work
   - [ ] Code blocks are properly formatted
   - [ ] Authentication section explains API key usage
   - [ ] Payment integration information is clear

3. **Code Examples**
   - [ ] Code syntax is correct
   - [ ] Examples are copy-pasteable
   - [ ] Examples cover common use cases

## API Testing

### Health Check
```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Authentication Endpoints

**Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
# Expected: Returns token and user object
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
# Expected: Returns token and user object
```

### Agent Endpoints

**List All Agents**
```bash
curl http://localhost:3000/api/agents
# Expected: Returns array of agents
```

**Get Single Agent**
```bash
curl http://localhost:3000/api/agents/1
# Expected: Returns single agent details
```

**Purchase Agent (Authenticated)**
```bash
TOKEN="your_jwt_token"
curl -X POST http://localhost:3000/api/agents/purchase \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": 1}'
# Expected: Success message
```

### Demo Endpoint

**Execute Demo**
```bash
curl -X POST http://localhost:3000/api/demo/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "content-generator",
    "input": "Write about AI"
  }'
# Expected: Returns demo output
```

### User Endpoints (Authenticated)

**Get Profile**
```bash
TOKEN="your_jwt_token"
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
# Expected: Returns user profile
```

**Get Purchases**
```bash
TOKEN="your_jwt_token"
curl -X GET http://localhost:3000/api/user/purchases \
  -H "Authorization: Bearer $TOKEN"
# Expected: Returns list of purchased agents
```

**Regenerate API Key**
```bash
TOKEN="your_jwt_token"
curl -X POST http://localhost:3000/api/user/regenerate-key \
  -H "Authorization: Bearer $TOKEN"
# Expected: Returns new API key
```

## Security Testing

### 1. Authentication Tests
- [ ] JWT tokens expire correctly (7 days)
- [ ] Invalid tokens are rejected (403)
- [ ] Missing tokens are rejected (401)
- [ ] Password hashing works (bcrypt)

### 2. Rate Limiting
- [ ] Rate limit is enforced on API endpoints
- [ ] Rate limit headers are present
- [ ] Exceeding rate limit returns 429 status

### 3. CORS Testing
- [ ] CORS headers are set correctly
- [ ] Allowed origins are enforced
- [ ] Credentials are handled properly

### 4. Input Validation
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are sanitized
- [ ] Email validation works
- [ ] Password strength requirements enforced

## Performance Testing

### 1. Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Catalog page loads in < 2 seconds
- [ ] API responses are < 500ms
- [ ] Demo execution completes in < 2 seconds

### 2. Asset Optimization
- [ ] CSS is minified (in production)
- [ ] JavaScript is minified (in production)
- [ ] Images are optimized
- [ ] No unnecessary network requests

## Browser Compatibility Testing

Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (iOS)
- [ ] Mobile Safari (iOS)

## Responsive Design Testing

Test on the following screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Responsive Checklist
- [ ] Navigation menu adapts to mobile
- [ ] Cards stack properly on mobile
- [ ] Text is readable on all screen sizes
- [ ] Forms are usable on mobile
- [ ] Buttons are tappable on mobile

## Automated Testing (Future)

### Unit Tests
- Authentication functions
- API endpoint handlers
- Validation functions

### Integration Tests
- Full authentication flow
- Agent purchase flow
- Demo execution flow

### E2E Tests
- User signup and login
- Browse and purchase agent
- Execute demo
- Dashboard usage

## Bug Report Template

When reporting bugs, include:

```markdown
**Bug Title**: Brief description

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen Size: 1920x1080

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. Observe...

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots**:
If applicable

**Console Errors**:
Any JavaScript errors
```

## Test Results Log

| Test Date | Tester | Overall Result | Notes |
|-----------|--------|----------------|-------|
| 2026-01-01 | System | ✅ PASS | All core features working |
| | | | - Demo execution works |
| | | | - Authentication functional |
| | | | - API endpoints responding |
| | | | - UI renders correctly |

## Known Issues

Currently no known issues. Report any bugs to the GitHub repository.

## Testing Credentials

For testing purposes, you can use:
- Email: test@example.com
- Password: testpass123

(These are automatically created during server startup in development mode)

## Deployment Testing

Before deploying to production:

1. [ ] All environment variables are set correctly
2. [ ] Database connections work
3. [ ] Stripe keys are production keys
4. [ ] JWT secret is strong and unique
5. [ ] HTTPS is enabled
6. [ ] Rate limiting is appropriate for production
7. [ ] Error logging is configured
8. [ ] Monitoring is set up
9. [ ] Backup strategy is in place
10. [ ] SSL certificates are valid

## Support

For testing support or questions:
- GitHub Issues: https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/issues
- Email: support@aiagents.example
