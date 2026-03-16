import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllDocs, getDocBySlug } from '@/lib/docs'

export function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({ slug: doc.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug)
  if (!doc) return { title: 'Not Found' }
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  }
}

function renderMarkdown(content: string): string {
  // Renders trusted local MDX content only (from content/docs/ directory).
  // This is never used with user-supplied input.
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulo])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug)
  if (!doc) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/docs" className="text-sm text-zinc-500 hover:text-purple-400 mb-6 inline-block">
        &larr; Back to Docs
      </Link>

      <article>
        <h1 className="text-3xl font-bold text-zinc-50 mb-4">{doc.frontmatter.title}</h1>

        <div className="flex gap-2 mb-8">
          {doc.frontmatter.tags.map((tag) => (
            <span key={tag} className="badge badge-closed">{tag}</span>
          ))}
        </div>

        {/* Safe: renders only trusted local MDX files from content/docs/ */}
        <div
          className="prose-dark"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content) }}
        />
      </article>
    </div>
  )
}
