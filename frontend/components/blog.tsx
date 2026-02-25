"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlitchText } from "@/components/glitch-text"
import AsciiEyes from "@/components/ascii-eyes"

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

export function Blog() {
  const router = useRouter()
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [glitchActive, setGlitchActive] = useState(false)
  const [terminalLoaded, setTerminalLoaded] = useState(false)
  const [showEyes, setShowEyes] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInitDoneRef = useRef(false)

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

  // Load blog posts from the API/files
  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      
      // First, fetch the list of files in the Blog notes directory
      const directoryResponse = await fetch('/api/blog-files')
        .catch(() => ({ ok: false })) // Fallback if API doesn't exist

      // Get the filenames from the API if available, otherwise use fallbacks
      let filenames: string[] = []
      if (directoryResponse.ok) {
        // If we have an API endpoint that returns the files
        if ("json" in directoryResponse) {
          filenames = await directoryResponse.json()
        }
      } else {
        // Try to load the blog directory directly
        try {
          const blogDirResponse = await fetch('/Blog notes/')
          if (blogDirResponse.ok) {
            const html = await blogDirResponse.text()
            // Extract filenames from directory listing HTML (may work on some servers)
            const fileMatches = html.match(/href="([^"]+\.md)"/g) || []
            filenames = fileMatches.map(match => match.replace(/href="|"/g, ''))
          }
        } catch (error) {
          console.warn('Failed to load blog directory, using fallback discovery')
        }

        // No fallback test files - we'll only load what we can discover through the API or directory listing
        if (filenames.length === 0) {
          console.warn('No files found in the Blog notes directory through API or directory listing')
        }
      }

      const loadedPosts: BlogPost[] = []
      
      for (const filename of filenames) {
        try {
          const response = await fetch(`/Blog notes/${filename}`)
          if (response.ok) {
            const content = await response.text()
            const { frontmatter } = parseFrontmatter(content)
            
            // Generate display filename with extension
            const baseTitle = frontmatter.title || filename.replace('.md', '')
            const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
            const extension = generateFileExtension(tags, baseTitle)
            const displayFilename = baseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') + extension
            
            const post: BlogPost = {
              title: frontmatter.title || filename.replace('.md', ''),
              date: frontmatter.date || new Date().toISOString().split('T')[0],
              updated: frontmatter.updated || `${frontmatter.date} | 12:00 PM`,
              description: frontmatter.description || 'No description available',
              tags: tags,
              featured: frontmatter.featured || false,
              slug: filename.replace('.md', ''),
              fileSize: `${Math.round(content.length / 1024 * 10) / 10}K`,
              permissions: frontmatter.featured ? '-rw-r--r--' : '-rw-------',
              filename: displayFilename,
              content: content
            }
            
            loadedPosts.push(post)
          }
        } catch (error) {
          console.warn(`Failed to load ${filename}:`, error)
        }
      }
      
      // Sort by date (newest first)
      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setPosts(loadedPosts)

      // Show error message if no posts were loaded
      if (loadedPosts.length === 0) {
        console.warn('No blog posts found in the Blog notes directory')
        setTerminalHistory(prev => [
          ...prev,
          "Error: No readable blog posts found in the 'Blog notes' directory.",
          "Check that markdown files exist and are properly formatted."
        ])
      }
      
    } catch (error) {
      console.error('Failed to load blog posts:', error)
      // Fallback empty state
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Generate file listing with colors and selection highlighting
  const generateFileList = () => {
    if (posts.length === 0) {
      return ["total 0", "No dream fragments found...", ""]
    }
    
    const output = [`total ${posts.length}`]
    posts.forEach((post, index) => {
      const isExecutable = post.permissions.includes('x')
      const isSelected = index === selectedFileIndex
      const baseColor = isExecutable ? 'text-green-400' : 
                       post.filename.includes('.dream') ? 'text-purple-400' :
                       post.filename.includes('.session') ? 'text-blue-400' :
                       post.filename.includes('.log') ? 'text-yellow-400' : 'text-white'
      
      const selectionStyle = isSelected ? 'bg-green-700/30 text-white' : ''
      const arrow = isSelected ? '→ ' : '  '
      
      output.push(`<span class="${selectionStyle} cursor-pointer hover:bg-green-700/20" data-post-index="${index}">${arrow}${post.permissions} 1 user user ${post.fileSize.padStart(6)} ${post.date} <span class="${baseColor}">${post.filename}</span></span>`)
    })
    return output
  }

  // Handle click on file listing
  const handleFileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const span = target.closest('[data-post-index]') as HTMLElement
    if (span) {
      const index = parseInt(span.dataset.postIndex || '0', 10)
      if (!isNaN(index) && posts[index]) {
        const selectedPostData = posts[index]
        
        // Add terminal output for opening file
        setTerminalHistory(prev => [
          ...prev,
          "",
          `user@dreams:~$ cat ${selectedPostData.filename}`,
          `Opening ${selectedPostData.filename}...`,
          ""
        ])
        
        // Navigate to the blog post page
        router.push(`/blog/${selectedPostData.slug}`)
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (posts.length === 0) return

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedFileIndex(prev => Math.max(0, prev - 1))
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedFileIndex(prev => Math.min(posts.length - 1, prev + 1))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selectedPostData = posts[selectedFileIndex]
        
        // Add terminal output for opening file
        setTerminalHistory(prev => [
          ...prev,
          "",
          `user@dreams:~$ cat ${selectedPostData.filename}`,
          `Opening ${selectedPostData.filename}...`,
          ""
        ])
        
        // Navigate to the blog post page
        router.push(`/blog/${selectedPostData.slug}`)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedFileIndex, posts, router])

  // Load posts on mount
  useEffect(() => {
    loadBlogPosts()
  }, [])

  // Progressive terminal loading effect
  useEffect(() => {
    // Prevent re-initialization in Strict Mode or if already done
    if (terminalInitDoneRef.current) {
      return;
    }
    terminalInitDoneRef.current = true;

    const loadTerminalProgressively = async () => {
      // Reset history and start fresh
      setTerminalHistory([])
      
      // Initial welcome message
      setTerminalHistory(["Welcome to MP CLI v2.1.4"])
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Loading message
      setTerminalHistory(prev => [...prev, "Loading data fragments..."])
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Empty line and prompt
      setTerminalHistory(prev => [...prev, "", "user@dreams:~$ "])
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Type "ls" command
      for (let i = 1; i <= 2; i++) {
        setTerminalHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1] = "user@dreams:~$ " + "ls".substring(0, i)
          return newHistory
        })
        await new Promise(resolve => setTimeout(resolve, 150))
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Execute command
      setTerminalHistory(prev => {
        const newHistory = [...prev]
        newHistory[newHistory.length - 1] = "user@dreams:~$ ls"
        return newHistory
      })
      
      setTerminalLoaded(true)
    }

    // The old "if (terminalHistory.length === 0)" condition is removed
    loadTerminalProgressively()
  }, [])

  // Auto-load file listing when posts are loaded and terminal is ready
  useEffect(() => {
    if (!loading && terminalLoaded && posts.length > 0) {
      const timer = setTimeout(() => {
        const fileList = generateFileList()
        setTerminalHistory(prev => {
          // Check if file listing already added to prevent duplicates
          const hasFileList = prev.some(line => line.includes('total'))
          if (!hasFileList) {
            return [
              ...prev,
              ...fileList, 
              "", 
              "Use ↑↓ arrows to navigate, Enter to open file"
            ]
          }
          return prev
        })
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [loading, posts, terminalLoaded])

  // Update file listing when selection changes (only after initial load)
  useEffect(() => {
    if (!loading && posts.length > 0 && terminalLoaded && terminalHistory.length > 6) {
      const fileList = generateFileList()
      setTerminalHistory(prev => {
        // Find where the file listing starts (after "user@dreams:~$ ls")
        const lsCommandIndex = prev.findIndex(line => line.includes("user@dreams:~$ ls"))
        if (lsCommandIndex >= 0) {
          const beforeFileList = prev.slice(0, lsCommandIndex + 1)
          return [...beforeFileList, ...fileList, "", "Use ↑↓ arrows to navigate, Enter to open file"]
        }
        return prev
      })
    }
  }, [selectedFileIndex, loading, posts, terminalLoaded])

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

  // Add effect for delayed eyes appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEyes(true)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={cn(
      "h-full bg-black text-white font-mono relative overflow-hidden",
      glitchActive && "animate-pulse"
    )}>
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-green-900/10 pointer-events-none"></div>
      
      {showEyes && <AsciiEyes maxEyes={4} startupDelay={0} initialSpawnDelay={1000} />}
      
      <div className="max-w-5xl mx-auto p-6 relative z-10 h-full flex flex-col">
        {/* Terminal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-gray-400">MP CLI v2.1.4</span>
          </div>
          
          <div className="text-green-400 text-lg">
            <GlitchText 
              text=">> MEMORIES.."
              isActive={glitchActive}
              intensity="high"
            />
          </div>
        </div>

        {/* Terminal Output */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto bg-black/50 border border-green-700/30 p-4 rounded mb-4"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
          onClick={handleFileClick}
        >
          {terminalHistory.map((line, index) => (
            <div 
              key={index} 
              className="text-green-300 mb-1"
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="text-gray-500 text-xs">
          <div>Navigate: ↑↓ Arrow Keys | Open: Enter | Close File: ESC</div>
          <div>Press 1 to return to main menu</div>
        </div>
      </div>
    </div>
  )
} 