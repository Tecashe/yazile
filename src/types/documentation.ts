export interface DocumentationArticle {
  title: string
  description: string
  readTime: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  lastUpdated: string
  content: string
  tableOfContents: Array<{
    title: string
    anchor: string
  }>
}

export interface DocumentationCategory {
  title: string
  articles: Record<string, DocumentationArticle>
}

export interface DocumentationData {
  [key: string]: DocumentationCategory
}
