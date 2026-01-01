import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const agent = await prisma.agent.findUnique({
    where: { id },
  })

  if (!agent) {
    notFound()
  }

  const tags = JSON.parse(agent.tags) as string[]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <Link href="/agents" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Agents
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{agent.name}</h1>
              <div className="flex gap-2 items-center text-sm text-gray-600">
                <span>{agent.framework}</span>
                <span>•</span>
                <span>{agent.industry}</span>
                {agent.featured && (
                  <>
                    <span>•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Featured</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPrice(agent.price)}
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Purchase Agent
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {agent.description}
            </p>

            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Framework</div>
                <div className="font-semibold">{agent.framework}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Industry</div>
                <div className="font-semibold">{agent.industry}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Category</div>
                <div className="font-semibold">{agent.category}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">GitHub</div>
                <a 
                  href={agent.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  View Repository →
                </a>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {agent.demoUrl && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Live Demo</h2>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 mb-4">
                    Try out this agent&apos;s capabilities with our interactive demo:
                  </p>
                  <a
                    href={agent.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Launch Demo →
                  </a>
                </div>
              </>
            )}

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> After purchase, you&apos;ll receive instant access to the complete 
                source code, documentation, and integration guides. All agents include full GitHub 
                repository access and regular updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
