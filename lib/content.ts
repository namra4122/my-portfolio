export type Link = { label: string; href: string }
export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  links?: Link[]
}
export type Experience = {
  id: string
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
    phone?: string
    location?: string
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
    "Integrated M.Tech in Software Engineering (5-year programme) — Vellore Institute of Technology, Chennai (Sept 2020 – Apr 2025). Coursework: Operating Systems, Computer Networks, Data Structures & Algorithms, Database Design, Software Architecture, Cloud Computing",
  summary:
    "Software engineer focused on backend systems and automation, with experience in security data pipelines and microservices. Skilled in containerization, observability, and CI/CD. At Optiv, working on large-scale security data ingestion, integrity monitoring, and executive-level analysis. Proficient in Python and Go, with strong system design and reliability fundamentals.",
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
      description:
        "Built an offline retrieval-augmented-generation pipeline optimized for latency-sensitive environments. Selected HNSW approximate nearest-neighbour indexing over brute-force search, reducing retrieval time to under 50 ms at scale while keeping memory footprint low. Containerised components with Redis caching for O(1) repeated-query lookups; designed for secure, offline operation with no external API dependencies.",
      technologies: ["Python", "Hugging Face Transformers", "Redis", "Docker", "FAISS", "HNSW", "CLI"],
      links: [{ label: "GitHub", href: "https://github.com/namra4122/cli_docDost" }],
    },
    {
      id: "version-set-manager",
      title: "Version Set Manager",
      description:
        "Developed a scalable academic submission platform with role-based access control, background job processing for large-file uploads, and JWT-based authentication. Selected MongoDB's document model over relational schemas to support flexible versioned submission records, and architected a container-friendly, horizontally scalable system for high-throughput use cases.",
      technologies: ["Node.js", "Express.js", "MongoDB", "Cloudinary", "JWT", "Docker"],
      links: [{ label: "GitHub", href: "https://github.com/namra4122/Version-Set-Manager" }],
    },
  ],
  experience: [
    {
      id: "optiv-swe",
      company: "Optiv, Bangalore",
      role: "Software Engineer",
      period: "Nov 2025 - Present",
      summary:
        "Contribute to a centralized, high-throughput Threat Management Platform for managing client findings and generating reports across multiple security assessments. Designed and developed an internal SDK to standardize platform integrations, reducing new use-case development time by 75% and enabling automation across 15+ integrations. Built ingestion service components with reliability-focused design, including event ordering, idempotent processing, and dead-letter handling to minimize data loss in high-volume systems.",
    },
    {
      id: "intervue-swe",
      company: "Intervue.io, Bangalore",
      role: "SDE & AI Intern",
      period: "Mar 2025 - Oct 2025",
      summary:
        "Reduced RAG pipeline latency by 50% by optimizing embedding models and tuning search patterns, improving real-time candidate analysis throughput. Built containerized microservices for a Voice AI agent (STT → LLM → TTS), designing a graph-based conversation state machine for context-aware interactions and deterministic flow control. Collaborated with system architects to refactor backend modules and data models, reducing critical production incidents by 40% through improved consistency and fault isolation.",
    },
    {
      id: "greenie-intern",
      company: "Greenie Web, Singapore",
      role: "Software Engineering Intern",
      period: "May 2023 - Jul 2023",
      summary:
        "Improved backend performance by ~25% via regex-based refactors and Postgres/MySQL query optimizations; stabilized APIs with robust error handling; automated QA by integrating Python scripts with Excel to accelerate bug triage.",
    },
  ],
  learning: [],
  contributions: [
    "Team.Shiksha (open-source) — Multi-tenant Merchandise E-commerce Platform: Building the Go backend for a community-run e-commerce platform supporting multiple tenants. Designing service boundaries, tenant isolation logic, and API contracts for concurrent store operations.",
    "Team.Shiksha (open-source) — Community Website - Contributor Onboarding Module: Developed a Python-based backend module for the community's main website to streamline contributor onboarding; built the data models, API endpoints, and onboarding workflow logic to reduce friction for new developers joining the community.",
  ],
  links: [
    { label: "Mail", href: "mailto:hey@maniarnamra.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/namra-maniar/" },
    { label: "GitHub", href: "https://github.com/namra4122" },
    { label: "Twitter", href: "https://x.com/ManiarNamra" },
  ],
  blog: [],
  contact: {
    phone: "+91-6353779926",
    location: "Bangalore, India",
    email: "mailto:hey@maniarnamra.com",
    website: "https://maniarnamra.com",
    github: "https://github.com/namra4122",
    linkedin: "https://www.linkedin.com/in/namra-maniar",
    twitter: "https://x.com/ManiarNamra",
  },
}
