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

      <div className="grid gap-4">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="card group hover:border-purple-500/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-zinc-50 mb-1 group-hover:text-purple-400 transition-colors">
              {doc.frontmatter.title}
            </h2>
            <p className="text-sm text-zinc-400 mb-3">{doc.frontmatter.description}</p>
            <div className="flex gap-2">
              {doc.frontmatter.tags.map((tag) => (
                <span key={tag} className="badge badge-closed">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
