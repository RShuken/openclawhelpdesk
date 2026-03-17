import Link from 'next/link'
import { getAllDocs } from '@/lib/docs'

export const metadata = {
  title: 'Documentation',
  description: 'Browse the OpenClaw knowledge base for guides and tutorials.',
}

export default function DocsPage() {
  const docs = getAllDocs()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Documentation</h1>
      <p className="text-zinc-400 mb-8">Guides, tutorials, and reference material for your OpenClaw setup.</p>

      {docs.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-zinc-400 mb-2">No documentation articles yet.</p>
          <p className="text-sm text-zinc-500">Check back soon -- we are adding new guides regularly.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group hover:border-purple-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <h2 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-purple-400 transition-colors">
                {doc.frontmatter.title}
              </h2>
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{doc.frontmatter.description}</p>
              <div className="flex flex-wrap gap-2">
                {doc.frontmatter.tags.map((tag) => (
                  <span key={tag} className="badge badge-closed">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
