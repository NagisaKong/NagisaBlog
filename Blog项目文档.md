# Personal Tech Blog — Build Instructions

## Project Overview
Build a personal tech blog and portfolio site using Next.js 15 (App Router), MDX, and Tailwind CSS v4. The owner is a CS student who writes about cybersecurity, networking, and project showcases. Deploy target is Vercel with a custom domain.

## Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **Content**: MDX via `next-mdx-remote` + `gray-matter` for frontmatter
- **Styling**: Tailwind CSS v4 + shadcn/ui for components
- **Code highlighting**: `rehype-pretty-code` with a dark theme (e.g. vesper or github-dark)
- **Search**: Pagefind (static, no server needed)
- **Comments**: Giscus (GitHub Discussions-based, add as a client component)
- **Analytics**: Umami (self-hosted or cloud, inject script in layout)

## Project Structure to Create
```
my-blog/
├── app/
│   ├── layout.tsx           # Root layout with nav + footer
│   ├── page.tsx             # Homepage: hero + recent posts
│   ├── blog/
│   │   ├── page.tsx         # Post list with tag filtering
│   │   └── [slug]/page.tsx  # Individual post page with TOC
│   ├── projects/page.tsx    # Project showcase grid
│   └── about/page.tsx       # About me page
├── components/
│   ├── Nav.tsx              # Top navigation bar
│   ├── PostCard.tsx         # Blog post card component
│   ├── MDXComponents.tsx    # Custom MDX renderer mappings
│   ├── TableOfContents.tsx  # Floating TOC from heading anchors
│   ├── TagFilter.tsx        # Client component for tag filtering
│   └── GiscusComments.tsx   # Client component, lazy-loaded
├── lib/
│   ├── posts.ts             # getAllPosts(), getPostBySlug() helpers
│   └── projects.ts          # Static project data array
├── posts/                   # MDX article files live here
│   └── example-post.mdx     # Seed with one real example post
├── public/
└── CLAUDE.md                # This file
```

## Content Schema
Each MDX file in /posts must include this frontmatter:
```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
description: "One-sentence summary for SEO and card preview"
tags: ["tag1", "tag2"]
published: true
---
```

Projects data in lib/projects.ts should follow:
```ts
type Project = {
  title: string
  description: string
  tags: string[]
  github?: string
  demo?: string
  featured: boolean
}
```

## Key Implementation Details

### posts.ts helpers
- `getAllPosts()`: reads all .mdx files from /posts, parses frontmatter, sorts by date descending, filters published: true
- `getPostBySlug(slug)`: returns frontmatter + serialized MDX content for a single post
- Generate static params in [slug]/page.tsx using generateStaticParams()

### Reading time
Calculate estimated reading time (words / 200) in getAllPosts() and include in returned metadata.

### Table of Contents
Parse heading elements (h2, h3) from MDX content and render a sticky TOC on the right side on desktop. Highlight the active heading on scroll using IntersectionObserver.

### Tag filtering
TagFilter.tsx should be a client component using useSearchParams() and router.push() to filter posts by tag in the URL (?tag=cybersecurity). PostCard.tsx renders tag badges that link to filtered views.

### Open Graph metadata
Add generateMetadata() to both blog/page.tsx and blog/[slug]/page.tsx with title, description, openGraph image (use a default OG image for now).

## Styling Guidelines
- Clean, minimal aesthetic — dark mode first
- Use CSS variables for theme colors so dark/light toggle works
- Code blocks: dark background, line numbers, copy button
- Font: Geist Sans for body, Geist Mono for code (both available via next/font)
- Mobile-first responsive layout; hide TOC below lg breakpoint

## Sample Content
Seed the blog with one example post at posts/arp-spoofing-analysis.mdx covering ARP spoofing/poisoning. Include real technical content: how ARP works, the attack flow, mitigation strategies, and a code block showing an example with scapy.

## Do NOT
- Do not use the Pages Router — App Router only
- Do not add a database; all content is file-based MDX
- Do not add authentication
- Do not use CSS modules; use Tailwind utility classes throughout

## After Scaffolding
1. Run `npm run dev` and confirm the homepage loads
2. Confirm the example MDX post renders with syntax highlighting
3. Output a summary of all files created and any manual steps needed (e.g. Giscus repo config, Vercel env vars)