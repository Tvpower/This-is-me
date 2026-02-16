"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlitchText } from "@/components/glitch-text"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface BlogPost {
  title: string
  date: string
  updated: string
  description: string
  tags: string[]
  featured?: boolean
  slug: string
  fileSize: string
  permissions: string
  filename: string
  content: string
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)
  const router = useRouter()

  // Parse frontmatter from markdown content
  const parseFrontmatter = (content: string) => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/
    const match = content.match(frontmatterRegex)
    
    if (!match) return { frontmatter: {}, content: content }
    
    const frontmatterText = match[1]
    const markdownContent = match[2]
    
    const frontmatter: Record<string, any> = {}
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        let value: any = line.substring(colonIndex + 1).trim()
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        
        // Parse arrays
        if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(item => 
            item.trim().replace(/['"]/g, '')
          )
        }
        
        frontmatter[key] = value
      }
    })
    
    return { frontmatter, content: markdownContent }
  }

  // Generate file extension based on tags/content
  const generateFileExtension = (tags: string[], title: string) => {
    if (tags.includes('dreams') || tags.includes('journal')) return '.dream'
    if (tags.includes('code') || tags.includes('programming')) return '.session'
    if (tags.includes('philosophy')) return '.txt'
    if (tags.includes('projects') || tags.includes('creation')) return '.exe'
    if (tags.includes('terminal') || tags.includes('design')) return '.log'
    return '.md'
  }

  // Load the blog post
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        
        console.log('Loading blog post with slug:', resolvedParams.slug)
        
        // Get all markdown files
        const directoryResponse = await fetch('/api/blog-files')
        if (!directoryResponse.ok) {
          throw new Error('Failed to fetch blog files')
        }

        const filenames: string[] = await directoryResponse.json()
        console.log('Available files:', filenames)
        
        // Find the matching file by slug (try exact match first, then with .md extension)
        const matchingFile = filenames.find(filename => {
          const fileSlug = filename.replace('.md', '')
          // Try both with and without decoding the slug
          return fileSlug === resolvedParams.slug || 
                 fileSlug === decodeURIComponent(resolvedParams.slug) ||
                 filename === resolvedParams.slug
        })

        console.log('Matching file:', matchingFile)

        if (!matchingFile) {
          console.error('No matching file found for slug:', resolvedParams.slug)
          throw new Error('Blog post not found')
        }

        // Fetch the content
        const response = await fetch(`/Blog notes/${matchingFile}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog content')
        }

        const content = await response.text()
        const { frontmatter } = parseFrontmatter(content)
        
        // Generate display filename with extension
        const baseTitle = frontmatter.title || matchingFile.replace('.md', '')
        const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
        const extension = generateFileExtension(tags, baseTitle)
        const displayFilename = baseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') + extension
        
        const blogPost: BlogPost = {
          title: frontmatter.title || matchingFile.replace('.md', ''),
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          updated: frontmatter.updated || `${frontmatter.date} | 12:00 PM`,
          description: frontmatter.description || 'No description available',
          tags: tags,
          featured: frontmatter.featured || false,
          slug: matchingFile.replace('.md', ''),
          fileSize: `${Math.round(content.length / 1024 * 10) / 10}K`,
          permissions: frontmatter.featured ? '-rw-r--r--' : '-rw-------',
          filename: displayFilename,
          content: content
        }
        
        setPost(blogPost)
      } catch (error) {
        console.error('Failed to load blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [resolvedParams.slug])

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 200)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-green-400">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-red-400">Blog post not found</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-mono overflow-y-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent pointer-events-none"></div>
      <div className="max-w-4xl mx-auto p-6 relative z-10 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-green-400">
            <span className="text-gray-400">user@dreams:</span>
            <span className="text-white">~$ cat {post.filename}</span>
          </div>
          <button 
            onClick={() => router.push('/blog')}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            [ESC] Back to List
          </button>
        </div>
        
        <div className="bg-gray-900/50 border border-green-700/30 p-6 rounded">
          <div className="mb-4 text-green-300">
            <div>File: {post.filename}</div>
            <div>Size: {post.fileSize}</div>
            <div>Modified: {post.updated}</div>
            <div>Permissions: {post.permissions}</div>
          </div>
          
          <div className="border-t border-green-700/30 pt-4 mt-4">
            <h1 className="text-2xl text-green-400 mb-4">
              <GlitchText 
                text={post.title} 
                isActive={glitchActive}
                intensity="medium"
              />
            </h1>
            <div className="text-gray-300 leading-relaxed">
              {post.description}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-green-500 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-6 text-gray-300 prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={(url) => {
                  console.log('URL Transform:', url);
                  return url;
                }}
                components={{
                  img: ({ src, alt }) => {
                    console.log('Image src:', src, 'alt:', alt);
                    return (
                      <img 
                        src={src} 
                        alt={alt || ''} 
                        className="max-w-full h-auto rounded border border-green-700/30 my-4"
                        onError={(e) => {
                          console.error('Image failed to load:', src);
                          e.currentTarget.style.border = '2px solid red';
                        }}
                      />
                    );
                  },
                  p: ({ children }) => <p className="mb-4 text-gray-300">{children}</p>,
                  h1: ({ children }) => <h1 className="text-2xl text-green-400 mb-4 mt-6 font-bold">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl text-green-400 mb-3 mt-5 font-bold">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg text-green-400 mb-2 mt-4 font-semibold">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300">{children}</ol>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  code: ({ children }) => <code className="bg-gray-800 px-2 py-1 rounded text-green-400 text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-800 p-4 rounded border border-green-700/30 overflow-x-auto my-4">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-green-700 pl-4 italic my-4 text-gray-400">{children}</blockquote>,
                  a: ({ href, children }) => <a href={href} className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {(() => {
                  const markdownContent = post.content.split('---').slice(2).join('---').trim();
                  return markdownContent;
                })()}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

