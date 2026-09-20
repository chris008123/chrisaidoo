import { useState, useEffect, useRef } from 'react'

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────
// Pulled from environment variables at build time (Vite requires the
// VITE_ prefix to expose vars to client code).
//
// 1. Sign up at https://emailjs.com
// 2. Add an Email Service (Gmail) → copy the Service ID
// 3. Create an Email Template → copy the Template ID
// 4. Go to Account → API Keys → copy your Public Key
// 5. Create a `.env` file at your project root (see .env.example) with:
//      VITE_EMAILJS_SERVICE_ID=your_service_id
//      VITE_EMAILJS_TEMPLATE_ID=your_template_id
//      VITE_EMAILJS_PUBLIC_KEY=your_public_key
// 6. Restart `npm run dev` after creating/editing .env — Vite only
//    reads env files on startup, not on hot reload.
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

if (import.meta.env.DEV && (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY)) {
  // eslint-disable-next-line no-console
  console.warn(
    '[EmailJS] One or more VITE_EMAILJS_* env vars are missing. ' +
    'The contact form will fail to send until .env is set up — see .env.example.'
  )
}
// ─────────────────────────────────────────────────────────────────────

// ─── DATA ────────────────────────────────────────────────────────────

const TECH_TREE = {
  backend: {
    label: 'backend',
    items: ['Python', 'FastAPI', 'REST APIs', 'SQLAlchemy', 'Node.js', 'Linux'],
  },
  databases: {
    label: 'databases',
    items: ['PostgreSQL', 'Supabase', 'MongoDB', 'SQLite', 'SQL'],
  },
  frontend: {
    label: 'frontend',
    items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'Tailwind CSS'],
  },
  'ai-ml': {
    label: 'ai/ml',
    items: ['OpenCV', 'MediaPipe', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
  },
  devops: {
    label: 'devops',
    items: ['Docker', 'Git', 'GitHub', 'Vercel', 'Netlify'],
  },
  'ai-tools': {
    label: 'ai-coding-tools',
    items: ['Claude Code', 'GitHub Copilot', 'Cursor'],
  },
}

const PROCESSES = [
  { pid: '001', name: 'backend',      cpu: 88, mem: 74, threads: 10, status: 'ACTIVE'   },
  { pid: '002', name: 'databases',    cpu: 82, mem: 68, threads: 6,  status: 'ACTIVE'   },
  { pid: '003', name: 'frontend',     cpu: 76, mem: 60, threads: 8,  status: 'ACTIVE'   },
  { pid: '004', name: 'ai/ml',        cpu: 65, mem: 85, threads: 16, status: 'BUILDING' },
  { pid: '005', name: 'devops',       cpu: 70, mem: 52, threads: 5,  status: 'ACTIVE'   },
  { pid: '006', name: 'ai-tools',     cpu: 90, mem: 45, threads: 3,  status: 'ACTIVE'   },
]

const GIT_LOG = [
  {
    year: '2025',
    milestone: 'Co-Founded SL',
    techs: ['FastAPI', 'React', 'Groq API', 'Netlify Functions', 'EmailJS', 'Docker'],
    hash: 'a3f9b1c',
  },
  {
    year: '2025',
    milestone: 'AI & Computer Vision Systems',
    techs: ['OpenCV', 'MediaPipe', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
    hash: '7d2e04a',
  },
  {
    year: '2025',
    milestone: 'Production Backend Engineering',
    techs: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Docker', 'REST APIs'],
    hash: 'f1c83b2',
  },
  {
    year: '2024',
    milestone: 'Full-Stack Web & Mobile',
    techs: ['React', 'React Native', 'TypeScript', 'Supabase', 'Expo', 'Vercel'],
    hash: '9e5a71d',
  },
  {
    year: '2023',
    milestone: 'Frontend & JavaScript Ecosystem',
    techs: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'],
    hash: '3b8f02e',
  },
  {
    year: '2022',
    milestone: 'Python & Programming Foundations',
    techs: ['Python', 'C++', 'SQL', 'Algorithms', 'Data Structures'],
    hash: '1a4c67f',
  },
]

const PROJECTS = [
  {
    name: 'Discord Code Quality Bot',
    desc: 'Production-ready Discord bot that analyzes code submissions and generates weekly quality leaderboards using a transparent 0–100 scoring engine — AST validation, PEP8 style, complexity, security, and doc-coverage checks. Containerized with Docker.',
    stack: ['Python', 'Docker', 'Discord.py', 'pylint', 'radon', 'bandit', 'AST'],
    status: 'Deployed',
    category: 'Backend',
    github: 'https://github.com/chris008123/Bot.git',
    live: '#',
  },
  {
    name: 'DentAI',
    desc: 'Clinical decision support platform for dentists with a FastAPI backend, Supabase authentication, and a responsive React frontend built with Tailwind CSS.',
    stack: ['Python', 'FastAPI', 'React', 'Tailwind CSS', 'Supabase'],
    status: 'Deployed',
    category: 'AI',
    github: 'https://github.com/chris008123/DentAI.git',
    live: '#',
  },
  {
    name: 'TelloSign ASL Interpreter',
    desc: 'Real-time computer vision app that recognizes American Sign Language gestures via MediaPipe hand landmarks and SVM classification.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Scikit-learn'],
    status: 'Deployed',
    category: 'AI',
    github: 'https://github.com/chris008123/TELLOSIGN.git',
    live: '#',
  },
  {
    name: 'Virtual Mouse',
    desc: 'Hand gesture-controlled virtual mouse with real-time cursor movement and click gesture recognition using MediaPipe and OpenCV.',
    stack: ['Python', 'OpenCV', 'MediaPipe'],
    status: 'Deployed',
    category: 'AI',
    github: 'https://github.com/chris008123',
    live: '#',
  },
  {
    name: 'Tutorly',
    desc: 'Q&A developer learning platform with authentication and cloud-hosted database. Built with React and Supabase and deployed on Vercel.',
    stack: ['React', 'Supabase', 'Vercel'],
    status: 'Deployed',
    category: 'Web',
    github: 'https://github.com/chris008123/SL_Hub-Tutorly-.git',
    live: '#',
  },
  {
    name: 'SL Hub',
    desc: 'Cross-platform community app with authentication and cloud-hosted database built with React Native and Expo.',
    stack: ['React Native', 'Expo', 'Supabase'],
    status: 'Deployed',
    category: 'Mobile',
    github: 'https://github.com/chris008123',
    live: '#',
  },
]

const SERVICES = [
  { title: 'Backend Systems', desc: 'Production-grade Python/FastAPI backends with REST APIs, SQLAlchemy, and containerized deployments via Docker.', icon: '⬡' },
  { title: 'Database Engineering', desc: 'PostgreSQL, Supabase, MongoDB, and SQLite — schema design, migrations, and cloud-hosted setups.', icon: '⬡' },
  { title: 'Frontend Development', desc: 'Responsive web interfaces with React and TypeScript, styled with Tailwind CSS and deployed on Vercel.', icon: '⬡' },
  { title: 'Computer Vision & AI', desc: 'Real-time CV pipelines using OpenCV and MediaPipe; ML models with TensorFlow, PyTorch, and Scikit-learn.', icon: '⬡' },
  { title: 'Mobile Apps', desc: 'Cross-platform mobile apps with React Native and Expo, backed by Supabase for auth and data.', icon: '⬡' },
  { title: 'AI-Accelerated Development', desc: 'Fluent with Claude Code, GitHub Copilot, and Cursor — shipping faster without sacrificing quality.', icon: '⬡' },
]

const EXPERIENCE = [
  {
    org: 'SL',
    role: 'Co-Founder',
    period: 'August 2025 — Present',
    points: [
      'Designed scalable software architecture across multiple products spanning Python/FastAPI backends and React frontends.',
      'Built AI-powered internal tools using Groq API, Netlify Functions, and EmailJS — including the Skill Intake Platform and SkillMap.',
      'Owned end-to-end delivery from backend logic to deployment, collaborating on branding, strategy, and client-facing solutions.',
    ],
  },
  {
    org: 'Mfantsipim Computer & Robotics Club (MCRC)',
    role: 'General Secretary',
    period: '2023 — 2024',
    points: [
      'Coordinated club activities, meetings, and communications for 40+ members.',
      'Organised robotics and software development initiatives and inter-school competitions.',
    ],
  },
  {
    org: 'Independent Engineering',
    role: 'Software Engineer',
    period: '2022 — Present',
    points: [
      'Built and shipped 6+ production applications across backend systems, computer vision, web, and mobile.',
      'Worked fluently with AI coding assistants (Claude Code, GitHub Copilot, Cursor) to accelerate development velocity.',
    ],
  },
]

const REPOS = [
  { name: 'discord-code-bot',  stars: 14, lang: 'Python',      desc: 'Code quality bot with AST scoring engine' },
  { name: 'DentAI',            stars: 18, lang: 'Python',      desc: 'Clinical decision support for dentists' },
  { name: 'TelloSign',         stars: 11, lang: 'Python',      desc: 'Real-time ASL gesture recognition' },
  { name: 'virtual-mouse',     stars: 9,  lang: 'Python',      desc: 'Hand gesture-controlled virtual mouse' },
  { name: 'Tutorly',           stars: 12, lang: 'TypeScript',  desc: 'Q&A developer learning platform' },
  { name: 'SL-Hub',            stars: 6,  lang: 'TypeScript',  desc: 'Cross-platform community mobile app' },
]

// ─── UTILITIES ───────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Deployed: 'var(--color-success)',
    Active: 'var(--color-success)',
    Beta: 'var(--color-warning)',
    Development: 'var(--color-info)',
    Research: 'var(--color-text-muted)',
  }
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2"
      style={{ backgroundColor: colors[status] ?? 'var(--color-text-muted)' }}
    />
  )
}

// ─── NAVBAR ──────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

  return (
    <nav
      style={{
        backgroundColor: scrolled ? 'var(--color-background)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <a
          href="#hero"
          className="font-mono text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          chris@aidoo<span className="cursor-blink accent-text">_</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-text)' }}
            >
              {l}
            </a>
          ))}

          {/* Divider */}
          <span style={{ width: 1, height: 16, backgroundColor: 'var(--color-border)', display: 'inline-block' }} />

          {/* Social icons */}
          <a href="https://github.com/chris008123" target="_blank" rel="noopener noreferrer" title="GitHub"
            className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/chris-atta-aidoo-atta" target="_blank" rel="noopener noreferrer" title="LinkedIn"
            className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="mailto:aidoochris0081@gmail.com" title="Email"
            className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m2 7 10 7 10-7"/>
            </svg>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden font-mono text-xs"
          style={{ color: 'var(--color-text)' }}
          onClick={() => setOpen(o => !o)}
        >
          {open ? '[close]' : '[menu]'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
          }}
        >
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: 'var(--color-text)' }}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────

const SKILL_COLUMNS = [
  ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'SQLAlchemy', 'React', 'Supabase', 'OpenCV', 'TypeScript', 'MediaPipe', 'Node.js', 'Git'],
  ['React Native', 'Tailwind CSS', 'MongoDB', 'SQLite', 'Expo', 'Vercel', 'Linux', 'REST APIs', 'Netlify', 'JavaScript', 'Scikit-learn', 'GitHub'],
  ['TensorFlow', 'PyTorch', 'Claude Code', 'GitHub Copilot', 'Cursor', 'bandit', 'radon', 'pylint', 'AST', 'Discord.py', 'Groq API', 'SQL'],
]

function SkillsAnimation() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '340px' }}>
      {/* Fade masks top and bottom */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--color-background), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-background), transparent)' }}
      />

      <div className="flex gap-3 h-full">
        {SKILL_COLUMNS.map((col, ci) => (
          <div
            key={ci}
            className="flex flex-col gap-3 shrink-0"
            style={{
              animation: `scrollCol${ci % 2 === 0 ? 'Up' : 'Down'} ${18 + ci * 4}s linear infinite`,
            }}
          >
            {/* duplicate for seamless loop */}
            {[...col, ...col].map((skill, i) => (
              <div
                key={i}
                className="font-mono text-xs px-3 py-2 border rounded-sm whitespace-nowrap"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function TerminalPanel({ dark = false }: { dark?: boolean }) {
  const lines = [
    { prompt: true,  text: 'whoami' },
    { prompt: false, text: 'chris-atta-aidoo · software-engineer · accra-ghana' },
    { prompt: false, text: '' },
    { prompt: true,  text: 'cat stack.txt' },
    { prompt: false, text: 'React · Next.js · TypeScript' },
    { prompt: false, text: 'Python · FastAPI · Node.js' },
    { prompt: false, text: 'PostgreSQL · Supabase · MongoDB' },
    { prompt: false, text: '' },
    { prompt: true,  text: 'git status' },
    { prompt: false, text: '● On branch: main' },
    { prompt: false, text: '● Building · Learning · Shipping' },
  ]

  const [visible, setVisible] = useState(0)

  useEffect(() => {
    setVisible(0)
  }, [])

  useEffect(() => {
    if (visible >= lines.length) return
    const delay = lines[visible].prompt ? 500 : 100
    const t = setTimeout(() => setVisible(v => v + 1), delay)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <div>
      <div className="p-6 font-mono text-sm leading-7">
        {lines.slice(0, visible).map((line, i) => (
          <div key={i}>
            {line.prompt ? (
              <div className="flex items-center gap-2">
                <span style={{ color: dark ? '#6ee7b7' : 'var(--color-text-muted)' }}>$</span>
                <span style={{ color: dark ? '#f4f3ee' : 'var(--color-text)' }}>{line.text}</span>
              </div>
            ) : line.text === '' ? (
              <div className="h-2" />
            ) : (
              <div className="pl-4" style={{ color: line.text.startsWith('●') ? 'var(--color-success)' : dark ? '#a8a29e' : 'var(--color-text-muted)' }}>
                {line.text}
              </div>
            )}
          </div>
        ))}
        {visible < lines.length && <span className="cursor-blink" style={{ color: dark ? '#f4f3ee' : 'var(--color-text)' }}>▋</span>}
        {visible >= lines.length && (
          <div className="flex items-center gap-2 mt-2">
            <span style={{ color: dark ? '#6ee7b7' : 'var(--color-text-muted)' }}>$</span>
            <span className="cursor-blink" style={{ color: dark ? '#f4f3ee' : 'var(--color-text)' }}>▋</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Hero() {
  const [terminalOpen, setTerminalOpen] = useState(false)
  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setTerminalOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-14"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <style>{`
        @keyframes scrollColUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollColDown {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes terminalSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — name & intro */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Software Engineer · Accra, Ghana
            </p>
            <h1 className="font-semibold mb-6" style={{ color: 'var(--color-text)', lineHeight: 1.05 }}>
              <span className="block text-5xl md:text-6xl tracking-tight">Chris Atta</span>
              <span className="block text-5xl md:text-6xl tracking-tight">Aidoo</span>
            </h1>
            <p className="mb-8 max-w-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              3+ years building backend systems, computer vision apps, and
              full-stack products — end to end, from logic to deployment.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href="#projects"
                className="font-mono text-xs px-5 py-3 border transition-all"
                style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-background)', borderColor: 'var(--color-text)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; e.currentTarget.style.color = 'var(--color-text)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-background)' }}
              >
                view projects /
              </a>
              <a
                href="#contact"
                className="font-mono text-xs px-5 py-3 border transition-all"
                style={{ borderColor: 'var(--color-text)', color: 'var(--color-text)', backgroundColor: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-border-soft)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                contact /
              </a>
            </div>

            <div className="flex gap-6">
              {['GitHub', 'LinkedIn', 'Email'].map(s => (
                <a key={s} href="#" className="font-mono text-xs transition-opacity hover:opacity-50" style={{ color: 'var(--color-text-muted)' }}>
                  {s} →
                </a>
              ))}
            </div>
          </div>

          {/* Right — skills animation + terminal button */}
          <div className="flex flex-col gap-4">
            <SkillsAnimation />

            <button
              onClick={() => setTerminalOpen(true)}
              className="flex items-center gap-3 px-5 py-3 border font-mono text-xs transition-all self-start group"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              <span className="font-semibold">&gt;_</span>
              <span>open terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Floating terminal overlay ── */}
      {terminalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setTerminalOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              backgroundColor: 'rgba(49,49,49,0.35)',
              backdropFilter: 'blur(2px)',
              animation: 'backdropIn 0.25s ease both',
            }}
          />

          {/* Terminal window — centered, capped width */}
          <div
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 101,
              width: 'min(640px, 92vw)',
              boxShadow: '0 32px 80px rgba(49,49,49,0.22), 0 2px 8px rgba(49,49,49,0.12)',
              animation: 'terminalSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ backgroundColor: 'var(--color-charcoal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Traffic lights */}
              <button
                onClick={() => setTerminalOpen(false)}
                className="w-3 h-3 rounded-full flex items-center justify-center group"
                style={{ backgroundColor: 'var(--color-error)' }}
                title="Close"
              />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
              <span className="ml-auto font-mono text-xs" style={{ color: 'rgba(244,243,238,0.45)' }}>
                ~/chris — zsh
              </span>
            </div>

            {/* Terminal body — dark background for contrast */}
            <div
              style={{
                backgroundColor: '#1e1e1e',
                padding: '24px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: '1.9',
                color: '#d4d0c8',
                minHeight: '320px',
              }}
            >
              <TerminalPanel dark />
            </div>

            {/* Footer hint */}
            <div
              className="flex items-center justify-between px-4 py-2 font-mono text-xs"
              style={{ backgroundColor: '#1e1e1e', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}
            >
              <span>press esc or click outside to close</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>~/chris</span>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

// ─── ABOUT ───────────────────────────────────────────────────────────

function About() {
  return (
    <section
      id="about"
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--color-text-muted)' }}>
          $ cat about.txt
        </p>

        {/* Top row: photo + bio */}
        <div className="grid md:grid-cols-[360px_1fr] gap-12 items-start mb-12">
          {/* Profile photo */}
          <div className="flex flex-col gap-3">
            <div
              className="w-full aspect-square rounded-sm border overflow-hidden relative flex items-center justify-center"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border-soft)' }}
            >
              <img
                src="/photo.jpg"
                alt="Chris Atta Aidoo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Social icons under photo */}
            <div className="flex justify-center gap-4 mt-1">
              <a href="https://github.com/chris008123" target="_blank" rel="noopener noreferrer" title="GitHub"
                className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/in/chris-atta-aidoo-atta" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:aidoochris0081@gmail.com" title="Email"
                className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 7 10-7"/>
                </svg>
              </a>
              <a href="https://chrisaidoo.vercel.app" target="_blank" rel="noopener noreferrer" title="Portfolio"
                className="transition-opacity hover:opacity-50" style={{ color: 'var(--color-text)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-3xl font-semibold leading-snug mb-6" style={{ color: 'var(--color-text)' }}>
              Building software that solves real problems.
            </h2>

            <p className="mb-4" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              I'm Chris Atta Aidoo, a software engineer based in Accra, Ghana, with 3+ years of
              hands-on experience across backend engineering, full-stack web development,
              cross-platform mobile apps, and computer vision systems.
            </p>
            <p className="mb-4" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              On the backend I build production APIs with <strong style={{ color: 'var(--color-text)', fontWeight: 500 }}>Python and FastAPI</strong>,
              containerised with Docker and backed by PostgreSQL, Supabase, and MongoDB. On the
              frontend I build responsive interfaces with <strong style={{ color: 'var(--color-text)', fontWeight: 500 }}>React and TypeScript</strong>,
              and ship cross-platform mobile apps with <strong style={{ color: 'var(--color-text)', fontWeight: 500 }}>React Native and Expo</strong>.
            </p>
            <p className="mb-6" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              My AI/ML work spans real-time computer vision pipelines (OpenCV, MediaPipe),
              machine learning models (TensorFlow, PyTorch, Scikit-learn), and integrating
              LLM APIs like Groq into production tools. I work fluently with AI coding assistants —
              Claude Code, GitHub Copilot, Cursor — to accelerate delivery without sacrificing quality.
              Co-Founder of <strong style={{ color: 'var(--color-text)', fontWeight: 500 }}>SL</strong>, where
              I lead software architecture and end-to-end product delivery across multiple live products in Ghana.
            </p>

            <div className="flex gap-3 flex-wrap">
              <a
                href="#"
                className="font-mono text-xs px-4 py-2 border transition-all inline-block"
                style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-background)', borderColor: 'var(--color-text)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; e.currentTarget.style.color = 'var(--color-text)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-background)' }}
              >
                Download CV /
              </a>
              <a
                href="#projects"
                className="font-mono text-xs px-4 py-2 border transition-all inline-block"
                style={{ borderColor: 'var(--color-text)', color: 'var(--color-text)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-border-soft)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                View Projects /
              </a>
            </div>
          </div>
        </div>

        {/* ── What I do — domain cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
          {[
            { label: 'Backend Engineering', detail: 'Python · FastAPI · Docker · PostgreSQL · REST APIs' },
            { label: 'Web Development',     detail: 'React · TypeScript · Tailwind CSS · Supabase · Vercel' },
            { label: 'Mobile Apps',         detail: 'React Native · Expo · Cross-platform iOS & Android' },
            { label: 'AI / Computer Vision',detail: 'OpenCV · MediaPipe · TensorFlow · PyTorch · Scikit-learn' },
          ].map(({ label, detail }) => (
            <div
              key={label}
              className="border rounded-sm p-4"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <div className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>{label}</div>
              <div className="font-mono text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{detail}</div>
            </div>
          ))}
        </div>

        {/* ── Profile table + stats ── */}
        <div className="grid md:grid-cols-2 gap-6 mt-6 font-mono text-sm" style={{ color: 'var(--color-text)' }}>
          <div
            className="border p-6 rounded-sm"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div className="mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Profile</div>
            {[
              ['Name',     'Chris Atta Aidoo'],
              ['Role',     'Software Engineer'],
              ['Focus',    'Backend · Web · Mobile · AI'],
              ['Location', 'Accra, Ghana'],
              ['Email',    'aidoochris0081@gmail.com'],
              ['Status',   '● Available for opportunities'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2 border-b last:border-0" style={{ borderColor: 'var(--color-border-soft)' }}>
                <span className="w-24 shrink-0 text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                <span style={{ color: v.startsWith('●') ? 'var(--color-success)' : 'var(--color-text)', fontSize: '0.8rem' }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                ['3+', 'Years\nExperience'],
                ['6+', 'Projects\nShipped'],
                ['4',  'Domains\nMastered'],
              ].map(([n, l]) => (
                <div
                  key={n}
                  className="border p-4 text-center rounded-sm"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="text-2xl font-semibold">{n}</div>
                  <div className="text-xs mt-1 whitespace-pre-line" style={{ color: 'var(--color-text-muted)' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Currently working on */}
            <div
              className="border rounded-sm p-5 flex-1"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>Currently</div>
              {[
                { dot: 'var(--color-success)',  text: 'Building products at SL' },
                { dot: 'var(--color-info)',     text: 'Deepening AI/ML systems knowledge' },
                { dot: 'var(--color-warning)',  text: 'Open to freelance & collaboration' },
              ].map(({ dot, text }) => (
                <div key={text} className="flex items-center gap-3 py-1.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROCESS MONITOR ─────────────────────────────────────────────────

function MiniBar({ pct, color = 'var(--color-text)', width = 10 }: { pct: number; color?: string; width?: number }) {
  const filled = Math.round((pct / 100) * width)
  const empty = width - filled
  return (
    <span style={{ color, letterSpacing: 1 }}>
      {'█'.repeat(filled)}
      <span style={{ color: 'var(--color-border)' }}>{'░'.repeat(empty)}</span>
    </span>
  )
}

function ProcessMonitor() {
  const [tick, setTick] = useState(0)
  const [procs, setProcs] = useState(PROCESSES)

  // Subtle live fluctuation every 2 s
  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1)
      setProcs(prev =>
        prev.map(p => ({
          ...p,
          cpu: Math.min(99, Math.max(10, p.cpu + Math.floor((Math.random() - 0.5) * 6))),
          mem: Math.min(99, Math.max(10, p.mem + Math.floor((Math.random() - 0.5) * 4))),
        }))
      )
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const uptime = `${4}y ${3}m ${tick}s`

  const statusColor: Record<string, string> = {
    ACTIVE:   'var(--color-success)',
    BUILDING: 'var(--color-warning)',
    LEARNING: 'var(--color-info)',
  }

  return (
    <div
      className="border rounded-sm overflow-hidden font-mono text-xs"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: 'var(--color-text)', borderColor: 'var(--color-text)' }}
      >
        <span style={{ color: 'var(--color-background)', fontWeight: 600 }}>
          dev-monitor — chris@developer.local
        </span>
        <span style={{ color: 'var(--color-background)', opacity: 0.6 }}>
          uptime {uptime}
        </span>
      </div>

      {/* System stats row */}
      <div
        className="grid grid-cols-3 gap-px border-b text-center"
        style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}
      >
        {[
          { label: 'PROCESSES', value: `${procs.length} running` },
          { label: 'DOMAINS',   value: '6 active' },
          { label: 'STATUS',    value: '● online' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="py-2 px-3"
            style={{ backgroundColor: 'var(--color-border-soft)' }}
          >
            <div style={{ color: 'var(--color-text-muted)' }}>{label}</div>
            <div style={{ color: value.startsWith('●') ? 'var(--color-success)' : 'var(--color-text)', marginTop: 2 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Column headers */}
      <div
        className="grid px-4 py-2 border-b"
        style={{
          gridTemplateColumns: '2.5rem 7rem 1fr 1fr 3.5rem 5rem',
          color: 'var(--color-text-muted)',
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-border-soft)',
          gap: '0.5rem',
        }}
      >
        <span>PID</span>
        <span>PROCESS</span>
        <span>CPU%</span>
        <span>MEM%</span>
        <span>THR</span>
        <span>STATUS</span>
      </div>

      {/* Rows */}
      {procs.map((p, i) => (
        <div
          key={p.pid}
          className="grid px-4 py-2.5 border-b last:border-0 transition-colors"
          style={{
            gridTemplateColumns: '2.5rem 7rem 1fr 1fr 3.5rem 5rem',
            borderColor: 'var(--color-border-soft)',
            backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'var(--color-border)' }}>{p.pid}</span>
          <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{p.name}</span>
          <span>
            <MiniBar pct={p.cpu} width={9} />
            <span style={{ color: 'var(--color-text-muted)', marginLeft: 6 }}>{p.cpu}</span>
          </span>
          <span>
            <MiniBar pct={p.mem} width={9} color="var(--color-text-muted)" />
            <span style={{ color: 'var(--color-text-muted)', marginLeft: 6 }}>{p.mem}</span>
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>{p.threads}</span>
          <span style={{ color: statusColor[p.status] ?? 'var(--color-text-muted)' }}>
            {p.status}
          </span>
        </div>
      ))}

      {/* Footer prompt */}
      <div
        className="px-4 py-2 border-t"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>$ </span>
        <span style={{ color: 'var(--color-text)' }}>ps --skills --watch</span>
        <span className="cursor-blink" style={{ color: 'var(--color-text)' }}> ▋</span>
      </div>
    </div>
  )
}

// ─── DEVELOPMENT ECOSYSTEM ───────────────────────────────────────────

function DevEcosystem() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setExpanded(e => ({ ...e, [key]: !e[key] }))

  return (
    <section
      id="skills"
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          $ development --tree
        </p>
        <h2 className="section-heading">
          Development Ecosystem
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Process monitor — left */}
          <ProcessMonitor />

          {/* Interactive tree — right */}
          <div
            className="border rounded-sm font-mono text-sm p-6"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="text-xs mb-4 pb-3 border-b"
              style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}
            >
              ~/developer
            </div>
            <div style={{ color: 'var(--color-text)' }}>
              {Object.entries(TECH_TREE).map(([key, branch], i, arr) => {
                const isLast = i === arr.length - 1
                const isOpen = expanded[key]
                return (
                  <div key={key} className="mb-1">
                    <button
                      className="flex items-center gap-1 hover:opacity-70 transition-opacity text-left w-full"
                      onClick={() => toggle(key)}
                    >
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {isLast ? '└──' : '├──'}
                      </span>
                      <span className="font-medium">{isOpen ? '▾' : '▸'} {branch.label}/</span>
                    </button>
                    {isOpen && (
                      <div className="ml-6 mt-1 mb-2">
                        {branch.items.map((item, j) => (
                          <div key={item} className="flex items-center gap-1 py-0.5">
                            <span style={{ color: 'var(--color-border)' }}>
                              {j === branch.items.length - 1 ? '└──' : '├──'}
                            </span>
                            <span style={{ color: 'var(--color-text-muted)' }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── GIT TIMELINE ────────────────────────────────────────────────────

function GitTimeline() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const toggle = (i: number) => setExpanded(e => ({ ...e, [i]: !e[i] }))

  return (
    <section
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          $ git log --development
        </p>
        <h2 className="section-heading">
          Development Journey
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-3 bottom-3 w-px"
            style={{ backgroundColor: 'var(--color-border)' }}
          />

          <div className="space-y-0">
            {GIT_LOG.map((entry, i) => (
              <div key={i} className="relative pl-12">
                {/* Dot */}
                <div
                  className="absolute left-3 top-3 w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-text)',
                    transform: 'translateX(-50%)',
                  }}
                />

                <button
                  className="w-full text-left py-4 border-b transition-all"
                  style={{ borderColor: 'var(--color-border-soft)' }}
                  onClick={() => toggle(i)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className="font-mono text-xs mb-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {entry.year} · {entry.hash}
                      </div>
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {expanded[i] ? '▾' : '▸'} {entry.milestone}
                      </div>
                    </div>
                  </div>

                  {expanded[i] && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.techs.map(t => (
                        <span
                          key={t}
                          className="font-mono text-xs px-2 py-1 border"
                          style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            ))}

            {/* Initial commit */}
            <div className="relative pl-12 pt-4">
              <div
                className="absolute left-3 top-7 w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: 'var(--color-border)',
                  transform: 'translateX(-50%)',
                }}
              />
              <span className="font-mono text-xs" style={{ color: 'var(--color-border)' }}>
                └── initial commit
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROJECTS ────────────────────────────────────────────────────────

function Projects() {
  const categories = ['All', 'Web', 'AI', 'Mobile']
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === active)

  return (
    <section
      id="projects"
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          $ ls projects/
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h2 className="text-3xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Projects
          </h2>
          <div className="flex gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="font-mono text-xs px-3 py-1.5 border transition-all"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: active === c ? 'var(--color-text)' : 'transparent',
                  color: active === c ? 'var(--color-background)' : 'var(--color-text-muted)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project: p }: { project: typeof PROJECTS[0] }) {
  const [hovered, setHovered] = useState(false)
  const slug = p.name.toLowerCase().replace(/\s/g, '-')
  return (
    <div
      className="overflow-hidden cursor-default flex flex-col relative group"
      style={{
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.12), 4px 4px 0 var(--color-border)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview image — tall, takes most of card */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: '4/3',
          backgroundColor: 'var(--color-border-soft)',
        }}
      >
        <img
          src={`/previews/${slug}-preview.png`}
          alt={`${p.name} preview`}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {/* Placeholder shown when no image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none pointer-events-none">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" style={{ color: 'var(--color-border)' }}>
            <rect x="3" y="3" width="18" height="14" rx="2" />
            <path d="M3 13l4-4 4 4 4-6 4 4" />
            <circle cx="8.5" cy="8" r="1.5" />
          </svg>
          <span className="font-mono text-xs" style={{ color: 'var(--color-border)' }}>{slug}-preview.png</span>
        </div>

        {/* Hover overlay — slides up over image */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-5"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, transparent 100%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.88)' }}>
            {p.desc}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.stack.map(t => (
              <span key={t} className="font-mono text-xs px-2 py-0.5" style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>{t}</span>
            ))}
          </div>
          <div className="flex gap-4 font-mono text-xs">
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >GitHub →</a>
            {p.live !== '#' && (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >Live →</a>
            )}
          </div>
        </div>

        {/* Category tag — top right */}
        <span className="tag absolute top-3 right-3" style={{ borderRadius: '6px', background: 'var(--color-surface)' }}>{p.category}</span>
      </div>

      {/* Card footer — always visible */}
      <div className="px-5 py-4 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--color-text)' }}>{p.name}</h3>
        <div className="flex items-center font-mono text-xs shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          <StatusDot status={p.status} />{p.status}
        </div>
      </div>
    </div>
  )
}

// ─── SERVICES ────────────────────────────────────────────────────────

function Services() {
  return (
    <section
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          $ cat services.txt
        </p>
        <h2 className="section-heading">
          Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--color-text)' }}>{s.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────

function Experience() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true })
  const toggle = (i: number) => setOpen(o => ({ ...o, [i]: !o[i] }))

  return (
    <section
      id="experience"
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          $ git log --experience
        </p>
        <h2 className="section-heading">
          Experience
        </h2>
        <div className="space-y-2">
          {EXPERIENCE.map((ex, i) => (
            <div
              key={i}
              className="border rounded-sm overflow-hidden"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                style={{ backgroundColor: open[i] ? 'var(--color-background)' : 'transparent' }}
                onClick={() => toggle(i)}
              >
                <div>
                  <div className="font-semibold" style={{ color: 'var(--color-text)' }}>{ex.org}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{ex.role}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{ex.period}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{open[i] ? '−' : '+'}</span>
                </div>
              </button>
              {open[i] && (
                <div
                  className="px-6 pb-5 pt-0 border-t"
                  style={{ borderColor: 'var(--color-border-soft)' }}
                >
                  <ul className="mt-4 space-y-2">
                    {ex.points.map((p, j) => (
                      <li key={j} className="flex gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        <span style={{ color: 'var(--color-text)' }}>→</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Education compact */}
        <div className="mt-16">
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            $ cat education.txt
          </p>
          <h2 className="section-heading" style={{ marginBottom: '2rem' }}>
            Education
          </h2>
          <div
            className="border rounded-sm p-6"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <div className="font-semibold" style={{ color: 'var(--color-text)' }}>BSc Computer Science</div>
                <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Kwame Nkrumah University of Science and Technology (KNUST) · Ghana</div>
              </div>
              <div className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                2022 — Present
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── GITHUB ──────────────────────────────────────────────────────────

function GitHub() {
  return (
    <section
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
          $ git status
        </p>
        <h2 className="section-heading">
          Open Source
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPOS.map(r => (
            <a
              key={r.name}
              href="https://github.com/chris008123"
              target="_blank"
              rel="noopener noreferrer"
              className="card block p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.name}</div>
                <div className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>★ {r.stars}</div>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{r.desc}</p>
              <span className="tag">{r.lang}</span>
            </a>
          ))}
        </div>
        <div className="mt-8">
          <a
            href="#"
            className="font-mono text-xs transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-text)' }}
          >
            View all repositories on GitHub →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          template_params: {
            name:     form.name,
            time:     new Date().toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }),
            message:  form.subject
                        ? `Subject: ${form.subject}\n\n${form.message}`
                        : form.message,
            reply_to: form.email,
          },
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    backgroundColor: 'var(--color-background)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <section
      id="contact"
      className="py-28 border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
            $ ./contact
          </p>
          <h2 className="text-3xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Let's work together.
          </h2>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            Available for freelance projects, collaborative work, and full-time opportunities.
            Reach out and let's build something.
          </p>
          <div className="space-y-3 font-mono text-sm">
            {[
              { label: 'Email',     value: 'aidoochris0081@gmail.com',          href: 'mailto:aidoochris0081@gmail.com' },
              { label: 'GitHub',    value: 'github.com/chris008123',             href: 'https://github.com/chris008123' },
              { label: 'LinkedIn',  value: 'linkedin.com/in/chris-atta-aidoo-atta',   href: 'https://linkedin.com/in/chris-atta-aidoo-atta' },
              { label: 'Portfolio', value: 'aidoochris.vercel.app',           href: 'https://aidoochris.vercel.app' },
              { label: 'Phone',     value: '+233 54 764 5984',                    href: 'tel:+233547645984' },
            ].map(({ label, value, href }) => (
              <div key={label} className="flex gap-4">
                <span className="w-20 text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: 'var(--color-text)' }} className="hover:opacity-60 transition-opacity">{value}</a>
              </div>
            ))}
          </div>
        </div>

        <div>
          {status === 'sent' ? (
            <div
              className="border rounded-sm p-8 font-mono text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div style={{ color: 'var(--color-success)' }}>[+] Message sent successfully.</div>
              <div className="mt-2" style={{ color: 'var(--color-text-muted)' }}>&gt; Delivered to aidoochris0081@gmail.com</div>
              <div className="mt-1" style={{ color: 'var(--color-text-muted)' }}>&gt; I'll respond within 24 hours.</div>
              <button
                className="mt-4 text-xs hover:opacity-60 transition-opacity"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={() => setStatus('idle')}
              >
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'NAME:', placeholder: 'Your name', type: 'text' },
                { key: 'email', label: 'EMAIL:', placeholder: 'your@email.com', type: 'email' },
                { key: 'subject', label: 'SUBJECT:', placeholder: 'What is this about?', type: 'text' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block font-mono text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border px-4 py-3 rounded-sm transition-colors focus:border-[var(--color-text)] placeholder:text-[var(--color-border)]"
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label className="block font-mono text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  MESSAGE:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell me about the project or opportunity..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full border px-4 py-3 rounded-sm resize-none transition-colors focus:border-[var(--color-text)] placeholder:text-[var(--color-border)]"
                  style={inputStyle}
                />
              </div>
              {status === 'error' && (
                <div className="font-mono text-xs py-2" style={{ color: 'var(--color-error)' }}>
                  [!] Failed to send. Check your EmailJS config or try again.
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full font-mono text-xs py-3 border transition-all"
                style={{
                  backgroundColor: status === 'sending' ? 'var(--color-border)' : 'var(--color-text)',
                  color: status === 'sending' ? 'var(--color-text-muted)' : 'var(--color-background)',
                  borderColor: status === 'sending' ? 'var(--color-border)' : 'var(--color-text)',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => {
                  if (status !== 'sending') {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)'
                    e.currentTarget.style.color = 'var(--color-text)'
                  }
                }}
                onMouseLeave={e => {
                  if (status !== 'sending') {
                    e.currentTarget.style.backgroundColor = 'var(--color-text)'
                    e.currentTarget.style.color = 'var(--color-background)'
                  }
                }}
              >
                {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE /'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="border-t py-12"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="font-semibold" style={{ color: 'var(--color-text)' }}>Chris Atta Aidoo</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Software Engineer · Accra, Ghana
          </div>
        </div>
        <div className="flex gap-6 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {['GitHub', 'LinkedIn', 'Email'].map(s => (
            <a key={s} href="#" className="hover:opacity-60 transition-opacity">{s}</a>
          ))}
        </div>
        <div className="font-mono text-xs" style={{ color: 'var(--color-border)' }}>
          © 2026 Chris Atta Aidoo · $ exit<span className="cursor-blink">_</span>
        </div>
      </div>
    </footer>
  )
}

// ─── PALETTE GLITCH EFFECT ───────────────────────────────────────────

function PaletteGlitch({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const DURATION = 1600  // ms total glitch duration
    const SWAP_AT  = 900   // ms — when palette flips mid-glitch
    let start: number | null = null
    let swapped = false
    let raf: number

    const GLITCH_CHARS = '░▒▓█▄▀■□▪▫'

    function drawFrame(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start
      const t = Math.min(elapsed / DURATION, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const W = canvas.width
      const H = canvas.height
      const intensity = t < 0.5 ? t * 2 : (1 - t) * 2   // ramp up then down

      // ── Horizontal slice displacement ──
      const sliceCount = Math.floor(8 + intensity * 24)
      for (let i = 0; i < sliceCount; i++) {
        const y      = Math.random() * H
        const sliceH = 2 + Math.random() * (H / sliceCount) * intensity * 3
        const shift  = (Math.random() - 0.5) * 120 * intensity

        // fill slice with semi-opaque shifted block
        const alpha = 0.12 + Math.random() * 0.3 * intensity
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fillRect(shift, y, W, sliceH)
      }

      // ── RGB channel aberration bands ──
      const bands = Math.floor(intensity * 12)
      for (let i = 0; i < bands; i++) {
        const y = Math.random() * H
        const h = 1 + Math.random() * 6
        ctx.fillStyle = `rgba(185,74,72,${0.15 * intensity})`
        ctx.fillRect(-6 * intensity, y, W, h)
        ctx.fillStyle = `rgba(74,111,165,${0.15 * intensity})`
        ctx.fillRect(6 * intensity, y + 1, W, h)
      }

      // ── Random corrupted blocks ──
      const blocks = Math.floor(intensity * 18)
      for (let i = 0; i < blocks; i++) {
        const x = Math.random() * W
        const y = Math.random() * H
        const w = 4 + Math.random() * 80 * intensity
        const h = 2 + Math.random() * 12 * intensity
        const a = 0.6 + Math.random() * 0.4
        if (Math.random() > 0.5) {
          ctx.fillStyle = `rgba(237,234,226,${a * intensity})`
        } else {
          ctx.fillStyle = `rgba(20,20,20,${a * intensity})`
        }
        ctx.fillRect(x, y, w, h)
      }

      // ── Full-screen flash at peak ──
      if (t > 0.45 && t < 0.6) {
        ctx.fillStyle = `rgba(237,234,226,${(t - 0.45) * 4 * intensity})`
        ctx.fillRect(0, 0, W, H)
      }

      // ── Swap palette at midpoint ──
      if (!swapped && elapsed >= SWAP_AT) {
        swapped = true
        document.documentElement.classList.add('palette-dark')
      }

      if (t < 1) {
        raf = requestAnimationFrame(drawFrame)
      } else {
        ctx.clearRect(0, 0, W, H)
        // 1 second after going dark, snap back to light
        setTimeout(() => {
          document.documentElement.classList.remove('palette-dark')
        }, 1000)
        onDone()
      }
    }

    raf = requestAnimationFrame(drawFrame)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  )
}

// ─── GLITCH INTRO ────────────────────────────────────────────────────

const BOOT_LINES = [
  '> initializing portfolio...',
  '> loading modules...',
  '> mounting components...',
  '> ready.',
]

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#@%&$'

function scramble(text: string, progress: number) {
  return text
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (i < Math.floor(progress * text.length)) return char
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    })
    .join('')
}

function GlitchIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase]       = useState<'glitch' | 'boot' | 'fadeout'>('glitch')
  const [bootIdx, setBootIdx]   = useState(0)
  const [display, setDisplay]   = useState('CHRIS ATTA AIDOO')
  const [progress, setProgress] = useState(0)

  // Phase 1 — scramble then resolve the name
  useEffect(() => {
    if (phase !== 'glitch') return
    let frame = 0
    const total = 40
    const id = setInterval(() => {
      frame++
      const p = frame / total
      setProgress(p)
      setDisplay(scramble('CHRIS ATTA AIDOO', p))
      if (frame >= total) {
        clearInterval(id)
        setDisplay('CHRIS ATTA AIDOO')
        setPhase('boot')
      }
    }, 45)
    return () => clearInterval(id)
  }, [phase])

  // Phase 2 — boot lines appear one by one
  useEffect(() => {
    if (phase !== 'boot') return
    if (bootIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase('fadeout'), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setBootIdx(i => i + 1), 260)
    return () => clearTimeout(t)
  }, [phase, bootIdx])

  // Phase 3 — fade out then unmount
  useEffect(() => {
    if (phase !== 'fadeout') return
    const t = setTimeout(onDone, 600)
    return () => clearTimeout(t)
  }, [phase, onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'var(--color-charcoal)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: phase === 'fadeout' ? 'introFadeOut 0.6s ease forwards' : undefined,
        overflow: 'hidden',
      }}
    >
      {/* Scanline sweep */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.06) 50%)',
          backgroundSize: '100% 4px',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute', left: 0, right: 0, height: '120px',
          background: 'linear-gradient(to bottom, transparent, rgba(244,243,238,0.04), transparent)',
          animation: 'scanline 1.8s linear infinite',
          zIndex: 2, pointerEvents: 'none',
        }}
      />

      {/* Main glitch name */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
        {/* Glitch layers */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <h1
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 700,
              color: 'var(--color-ivory)',
              letterSpacing: '0.12em',
              animation: phase === 'glitch' ? 'glitchFlicker 0.3s linear infinite' : undefined,
              position: 'relative',
            }}
          >
            {display}
          </h1>

          {/* Glitch clone 1 — red channel offset */}
          {phase === 'glitch' && (
            <h1
              aria-hidden
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'rgba(185,74,72,0.7)',
                position: 'absolute', inset: 0,
                animation: 'glitchClip1 0.25s steps(1) infinite',
              }}
            >
              {display}
            </h1>
          )}

          {/* Glitch clone 2 — blue channel offset */}
          {phase === 'glitch' && (
            <h1
              aria-hidden
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'rgba(74,111,165,0.7)',
                position: 'absolute', inset: 0,
                animation: 'glitchClip2 0.3s steps(1) infinite',
              }}
            >
              {display}
            </h1>
          )}
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'rgba(244,243,238,0.4)',
            letterSpacing: '0.3em',
            marginTop: '1rem',
            textTransform: 'uppercase',
          }}
        >
          full-stack developer
        </p>
      </div>

      {/* Boot lines */}
      {phase !== 'glitch' && (
        <div
          style={{
            position: 'absolute', bottom: '10%', left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'rgba(244,243,238,0.35)',
            display: 'flex', flexDirection: 'column', gap: '6px',
            minWidth: '260px', zIndex: 3,
          }}
        >
          {BOOT_LINES.slice(0, bootIdx).map((line, i) => (
            <div
              key={i}
              style={{
                animation: 'bootLine 0.2s ease both',
                color: line === '> ready.' ? 'rgba(63,125,88,0.9)' : 'rgba(244,243,238,0.35)',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────

export default function App() {
  const [intro, setIntro]           = useState(true)
  const [glitching, setGlitching]   = useState(false)

  // Fire the palette glitch 10 s after the intro completes
  useEffect(() => {
    if (intro) return
    const t = setTimeout(() => setGlitching(true), 10_000)
    return () => clearTimeout(t)
  }, [intro])

  return (
    <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      {intro && <GlitchIntro onDone={() => setIntro(false)} />}
      {glitching && <PaletteGlitch onDone={() => setGlitching(false)} />}
      <Navbar />
      <Hero />
      <About />
      <DevEcosystem />
      <GitTimeline />
      <Projects />
      <Services />
      <Experience />
      <GitHub />
      <Contact />
      <Footer />
    </div>
  )
}
