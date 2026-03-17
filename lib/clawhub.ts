const API_BASE =
  process.env.NEXT_PUBLIC_CLAWHUB_API_URL ||
  'https://clawhub-api.ryanshuken.workers.dev'

interface FetchOptions {
  method?: string
  body?: Record<string, unknown>
  turnstileToken?: string
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (opts.turnstileToken) {
    headers['X-Turnstile-Token'] = opts.turnstileToken
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`API error ${res.status}: ${text}`)
  }

  return res.json()
}

// --- Docs ---

export interface DocSummary {
  slug: string
  title: string
  description: string
  tags: string[]
  updatedAt: string
}

export interface DocDetail extends DocSummary {
  content: string
}

export function searchDocs(query?: string) {
  const params = query ? `?q=${encodeURIComponent(query)}` : ''
  return apiFetch<{ docs: DocSummary[] }>(`/docs${params}`)
}

export function getDoc(slug: string) {
  return apiFetch<{ doc: DocDetail }>(`/docs/${slug}`)
}

// --- Questions (MoltOverflow) ---

export interface QuestionSummary {
  id: string
  title: string
  status: 'open' | 'answered' | 'closed'
  answerCount: number
  tags: string[]
  createdAt: string
  authorEmail: string
}

export interface Answer {
  id: string
  body: string
  votes: number
  accepted: boolean
  authorEmail: string
  createdAt: string
}

export interface QuestionDetail extends QuestionSummary {
  body: string
  answers: Answer[]
}

export async function getQuestions(params?: { q?: string; tag?: string; status?: string }): Promise<QuestionSummary[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.set('q', params.q)
    if (params?.tag) searchParams.set('tag', params.tag)
    if (params?.status) searchParams.set('status', params.status)
    const qs = searchParams.toString()
    const data = await apiFetch<Record<string, unknown>>(`/questions${qs ? `?${qs}` : ''}`)
    // Handle multiple possible response shapes from the API
    const questions = data.questions || data.results || data
    return Array.isArray(questions) ? questions : []
  } catch {
    return []
  }
}

export async function getQuestion(id: string): Promise<QuestionDetail | null> {
  try {
    const data = await apiFetch<Record<string, unknown>>(`/questions/${id}`)
    const question = (data.question || data.result || data) as QuestionDetail
    if (!question || !question.id) return null
    // Ensure answers is always an array
    if (!Array.isArray(question.answers)) question.answers = []
    return question
  } catch {
    return null
  }
}

export async function askQuestion(data: {
  title: string
  body: string
  tags: string[]
  email: string
  turnstileToken?: string
}) {
  return apiFetch<{ question: { id: string } }>('/questions', {
    method: 'POST',
    body: { title: data.title, body: data.body, tags: data.tags, email: data.email },
    turnstileToken: data.turnstileToken,
  })
}

export async function answerQuestion(questionId: string, data: {
  body: string
  email: string
  turnstileToken?: string
}) {
  return apiFetch<{ answer: { id: string } }>(`/questions/${questionId}/answers`, {
    method: 'POST',
    body: { body: data.body, email: data.email },
    turnstileToken: data.turnstileToken,
  })
}

// --- Support Tickets ---

export interface TicketSummary {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high'
  createdAt: string
}

export interface TicketMessage {
  id: string
  body: string
  fromSupport: boolean
  createdAt: string
}

export interface TicketDetail extends TicketSummary {
  description: string
  messages: TicketMessage[]
}

export function createTicket(data: {
  subject: string
  description: string
  priority: string
  email: string
  turnstileToken?: string
}) {
  return apiFetch<{ ticket: { id: string } }>('/tickets', {
    method: 'POST',
    body: {
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      email: data.email,
    },
    turnstileToken: data.turnstileToken,
  })
}

export async function getTicket(id: string): Promise<TicketDetail | null> {
  try {
    const data = await apiFetch<Record<string, unknown>>(`/tickets/${id}`)
    const ticket = (data.ticket || data.result || data) as TicketDetail
    if (!ticket || !ticket.id) return null
    // Ensure messages is always an array
    if (!Array.isArray(ticket.messages)) ticket.messages = []
    return ticket
  } catch {
    return null
  }
}

export function replyToTicket(id: string, data: {
  body: string
  email: string
  turnstileToken?: string
}) {
  return apiFetch<{ message: { id: string } }>(`/tickets/${id}/messages`, {
    method: 'POST',
    body: { body: data.body, email: data.email },
    turnstileToken: data.turnstileToken,
  })
}
