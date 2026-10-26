import { describe, expect, it } from 'vitest'
import { bookMarkdown, bookWords, countWords, starterLibrary } from './model'

describe('manuscrito', () => {
  it('conta palavras sem inflar espaços', () => expect(countWords('  uma   boa história\ncomeça ')).toBe(4))
  it('soma somente o texto dos capítulos', () => expect(bookWords(starterLibrary.books[0])).toBeGreaterThan(20))
  it('exporta capítulos na ordem do planejamento', () => {
    const markdown = bookMarkdown(starterLibrary.books[0])
    expect(markdown.indexOf('A casa diante do mar')).toBeLessThan(markdown.indexOf('Tinta azul'))
  })
})
