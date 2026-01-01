/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const agents = [
  {
    name: 'HIA (Health Insights Agent)',
    description: 'Analyses medical reports and provide health insights.',
    category: 'Medical Diagnostics',
    framework: 'CrewAI',
    githubUrl: 'https://github.com/harshhh28/hia.git',
    industry: 'Healthcare',
    price: 49.99,
    featured: true,
    tags: JSON.stringify(['healthcare', 'medical', 'diagnostics']),
  },
  {
    name: 'AI Health Assistant',
    description: 'Diagnoses and monitors diseases using patient data.',
    category: 'Medical Diagnostics',
    framework: 'AutoGen',
    githubUrl: 'https://github.com/ahmadvh/AI-Agents-for-Medical-Diagnostics.git',
    industry: 'Healthcare',
    price: 59.99,
    featured: true,
    tags: JSON.stringify(['healthcare', 'diagnostics', 'monitoring']),
  },
  {
    name: 'Automated Trading Bot',
    description: 'Automates stock trading with real-time market analysis.',
    category: 'Trading',
    framework: 'LangGraph',
    githubUrl: 'https://github.com/MingyuJ666/Stockagent.git',
    industry: 'Finance',
    price: 99.99,
    featured: true,
    tags: JSON.stringify(['finance', 'trading', 'stocks']),
  },
  {
    name: 'Virtual AI Tutor',
    description: 'Provides personalized education tailored to users.',
    category: 'Learning',
    framework: 'CrewAI',
    githubUrl: 'https://github.com/hqanhh/EduGPT.git',
    industry: 'Education',
    price: 39.99,
    featured: false,
    tags: JSON.stringify(['education', 'learning', 'tutoring']),
  },
  {
    name: '24/7 AI Chatbot',
    description: 'Handles customer queries around the clock.',
    category: 'Support',
    framework: 'LangGraph',
    githubUrl: 'https://github.com/NirDiamant/GenAI_Agents',
    industry: 'Customer Service',
    price: 29.99,
    featured: false,
    tags: JSON.stringify(['customer-service', 'chatbot', 'support']),
  },
  {
    name: 'Product Recommendation Agent',
    description: 'Suggests products based on user preferences and history.',
    category: 'Recommendation',
    framework: 'AutoGen',
    githubUrl: 'https://github.com/microsoft/RecAI',
    industry: 'Retail',
    price: 44.99,
    featured: false,
    tags: JSON.stringify(['retail', 'recommendation', 'e-commerce']),
  },
  {
    name: 'Content Personalization Agent',
    description: 'Recommends personalized media based on preferences.',
    category: 'Recommendation',
    framework: 'Agno',
    githubUrl: 'https://github.com/crosleythomas/MirrorGPT',
    industry: 'Entertainment',
    price: 34.99,
    featured: false,
    tags: JSON.stringify(['entertainment', 'content', 'personalization']),
  },
  {
    name: 'Legal Document Review Assistant',
    description: 'Automates document review and highlights key clauses.',
    category: 'Document Analysis',
    framework: 'LangGraph',
    githubUrl: 'https://github.com/firica/legalai',
    industry: 'Legal',
    price: 79.99,
    featured: true,
    tags: JSON.stringify(['legal', 'documents', 'analysis']),
  },
  {
    name: 'Recruitment Recommendation Agent',
    description: 'Suggests best-fit candidates for job openings.',
    category: 'HR',
    framework: 'CrewAI',
    githubUrl: 'https://github.com/sentient-engineering/jobber',
    industry: 'Human Resources',
    price: 54.99,
    featured: false,
    tags: JSON.stringify(['hr', 'recruitment', 'hiring']),
  },
  {
    name: 'Virtual Travel Assistant',
    description: 'Plans travel itineraries based on preferences.',
    category: 'Planning',
    framework: 'CrewAI',
    githubUrl: 'https://github.com/nirbar1985/ai-travel-agent',
    industry: 'Hospitality',
    price: 29.99,
    featured: false,
    tags: JSON.stringify(['travel', 'planning', 'hospitality']),
  },
  {
    name: 'Real-Time Threat Detection Agent',
    description: 'Identifies potential threats and mitigates attacks.',
    category: 'Security',
    framework: 'AutoGen',
    githubUrl: 'https://github.com/NVISOsecurity/cyber-security-llm-agents',
    industry: 'Cybersecurity',
    price: 149.99,
    featured: true,
    tags: JSON.stringify(['security', 'cybersecurity', 'threat-detection']),
  },
  {
    name: 'E-commerce Personal Shopper Agent',
    description: 'Helps customers find products they\'ll love.',
    category: 'Shopping',
    framework: 'Agno',
    githubUrl: 'https://github.com/Hoanganhvu123/ShoppingGPT',
    industry: 'E-commerce',
    price: 39.99,
    featured: false,
    tags: JSON.stringify(['e-commerce', 'shopping', 'recommendation']),
  },
  {
    name: 'Finance Agent',
    description: 'An advanced AI-powered market analyst that delivers real-time stock market insights.',
    category: 'Financial Analysis',
    framework: 'Agno',
    githubUrl: 'https://github.com/agno-agi/agno',
    industry: 'Finance',
    price: 89.99,
    featured: true,
    tags: JSON.stringify(['finance', 'stocks', 'analysis']),
  },
  {
    name: 'Research Scholar Agent',
    description: 'An AI-powered academic assistant that performs advanced academic searches.',
    category: 'Research',
    framework: 'Agno',
    githubUrl: 'https://github.com/agno-agi/agno',
    industry: 'Education',
    price: 64.99,
    featured: false,
    tags: JSON.stringify(['research', 'academic', 'education']),
  },
  {
    name: 'SQL Agent',
    description: 'Build an agent that can answer questions about a SQL database.',
    category: 'Database',
    framework: 'LangGraph',
    githubUrl: 'https://github.com/langchain-ai/langgraph',
    industry: 'Software Development',
    price: 44.99,
    featured: false,
    tags: JSON.stringify(['database', 'sql', 'development']),
  },
]

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  await prisma.purchase.deleteMany({})
  await prisma.agent.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.documentation.deleteMany({})

  console.log('Cleared existing data')

  // Seed agents
  for (const agent of agents) {
    await prisma.agent.create({
      data: agent,
    })
  }

  console.log(`Created ${agents.length} agents`)

  // Create sample documentation
  await prisma.documentation.create({
    data: {
      title: 'Getting Started',
      content: 'Welcome to the AI Agents Marketplace! Learn how to browse, purchase, and integrate AI agents.',
      category: 'Tutorial',
      slug: 'getting-started',
      order: 1,
    },
  })

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
