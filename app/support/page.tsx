'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { createTicket, getTicketsByEmail, type TicketSummary } from '@/lib/clawhub'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Spinner from '@/components/Spinner'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'badge-open',
    'in-progress': 'badge-answered',
    resolved: 'badge-answered',
    closed: 'badge-closed',
  }
  return `badge ${map[status] || 'badge-closed'}`
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
    normal: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20',
    low: 'bg-zinc-500/10 text-zinc-400 ring-1 ring-inset ring-zinc-500/20',
  }
  return `badge ${map[priority] || map.normal}`
}

function SupportPageContent() {
  // Ticket creation
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null)

  // Ticket lookup
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupDone, setLookupDone] = useState(false)
  const [tickets, setTickets] = useState<TicketSummary[]>([])

  async function handleLookup(e: FormEvent) {
    e.preventDefault()
    if (!lookupEmail.trim()) return
    setLookupLoading(true)
    setLookupDone(false)
    try {
      const results = await getTicketsByEmail(lookupEmail.trim())
      setTickets(results)
    } catch {
      setTickets([])
    } finally {
      setLookupLoading(false)
      setLookupDone(true)
    }
  }

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
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Support</h1>
      <p className="text-zinc-400 mb-8">
        Check on an existing ticket or submit a new one.
      </p>

      {/* Ticket lookup */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">Check existing ticket</h2>
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            className="input flex-1"
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            aria-label="Email for ticket lookup"
          />
          <button type="submit" className="btn-secondary whitespace-nowrap" disabled={lookupLoading}>
            {lookupLoading ? 'Looking up...' : 'Look up'}
          </button>
        </form>

        {lookupLoading && <Spinner />}

        {lookupDone && !lookupLoading && tickets.length === 0 && (
          <div className="mt-4 text-center py-6">
            <p className="text-zinc-400">No tickets found for that email.</p>
            <p className="text-sm text-zinc-500 mt-1">
              If you have not submitted a ticket yet, use the form below.
            </p>
          </div>
        )}

        {lookupDone && !lookupLoading && tickets.length > 0 && (
          <div className="mt-4 grid gap-3">
            {tickets.map((t) => (
              <Link
                key={t.id}
                href={`/support/view?id=${t.id}`}
                className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 group hover:border-purple-500/50 transition-colors block"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-50 group-hover:text-purple-400 transition-colors truncate">
                      {t.subject}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className={statusBadge(t.status)}>{t.status}</span>
                    <span className={priorityBadge(t.priority)}>{t.priority}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-sm text-zinc-500">or submit a new ticket</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Ticket creation */}
      {result?.success && result.id && (
        <div className="bg-zinc-900 border border-green-500/50 rounded-xl p-6 mb-6">
          <p className="text-green-400 font-medium mb-2">Ticket created successfully!</p>
          <p className="text-sm text-zinc-400 mb-2">Your ticket ID: <code className="text-purple-300">{result.id}</code></p>
          <Link href={`/support/view?id=${result.id}`} className="text-purple-400 hover:text-fuchsia-400">
            View your ticket &rarr;
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid gap-4">
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
