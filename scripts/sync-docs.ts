import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs')
const API_URL = process.env.CLAWHUB_API_URL || 'https://clawhub-api.ryanshuken.workers.dev'
const API_KEY = process.env.CLAWHUB_ADMIN_KEY

async function main() {
  if (!API_KEY) {
    console.error('Error: CLAWHUB_ADMIN_KEY environment variable is required')
    process.exit(1)
  }

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.mdx'))
  console.log(`Found ${files.length} docs to sync`)

  const docs = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(DOCS_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      tags: data.tags || [],
      content: content.trim(),
    }
  })

  console.log(`Syncing ${docs.length} docs to ${API_URL}/admin/docs/sync`)

  const res = await fetch(`${API_URL}/admin/docs/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ docs }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`Sync failed (${res.status}): ${text}`)
    process.exit(1)
  }

  const result = await res.json()
  console.log('Sync complete:', result)
}

main().catch((err) => {
  console.error('Sync error:', err)
  process.exit(1)
})
