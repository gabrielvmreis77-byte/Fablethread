export type ChapterStatus = 'Idea' | 'Draft' | 'Revision' | 'Done'
export type NodeKind = 'character' | 'place' | 'theme' | 'object' | 'event'

export interface Chapter { id: string; title: string; summary: string; content: string; status: ChapterStatus; target: number }
export interface StoryNode { id: string; label: string; kind: NodeKind; notes: string }
export interface StoryLink { from: string; to: string }
export interface Book { id: string; title: string; subtitle: string; author: string; genre: string; premise: string; goal: number; dailyGoal: number; chapters: Chapter[]; nodes: StoryNode[]; links: StoryLink[] }
export interface Library { activeBookId: string; books: Book[]; lastSaved?: string }

export const countWords = (text: string) => text.trim() ? text.trim().split(/\s+/u).length : 0
export const bookWords = (book: Book) => book.chapters.reduce((total, chapter) => total + countWords(chapter.content), 0)
export const chapterMarkdown = (chapter: Chapter) => `# ${chapter.title}\n\n${chapter.content.trim()}\n`
export const bookMarkdown = (book: Book) => `# ${book.title}\n\n${book.subtitle ? `_${book.subtitle}_\n\n` : ''}${book.author ? `**${book.author}**\n\n` : ''}---\n\n${book.chapters.map(chapterMarkdown).join('\n---\n\n')}`

const oldStatuses: Record<string, ChapterStatus> = { Ideia: 'Idea', Rascunho: 'Draft', 'Revisão': 'Revision', Pronto: 'Done' }
const oldKinds: Record<string, NodeKind> = { personagem: 'character', lugar: 'place', tema: 'theme', objeto: 'object', evento: 'event' }

export function normalizeLibrary(value: unknown): Library | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Partial<Library>
  if (!Array.isArray(source.books) || !source.books.length) return null
  return {
    activeBookId: typeof source.activeBookId === 'string' ? source.activeBookId : source.books[0].id,
    lastSaved: source.lastSaved,
    books: source.books.map(book => ({
      ...book,
      chapters: (book.chapters ?? []).map(chapter => ({ ...chapter, status: oldStatuses[chapter.status] ?? chapter.status })),
      nodes: (book.nodes ?? []).map(node => ({ ...node, kind: oldKinds[node.kind] ?? node.kind })),
      links: book.links ?? []
    }))
  }
}

export const starterLibrary: Library = {
  activeBookId: 'book-aurora',
  books: [{
    id: 'book-aurora', title: 'The Letters of Aurora', subtitle: 'A novel of memory, the sea, and second chances', author: 'Your name', genre: 'Literary fiction',
    premise: 'When Lia inherits a house overlooking the sea, she finds letters her grandmother wrote but never sent. She must decide which truths should finally reach their destination.',
    goal: 70000, dailyGoal: 800,
    chapters: [
      { id: 'chapter-1', title: 'The House by the Sea', summary: 'Lia returns home and discovers the first letter.', status: 'Revision', target: 2500, content: 'The wind arrived before the sea. Lia felt it slip through the window, carrying salt, sand, and a memory she could not yet name.\n\nThe house key weighed in her coat pocket like a question.' },
      { id: 'chapter-2', title: 'Blue Ink', summary: 'An impossible date changes the meaning of her inheritance.', status: 'Draft', target: 2500, content: 'The box was hidden beneath three loose floorboards. Inside, dozens of envelopes bore the same address and not a single postmark.' },
      { id: 'chapter-3', title: 'The Lighthouse Keeper', summary: 'Thomas recognizes the handwriting but refuses to explain.', status: 'Idea', target: 2500, content: '' },
      { id: 'chapter-4', title: 'Low Tide', summary: 'A clue appears where the ocean recedes.', status: 'Idea', target: 2500, content: '' }
    ],
    nodes: [
      { id: 'lia', label: 'Lia', kind: 'character', notes: 'Protagonist. Book restorer, age 31.' },
      { id: 'aurora', label: 'Aurora', kind: 'character', notes: 'Lia’s grandmother and author of the letters.' },
      { id: 'thomas', label: 'Thomas', kind: 'character', notes: 'Lighthouse keeper with an old secret.' },
      { id: 'house', label: 'Sea House', kind: 'place', notes: 'The house Lia inherited.' },
      { id: 'letters', label: 'Blue Letters', kind: 'object', notes: 'Letters that were never sent.' },
      { id: 'truth', label: 'Truth & Care', kind: 'theme', notes: 'Some truths hurt when they arrive.' }
    ],
    links: [{ from: 'lia', to: 'aurora' }, { from: 'lia', to: 'house' }, { from: 'aurora', to: 'letters' }, { from: 'letters', to: 'thomas' }, { from: 'letters', to: 'truth' }, { from: 'lia', to: 'truth' }]
  }]
}
