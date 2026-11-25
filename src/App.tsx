import { ChangeEvent, FormEvent, ReactNode, useState } from 'react'

type Letter = {
  id: string
  agenda: string
  subject: string
  sender: string
  date: string
  category: string
  status: 'Selesai' | 'Diproses' | 'Perlu Tindakan'
  type: 'Masuk' | 'Keluar' | 'Draf'
}

type UploadedTemplate = {
  id: string
  name: string
  size: string
  uploadedAt: string
}

const initialLetters: Letter[] = [
  { id: '1', agenda: '001/SM/VI/2025', subject: 'Undangan Rapat Koordinasi Akademik', sender: 'Biro Akademik', date: '12 Jun 2025', category: 'Undangan', status: 'Perlu Tindakan', type: 'Masuk' },
  { id: '2', agenda: '042/ST/VI/2025', subject: 'Surat Tugas Pendampingan Akreditasi', sender: 'Fakultas', date: '11 Jun 2025', category: 'Surat Tugas', status: 'Selesai', type: 'Keluar' },
  { id: '3', agenda: '002/SM/VI/2025', subject: 'Permohonan Data Beban Kerja Dosen', sender: 'LPM UAD', date: '10 Jun 2025', category: 'Permohonan', status: 'Diproses', type: 'Masuk' },
  { id: '4', agenda: '041/SK/VI/2025', subject: 'Keterangan Aktif Mengajar Semester Genap', sender: 'Program Studi', date: '9 Jun 2025', category: 'Keterangan', status: 'Selesai', type: 'Keluar' },
  { id: '5', agenda: '040/SP/VI/2025', subject: 'Permohonan Narasumber Workshop', sender: 'Fakultas', date: '7 Jun 2025', category: 'Permohonan', status: 'Selesai', type: 'Keluar' },
]

const initialDrafts: Letter[] = [
  { id: 'd1', agenda: 'DRAF-001/VI/2025', subject: 'Permohonan Kerja Sama Kegiatan', sender: 'Program Studi', date: '17 Jun 2025', category: 'Permohonan', status: 'Diproses', type: 'Draf' },
  { id: 'd2', agenda: 'DRAF-002/VI/2025', subject: 'Surat Tugas Panitia Seminar Nasional', sender: 'Fakultas', date: '16 Jun 2025', category: 'Surat Tugas', status: 'Diproses', type: 'Draf' },
]

const navItems = [
  { label: 'Beranda', icon: 'home' },
  { label: 'Surat Masuk', icon: 'inbox', count: 3 },
  { label: 'Surat Keluar', icon: 'send' },
  { label: 'Draf Surat', icon: 'file' },
  { label: 'Menunggu Persetujuan', icon: 'clock', count: 2 },
  { label: 'Template Surat', icon: 'file' },
]

function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    inbox: <><path d="M4 4h16v15H4z" /><path d="M4 14h4l2 3h4l2-3h4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    route: <><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M6 16V9a4 4 0 0 1 4-4h5" /></>,
    file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M9 13h6M9 17h5" /></>,
    archive: <><path d="M3 6h18M5 6v15h14V6M3 3h18v3H3z" /><path d="M9 11h6" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 15v5h16v-5" /></>,
    wand: <><path d="m15 4 5 5L8 21l-5-5Z" /><path d="m6 14 5 5M6 3v3M4.5 4.5h3M18 15v4M16 17h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    download: <><path d="M12 3v13M7 11l5 5 5-5" /><path d="M4 20h16" /></>,
  }
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Beranda')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [typeFilter, setTypeFilter] = useState('Semua')
  const [letters, setLetters] = useState(initialLetters)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [uploadedTemplates, setUploadedTemplates] = useState<UploadedTemplate[]>([])
  const [modal, setModal] = useState<'incoming' | 'outgoing' | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [toast, setToast] = useState('')

  const filteredLetters = letters.filter((letter) => typeFilter === 'Semua' || letter.type === typeFilter)

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function submitLetter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const type = modal === 'incoming' ? 'Masuk' : 'Draf'
    const next = letters.length + 1
    const newLetter: Letter = {
      id: String(Date.now()),
      agenda: type === 'Masuk' ? `00${next}/SM/VI/2025` : `DRAF-00${drafts.length + 1}/VI/2025`,
      subject: String(data.get('subject')),
      sender: String(data.get('sender')),
      date: 'Hari ini',
      category: String(data.get('category')),
      status: type === 'Masuk' ? 'Perlu Tindakan' : 'Diproses',
      type,
    }
    if (type === 'Masuk') {
      setLetters((current) => [newLetter, ...current])
    } else {
      setDrafts((current) => [newLetter, ...current])
      setActiveNav('Draf Surat')
    }
    setModal(null)
    notify(type === 'Masuk' ? 'Surat masuk berhasil diarsipkan' : 'Draf tersimpan di halaman Draf Surat')
  }

  function uploadTemplate(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024)
    if (!validFiles.length) {
      notify('File melebihi batas maksimal 10 MB')
      event.target.value = ''
      return
    }
    setUploadedTemplates((current) => [
      ...validFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        size: file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: 'Baru saja',
      })),
      ...current,
    ])
    notify(`${validFiles.length} template berhasil diunggah`)
    event.target.value = ''
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#17211d]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-[#dde5e0] bg-white transition-transform duration-300 lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-[#edf0ee] px-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#086b52] text-white shadow-sm"><Icon name="archive" size={21} /></div>
          <div className="min-w-0"><h1 className="text-[17px] font-bold tracking-[-.02em]">Jendela Arsip</h1><p className="whitespace-nowrap text-[9px] font-semibold tracking-[.1em] text-[#7a8881]">UNIVERSITAS AHMAD DAHLAN</p></div>
          <button className="ml-auto text-[#6c7973] lg:hidden" onClick={() => setMobileMenu(false)}><Icon name="close" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#9aa49f]">Ruang kerja</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setActiveNav(item.label); setMobileMenu(false) }}
                className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition ${activeNav === item.label ? 'bg-[#e9f3ef] text-[#086b52] shadow-[inset_3px_0_0_#086b52]' : 'text-[#5e6c65] hover:bg-[#f4f6f5]'}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center"><Icon name={item.icon} size={18} /></span>
                <span className="min-w-0 flex-1 whitespace-nowrap text-left">{item.label}</span>
                {(item.label === 'Draf Surat' ? drafts.length : item.count) ? <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-[#d8ebe3] px-1.5 text-[9px] font-extrabold text-[#086b52]">{item.label === 'Draf Surat' ? drafts.length : item.count}</span> : null}
              </button>
            ))}
          </div>
        </nav>
        <div className="m-3 rounded-xl border border-[#e3e9e5] bg-[#f8faf9] p-3">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#d7a14a] text-xs font-bold text-white">AS</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Aulia Sari</p><p className="truncate text-[10px] text-[#829089]">Administrator Unit</p></div><Icon name="chevron" size={15} className="text-[#94a098]" /></div>
        </div>
      </aside>

      {mobileMenu && <button aria-label="Tutup menu" className="fixed inset-0 z-30 bg-black/25 lg:hidden" onClick={() => setMobileMenu(false)} />}

      <main className="min-h-screen lg:pl-[280px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center gap-4 border-b border-[#e3e8e5] bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <button className="text-[#536159] lg:hidden" onClick={() => setMobileMenu(true)}><Icon name="menu" /></button>
          <div className="ml-auto flex items-center gap-2"><button onClick={() => setModal('outgoing')} className="hidden h-10 items-center gap-2 rounded-lg bg-[#086b52] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#075b46] sm:flex"><Icon name="upload" size={17} />Upload Surat</button></div>
        </header>

        {activeNav === 'Beranda' && <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-[.13em] text-[#0c765b]">Rabu, 18 Juni 2025</p><h2 className="text-2xl font-bold tracking-[-.035em] sm:text-[28px]">Selamat datang, Aulia</h2><p className="mt-1 text-sm text-[#748179]">Pantau seluruh aktivitas persuratan unit Anda hari ini.</p></div>
            <button onClick={() => notify('Laporan bulanan sedang disiapkan')} className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d9e1dc] bg-white px-4 text-xs font-semibold text-[#45534c] shadow-sm hover:bg-[#fafcfb]"><Icon name="download" size={16} />Unduh Laporan Bulanan</button>
          </section>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {[
              { title: 'Surat Masuk', value: '128', note: '+12 bulan ini', icon: 'inbox', tone: 'green' },
              { title: 'Surat Keluar', value: '96', note: '+8 bulan ini', icon: 'send', tone: 'blue' },
              { title: 'Menunggu Persetujuan', value: '07', note: '2 prioritas tinggi', icon: 'clock', tone: 'amber' },
              { title: 'Total Arsip', value: '1.284', note: 'Tersimpan aman', icon: 'archive', tone: 'slate' },
            ].map((stat) => <div key={stat.title} className="rounded-xl border border-[#e1e7e3] bg-white p-4 shadow-[0_2px_8px_rgba(25,45,35,.025)] sm:p-5"><div className="flex items-start justify-between gap-2"><div><p className="text-[11px] font-semibold text-[#78857e] sm:text-xs">{stat.title}</p><p className="mt-2 text-2xl font-bold tracking-[-.04em] sm:text-[28px]">{stat.value}</p></div><div className={`grid h-9 w-9 place-items-center rounded-lg stat-${stat.tone}`}><Icon name={stat.icon} size={18} /></div></div><p className={`mt-3 text-[10px] font-medium sm:text-[11px] ${stat.tone === 'amber' ? 'text-[#bd7127]' : stat.tone === 'green' ? 'text-[#168162]' : 'text-[#829088]'}`}>{stat.note}</p></div>)}
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_330px]">
            <div className="min-w-0 rounded-xl border border-[#e0e6e2] bg-white shadow-[0_2px_10px_rgba(23,42,33,.025)]">
              <div className="flex flex-col gap-4 border-b border-[#edf0ee] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="text-[15px] font-bold">Aktivitas Persuratan Terbaru</h3><p className="mt-1 text-[11px] text-[#859189]">Diperbarui secara real-time</p></div>
                <div className="flex gap-1 rounded-lg bg-[#f3f6f4] p-1">{['Semua', 'Masuk', 'Keluar'].map((filter) => <button key={filter} onClick={() => setTypeFilter(filter)} className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${typeFilter === filter ? 'bg-white text-[#086b52] shadow-sm' : 'text-[#7b8880]'}`}>{filter}</button>)}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead><tr className="border-b border-[#edf0ee] bg-[#fafbfa] text-[10px] font-bold uppercase tracking-[.08em] text-[#8a958f]"><th className="px-5 py-3.5">Nomor Agenda</th><th className="px-4 py-3.5">Perihal & Pengirim</th><th className="px-4 py-3.5">Tanggal</th><th className="px-4 py-3.5">Kategori</th><th className="px-4 py-3.5" /></tr></thead>
                  <tbody>
                    {filteredLetters.map((letter) => <tr key={letter.id} className="group border-b border-[#f0f2f1] text-xs transition last:border-0 hover:bg-[#fafcfb]"><td className="px-5 py-4 font-semibold text-[#3a4a42]">{letter.agenda}</td><td className="max-w-[280px] px-4 py-4"><button onClick={() => setSelectedLetter(letter)} className="block max-w-full text-left"><p className="truncate font-semibold text-[#26332d] transition hover:text-[#086b52]">{letter.subject}</p><p className="mt-1 text-[10px] text-[#8a958f]">{letter.type === 'Masuk' ? 'Dari' : 'Oleh'}: {letter.sender}</p></button></td><td className="px-4 py-4 text-[#66736c]">{letter.date}</td><td className="px-4 py-4"><span className="rounded-md bg-[#f0f3f1] px-2 py-1 text-[10px] font-semibold text-[#66736c]">{letter.category}</span></td><td className="px-4 py-4"><button aria-label={`Buka ${letter.subject}`} title="Buka surat" onClick={() => setSelectedLetter(letter)} className="grid h-7 w-7 place-items-center rounded-md text-[#87938c] hover:bg-[#eaf2ee] hover:text-[#086b52]"><Icon name="chevron" size={15} /></button></td></tr>)}
                    {filteredLetters.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-[#87938c]">Arsip tidak ditemukan. Coba gunakan kata kunci lain.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-[#edf0ee] px-5 py-4 text-[11px] text-[#7d8982]"><span>Menampilkan {filteredLetters.length} dari {letters.length} aktivitas</span><button onClick={() => setActiveNav('Surat Masuk')} className="flex items-center gap-1 font-bold text-[#086b52]">Lihat Semua Arsip <Icon name="chevron" size={13} /></button></div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-[#e0e6e2] bg-white p-5 shadow-[0_2px_10px_rgba(23,42,33,.025)]"><h3 className="text-[15px] font-bold">Aksi Cepat</h3><p className="mt-1 text-[11px] text-[#859189]">Selesaikan pekerjaan lebih cepat</p><div className="mt-4 space-y-2.5">
                <button onClick={() => setModal('incoming')} className="group flex w-full items-center gap-3 rounded-lg border border-[#e1e7e3] p-3 text-left transition hover:border-[#afd1c4] hover:bg-[#f5faf8]"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#e6f3ee] text-[#087058]"><Icon name="upload" size={18} /></div><div className="flex-1"><p className="text-xs font-bold">Arsipkan Surat Masuk</p><p className="mt-0.5 text-[10px] text-[#87938d]">Unggah dan catat dokumen</p></div><Icon name="chevron" size={15} className="text-[#9ba59f] group-hover:text-[#087058]" /></button>
                <button onClick={() => setModal('outgoing')} className="group flex w-full items-center gap-3 rounded-lg border border-[#e1e7e3] p-3 text-left transition hover:border-[#d8c28e] hover:bg-[#fffaf0]"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff3d9] text-[#ad7417]"><Icon name="upload" size={18} /></div><div className="flex-1"><p className="text-xs font-bold">Upload Surat</p><p className="mt-0.5 text-[10px] text-[#87938d]">Unggah surat yang sudah dibuat</p></div><Icon name="chevron" size={15} className="text-[#9ba59f] group-hover:text-[#ad7417]" /></button>
              </div></div>
            </aside>
          </section>
        </div>}

        {(activeNav === 'Surat Masuk' || activeNav === 'Surat Keluar') && (() => {
          const pageType = activeNav === 'Surat Masuk' ? 'Masuk' : 'Keluar'
          const pageLetters = letters.filter((letter) => letter.type === pageType)
          const isIncoming = pageType === 'Masuk'
          return <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
            <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[.13em] text-[#0c765b]">Ruang Kerja / {activeNav}</p>
                <h2 className="text-2xl font-bold tracking-[-.035em] sm:text-[28px]">{activeNav}</h2>
                <p className="mt-1 text-sm text-[#748179]">{isIncoming ? 'Kelola, tindak lanjuti, dan arsipkan seluruh surat yang diterima unit.' : 'Pantau surat yang telah dibuat dan dikirim oleh unit Anda.'}</p>
              </div>
              <button onClick={() => setModal(isIncoming ? 'incoming' : 'outgoing')} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#086b52] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#075b46]"><Icon name="upload" size={16} />{isIncoming ? 'Arsipkan Surat Masuk' : 'Upload Surat Keluar'}</button>
            </section>

            <section className="mb-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: `Total Surat ${pageType}`, value: isIncoming ? '128' : '96', note: 'Tahun 2025', icon: isIncoming ? 'inbox' : 'send', tone: 'green' },
                { label: 'Bulan Ini', value: isIncoming ? '12' : '08', note: isIncoming ? '3 surat minggu ini' : '2 surat minggu ini', icon: 'file', tone: 'blue' },
                { label: isIncoming ? 'Sudah Ditindaklanjuti' : 'Sudah Dikirim', value: isIncoming ? '121' : '91', note: isIncoming ? '94,5% terselesaikan' : '94,8% terkirim', icon: 'check', tone: 'slate' },
              ].map((stat) => <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-[#e1e7e3] bg-white p-5 shadow-[0_2px_8px_rgba(25,45,35,.025)]"><div className={`grid h-11 w-11 place-items-center rounded-xl stat-${stat.tone}`}><Icon name={stat.icon} size={20} /></div><div><p className="text-[11px] font-semibold text-[#7a8780]">{stat.label}</p><div className="mt-1 flex items-baseline gap-2"><strong className="text-2xl tracking-[-.04em]">{stat.value}</strong><span className="text-[10px] text-[#8a958f]">{stat.note}</span></div></div></div>)}
            </section>

            <section className="overflow-hidden rounded-xl border border-[#e0e6e2] bg-white shadow-[0_2px_10px_rgba(23,42,33,.025)]">
              <div className="flex flex-col gap-3 border-b border-[#edf0ee] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-[15px] font-bold">Daftar {activeNav}</h3><p className="mt-1 text-[11px] text-[#859189]">{pageLetters.length} surat tersedia</p></div><select className="h-9 rounded-lg border border-[#dfe5e1] bg-white px-3 text-[11px] font-semibold text-[#607068] outline-none"><option>Semua kategori</option><option>Undangan</option><option>Surat Tugas</option><option>Permohonan</option><option>Keterangan</option></select></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead><tr className="border-b border-[#edf0ee] bg-[#fafbfa] text-[10px] font-bold uppercase tracking-[.08em] text-[#8a958f]"><th className="px-5 py-3.5">Nomor Agenda</th><th className="px-4 py-3.5">Perihal & {isIncoming ? 'Pengirim' : 'Unit'}</th><th className="px-4 py-3.5">Tanggal</th><th className="px-4 py-3.5">Kategori</th><th className="px-4 py-3.5">Dokumen</th></tr></thead>
                  <tbody>
                    {pageLetters.map((letter) => <tr key={letter.id} className="border-b border-[#f0f2f1] text-xs transition last:border-0 hover:bg-[#fafcfb]"><td className="px-5 py-4 font-semibold text-[#3a4a42]">{letter.agenda}</td><td className="max-w-[300px] px-4 py-4"><button onClick={() => setSelectedLetter(letter)} className="block max-w-full text-left"><p className="truncate font-semibold text-[#26332d] hover:text-[#086b52]">{letter.subject}</p><p className="mt-1 text-[10px] text-[#8a958f]">{letter.sender}</p></button></td><td className="px-4 py-4 text-[#66736c]">{letter.date}</td><td className="px-4 py-4"><span className="rounded-md bg-[#f0f3f1] px-2 py-1 text-[10px] font-semibold text-[#66736c]">{letter.category}</span></td><td className="px-4 py-4"><button onClick={() => setSelectedLetter(letter)} className="flex items-center gap-1.5 rounded-md border border-[#dce4df] px-2.5 py-1.5 text-[10px] font-bold text-[#087058] hover:bg-[#edf6f2]"><Icon name="file" size={13} />Buka</button></td></tr>)}
                    {pageLetters.length === 0 && <tr><td colSpan={5} className="px-5 py-14 text-center text-sm text-[#87938c]">Belum ada surat yang sesuai dengan pencarian.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-[#edf0ee] px-5 py-4 text-[11px] text-[#7d8982]"><span>Halaman 1 dari 1</span><span>Menampilkan {pageLetters.length} dokumen</span></div>
            </section>
          </div>
        })()}

        {activeNav === 'Draf Surat' && <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-[.13em] text-[#0c765b]">Ruang Kerja / Dokumen</p><h2 className="text-2xl font-bold tracking-[-.035em] sm:text-[28px]">Draf Surat</h2><p className="mt-1 text-sm text-[#748179]">Lihat dan periksa surat yang sudah diunggah tetapi belum dikirim.</p></div>
            <button onClick={() => setModal('outgoing')} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#086b52] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#075b46]"><Icon name="upload" size={16} />Upload Surat</button>
          </section>

          <section className="mb-5 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-[#e1e7e3] bg-white p-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff2dc] text-[#ad7121]"><Icon name="file" size={20} /></div><div><p className="text-[11px] font-semibold text-[#7a8780]">Total Draf Tersimpan</p><strong className="mt-1 block text-2xl tracking-[-.04em]">{drafts.length}</strong></div></div>
            <div className="flex items-center gap-4 rounded-xl border border-[#e1e7e3] bg-white p-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e7f4ef] text-[#087058]"><Icon name="clock" size={20} /></div><div><p className="text-[11px] font-semibold text-[#7a8780]">Terakhir Diperbarui</p><strong className="mt-1 block text-sm">Hari ini, 10.24 WIB</strong></div></div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#e0e6e2] bg-white shadow-[0_2px_10px_rgba(23,42,33,.025)]">
            <div className="border-b border-[#edf0ee] p-5"><h3 className="text-[15px] font-bold">Daftar Draf</h3><p className="mt-1 text-[11px] text-[#859189]">Dokumen disimpan otomatis dan dapat dibuka sebelum dikirim</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead><tr className="border-b border-[#edf0ee] bg-[#fafbfa] text-[10px] font-bold uppercase tracking-[.08em] text-[#8a958f]"><th className="px-5 py-3.5">Nomor Draf</th><th className="px-4 py-3.5">Perihal & Unit</th><th className="px-4 py-3.5">Terakhir Diubah</th><th className="px-4 py-3.5">Kategori</th><th className="px-4 py-3.5 text-right">Aksi</th></tr></thead>
                <tbody>
                  {drafts.map((draft) => <tr key={draft.id} className="border-b border-[#f0f2f1] text-xs transition last:border-0 hover:bg-[#fafcfb]"><td className="px-5 py-4 font-semibold text-[#3a4a42]">{draft.agenda}</td><td className="max-w-[320px] px-4 py-4"><button onClick={() => setSelectedLetter(draft)} className="block max-w-full text-left"><p className="truncate font-semibold text-[#26332d] hover:text-[#086b52]">{draft.subject}</p><p className="mt-1 text-[10px] text-[#8a958f]">{draft.sender}</p></button></td><td className="px-4 py-4 text-[#66736c]">{draft.date}</td><td className="px-4 py-4"><span className="rounded-md bg-[#f0f3f1] px-2 py-1 text-[10px] font-semibold text-[#66736c]">{draft.category}</span></td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button onClick={() => setSelectedLetter(draft)} className="h-8 rounded-lg border border-[#dce3df] px-3 text-[10px] font-bold text-[#59675f] hover:bg-[#f5f7f6]">Buka Draf</button><button onClick={() => { const sentLetter: Letter = { ...draft, agenda: `04${letters.length + 1}/SK/VI/2025`, type: 'Keluar', status: 'Selesai', date: 'Hari ini' }; setLetters((current) => [sentLetter, ...current]); setDrafts((current) => current.filter((item) => item.id !== draft.id)); notify(`${draft.subject} berhasil dikirim`) }} className="flex h-8 items-center gap-1.5 rounded-lg bg-[#086b52] px-3 text-[10px] font-bold text-white hover:bg-[#075b46]"><Icon name="send" size={13} />Kirim Surat</button></div></td></tr>)}
                  {drafts.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf3f0] text-[#718078]"><Icon name="file" size={22} /></div><p className="mt-3 text-sm font-bold">Belum ada draf surat</p><p className="mt-1 text-xs text-[#87938c]">Upload surat yang sudah dibuat untuk menyimpannya sebagai draf.</p></td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>}

        {activeNav === 'Menunggu Persetujuan' && (() => {
          const approvalLetters = letters.filter((letter) => letter.status !== 'Selesai')
          return <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
            <section className="mb-7"><p className="mb-1 text-xs font-semibold uppercase tracking-[.13em] text-[#b36e22]">Ruang Kerja / Persetujuan</p><h2 className="text-2xl font-bold tracking-[-.035em] sm:text-[28px]">Menunggu Persetujuan</h2><p className="mt-1 text-sm text-[#748179]">Periksa dokumen yang memerlukan keputusan atau tindak lanjut Anda.</p></section>
            <div>
              <section className="overflow-hidden rounded-xl border border-[#e0e6e2] bg-white">
                <div className="border-b border-[#edf0ee] p-5"><h3 className="text-[15px] font-bold">Antrean Persetujuan</h3><p className="mt-1 text-[11px] text-[#859189]">{approvalLetters.length} dokumen perlu diperiksa</p></div>
                <div className="divide-y divide-[#edf0ee]">
                  {approvalLetters.map((letter, index) => <article key={letter.id} className="p-5 transition hover:bg-[#fbfcfb]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${index === 0 ? 'bg-[#fff0ec] text-[#bd5b4d]' : 'bg-[#fff5df] text-[#ae7423]'}`}><Icon name="file" size={20} /></div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{letter.subject}</p><p className="mt-1 text-[10px] text-[#859189]">{letter.agenda} · {letter.sender} · Diajukan {index + 1} jam lalu</p></div>
                      <div className="flex shrink-0 gap-2"><button onClick={() => setSelectedLetter(letter)} className="h-9 rounded-lg border border-[#dae2dd] px-3 text-[10px] font-bold text-[#526159] hover:bg-[#f5f7f6]">Periksa</button><button onClick={() => { setLetters((current) => current.map((item) => item.id === letter.id ? { ...item, status: 'Selesai' } : item)); notify(`${letter.agenda} berhasil disetujui`) }} className="flex h-9 items-center gap-1.5 rounded-lg bg-[#086b52] px-3 text-[10px] font-bold text-white hover:bg-[#075b46]"><Icon name="check" size={14} />Setujui</button></div>
                    </div>
                  </article>)}
                  {approvalLetters.length === 0 && <div className="px-5 py-16 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f4ef] text-[#087058]"><Icon name="check" size={22} /></div><p className="mt-3 text-sm font-bold">Semua dokumen sudah diperiksa</p><p className="mt-1 text-xs text-[#87938c]">Tidak ada surat yang menunggu persetujuan.</p></div>}
                </div>
              </section>
            </div>
          </div>
        })()}

        {activeNav === 'Template Surat' && <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[.13em] text-[#0c765b]">Ruang Kerja / Dokumen</p><h2 className="text-2xl font-bold tracking-[-.035em] sm:text-[28px]">Template Surat Instansi</h2><p className="mt-1 text-sm text-[#748179]">Unggah format surat resmi milik instansi Anda untuk digunakan saat membuat draf.</p></div><label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#086b52] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#075b46]"><Icon name="upload" size={16} />Upload Template<input type="file" multiple accept=".doc,.docx,.odt,.pdf" onChange={uploadTemplate} className="hidden" /></label></section>

          <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <label className="group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbd8d1] bg-white px-6 py-10 text-center transition hover:border-[#60a38e] hover:bg-[#f8fcfa]">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f4ef] text-[#087058] transition group-hover:scale-105"><Icon name="upload" size={24} /></div>
              <h3 className="mt-4 text-sm font-bold">Pilih file template instansi</h3>
              <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-[#7b8881]">Klik area ini untuk memilih satu atau beberapa template dari perangkat Anda.</p>
              <span className="mt-4 rounded-lg border border-[#dce5e0] bg-[#f7f9f8] px-3 py-2 text-[10px] font-bold text-[#5d6b64]">DOC, DOCX, ODT, atau PDF</span>
              <input type="file" multiple accept=".doc,.docx,.odt,.pdf" onChange={uploadTemplate} className="hidden" />
            </label>
            <aside className="rounded-xl border border-[#e0e6e2] bg-white p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff2dc] text-[#ad7121]"><Icon name="file" size={19} /></div>
              <h3 className="mt-4 text-sm font-bold">Ketentuan Template</h3>
              <ul className="mt-4 space-y-3 text-[11px] leading-relaxed text-[#718078]">
                <li className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-[#087058]" />Gunakan kop surat resmi instansi.</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-[#087058]" />Ukuran maksimal setiap file adalah 10 MB.</li>
                <li className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-[#087058]" />Pastikan format dan tata letak sudah final.</li>
              </ul>
            </aside>
          </section>

          <section className="mt-6 overflow-hidden rounded-xl border border-[#e0e6e2] bg-white">
            <div className="flex items-center justify-between border-b border-[#edf0ee] p-5"><div><h3 className="text-[15px] font-bold">Template Terunggah</h3><p className="mt-1 text-[11px] text-[#859189]">Template khusus yang tersedia untuk instansi Anda</p></div><span className="text-xs font-bold text-[#086b52]">{uploadedTemplates.length} file</span></div>
            {uploadedTemplates.length > 0 ? <div className="divide-y divide-[#edf0ee]">{uploadedTemplates.map((template) => <article key={template.id} className="flex flex-col gap-4 p-5 transition hover:bg-[#fbfcfb] sm:flex-row sm:items-center"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf1ee] text-[#49675c]"><Icon name="file" size={20} /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{template.name}</p><p className="mt-1 text-[10px] text-[#8a958f]">{template.size} · Diunggah {template.uploadedAt}</p></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => notify(`${template.name} siap diunduh`)} className="flex h-9 items-center gap-1.5 rounded-lg bg-[#086b52] px-4 text-[10px] font-bold text-white hover:bg-[#075b46]"><Icon name="download" size={13} />Unduh Template</button><button aria-label={`Hapus ${template.name}`} onClick={() => setUploadedTemplates((current) => current.filter((item) => item.id !== template.id))} className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce3df] text-[#7b8881] hover:border-[#d2a6a0] hover:bg-[#fff6f5] hover:text-[#b45145]"><Icon name="close" size={15} /></button></div></article>)}</div> : <div className="px-5 py-12 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#f0f4f2] text-[#7d8b84]"><Icon name="file" size={20} /></div><p className="mt-3 text-xs font-bold">Belum ada template yang diunggah</p><p className="mt-1 text-[11px] text-[#8a958f]">Template yang Anda upload akan tampil di sini.</p></div>}
          </section>
        </div>}
      </main>

      {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-[#12231c]/45 p-4 backdrop-blur-[2px]"><div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e7ece9] p-5"><div><h3 className="text-lg font-bold">{modal === 'incoming' ? 'Arsipkan Surat Masuk' : 'Upload Surat'}</h3><p className="mt-1 text-xs text-[#7b8881]">{modal === 'incoming' ? 'Nomor agenda dibuat otomatis oleh sistem.' : 'Unggah surat yang sudah dibuat untuk disimpan sebagai draf.'}</p></div><button onClick={() => setModal(null)} className="grid h-8 w-8 place-items-center rounded-lg text-[#75827b] hover:bg-[#f1f4f2]"><Icon name="close" size={18} /></button></div>
        <form onSubmit={submitLetter} className="space-y-4 p-5">
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#46544d]">Perihal surat</span><input required name="subject" className="form-input" placeholder="Contoh: Undangan rapat koordinasi" /></label>
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#46544d]">{modal === 'incoming' ? 'Instansi / pengirim' : 'Unit pembuat surat'}</span><input required name="sender" className="form-input" placeholder={modal === 'incoming' ? 'Nama instansi pengirim' : 'Program Studi / Fakultas'} /></label>
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#46544d]">Kategori surat</span><select name="category" className="form-input"><option>Undangan</option><option>Surat Tugas</option><option>Permohonan</option><option>Keterangan</option><option>Lainnya</option></select></label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#bdcac3] bg-[#f9fbfa] py-5 text-xs font-semibold text-[#637168] hover:border-[#0c765b] hover:text-[#0c765b]"><Icon name="upload" size={18} />{modal === 'incoming' ? 'Pilih berkas PDF' : 'Pilih berkas surat'}<input required type="file" accept={modal === 'incoming' ? '.pdf' : '.doc,.docx,.odt,.pdf'} className="hidden" /></label>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setModal(null)} className="h-10 rounded-lg border border-[#dce3df] px-4 text-xs font-bold text-[#59675f]">Batal</button><button type="submit" className="flex h-10 items-center gap-2 rounded-lg bg-[#086b52] px-4 text-xs font-bold text-white hover:bg-[#075b46]"><Icon name="upload" size={16} />{modal === 'incoming' ? 'Simpan Arsip' : 'Upload ke Draf'}</button></div>
        </form>
      </div></div>}

      {selectedLetter && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#12231c]/50 p-4 backdrop-blur-[2px]">
        <div className="my-5 w-full max-w-3xl overflow-hidden rounded-2xl bg-[#eef1ef] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#dce3df] bg-white px-5 py-4">
            <div className="min-w-0">
              <span className="inline-flex rounded-md bg-[#e6f3ee] px-2 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#087058]">Surat {selectedLetter.type}</span>
              <p className="mt-2 truncate text-sm font-bold text-[#27352e]">{selectedLetter.subject}</p>
              <p className="mt-0.5 text-[10px] text-[#7f8c85]">{selectedLetter.agenda} · {selectedLetter.date}</p>
            </div>
            <button aria-label="Tutup surat" onClick={() => setSelectedLetter(null)} className="ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#75827b] hover:bg-[#f1f4f2]"><Icon name="close" size={19} /></button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-7">
            <article className="mx-auto min-h-[760px] max-w-[620px] bg-white px-8 py-9 text-[#202823] shadow-[0_3px_14px_rgba(28,48,38,.09)] sm:px-14 sm:py-11">
              <header className="flex items-center gap-4 border-b-2 border-[#1c2c25] pb-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#086b52] text-white"><Icon name="archive" size={27} /></div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[.14em]">Universitas Ahmad Dahlan</p>
                  <h3 className="mt-1 text-lg font-extrabold uppercase tracking-[.04em]">Unit Administrasi Akademik</h3>
                  <p className="mt-1 text-[8px] leading-relaxed text-[#5e6863]">Jl. Kapas No. 9, Semaki, Yogyakarta 55166 · Telp. (0274) 563515</p>
                </div>
              </header>

              <div className="mt-7 grid grid-cols-[72px_8px_1fr] gap-y-1 text-[11px] leading-relaxed">
                <span>Nomor</span><span>:</span><span>{selectedLetter.agenda}</span>
                <span>Lampiran</span><span>:</span><span>1 (satu) berkas</span>
                <span>Perihal</span><span>:</span><span className="font-bold">{selectedLetter.subject}</span>
              </div>

              <div className="mt-7 text-[11px] leading-6">
                <p>Yth. Bapak/Ibu Pimpinan</p>
                <p>{selectedLetter.sender}</p>
                <p>di tempat</p>

                <p className="mt-6">Assalamu&apos;alaikum warahmatullahi wabarakatuh,</p>
                <p className="mt-4 text-justify indent-8">Dengan hormat, sehubungan dengan pelaksanaan kegiatan administrasi dan akademik di lingkungan Universitas Ahmad Dahlan, kami menyampaikan surat mengenai <strong>{selectedLetter.subject.toLowerCase()}</strong>.</p>
                <p className="mt-3 text-justify indent-8">Kami mengharapkan dukungan dan tindak lanjut Bapak/Ibu agar kegiatan tersebut dapat terlaksana dengan tertib dan sesuai jadwal yang telah ditentukan. Informasi teknis lebih lanjut dapat dikoordinasikan melalui Unit Administrasi Akademik.</p>
                <p className="mt-3 text-justify indent-8">Demikian surat ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami mengucapkan terima kasih.</p>
                <p className="mt-4">Wassalamu&apos;alaikum warahmatullahi wabarakatuh.</p>
              </div>

              <div className="ml-auto mt-10 w-48 text-[11px] leading-relaxed">
                <p>Yogyakarta, 18 Juni 2025</p>
                <p className="font-semibold">Kepala Unit Administrasi,</p>
                <div className="h-16" />
                <p className="font-bold underline">Dr. Ahmad Santoso, M.Pd.</p>
                <p className="text-[9px]">NIY. 60123456</p>
              </div>

              <div className="mt-12 border-t border-[#bfc8c3] pt-3 text-[8px] text-[#6f7a74]">
                <p className="font-bold">Tembusan:</p>
                <p>1. Pimpinan Unit terkait</p>
                <p>2. Arsip</p>
              </div>
            </article>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#dce3df] bg-white px-5 py-3">
            <button onClick={() => setSelectedLetter(null)} className="h-9 rounded-lg border border-[#dce3df] px-4 text-xs font-bold text-[#59675f]">Tutup</button>
            <button onClick={() => notify('Dokumen dummy siap diunduh')} className="flex h-9 items-center gap-2 rounded-lg bg-[#086b52] px-4 text-xs font-bold text-white hover:bg-[#075b46]"><Icon name="download" size={15} />Unduh PDF</button>
          </div>
        </div>
      </div>}

      {toast && <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-xl bg-[#183d32] px-4 py-3 text-xs font-semibold text-white shadow-xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#52a98b]"><Icon name="check" size={14} /></span>{toast}</div>}
    </div>
  )
}
