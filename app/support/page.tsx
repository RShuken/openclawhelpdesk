'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { createTicket } from '@/lib/clawhub'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function SupportPageContent() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !description.trim() || !email.trim()) return
    setSubmitting(true)
    setResult(null)

    try {
      const data = await createTicket({ subject, description, priority, email })
      setResult({ success: true, id: data.ticket.id })
      setSubject('')
      setDescription('')
      setPriority('normal')
    } catch {
      setResult({ success: false, message: 'Failed to submit ticket. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Submit a Support Ticket</h1>
      <p className="text-zinc-400 mb-8">
        Need direct help? Describe your issue and our team will respond as soon as possible.
      </p>

      {result?.success && result.id && (
        <div className="card border-green-500/50 mb-6">
          <p className="text-green-400 font-medium mb-2">Ticket created successfully!</p>
          <p className="text-sm text-zinc-400 mb-2">Your ticket ID: <code className="text-purple-300">{result.id}</code></p>
          <Link href={`/support/view?id=${result.id}`} className="text-purple-400 hover:text-fuchsia-400">
            View your ticket &rarr;
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card grid gap-4">
        <div>
          <label htmlFor="t-subject" className="block text-sm text-zinc-400 mb-1">
            Subject
          </label>
          <input
            id="t-subject"
            type="text"
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            required
          />
        </div>
        <div>
          <label htmlFor="t-description" className="block text-sm text-zinc-400 mb-1">
            Description
          </label>
          <textarea
            id="t-description"
            className="input min-h-[160px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            required
          />
        </div>
        <div>
          <label htmlFor="t-priority" className="block text-sm text-zinc-400 mb-1">
            Priority
          </label>
          <select
            id="t-priority"
            className="input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="t-email" className="block text-sm text-zinc-400 mb-1">
            Email
          </label>
          <input
            id="t-email"
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
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  )
}

export default function SupportPage() {
  return (
    <ErrorBoundary>
      <SupportPageContent />
    </ErrorBoundary>
  )
}
