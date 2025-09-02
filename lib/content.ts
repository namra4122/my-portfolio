export type Link = { label: string; href: string }
export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  links?: Link[]
}
export type Experience = {
  company: string
  role: string
  period: string
  summary: string
}
export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  url?: string
}

export type PortfolioContent = {
  fullName: string
  education: string
  summary: string
  skills: {
    coreStack: string[]
    domains: string[]
    interests: string[]
  }
  projects: Project[]
  experience: Experience[]
  learning: string[]
  contributions: string[]
  links: Link[]
  blog: BlogPost[]
  contact: {
    email?: string
    website?: string
    github?: string
    linkedin?: string
    twitter?: string
  }
}

// Updated shared content derived from the latest CV
export const content: PortfolioContent = {
  fullName: "Namra Maniar",
  education:
    "Vellore Institute of Technology (VIT), Chennai — M.Tech in Software Engineering (Sept 2020 - Apr 2025), CGPA 8.83/10",
  summary:
    "Backend Software Engineer skilled in Python, Go (Echo), and JavaScript, experienced in building scalable APIs and microservices. Strong background in AWS (EC2, S3, RDS), Docker, and CI/CD; proficient with Postman and familiar with Jenkins. Open‑source contributor passionate about reliable, high‑performance systems and eager to grow in infrastructure‑driven teams.",
  skills: {
    coreStack: ["Python", "Go", "JavaScript", "TypeScript"],
    domains: [
      "Backend & Infra Engineering",
      "APIs & Microservices",
      "Cloud & DevOps (AWS, Docker, CI/CD)",
      "GenAI, LLMs, RAG",
      "Core AI/ML Models and Algorithms",
    ],
    // keeping concurrency as a capability set for search and terminal views
    interests: [
      "Reliable systems",
      "High-performance engineering",
      "Observability",
      "RAG systems",
      "Distributed systems",
    ],
  },
  projects: [
    {
      id: "local-rag-chatbot",
      title: "Local RAG Chatbot",
      description: "Offline Retrieval-Augmented Generation system with a CLI interface for low-latency environments. Tuned vector retrieval and generation pipelines, leveraging caching for performance gains.",
      technologies: ["Python", "Transformers", "Redis", "CLI"],
      links: [{ label: "GitHub", href: "https://github.com/namra4122/cli_docDost" }],
    },
    {
      id: "version-set-manager",
      title: "Version Set Manager",
      description: "Role-based academic submission platform with secure JWT authentication for students, faculty, and admins. Integrated Cloudinary + Multer to handle large media/code uploads with optimized storage.",
      technologies: ["Node.js", "Express.js", "MongoDB", "Cloudinary", "JWT"],
      links: [{ label: "GitHub", href: "https://github.com/namra4122/Version-Set-Manager" }],
    },
  ],
  experience: [
    {
      company: "Intervue.io, Bangalore",
      role: "Software Engineer",
      period: "Mar 2025 - Present",
      summary: "Cut RAG latency by ~50% via embedding model changes and semantic search tuning; building graph-based conversation flows for a Voice AI agent with event-driven TTS/LLM/STT pipeline; reduced incidents by ~40% through proactive debugging and backend data model improvements; delivered full-stack features across Agile sprints; improved usability with React.js features; added centralized logging & metrics (NewRelic) to improve MTTR.",
    },
    {
      company: "Greenie Web, Singapore",
      role: "Software Engineering Intern",
      period: "May 2023 - Jul 2023",
      summary: "Improved backend performance by ~25% via regex-based refactors and Postgres/MySQL query optimizations; stabilized APIs with robust error handling; automated QA by integrating Python scripts with Excel to accelerate bug triage.",
    },
  ],
  learning: [],
  contributions: [
    "Team.Shiksha (open-source) — Contributor: onboarding workflows, backend tooling, and DevOps automation for streamlined CI/CD.",
  ],
  links: [
    { label: "Terminal UI", href: "/terminal" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/namra-maniar/" },
    { label: "GitHub", href: "https://github.com/namra4122" },
    { label: "Twitter", href: "https://x.com/ManiarNamra" },
  ],
  blog: [],
  contact: {
    email: "namra4122@gmail.com",
    github: "https://github.com/namra4122",
    linkedin: "https://www.linkedin.com/in/namra-maniar",
    twitter: "https://x.com/ManiarNamra"
  },
}
