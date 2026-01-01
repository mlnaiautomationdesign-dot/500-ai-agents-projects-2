import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const categories = [...new Set(agents.map(a => a.category))]
  const frameworks = [...new Set(agents.map(a => a.framework))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Agents Catalog</h1>
          <p className="text-gray-600">
            Browse our collection of 500+ AI agents across different industries and frameworks.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <select className="px-4 py-2 border rounded-lg bg-white">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select className="px-4 py-2 border rounded-lg bg-white">
            <option value="">All Frameworks</option>
            {frameworks.map(fw => (
              <option key={fw} value={fw}>{fw}</option>
            ))}
          </select>
        </div>

        {/* Agents Grid */}
        {agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No agents available yet.</p>
            <p className="text-sm text-gray-400">
              Run the seed script to populate the database with sample agents.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div key={agent.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold">{agent.name}</h3>
                  {agent.featured && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{agent.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {agent.framework}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {agent.industry}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(agent.price)}
                  </span>
                  <Link
                    href={`/agents/${agent.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
