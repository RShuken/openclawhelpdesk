'use client'

import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: do nothing
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded px-2 py-1 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="relative group">
      <CopyButton text={code} />
      <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 pr-20 overflow-x-auto">
        <code className="text-sm text-zinc-300 font-mono">{code}</code>
      </pre>
    </div>
  )
}

export default function DevelopersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
        Developer Tools
      </h1>
      <p className="text-lg text-zinc-400 mb-12">
        Integrate OpenClaw Helpdesk into your apps, scripts, and AI workflows.
      </p>

      {/* openclaw-helpdesk npm package */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-zinc-50">openclaw-helpdesk</h2>
          <span className="badge bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-500/20">
            npm
          </span>
        </div>
        <p className="text-zinc-400 mb-6">
          JavaScript/TypeScript client for the ClawHub API. Search docs, ask questions, and submit support tickets programmatically.
        </p>

        <h3 className="text-lg font-semibold text-zinc-50 mb-3">Install</h3>
        <CodeBlock code="npm install openclaw-helpdesk" />

        <h3 className="text-lg font-semibold text-zinc-50 mt-8 mb-3">Usage</h3>

        <CodeBlock
          language="typescript"
          code={`import { ClawHub } from 'openclaw-helpdesk'

const client = new ClawHub()

// Search docs
const docs = await client.searchDocs('telegram setup')

// Ask a question
const question = await client.askQuestion({
  title: 'How do I connect Telegram?',
  body: 'I followed the setup guide but...',
  tags: ['telegram', 'setup'],
  email: 'me@example.com',
})

// Submit a support ticket
const ticket = await client.createTicket({
  subject: 'Bot not responding',
  description: 'My AI assistant stopped replying...',
  priority: 'high',
  email: 'me@example.com',
})

// Look up tickets by email
const tickets = await client.getTicketsByEmail('me@example.com')`}
        />
      </section>

      {/* openclaw-helpdesk-mcp */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-zinc-50">openclaw-helpdesk-mcp</h2>
          <span className="badge bg-fuchsia-500/10 text-fuchsia-400 ring-1 ring-inset ring-fuchsia-500/20">
            MCP
          </span>
        </div>
        <p className="text-zinc-400 mb-6">
          Model Context Protocol server that gives AI assistants access to OpenClaw Helpdesk. Run it with npx -- no install needed.
        </p>

        <h3 className="text-lg font-semibold text-zinc-50 mb-3">Run</h3>
        <CodeBlock code="npx openclaw-helpdesk-mcp" />

        <h3 className="text-lg font-semibold text-zinc-50 mt-8 mb-3">Configuration</h3>
        <p className="text-zinc-400 mb-4">
          Add this to your <code className="bg-zinc-800 text-purple-300 px-1.5 py-0.5 rounded text-sm">openclaw.json</code> or MCP config:
        </p>

        <CodeBlock
          language="json"
          code={`{
  "mcpServers": {
    "openclaw-helpdesk": {
      "command": "npx",
      "args": ["openclaw-helpdesk-mcp"],
      "env": {
        "CLAWHUB_API_URL": "https://clawhub-api.ryanshuken.workers.dev"
      }
    }
  }
}`}
        />

        <h3 className="text-lg font-semibold text-zinc-50 mt-8 mb-3">Available tools</h3>
        <div className="grid gap-3">
          {[
            { name: 'search_docs', desc: 'Search the knowledge base by keyword' },
            { name: 'get_doc', desc: 'Get a specific doc article by slug' },
            { name: 'search_questions', desc: 'Search community Q&A' },
            { name: 'ask_question', desc: 'Post a new question' },
            { name: 'create_ticket', desc: 'Submit a support ticket' },
            { name: 'get_ticket', desc: 'Check ticket status by ID' },
          ].map((tool) => (
            <div
              key={tool.name}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <code className="text-purple-400 text-sm font-mono whitespace-nowrap">{tool.name}</code>
              <span className="text-sm text-zinc-400">{tool.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* API reference teaser */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-2">API Base URL</h2>
        <CodeBlock code="https://clawhub-api.ryanshuken.workers.dev" />
        <p className="text-sm text-zinc-500 mt-4">
          All endpoints accept JSON. No API key required for public read operations.
        </p>
      </section>
    </div>
  )
}
