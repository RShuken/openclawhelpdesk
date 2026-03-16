'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { getQuestions, type QuestionSummary } from '@/lib/clawhub'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'badge-open',
    answered: 'badge-answered',
    closed: 'badge-closed',
  }
  return `badge ${map[status] || 'badge-closed'}`
}

export default function QAPage() {
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
      const data = await getQuestions(params)
      setQuestions(data.questions)
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
      {loading && (
        <div className="text-center py-12 text-zinc-500">Loading questions...</div>
      )}

      {error && (
        <div className="card text-center py-12">
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
        <div className="card text-center py-12">
          <p className="text-zinc-400">No questions yet. Be the first to ask!</p>
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div className="grid gap-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              href={`/q/view?id=${q.id}`}
              className="card group hover:border-purple-500/50 transition-colors"
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
              {q.tags.length > 0 && (
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
