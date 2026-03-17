'use client'

import Link from 'next/link'
import { useState, useEffect, FormEvent } from 'react'
import { getTicket, replyToTicket, type TicketDetail } from '@/lib/clawhub'
import { ErrorBoundary } from '@/components/ErrorBoundary'

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

function TicketDetailContent({ id }: { id: string }) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [replyBody, setReplyBody] = useState('')
  const [replyEmail, setReplyEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const result = await getTicket(id)
        if (!result) {
          setError('Ticket not found.')
        } else {
          setTicket(result)
        }
      } catch {
        setError('Could not load this ticket.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleReply(e: FormEvent) {
    e.preventDefault()
    if (!replyBody.trim() || !replyEmail.trim()) return
    setSubmitting(true)
    setSubmitMsg('')
    try {
      await replyToTicket(id, { body: replyBody, email: replyEmail })
      setSubmitMsg('Reply sent!')
      setReplyBody('')
      const refreshed = await getTicket(id)
      if (refreshed) setTicket(refreshed)
    } catch {
      setSubmitMsg('Failed to send reply.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center text-zinc-500">
        Loading ticket...
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/support" className="text-sm text-zinc-500 hover:text-purple-400 mb-6 inline-block">
          &larr; Back to Support
        </Link>
        <div className="card text-center py-12">
          <p className="text-zinc-400">{error || 'Ticket not found.'}</p>
        </div>
      </div>
    )
  }

  const messages = Array.isArray(ticket.messages) ? ticket.messages : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/support" className="text-sm text-zinc-500 hover:text-purple-400 mb-6 inline-block">
        &larr; Back to Support
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-zinc-50">{ticket.subject}</h1>
          <div className="flex gap-2 shrink-0">
            <span className={statusBadge(ticket.status)}>{ticket.status}</span>
            <span className={priorityBadge(ticket.priority)}>{ticket.priority}</span>
          </div>
        </div>
        <div className="prose-dark whitespace-pre-wrap">{ticket.description}</div>
        <p className="text-sm text-zinc-500 mt-4">
          Created {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
      </div>

      <h2 className="text-lg font-semibold text-zinc-50 mb-4">Messages</h2>

      {messages.length === 0 && (
        <div className="card text-center py-8 mb-6">
          <p className="text-zinc-400">No replies yet. Our team will respond soon.</p>
        </div>
      )}

      <div className="grid gap-3 mb-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`card ${msg.fromSupport ? 'border-purple-500/30 bg-purple-500/5' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2 text-sm text-zinc-500">
              <span className={msg.fromSupport ? 'text-purple-400 font-medium' : ''}>
                {msg.fromSupport ? 'Support Team' : 'You'}
              </span>
              <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="prose-dark whitespace-pre-wrap">{msg.body}</div>
          </div>
        ))}
      </div>

      {ticket.status !== 'closed' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-zinc-50 mb-4">Reply</h3>
          <form onSubmit={handleReply} className="grid gap-4">
            <div>
              <label htmlFor="reply-body" className="block text-sm text-zinc-400 mb-1">
                Message
              </label>
              <textarea
                id="reply-body"
                className="input min-h-[100px]"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write your reply..."
                required
              />
            </div>
            <div>
              <label htmlFor="reply-email" className="block text-sm text-zinc-400 mb-1">
                Email
              </label>
              <input
                id="reply-email"
                type="email"
                className="input"
                value={replyEmail}
                onChange={(e) => setReplyEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            {submitMsg && (
              <p className={`text-sm ${submitMsg.includes('sent') ? 'text-green-400' : 'text-red-400'}`}>
                {submitMsg}
              </p>
            )}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Reply'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function TicketDetailView({ id }: { id: string }) {
  return (
    <ErrorBoundary>
      <TicketDetailContent id={id} />
    </ErrorBoundary>
  )
}
