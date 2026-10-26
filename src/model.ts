export type ChapterStatus = 'Ideia' | 'Rascunho' | 'Revisão' | 'Pronto'
export type NodeKind = 'personagem' | 'lugar' | 'tema' | 'objeto' | 'evento'

export interface Chapter { id: string; title: string; summary: string; content: string; status: ChapterStatus; target: number }
export interface StoryNode { id: string; label: string; kind: NodeKind; notes: string }
export interface StoryLink { from: string; to: string }
export interface Book { id: string; title: string; subtitle: string; author: string; genre: string; premise: string; goal: number; dailyGoal: number; chapters: Chapter[]; nodes: StoryNode[]; links: StoryLink[] }
export interface Library { activeBookId: string; books: Book[]; lastSaved?: string }

export const countWords = (text: string) => text.trim() ? text.trim().split(/\s+/u).length : 0
export const bookWords = (book: Book) => book.chapters.reduce((total, chapter) => total + countWords(chapter.content), 0)
export const chapterMarkdown = (chapter: Chapter) => `# ${chapter.title}\n\n${chapter.content.trim()}\n`
export const bookMarkdown = (book: Book) => `# ${book.title}\n\n${book.subtitle ? `_${book.subtitle}_\n\n` : ''}${book.author ? `**${book.author}**\n\n` : ''}---\n\n${book.chapters.map(chapterMarkdown).join('\n---\n\n')}`

export const starterLibrary: Library = {
  activeBookId: 'livro-aurora',
  books: [{
    id: 'livro-aurora', title: 'As Cartas de Aurora', subtitle: 'Um romance sobre memória, mar e recomeços', author: 'Seu nome', genre: 'Romance literário',
    premise: 'Ao herdar uma casa diante do mar, Lia encontra cartas que sua avó escreveu — mas nunca enviou — e precisa decidir quais verdades devem finalmente chegar ao destino.',
    goal: 70000, dailyGoal: 800,
    chapters: [
      { id: 'cap-1', title: 'A casa diante do mar', summary: 'Lia retorna à cidade e descobre a primeira carta.', status: 'Revisão', target: 2500, content: 'O vento chegava antes do mar. Lia o sentiu atravessar a fresta da janela, trazendo sal, areia e uma lembrança que ainda não tinha nome.\n\nA chave da casa pesava no bolso do casaco como uma pergunta.' },
      { id: 'cap-2', title: 'Tinta azul', summary: 'Uma data impossível muda o sentido da herança.', status: 'Rascunho', target: 2500, content: 'A caixa estava escondida sob três tábuas soltas. Dentro dela, dezenas de envelopes tinham o mesmo destinatário e nenhuma marca de correio.' },
      { id: 'cap-3', title: 'O faroleiro', summary: 'Tomás reconhece a caligrafia e se recusa a explicar.', status: 'Ideia', target: 2500, content: '' },
      { id: 'cap-4', title: 'Maré baixa', summary: 'Uma pista aparece onde o oceano recua.', status: 'Ideia', target: 2500, content: '' }
    ],
    nodes: [
      { id: 'lia', label: 'Lia', kind: 'personagem', notes: 'Protagonista. Restauradora de livros, 31 anos.' },
      { id: 'aurora', label: 'Aurora', kind: 'personagem', notes: 'Avó de Lia. Autora das cartas.' },
      { id: 'tomas', label: 'Tomás', kind: 'personagem', notes: 'Faroleiro e guardião de um segredo antigo.' },
      { id: 'casa', label: 'Casa do Mar', kind: 'lugar', notes: 'Casa herdada por Lia.' },
      { id: 'cartas', label: 'Cartas azuis', kind: 'objeto', notes: 'Cartas nunca enviadas.' },
      { id: 'verdade', label: 'Verdade × cuidado', kind: 'tema', notes: 'Nem toda verdade chega sem ferir.' }
    ],
    links: [{ from: 'lia', to: 'aurora' }, { from: 'lia', to: 'casa' }, { from: 'aurora', to: 'cartas' }, { from: 'cartas', to: 'tomas' }, { from: 'cartas', to: 'verdade' }, { from: 'lia', to: 'verdade' }]
  }]
}
