import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles, FileDown } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface NavbarProps {
  scrollProgress: number;
  onWorkWithMeClick: () => void;
  onResumeClick: () => void;
  activeSection: string;
  currentRoute?: 'home' | 'projects' | 'certificates';
  onNavigate?: (route: 'home' | 'projects' | 'certificates', sectionId?: string) => void;
}

export function Navbar({
  scrollProgress,
  onWorkWithMeClick,
  onResumeClick,
  activeSection,
  currentRoute = 'home',
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const navItems = [
    { label: 'HOME', route: 'home' as const, sectionId: 'hero' },
    { label: 'PROJECTS', route: 'projects' as const },
    { label: 'CERTIFICATES', route: 'certificates' as const },
    { label: 'JOURNEY', route: 'home' as const, sectionId: 'story' },
    { label: 'ABOUT', route: 'home' as const, sectionId: 'about' },
    { label: 'EXPERIENCE', route: 'home' as const, sectionId: 'experience' },
    { label: 'CONTACT', route: 'home' as const, sectionId: 'contact' },
  ];

  const handleItemClick = (
    e: React.MouseEvent,
    item: { label: string; route: 'home' | 'projects' | 'certificates'; sectionId?: string }
  ) => {
    e.preventDefault();
    soundEngine.playClick();
    setMobileMenuOpen(false);

    if (onNavigate) {
      onNavigate(item.route, item.sectionId);
    } else if (item.sectionId) {
      const target = document.getElementById(item.sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07090e]/85 backdrop-blur-md border-b border-sky-500/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a
          href="/"
          onClick={(e) => handleItemClick(e, { label: 'HOME', route: 'home', sectionId: 'hero' })}
          className="group flex items-center gap-2.5 focus:outline-none cursor-pointer"
          id="nav-brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500/20 to-indigo-500/10 border border-sky-400/30 flex items-center justify-center font-mono font-bold text-sky-400 text-sm tracking-wider group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
            FS
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-slate-200 group-hover:text-white transition-colors">
              FATHIMA SAHEERA J
            </span>
            <span className="text-[10px] font-mono text-sky-400/70 hidden sm:block">
              Aspiring Full-Stack Developer
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const isActive =
              (item.route === 'projects' && currentRoute === 'projects') ||
              (item.route === 'certificates' && currentRoute === 'certificates') ||
              (currentRoute === 'home' && item.route === 'home' && activeSection === item.sectionId);

            return (
              <button
                key={item.label}
                type="button"
                onClick={(e) => handleItemClick(e, item)}
                className={`relative px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? 'text-sky-300 bg-sky-950/40 border border-sky-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Sound Controls */}
        <div className="flex items-center gap-3">
          {/* RESUME DOWNLOAD CTA */}
          <button
            type="button"
            id="nav-resume-btn"
            onClick={() => {
              soundEngine.playClick();
              onResumeClick();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400/50 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-1.5"
            title="View & Download Resume"
          >
            <FileDown className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">RESUME</span>
          </button>

          {/* WORK WITH ME subtle CTA */}
          <button
            type="button"
            id="nav-work-with-me-btn"
            onClick={() => {
              soundEngine.playClick();
              onWorkWithMeClick();
            }}
            className="relative px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(56,189,248,0.25)] flex items-center gap-1.5"
          >
            <span>WORK WITH ME</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070a12]/95 border-b border-sky-500/20 backdrop-blur-xl px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={(e) => handleItemClick(e, item)}
              className="block w-full text-left px-3 py-2 rounded-lg font-mono text-xs text-slate-300 hover:text-sky-300 hover:bg-sky-950/30 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onResumeClick();
              }}
              className="w-full py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs tracking-wider text-center flex items-center justify-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-400" />
              <span>DOWNLOAD RESUME (PDF/DOC)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onWorkWithMeClick();
              }}
              className="w-full py-2.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-200 font-mono text-xs tracking-wider text-center"
            >
              WORK WITH ME
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
