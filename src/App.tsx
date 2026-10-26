import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, BrainCircuit, CircleDot, Download, FilePlus2, Focus, LayoutDashboard, Link2, Map, Menu, MoreHorizontal, Plus, Search, Sparkles, Target, X } from 'lucide-react'
import { Book, Chapter, ChapterStatus, Library, NodeKind, StoryNode, bookMarkdown, bookWords, countWords, normalizeLibrary, starterLibrary } from './model'

type View = 'overview' | 'write' | 'board' | 'map'
const cloneStarter = (): Library => JSON.parse(JSON.stringify(starterLibrary))
const id = () => crypto.randomUUID()
const statusOrder: ChapterStatus[] = ['Idea', 'Draft', 'Revision', 'Done']
const nodeColors: Record<NodeKind, string> = { character: '#e05c4b', place: '#2f8d82', theme: '#8a65a5', object: '#d49a38', event: '#4776a8' }

function App() {
  const [library, setLibrary] = useState<Library>(cloneStarter)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<View>('overview')
  const [selectedChapterId, setSelectedChapterId] = useState('chapter-1')
  const [search, setSearch] = useState('')
  const [focus, setFocus] = useState(false)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved')
  const [loadError, setLoadError] = useState(false)
  const [toast, setToast] = useState('')

  const book = library.books.find(item => item.id === library.activeBookId) ?? library.books[0]
  const chapter = book.chapters.find(item => item.id === selectedChapterId) ?? book.chapters[0]

  useEffect(() => {
    window.fablethread?.load().then(data => {
      const loaded = normalizeLibrary(data)
      if (data !== null && !loaded) throw new Error('Invalid library format')
      if (loaded) setLibrary(loaded)
      setReady(true)
    }).catch(() => { setLoadError(true); setSaveState('error') })
  }, [])

  useEffect(() => {
    if (!ready) return
    setSaveState('saving')
    const timer = window.setTimeout(async () => {
      try {
        await window.fablethread?.save({ ...library, lastSaved: new Date().toISOString() })
        setSaveState('saved')
      } catch {
        setSaveState('error')
      }
    }, 500)
    return () => window.clearTimeout(timer)
  }, [library, ready])

  const updateBook = (change: (book: Book) => Book) => setLibrary(current => ({ ...current, books: current.books.map(item => item.id === book.id ? change(item) : item) }))
  const updateChapter = (patch: Partial<Chapter>) => updateBook(current => ({ ...current, chapters: current.chapters.map(item => item.id === chapter.id ? { ...item, ...patch } : item) }))
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2400) }

  const createChapter = () => {
    const next: Chapter = { id: id(), title: 'New chapter', summary: 'What changes in this part of the story?', content: '', status: 'Idea', target: 2000 }
    updateBook(current => ({ ...current, chapters: [...current.chapters, next] }))
    setSelectedChapterId(next.id); setView('write')
  }

  const exportBook = async () => {
    const result = await window.fablethread?.exportBook({ title: book.title, markdown: bookMarkdown(book) })
    if (result) flash('Manuscript exported')
  }

  const filteredChapters = book.chapters.filter(item => `${item.title} ${item.summary} ${item.content}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))

  if (loadError) return <div className="load-error"><img src="/brand.png" alt="Fablethread"/><h1>We couldn't open your library.</h1><p>Your existing files have not been changed. Check the app data folder and try opening Fablethread again.</p></div>

  return <div className={`app ${focus ? 'focus-mode' : ''}`}>
    <div className="title-strip"><img src="/brand.png"/> <span>Fablethread</span></div>
    {!focus && <aside className="sidebar">
      <div className="brand"><img src="/brand.png"/><div><strong>Fablethread</strong><span>stories, connected</span></div></div>
      <div className="book-switch"><span><small>Current book</small>{book.title}</span></div>
      <nav className="primary-nav" aria-label="Main navigation">
        <button className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')}><LayoutDashboard/>Overview</button>
        <button className={view === 'write' ? 'active' : ''} onClick={() => setView('write')}><BookOpen/>Write</button>
        <button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}><Menu/>Outline</button>
        <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><BrainCircuit/>Story map</button>
      </nav>
      <div className="section-label"><span>MANUSCRIPT</span><button title="New chapter" onClick={createChapter}><Plus size={16}/></button></div>
      <label className="search"><Search size={15}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search this book..."/></label>
      <div className="chapter-list">
        {filteredChapters.map((item, index) => <button key={item.id} className={chapter?.id === item.id && view === 'write' ? 'selected' : ''} onClick={() => { setSelectedChapterId(item.id); setView('write') }}>
          <span className="chapter-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{countWords(item.content).toLocaleString('en-US')} words</small></span>
        </button>)}
      </div>
      <div className="sidebar-foot"><div className="local"><span></span>Stored on this device</div></div>
    </aside>}
    <main className="workspace">
      <header className="topbar">
        <div className="crumb"><span>{book.title}</span><span>/</span><strong>{viewLabel(view, chapter?.title)}</strong></div>
        <div className="top-actions"><span className="save-state">{saveState === 'saving' ? 'Saving…' : saveState === 'error' ? 'Save failed' : 'All changes saved'}</span><button className="icon-button" title="Focus mode" onClick={() => { if (view !== 'write') setView('write'); setFocus(true) }}><Focus size={18}/></button><button className="export" onClick={exportBook}><Download size={17}/>Export</button></div>
      </header>
      {view === 'overview' && <Overview book={book} selectChapter={chapterId => { setSelectedChapterId(chapterId); setView('write') }} goTo={setView}/>} 
      {view === 'write' && chapter && <Writer chapter={chapter} update={updateChapter} onCloseFocus={() => setFocus(false)} focus={focus}/>} 
      {view === 'board' && <Board book={book} updateBook={updateBook} selectChapter={chapterId => { setSelectedChapterId(chapterId); setView('write') }} createChapter={createChapter}/>} 
      {view === 'map' && <StoryMap book={book} updateBook={updateBook}/>} 
    </main>
    {toast && <div className="toast"><CircleDot size={16}/>{toast}</div>}
  </div>
}

function viewLabel(view: View, chapterTitle?: string) {
  return view === 'overview' ? 'Overview' : view === 'write' ? chapterTitle ?? 'Write' : view === 'board' ? 'Outline' : 'Story map'
}

function Overview({ book, selectChapter, goTo }: { book: Book; selectChapter: (id: string) => void; goTo: (view: View) => void }) {
  const words = bookWords(book)
  const progress = Math.min(100, Math.round(words / book.goal * 100))
  const complete = book.chapters.filter(item => item.status === 'Done').length
  const active = book.chapters.find(item => item.status === 'Draft') ?? book.chapters[0]
  return <div className="page overview-page">
    <section className="welcome"><div><span className="eyebrow">YOUR WRITING DESK</span><h1>Your story is taking shape.</h1><p>Pick up where you left off or take a look at the bigger picture.</p></div><button onClick={() => selectChapter(active.id)}><Sparkles size={18}/>Continue writing</button></section>
    <section className="stats-grid">
      <div className="stat hero-stat"><div className="stat-icon coral"><BookOpen/></div><div><small>BOOK PROGRESS</small><strong>{words.toLocaleString('en-US')} <span>/ {book.goal.toLocaleString('en-US')}</span></strong><div className="bar"><i style={{ width: `${progress}%` }}/></div><p>{progress}% of your target</p></div></div>
      <div className="stat"><div className="stat-icon teal"><Target/></div><div><small>WRITING TARGET</small><strong>{book.dailyGoal.toLocaleString('en-US')}</strong><p>words per session</p></div></div>
      <div className="stat"><div className="stat-icon violet"><FilePlus2/></div><div><small>CHAPTERS</small><strong>{book.chapters.length}</strong><p>{complete} complete</p></div></div>
    </section>
    <section className="overview-grid">
      <div className="panel project-card"><div className="cover"><img src="/brand.png"/><span>YOUR STORY</span></div><div className="project-copy"><span className="eyebrow">CURRENT BOOK</span><h2>{book.title}</h2><em>{book.subtitle}</em><p>{book.premise}</p><div className="chips"><span>{book.genre}</span><span>{book.chapters.length} chapters</span></div></div></div>
      <div className="panel quick"><div className="panel-heading"><h3>Creative shortcuts</h3></div><button onClick={() => goTo('board')}><span className="mini-icon coral"><Menu/></span><span><strong>Arrange chapters</strong><small>Shape the story's rhythm</small></span></button><button onClick={() => goTo('map')}><span className="mini-icon teal"><Map/></span><span><strong>Open story map</strong><small>Connect people and ideas</small></span></button><button onClick={() => goTo('write')}><span className="mini-icon violet"><Focus/></span><span><strong>Write a scene</strong><small>Return to your manuscript</small></span></button></div>
    </section>
    <section className="panel recent"><div className="panel-heading"><h3>At a glance</h3><button onClick={() => goTo('board')}>View outline</button></div>{book.chapters.slice(0, 3).map(item => <button key={item.id} onClick={() => selectChapter(item.id)}><span className={`status-dot ${item.status.toLowerCase()}`}/><span><strong>{item.title}</strong><small>{item.summary}</small></span><span className="word-pill">{countWords(item.content)} words</span></button>)}</section>
  </div>
}

function Writer({ chapter, update, focus, onCloseFocus }: { chapter: Chapter; update: (patch: Partial<Chapter>) => void; focus: boolean; onCloseFocus: () => void }) {
  const words = countWords(chapter.content)
  const percentage = Math.min(100, Math.round(words / chapter.target * 100))
  const textRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { textRef.current?.focus() }, [chapter.id])
  return <div className="writer-page">
    {focus && <button className="leave-focus" onClick={onCloseFocus}><X size={17}/>Leave focus</button>}
    <div className="writing-sheet">
      <div className="chapter-kicker">CHAPTER</div>
      <input className="chapter-title-input" value={chapter.title} onChange={event => update({ title: event.target.value })} aria-label="Chapter title"/>
      <input className="summary-input" value={chapter.summary} onChange={event => update({ summary: event.target.value })} placeholder="What changes in this chapter?" aria-label="Chapter summary"/>
      <textarea ref={textRef} className="manuscript" value={chapter.content} onChange={event => update({ content: event.target.value })} placeholder="Start writing…" spellCheck />
    </div>
    {!focus && <aside className="chapter-inspector"><div className="inspector-title"><span>Chapter details</span><MoreHorizontal/></div><label>STAGE<select value={chapter.status} onChange={event => update({ status: event.target.value as ChapterStatus })}>{statusOrder.map(status => <option key={status}>{status}</option>)}</select></label><label>WORD TARGET<input type="number" value={chapter.target} min="100" step="100" onChange={event => update({ target: Math.max(100, Number(event.target.value)) })}/></label><div className="chapter-progress"><div><span>Progress</span><strong>{percentage}%</strong></div><div className="bar"><i style={{ width: `${percentage}%` }}/></div><small>{words.toLocaleString('en-US')} of {chapter.target.toLocaleString('en-US')} words</small></div><div className="tip"><Sparkles/><strong>Scene prompt</strong><p>What does your character want now, and what stands in the way?</p></div></aside>}
    <footer className="writer-footer"><span>{words.toLocaleString('en-US')} words</span><span>≈ {Math.max(1, Math.ceil(words / 250))} min read</span></footer>
  </div>
}

function Board({ book, updateBook, selectChapter, createChapter }: { book: Book; updateBook: (change: (book: Book) => Book) => void; selectChapter: (id: string) => void; createChapter: () => void }) {
  const move = (chapterId: string, direction: -1 | 1) => updateBook(current => {
    const chapters = [...current.chapters]; const index = chapters.findIndex(item => item.id === chapterId); const target = index + direction
    if (target < 0 || target >= chapters.length) return current
    ;[chapters[index], chapters[target]] = [chapters[target], chapters[index]]
    return { ...current, chapters }
  })
  const advance = (chapterId: string) => updateBook(current => ({ ...current, chapters: current.chapters.map(item => item.id === chapterId ? { ...item, status: statusOrder[(statusOrder.indexOf(item.status) + 1) % statusOrder.length] } : item) }))
  return <div className="page board-page"><section className="page-title"><div><span className="eyebrow">STORY STRUCTURE</span><h1>Outline</h1><p>See the whole book. Rearrange chapters and track each stage.</p></div><button onClick={createChapter}><Plus size={18}/>New chapter</button></section><div className="board">
    {statusOrder.map(status => <section className="board-column" key={status}><header><span className={`status-dot ${status.toLowerCase()}`}/><strong>{status}</strong><small>{book.chapters.filter(item => item.status === status).length}</small></header><div className="cards">{book.chapters.filter(item => item.status === status).map(item => <article key={item.id}><button className="card-main" onClick={() => selectChapter(item.id)}><span>{String(book.chapters.indexOf(item) + 1).padStart(2, '0')}</span><strong>{item.title}</strong><p>{item.summary}</p><small>{countWords(item.content)} words</small></button><div className="card-actions"><button onClick={() => move(item.id, -1)} title="Move earlier">↑</button><button onClick={() => move(item.id, 1)} title="Move later">↓</button><button onClick={() => advance(item.id)} title="Next stage">→</button></div></article>)}</div></section>)}
  </div></div>
}

function StoryMap({ book, updateBook }: { book: Book; updateBook: (change: (book: Book) => Book) => void }) {
  const [selected, setSelected] = useState(book.nodes[0]?.id ?? '')
  const [connecting, setConnecting] = useState<string | null>(null)
  const selectedNode = book.nodes.find(item => item.id === selected)
  const positions = useMemo(() => {
    const center = { x: 430, y: 280 }
    return Object.fromEntries(book.nodes.map((node, index) => {
      const angle = index / Math.max(book.nodes.length, 1) * Math.PI * 2 - Math.PI / 2
      const radius = 205 + (index % 2) * 35
      return [node.id, { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius }]
    }))
  }, [book.nodes])
  const addNode = () => {
    const node: StoryNode = { id: id(), label: 'New idea', kind: 'event', notes: 'Why does this matter to your story?' }
    updateBook(current => ({ ...current, nodes: [...current.nodes, node] })); setSelected(node.id)
  }
  const clickNode = (nodeId: string) => {
    if (connecting && connecting !== nodeId) {
      const exists = book.links.some(link => (link.from === connecting && link.to === nodeId) || (link.to === connecting && link.from === nodeId))
      if (!exists) updateBook(current => ({ ...current, links: [...current.links, { from: connecting, to: nodeId }] }))
      setConnecting(null)
    }
    setSelected(nodeId)
  }
  const updateNode = (patch: Partial<StoryNode>) => updateBook(current => ({ ...current, nodes: current.nodes.map(item => item.id === selected ? { ...item, ...patch } : item) }))
  return <div className="map-page"><section className="map-toolbar"><div><span className="eyebrow">STORY CONNECTIONS</span><h1>Story map</h1></div><div><span className="map-hint">{connecting ? 'Choose a second node' : 'Select a node to edit'}</span><button className={connecting ? 'connecting' : ''} onClick={() => setConnecting(connecting ? null : selected)} disabled={!selected}><Link2 size={17}/>{connecting ? 'Cancel' : 'Connect'}</button><button onClick={addNode}><Plus size={17}/>New idea</button></div></section>
    <div className="map-workspace"><div className="canvas-wrap"><svg viewBox="0 0 860 560" role="img" aria-label="Visual map of story connections">
      <defs><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity=".10"/></filter></defs>
      {book.links.map((link, index) => { const a = positions[link.from], b = positions[link.to]; return a && b ? <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="map-link"/> : null })}
      <g className="book-node" onClick={() => setSelected('')}><circle cx="430" cy="280" r="70"/><text x="430" y="272">{book.title.split(' ').slice(0, 2).join(' ')}</text><text x="430" y="294" className="sub">YOUR BOOK</text></g>
      {book.nodes.map(node => { const pos = positions[node.id]; const active = selected === node.id; return <g key={node.id} className={`story-node ${active ? 'active' : ''} ${connecting === node.id ? 'source' : ''}`} onClick={() => clickNode(node.id)} filter="url(#shadow)"><circle cx={pos.x} cy={pos.y} r={active ? 53 : 48} fill={nodeColors[node.kind]}/><text x={pos.x} y={pos.y - 2}>{node.label}</text><text x={pos.x} y={pos.y + 17} className="sub">{node.kind.toUpperCase()}</text></g> })}
    </svg><div className="legend">{Object.entries(nodeColors).map(([kind, color]) => <span key={kind}><i style={{ background: color }}/>{kind}</span>)}</div></div>
    <aside className="node-inspector">{selectedNode ? <><span className="eyebrow">NODE DETAILS</span><input className="node-title" value={selectedNode.label} onChange={event => updateNode({ label: event.target.value })}/><label>TYPE<select value={selectedNode.kind} onChange={event => updateNode({ kind: event.target.value as NodeKind })}>{Object.keys(nodeColors).map(kind => <option key={kind}>{kind}</option>)}</select></label><label>NOTES<textarea value={selectedNode.notes} onChange={event => updateNode({ notes: event.target.value })}/></label><div className="connections"><span>CONNECTIONS</span>{book.links.filter(link => link.from === selected || link.to === selected).map((link, index) => { const other = book.nodes.find(node => node.id === (link.from === selected ? link.to : link.from)); return <div key={index}><Link2 size={14}/>{other?.label}</div> })}</div></> : <div className="empty-inspector"><BrainCircuit/><h3>Choose an idea</h3><p>Select a node to see its notes and connections.</p></div>}</aside></div>
  </div>
}

export default App
