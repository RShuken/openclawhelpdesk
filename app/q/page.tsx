'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { getQuestions, type QuestionSummary } from '@/lib/clawhub'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Spinner from '@/components/Spinner'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'badge-open',
    answered: 'badge-answered',
    closed: 'badge-closed',
  }
  return `badge ${map[status] || 'badge-closed'}`
}

function QAPageContent() {
  const [questions, setQuestions] = useState<QuestionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = {}
      if (search) params.q = search
      if (statusFilter) params.status = statusFilter
      const results = await getQuestions(params)
      setQuestions(results)
    } catch {
      setError('Could not load questions. The API may not be available yet.')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">Q&A</h1>
          <p className="text-zinc-400">Ask questions and find answers from the community.</p>
        </div>
        <Link href="/q/ask" className="btn-primary text-center whitespace-nowrap">
          Ask a Question
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search questions..."
          className="input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search questions"
        />
        <select
          className="input sm:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="answered">Answered</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Results */}
      {loading && <Spinner />}

      {error && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl text-center py-12 px-6">
          <p className="text-zinc-400">{error}</p>
          <p className="text-sm text-zinc-500 mt-2">
            Check back soon or{' '}
            <Link href="/q/ask" className="text-purple-400 hover:text-fuchsia-400">
              ask your own question
            </Link>.
          </p>
        </div>
      )}

      {!loading && !error && questions.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl text-center py-12 px-6">
          <svg className="w-12 h-12 mx-auto text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
          <p className="text-zinc-300 font-medium mb-2">No questions yet. Be the first to ask!</p>
          <p className="text-sm text-zinc-500 mb-4">Your question could help others with the same issue.</p>
          <Link href="/q/ask" className="btn-primary inline-block">
            Ask a Question
          </Link>
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div className="grid gap-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              href={`/q/view?id=${q.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 group hover:border-purple-500/50 transition-colors block"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-zinc-50 group-hover:text-purple-400 transition-colors truncate">
                    {q.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                    <span>{q.answerCount} {q.answerCount === 1 ? 'answer' : 'answers'}</span>
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={statusBadge(q.status)}>{q.status}</span>
              </div>
              {q.tags?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {q.tags.map((tag) => (
                    <span key={tag} className="badge badge-closed">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function QAPage() {
  return (
    <ErrorBoundary>
      <QAPageContent />
    </ErrorBoundary>
  )
}
