'use client'

import Link from 'next/link'
import { useState, useEffect, FormEvent } from 'react'
import { getQuestion, answerQuestion, type QuestionDetail } from '@/lib/clawhub'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'badge-open',
    answered: 'badge-answered',
    closed: 'badge-closed',
  }
  return `badge ${map[status] || 'badge-closed'}`
}

function QuestionDetailContent({ id }: { id: string }) {
  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [answerBody, setAnswerBody] = useState('')
  const [answerEmail, setAnswerEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const result = await getQuestion(id)
        if (!result) {
          setError('Question not found.')
        } else {
          setQuestion(result)
        }
      } catch {
        setError('Could not load this question.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSubmitAnswer(e: FormEvent) {
    e.preventDefault()
    if (!answerBody.trim() || !answerEmail.trim()) return
    setSubmitting(true)
    setSubmitMsg('')
    try {
      await answerQuestion(id, { body: answerBody, email: answerEmail })
      setSubmitMsg('Answer submitted successfully!')
      setAnswerBody('')
      const refreshed = await getQuestion(id)
      if (refreshed) setQuestion(refreshed)
    } catch {
      setSubmitMsg('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center text-zinc-500">
        Loading question...
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/q" className="text-sm text-zinc-500 hover:text-purple-400 mb-6 inline-block">
          &larr; Back to Q&A
        </Link>
        <div className="card text-center py-12">
          <p className="text-zinc-400">{error || 'Question not found.'}</p>
        </div>
      </div>
    )
  }

  const answers = Array.isArray(question.answers) ? question.answers : []
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.accepted && !b.accepted) return -1
    if (!a.accepted && b.accepted) return 1
    return b.votes - a.votes
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/q" className="text-sm text-zinc-500 hover:text-purple-400 mb-6 inline-block">
        &larr; Back to Q&A
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-zinc-50">{question.title}</h1>
          <span className={statusBadge(question.status)}>{question.status}</span>
        </div>
        <div className="prose-dark mb-4 whitespace-pre-wrap">{question.body}</div>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
          {question.tags?.length > 0 && (
            <div className="flex gap-2">
              {question.tags.map((tag) => (
                <span key={tag} className="badge badge-closed">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-zinc-50 mb-4">
        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
      </h2>

      {sortedAnswers.length === 0 && (
        <div className="card text-center py-8 mb-6">
          <p className="text-zinc-400">No answers yet. Be the first to help!</p>
        </div>
      )}

      <div className="grid gap-4 mb-8">
        {sortedAnswers.map((answer) => (
          <div
            key={answer.id}
            className={`card ${answer.accepted ? 'border-green-500/50' : ''}`}
          >
            {answer.accepted && (
              <div className="badge badge-open mb-3">Accepted Answer</div>
            )}
            <div className="prose-dark whitespace-pre-wrap">{answer.body}</div>
            <div className="flex items-center gap-4 mt-4 text-sm text-zinc-500">
              <span>{answer.votes} votes</span>
              <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-zinc-50 mb-4">Your Answer</h3>
        <form onSubmit={handleSubmitAnswer} className="grid gap-4">
          <div>
            <label htmlFor="answer-body" className="block text-sm text-zinc-400 mb-1">
              Answer
            </label>
            <textarea
              id="answer-body"
              className="input min-h-[120px]"
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              placeholder="Write your answer..."
              required
            />
          </div>
          <div>
            <label htmlFor="answer-email" className="block text-sm text-zinc-400 mb-1">
              Email
            </label>
            <input
              id="answer-email"
              type="email"
              className="input"
              value={answerEmail}
              onChange={(e) => setAnswerEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          {submitMsg && (
            <p className={`text-sm ${submitMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {submitMsg}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Post Answer'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function QuestionDetailView({ id }: { id: string }) {
  return (
    <ErrorBoundary>
      <QuestionDetailContent id={id} />
    </ErrorBoundary>
  )
}
