export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  period: string
  location: string
  description: string[]
}

export interface Skill {
  category: string
  items: string[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  coverImage?: string | null
  status: string
  scheduledAt?: Date | string | null
  publishedAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}
