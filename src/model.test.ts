import { describe, expect, it } from 'vitest'
import { bookMarkdown, bookWords, countWords, normalizeLibrary, starterLibrary } from './model'

describe('manuscript', () => {
  it('counts words across whitespace', () => expect(countWords('  a   good story\nbegins ')).toBe(4))
  it('sums chapter prose', () => expect(bookWords(starterLibrary.books[0])).toBeGreaterThan(20))
  it('exports chapters in outline order', () => {
    const markdown = bookMarkdown(starterLibrary.books[0])
    expect(markdown.indexOf('The House by the Sea')).toBeLessThan(markdown.indexOf('Blue Ink'))
  })
  it('keeps an existing Portuguese manuscript while migrating its stages', () => {
    const old = structuredClone(starterLibrary)
    old.books[0].chapters[0].status = 'Revisão' as never
    old.books[0].chapters[0].content = 'Texto do usuário.'
    old.books[0].nodes[0].kind = 'personagem' as never
    const migrated = normalizeLibrary(old)!
    expect(migrated.books[0].chapters[0].status).toBe('Revision')
    expect(migrated.books[0].chapters[0].content).toBe('Texto do usuário.')
    expect(migrated.books[0].nodes[0].kind).toBe('character')
  })
})
