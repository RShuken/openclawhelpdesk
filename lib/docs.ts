import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs')

export interface DocFrontmatter {
  title: string
  description: string
  tags: string[]
}

export interface DocEntry {
  slug: string
  frontmatter: DocFrontmatter
  content: string
}

export function getAllDocs(): DocEntry[] {
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.mdx'))

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(DOCS_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      frontmatter: {
        title: data.title || slug,
        description: data.description || '',
        tags: data.tags || [],
      },
      content,
    }
  })
}

export function getDocBySlug(slug: string): DocEntry | null {
  const filePath = path.join(DOCS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    frontmatter: {
      title: data.title || slug,
      description: data.description || '',
      tags: data.tags || [],
    },
    content,
  }
}
