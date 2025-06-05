# Blog Component

## File Structure

This project reads blog posts from markdown files stored in the `/public/Blog notes/` directory. To add new blog posts, simply add Markdown files to this directory.

## Blog Post Format

Each blog post should be a Markdown file with frontmatter at the top. Here's an example:

```markdown
---
title: My Blog Post Title
date: 2025-06-01
updated: 2025-06-01 | 3:45 PM
description: A brief description of the blog post
tags: [code, philosophy, dreams]
featured: true
---

The content of your blog post goes here...
```

### Frontmatter Fields

- `title`: The title of the blog post
- `date`: The publication date (YYYY-MM-DD)
- `updated`: When the post was last updated (can include time)
- `description`: A brief summary of the post
- `tags`: An array of tags that categorize the post (affects file extension display)
- `featured`: Set to `true` to mark as featured (affects permissions display)

## File Extensions

The blog component automatically assigns special file extensions based on tags:
- `.dream` for posts tagged with 'dreams' or 'journal'
- `.session` for posts tagged with 'code' or 'programming'
- `.txt` for posts tagged with 'philosophy'
- `.exe` for posts tagged with 'projects' or 'creation'
- `.log` for posts tagged with 'terminal' or 'design'
- `.md` for all other posts

## API Route

An optional API route at `/api/blog-files` provides a more reliable way to list blog files. If this API route is not available, the component will fall back to other methods of discovering blog files.
