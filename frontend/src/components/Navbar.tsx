import { useEffect, useState, type ReactNode } from 'react'
import {
  Activity,
  BarChart3,
  BookOpen,
  FileText,
  HelpCircle,
  Home,
  Keyboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserPlus,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { userLogOut } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { soundEngine, type SoundTheme } from '../utils/audio'
import { Button } from './Button'
import { TipsModal } from './TipsModal'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
  authOnly?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: <Home size={17} /> },
  { to: '/test', label: 'Test', icon: <Activity size={17} /> },
  {
    to: '/history',
    label: 'History',
    icon: <BarChart3 size={17} />,
    authOnly: true,
  },
  {
    to: '/texts',
    label: 'Library',
    icon: <FileText size={17} />,
    authOnly: true,
  },
  { to: '/about', label: 'About', icon: <BookOpen size={17} /> },
]

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTipsOpen, setIsTipsOpen] = useState(false)
  const [soundTheme, setSoundTheme] = useState<SoundTheme>(() =>
    soundEngine.getTheme(),
  )

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await userLogOut()
    setIsMenuOpen(false)
    navigate('/')
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const cycleSound = () => {
    const themes: SoundTheme[] = ['mechanical', 'thock', 'typewriter', 'mute']
    const nextIdx = (themes.indexOf(soundTheme) + 1) % themes.length
    const nextTheme = themes[nextIdx]
    soundEngine.setTheme(nextTheme)
    setSoundTheme(nextTheme)
    if (nextTheme !== 'mute') {
      soundEngine.playKeyClick()
    }
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-all duration-150',
      isActive
        ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xs'
        : 'text-[var(--muted-strong)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]',
    ].join(' ')

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex h-11 items-center gap-3 rounded-lg px-3.5 text-sm font-semibold transition',
      isActive
        ? 'bg-[var(--foreground)] text-[var(--background)]'
        : 'text-[var(--muted-strong)] hover:bg-[var(--surface-soft)]',
    ].join(' ')

  const visibleItems = navItems.filter(
    (item) => !item.authOnly || isAuthenticated,
  )

  return (
    <>
      <header className='sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-xl'>
        <nav className='app-shell flex h-[73px] items-center justify-between gap-4'>
          <Link
            to='/'
            className='inline-flex min-w-0 items-center gap-2.5 text-[var(--foreground)] transition hover:opacity-90'
            aria-label='TypingPro home'
          >
            <span className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-md shadow-cyan-500/20 dark:from-cyan-500 dark:to-cyan-300 dark:text-slate-950'>
              <Keyboard size={21} />
            </span>
            <span className='min-w-0'>
              <span className='block truncate text-base font-black tracking-tight leading-tight'>
                TypingPro
              </span>
              <span className='block truncate text-[0.68rem] font-bold tracking-wider uppercase text-cyan-600 dark:text-cyan-400'>
                Benchmark
              </span>
            </span>
          </Link>

          <div className='hidden items-center gap-1.5 lg:flex'>
            {visibleItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className='hidden items-center gap-2 lg:flex'>
            {/* Shortcuts & Guide */}
            <button
              type='button'
              onClick={() => setIsTipsOpen(true)}
              className='inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
              title='Typing tips & hotkeys'
            >
              <HelpCircle size={17} />
              <span>Guide</span>
            </button>

            {/* Audio Toggle */}
            <button
              type='button'
              onClick={cycleSound}
              className='inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
              title={`Typing audio: ${soundTheme}. Click to cycle.`}
            >
              {soundTheme === 'mute' ? (
                <VolumeX size={17} className='text-rose-500' />
              ) : (
                <Volume2
                  size={17}
                  className='text-cyan-600 dark:text-cyan-400'
                />
              )}
              <span className='capitalize'>{soundTheme}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type='button'
              onClick={toggleTheme}
              className='grid h-10 w-10 place-items-center rounded-lg text-[var(--muted-strong)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
              aria-label='Toggle theme'
              title='Toggle theme'
            >
              {resolvedTheme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {isAuthenticated ? (
              <div className='flex items-center gap-2 border-l border-[var(--border)] pl-2'>
                <div className='max-w-40 truncate text-xs font-bold text-[var(--foreground)]'>
                  {user?.name}
                </div>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={handleLogout}
                  icon={<LogOut size={15} />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-2 border-l border-[var(--border)] pl-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => navigate('/login')}
                  icon={<LogIn size={15} />}
                >
                  Login
                </Button>
                <Button
                  type='button'
                  size='sm'
                  onClick={() => navigate('/register')}
                  icon={<UserPlus size={15} />}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          <div className='flex items-center gap-1.5 lg:hidden'>
            <button
              type='button'
              onClick={cycleSound}
              className='grid h-10 w-10 place-items-center rounded-lg text-[var(--muted-strong)] transition hover:bg-[var(--surface-soft)]'
              aria-label='Toggle audio'
            >
              {soundTheme === 'mute' ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <button
              type='button'
              onClick={toggleTheme}
              className='grid h-10 w-10 place-items-center rounded-lg text-[var(--muted-strong)] transition hover:bg-[var(--surface-soft)]'
              aria-label='Toggle theme'
            >
              {resolvedTheme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <button
              type='button'
              onClick={() => setIsMenuOpen((open) => !open)}
              className='grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition hover:bg-[var(--surface-soft)]'
              aria-label='Toggle menu'
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className='border-t border-[var(--border)] lg:hidden'>
            <div className='app-shell py-3'>
              <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg'>
                <div className='grid gap-1'>
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={mobileNavClass}
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                  <button
                    type='button'
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsTipsOpen(true)
                    }}
                    className='flex h-11 items-center gap-3 rounded-lg px-3.5 text-sm font-semibold text-[var(--muted-strong)] hover:bg-[var(--surface-soft)]'
                  >
                    <HelpCircle size={17} />
                    Tips & Shortcuts
                  </button>
                </div>

                <div className='mt-3 border-t border-[var(--border)] pt-3'>
                  {isAuthenticated ? (
                    <div className='grid gap-3'>
                      <div className='truncate px-3 text-sm font-semibold text-[var(--muted)]'>
                        Signed in as {user?.name}
                      </div>
                      <Button
                        type='button'
                        variant='secondary'
                        onClick={handleLogout}
                        icon={<LogOut size={16} />}
                        isFullWidth
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        type='button'
                        variant='secondary'
                        onClick={() => navigate('/login')}
                        icon={<LogIn size={16} />}
                      >
                        Login
                      </Button>
                      <Button
                        type='button'
                        onClick={() => navigate('/register')}
                        icon={<UserPlus size={16} />}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <TipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />
    </>
  )
}
