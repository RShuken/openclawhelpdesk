'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect, useRef } from 'react'
import { searchAll, type DocSummary, type QuestionSummary } from '@/lib/clawhub'
import Spinner from '@/components/Spinner'

const cards = [
  {
    title: 'Documentation',
    description: 'Guides, tutorials, and reference material to help you get the most out of your setup.',
    href: '/docs',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Q&A',
    description: 'Ask questions and find answers from the OpenClaw community.',
    href: '/q',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Support',
    description: 'Submit a ticket and our team will get back to you as soon as possible.',
    href: '/support',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796l-3.448 4.138m5.716-.37l-4.138 3.448M7.288 19.67a9.014 9.014 0 01-2.958-2.958m0 0l4.138-3.448m-4.138 3.448a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0a3.736 3.736 0 01.88-1.388 3.737 3.737 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 15.34l3.448-4.138m0 0a3.765 3.765 0 002.528 0m-2.528 0l4.138 3.448m-1.87-5.716l3.448 4.138m-3.448-4.138a3.765 3.765 0 000-2.528" />
      </svg>
    ),
  },
]

const quickLinks = [
  { label: 'Getting started', href: '/docs/getting-started' },
  { label: 'Telegram setup', href: '/docs/telegram-setup' },
  { label: 'Troubleshooting', href: '/docs/troubleshooting' },
  { label: 'Ask a question', href: '/q/ask' },
  { label: 'Submit a ticket', href: '/support' },
]

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'badge-open',
    answered: 'badge-answered',
    closed: 'badge-closed',
  }
  return `badge ${map[status] || 'badge-closed'}`
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [docs, setDocs] = useState<DocSummary[]>([])
  const [questions, setQuestions] = useState<QuestionSummary[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setHasSearched(false)
      setDocs([])
      setQuestions([])
      return
    }
    setSearching(true)
    try {
      const results = await searchAll(q.trim())
      setDocs(results.docs)
      setQuestions(results.questions)
      setHasSearched(true)
    } catch {
      setDocs([])
      setQuestions([])
      setHasSearched(true)
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setHasSearched(false)
      setDocs([])
      setQuestions([])
      return
    }
    debounceRef.current = setTimeout(() => {
      runSearch(query)
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, runSearch])

  const totalResults = docs.length + questions.length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero with search */}
      <section className="py-12 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
          How can we help?
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Search our docs and community Q&A, or browse below.
        </p>

        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you need help with?"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-4 py-4 text-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
              aria-label="Search docs and Q&A"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-zinc-700 border-t-purple-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search results */}
      {hasSearched && !searching && (
        <section className="pb-12">
          {totalResults === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-400 mb-2">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-zinc-500">
                Try a different search, or{' '}
                <Link href="/q/ask" className="text-purple-400 hover:text-fuchsia-400">
                  ask the community
                </Link>.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {docs.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    Documentation ({docs.length})
                  </h2>
                  <div className="grid gap-3">
                    {docs.map((doc) => (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 group hover:border-purple-500/50 transition-colors block"
                      >
                        <h3 className="font-semibold text-zinc-50 group-hover:text-purple-400 transition-colors">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-zinc-400 mt-1">{doc.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {questions.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    Q&A ({questions.length})
                  </h2>
                  <div className="grid gap-3">
                    {questions.map((q) => (
                      <Link
                        key={q.id}
                        href={`/q/view?id=${q.id}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 group hover:border-purple-500/50 transition-colors block"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-zinc-50 group-hover:text-purple-400 transition-colors">
                            {q.title}
                          </h3>
                          <span className={statusBadge(q.status)}>{q.status}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                          <span>{q.answerCount} {q.answerCount === 1 ? 'answer' : 'answers'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Cards */}
      {!hasSearched && (
        <>
          <section className="grid sm:grid-cols-3 gap-6 pb-12">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group hover:border-purple-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-purple-400 mb-4 group-hover:text-fuchsia-400 transition-colors">
                  {card.icon}
                </div>
                <h2 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-purple-400 transition-colors">
                  {card.title}
                </h2>
                <p className="text-sm text-zinc-400">{card.description}</p>
              </Link>
            ))}
          </section>

          {/* Quick links */}
          <section className="pb-16 sm:pb-24">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
              Quick links
            </h2>
            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
