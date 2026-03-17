'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { askQuestion } from '@/lib/clawhub'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function AskPageContent() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !email.trim()) return
    setSubmitting(true)
    setResult(null)

    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

      const data = await askQuestion({ title, body, tags: tagList, email })
      setResult({ success: true, id: data.question.id })
      setTitle('')
      setBody('')
      setTags('')
    } catch {
      setResult({ success: false, message: 'Failed to submit question. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/q" className="text-sm text-zinc-500 hover:text-purple-400 mb-6 inline-block">
        &larr; Back to Q&A
      </Link>

      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Ask a Question</h1>
      <p className="text-zinc-400 mb-8">
        Describe your issue or question clearly. The community and support team will help.
      </p>

      {result?.success && result.id && (
        <div className="card border-green-500/50 mb-6">
          <p className="text-green-400 font-medium mb-2">Question submitted successfully!</p>
          <Link href={`/q/view?id=${result.id}`} className="text-purple-400 hover:text-fuchsia-400">
            View your question &rarr;
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card grid gap-4">
        <div>
          <label htmlFor="q-title" className="block text-sm text-zinc-400 mb-1">
            Title
          </label>
          <input
            id="q-title"
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is your question?"
            required
          />
        </div>
        <div>
          <label htmlFor="q-body" className="block text-sm text-zinc-400 mb-1">
            Details
          </label>
          <textarea
            id="q-body"
            className="input min-h-[160px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide as much detail as possible..."
            required
          />
        </div>
        <div>
          <label htmlFor="q-tags" className="block text-sm text-zinc-400 mb-1">
            Tags (comma separated)
          </label>
          <input
            id="q-tags"
            type="text"
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="telegram, setup, integration"
          />
        </div>
        <div>
          <label htmlFor="q-email" className="block text-sm text-zinc-400 mb-1">
            Email
          </label>
          <input
            id="q-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {result && !result.success && (
          <p className="text-sm text-red-400">{result.message}</p>
        )}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  )
}

export default function AskPage() {
  return (
    <ErrorBoundary>
      <AskPageContent />
    </ErrorBoundary>
  )
}
