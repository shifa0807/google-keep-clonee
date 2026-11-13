
import { useEffect, useMemo, useState } from 'react'
import {
  Archive, Bell, Check, CheckSquare, ChevronDown, CirclePlus,
  Image, Lightbulb, Menu, Moon, MoreVertical, Palette, Pin,
  Plus, Search, Sun, Tag, Trash2, X, Edit3, FileText
} from 'lucide-react'

const starterNotes = [
  {
    id: 1,
    title: 'Project Plan',
    content: 'Design the interface\nComplete React components\nTest all features\nDeploy the website',
    checklist: true,
    checked: [true, false, false, false],
    color: 'yellow',
    label: 'Work',
    pinned: true,
    archived: false,
    deleted: false,
  },
  {
    id: 2,
    title: 'Meeting Notes',
    content: 'Discuss project timeline\nFinalize requirements\nAssign tasks\nNext review on Friday',
    checklist: false,
    checked: [],
    color: 'purple',
    label: 'Work',
    pinned: true,
    archived: false,
    deleted: false,
  },
  {
    id: 3,
    title: 'Learning Goals',
    content: 'Complete React course\nBuild 2 mini projects\nRevise JavaScript\nPractice DSA',
    checklist: true,
    checked: [false, true, false, false],
    color: 'blue',
    label: 'Study',
    pinned: true,
    archived: false,
    deleted: false,
  },
  {
    id: 4,
    title: 'Grocery List',
    content: 'Milk\nBread\nFruits\nEggs\nVegetables',
    checklist: true,
    checked: [false, false, false, false, false],
    color: 'pink',
    label: 'Personal',
    pinned: false,
    archived: false,
    deleted: false,
  },
  {
    id: 5,
    title: 'Ideas 💡',
    content: 'AI automation for HR\nResume generator\nMock test platform\nLinkedIn content ideas',
    checklist: false,
    checked: [],
    color: 'green',
    label: 'Work',
    pinned: false,
    archived: false,
    deleted: false,
  },
  {
    id: 6,
    title: 'Reading List 📚',
    content: 'Atomic Habits\nDeep Work\nThe Lean Startup\nBuilding a Second Brain',
    checklist: true,
    checked: [false, false, true, false],
    color: 'orange',
    label: 'Personal',
    pinned: false,
    archived: false,
    deleted: false,
  },
  {
    id: 7,
    title: 'Travel Plan ✈️',
    content: 'Manali - December\nBook hotel\nCheck weather\nMake itinerary',
    checklist: false,
    checked: [],
    color: 'blue',
    label: 'Personal',
    pinned: false,
    archived: false,
    deleted: false,
  },
]

const colors = [
  { name: 'default', value: '#ffffff' },
  { name: 'yellow', value: '#fff2b8' },
  { name: 'pink', value: '#ffe0e8' },
  { name: 'purple', value: '#eee2ff' },
  { name: 'blue', value: '#dceeff' },
  { name: 'green', value: '#d9f8e8' },
  { name: 'orange', value: '#ffead5' },
]

const colorClasses = {
  default: 'bg-white dark:bg-[#252a35]',
  yellow: 'bg-[#fff2b8] dark:bg-[#574b2d]',
  pink: 'bg-[#ffe0e8] dark:bg-[#573b49]',
  purple: 'bg-[#eee2ff] dark:bg-[#493d5c]',
  blue: 'bg-[#dceeff] dark:bg-[#30485f]',
  green: 'bg-[#d9f8e8] dark:bg-[#294d40]',
  orange: 'bg-[#ffead5] dark:bg-[#594333]',
}

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('keep-notes')
      return saved ? JSON.parse(saved) : starterNotes
    } catch {
      return starterNotes
    }
  })

  const [labels, setLabels] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('keep-labels')) || ['Work', 'Personal', 'Study']
    } catch {
      return ['Work', 'Personal', 'Study']
    }
  })

  const [dark, setDark] = useState(() => localStorage.getItem('keep-dark') === 'true')
  const [page, setPage] = useState('Notes')
  const [activeLabel, setActiveLabel] = useState('')
  const [search, setSearch] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [checklist, setChecklist] = useState(false)
  const [color, setColor] = useState('default')
  const [label, setLabel] = useState('')
  const [checked, setChecked] = useState([])
  const [showColors, setShowColors] = useState(false)
  const [showMenu, setShowMenu] = useState(null)
  const [newLabel, setNewLabel] = useState('')
  const [showLabelInput, setShowLabelInput] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('keep-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('keep-labels', JSON.stringify(labels))
  }, [labels])

  useEffect(() => {
    localStorage.setItem('keep-dark', String(dark))
  }, [dark])

  const resetComposer = () => {
    setTitle('')
    setContent('')
    setChecklist(false)
    setColor('default')
    setLabel('')
    setChecked([])
    setEditingId(null)
    setShowComposer(false)
    setShowColors(false)
  }

  const openNewNote = (isChecklist = false) => {
    resetComposer()
    setChecklist(isChecklist)
    setShowComposer(true)
  }

  const editNote = (note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setChecklist(note.checklist)
    setColor(note.color)
    setLabel(note.label || '')
    setChecked(note.checked || [])
    setShowComposer(true)
    setShowMenu(null)
  }

  const saveNote = (e) => {
    e.preventDefault()
    if (!title.trim() && !content.trim()) return

    const updatedNote = {
      id: editingId || Date.now(),
      title: title.trim(),
      content: content.trim(),
      checklist,
      checked: checklist
        ? content.split('\n').map((_, i) => Boolean(checked[i]))
        : [],
      color,
      label,
      pinned: editingId
        ? notes.find((n) => n.id === editingId)?.pinned || false
        : false,
      archived: editingId
        ? notes.find((n) => n.id === editingId)?.archived || false
        : false,
      deleted: false,
    }

    if (editingId) {
      setNotes((prev) => prev.map((n) => n.id === editingId ? updatedNote : n))
    } else {
      setNotes((prev) => [updatedNote, ...prev])
    }

    resetComposer()
  }

  const updateNote = (id, changes) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, ...changes } : n))
    setShowMenu(null)
  }

  const deleteNote = (id) => {
    const note = notes.find((n) => n.id === id)
    if (note?.deleted) {
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } else {
      updateNote(id, { deleted: true, pinned: false, archived: false })
    }
  }

  const restoreNote = (id) => updateNote(id, { deleted: false })

  const addLabel = (e) => {
    e.preventDefault()
    const value = newLabel.trim()
    if (value && !labels.includes(value)) setLabels((prev) => [...prev, value])
    setNewLabel('')
    setShowLabelInput(false)
  }

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (page === 'Trash' && !note.deleted) return false
      if (page !== 'Trash' && note.deleted) return false
      if (page === 'Pinned' && !note.pinned) return false
      if (page === 'Archive' && !note.archived) return false
      if (page === 'Notes' && note.archived) return false
      if (activeLabel && note.label !== activeLabel) return false

      const query = search.toLowerCase()
      if (query && !`${note.title} ${note.content}`.toLowerCase().includes(query)) return false
      return true
    })
  }, [notes, page, activeLabel, search])

  const pinnedNotes = filteredNotes.filter((n) => n.pinned && !n.archived && !n.deleted)
  const otherNotes = filteredNotes.filter((n) => !n.pinned || page !== 'Notes')

  const heading = activeLabel || page

  const toggleChecklistItem = (note, index) => {
    const next = [...(note.checked || [])]
    next[index] = !next[index]
    updateNote(note.id, { checked: next })
  }

  const navItems = [
    { name: 'Notes', icon: Lightbulb },
    { name: 'Pinned', icon: Pin },
    { name: 'Archive', icon: Archive },
    { name: 'Trash', icon: Trash2 },
  ]

  const NoteCard = ({ note }) => (
    <article
      className={`group relative break-inside-avoid rounded-2xl border border-black/5 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${colorClasses[note.color] || colorClasses.default}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 whitespace-pre-wrap break-words text-[16px] font-bold text-gray-900 dark:text-white">
          {note.title || 'Untitled'}
        </h3>
        <button
          onClick={() => updateNote(note.id, { pinned: !note.pinned })}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
          className={`rounded-full p-1.5 transition hover:bg-black/10 ${note.pinned ? 'text-amber-700 dark:text-amber-200' : 'text-gray-500 opacity-0 group-hover:opacity-100'}`}
        >
          <Pin size={19} fill={note.pinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      {note.checklist ? (
        <div className="mt-4 space-y-2">
          {note.content.split('\n').filter((line) => line.trim()).map((item, index) => (
            <label key={index} className="flex cursor-pointer items-start gap-3 text-sm text-gray-800 dark:text-gray-100">
              <input
                type="checkbox"
                checked={Boolean(note.checked?.[index])}
                onChange={() => toggleChecklistItem(note, index)}
                className="mt-0.5 h-4 w-4 accent-gray-900"
              />
              <span className={note.checked?.[index] ? 'text-gray-500 line-through' : ''}>
                {item}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700 dark:text-gray-100">
          {note.content}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        {note.label ? (
          <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-black/20 dark:text-white">
            {note.label}
          </span>
        ) : <span />}

        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-100">
          {page === 'Trash' ? (
            <button onClick={() => restoreNote(note.id)} title="Restore" className="rounded-full p-2 hover:bg-black/10">
              <Archive size={17} />
            </button>
          ) : (
            <>
              <button onClick={() => editNote(note)} title="Edit note" className="rounded-full p-2 hover:bg-black/10">
                <Edit3 size={17} />
              </button>
              <button onClick={() => updateNote(note.id, { archived: !note.archived, pinned: false })} title="Archive" className="rounded-full p-2 hover:bg-black/10">
                <Archive size={17} />
              </button>
              <button onClick={() => deleteNote(note.id)} title="Delete" className="rounded-full p-2 hover:bg-black/10">
                <Trash2 size={17} />
              </button>
            </>
          )}
          <div className="relative">
            <button onClick={() => setShowMenu(showMenu === note.id ? null : note.id)} title="More options" className="rounded-full p-2 hover:bg-black/10">
              <MoreVertical size={17} />
            </button>
            {showMenu === note.id && (
              <div className="absolute bottom-10 right-0 z-20 w-44 rounded-xl border border-gray-200 bg-white p-2 text-sm shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <button onClick={() => editNote(note)} className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">Edit note</button>
                <button onClick={() => updateNote(note.id, { pinned: !note.pinned })} className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">{note.pinned ? 'Unpin' : 'Pin'} note</button>
                <button onClick={() => updateNote(note.id, { archived: !note.archived, pinned: false })} className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">{note.archived ? 'Unarchive' : 'Archive'}</button>
                <button onClick={() => deleteNote(note.id)} className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">{page === 'Trash' ? 'Delete forever' : 'Move to trash'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#fafbff] text-gray-900 transition-colors dark:bg-[#171a21] dark:text-white">
        <header className="sticky top-0 z-30 flex h-[78px] items-center gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md dark:border-gray-700 dark:bg-[#20242d]/95 md:px-7">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden">
            <Menu size={22} />
          </button>

          <div className="flex w-[220px] shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white shadow-sm">
              <Lightbulb size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Keep<span className="text-amber-500">Notes</span></span>
          </div>

          <div className="flex max-w-2xl flex-1 items-center gap-3 rounded-full bg-[#eef0f6] px-5 py-3 dark:bg-[#303642]">
            <Search size={21} className="shrink-0 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500 dark:text-white"
            />
            {search && <button onClick={() => setSearch('')}><X size={18} /></button>}
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <button onClick={() => setDark(!dark)} title="Toggle theme" className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-600 dark:bg-gray-700">
              <span className={`rounded-full p-2 ${!dark ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}><Sun size={18} /></span>
              <span className={`rounded-full p-2 ${dark ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}><Moon size={18} /></span>
            </button>
            <button className="hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 sm:block" title="Notifications"><Bell size={22} /></button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-800 text-lg font-bold text-white shadow">S</div>
          </div>
        </header>

        <div className="flex">
          {sidebarOpen && <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/30 lg:hidden" />}

          <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed bottom-0 left-0 top-[78px] z-30 w-[270px] border-r border-gray-200 bg-white px-4 py-6 transition-transform dark:border-gray-700 dark:bg-[#20242d] lg:sticky lg:top-[78px] lg:h-[calc(100vh-78px)] lg:translate-x-0`}>
            <nav className="space-y-2">
              {navItems.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => { setPage(name); setActiveLabel(''); setSidebarOpen(false) }}
                  className={`flex w-full items-center gap-5 rounded-r-full rounded-l-full px-5 py-4 text-left font-semibold transition ${page === name && !activeLabel ? 'bg-[#ffedaa] text-gray-900 dark:bg-amber-500/20 dark:text-amber-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <Icon size={22} /> {name}
                </button>
              ))}
            </nav>

            <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

            <div className="mb-4 flex items-center justify-between px-3">
              <h3 className="font-bold">Labels</h3>
              <button onClick={() => setShowLabelInput(!showLabelInput)} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus size={22} /></button>
            </div>

            {showLabelInput && (
              <form onSubmit={addLabel} className="mb-3 flex gap-2 px-2">
                <input autoFocus value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="New label" className="w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-gray-600" />
                <button type="submit" className="rounded-lg bg-amber-400 px-3 text-gray-900"><Check size={18} /></button>
              </form>
            )}

            <div className="space-y-1">
              {labels.map((item, index) => (
                <button
                  key={item}
                  onClick={() => { setActiveLabel(activeLabel === item ? '' : item); setPage('Notes'); setSidebarOpen(false) }}
                  className={`flex w-full items-center gap-5 rounded-full px-5 py-3 text-left font-medium ${activeLabel === item ? 'bg-amber-100 dark:bg-amber-500/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Tag size={20} className={['text-violet-600', 'text-green-600', 'text-blue-600'][index % 3]} />
                  {item}
                </button>
              ))}
            </div>
          </aside>

          <main className="min-w-0 flex-1 px-4 py-7 md:px-8 lg:px-10">
            {page === 'Notes' && !activeLabel && (
              <div className="mx-auto mb-9 max-w-4xl">
                {!showComposer ? (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-md dark:border-gray-700 dark:bg-[#252a35]">
                    <button onClick={() => openNewNote(false)} className="flex-1 text-left text-gray-500">Take a note...</button>
                    <button onClick={() => openNewNote(true)} title="New checklist" className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><CheckSquare size={22} /></button>
                    <button onClick={() => openNewNote(false)} title="New note" className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><Image size={22} /></button>
                    <button onClick={() => openNewNote(false)} title="Choose note colour" className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><Palette size={22} /></button>
                  </div>
                ) : (
                  <form onSubmit={saveNote} className={`rounded-2xl border border-gray-200 p-5 shadow-lg dark:border-gray-700 ${colorClasses[color]}`}>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="mb-3 w-full bg-transparent text-lg font-bold text-gray-900 outline-none placeholder:text-gray-500 dark:text-white" />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={checklist ? 'Add checklist items on separate lines...' : 'Take a note...'} rows={4} className="w-full resize-y bg-transparent text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-500 dark:text-white" />
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => setChecklist(!checklist)} className={`rounded-lg p-2 ${checklist ? 'bg-black/10' : 'hover:bg-black/10'}`} title="Toggle checklist"><CheckSquare size={19} /></button>
                        <div className="relative">
                          <button type="button" onClick={() => setShowColors(!showColors)} className="rounded-lg p-2 hover:bg-black/10" title="Note colour"><Palette size={19} /></button>
                          {showColors && <div className="absolute bottom-12 left-0 z-20 flex gap-2 rounded-xl bg-white p-3 shadow-xl dark:bg-gray-800">{colors.map((c) => <button key={c.name} type="button" title={c.name} onClick={() => { setColor(c.name); setShowColors(false) }} className={`h-7 w-7 rounded-full border border-gray-300 ${colorClasses[c.name]}`} />)}</div>}
                        </div>
                        <select value={label} onChange={(e) => setLabel(e.target.value)} className="max-w-[130px] rounded-lg border border-gray-300 bg-white/70 px-2 py-2 text-xs text-gray-800 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                          <option value="">No label</option>
                          {labels.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={resetComposer} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-black/10 dark:text-white">Cancel</button>
                        <button type="submit" className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-amber-400 dark:text-gray-900">Save note</button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="mx-auto max-w-[1500px]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Your workspace</p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">{search ? 'Search Results' : heading}</h1>
                </div>
                <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{filteredNotes.length} notes</span>
              </div>

              {page === 'Notes' && !activeLabel && !search && pinnedNotes.length > 0 && (
                <>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500"><Pin size={16} /> Pinned</h2>
                  <div className="mb-9 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {pinnedNotes.map((note) => <NoteCard key={note.id} note={note} />)}
                  </div>
                  {otherNotes.length > 0 && <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Others</h2>}
                </>
              )}

              {filteredNotes.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center text-gray-400">
                  <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800"><FileText size={38} /></div>
                  <h2 className="text-lg font-bold text-gray-600 dark:text-gray-300">No notes found</h2>
                  <p className="mt-1 text-sm">Your notes will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {(page === 'Notes' && !activeLabel && !search ? otherNotes : filteredNotes).map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              )}
            </div>

            <footer className="py-12 text-center text-xs text-gray-400">
              KeepNotes · Your ideas, beautifully organized
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App