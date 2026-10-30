
import { useState, useEffect } from 'react';
import { ViewportProgressBar } from './components/ViewportProgressBar';
import { CinematicBackground } from './components/CinematicBackground';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoryJourneySection } from './components/StoryJourneySection';
import { AboutCinematic } from './components/AboutCinematic';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsConstellation } from './components/SkillsConstellation';
import { ContactSection } from './components/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { CertificateModal } from './components/CertificateModal';
import { LiveWebsiteNoticeModal } from './components/LiveWebsiteNoticeModal';
import { ResumeModal } from './components/ResumeModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { ProjectsPage } from './pages/ProjectsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { ProjectData, CertificationItem } from './data/portfolioData';
import { useDynamicSEO } from './hooks/useDynamicSEO';

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioAppRoot />
    </PortfolioProvider>
  );
}

type AppRoute = 'home' | 'projects' | 'certificates' | 'admin';

function getRouteFromUrl(): AppRoute {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    if (
      path === '/admin' ||
      path.startsWith('/admin') ||
      hash === '#/admin' ||
      hash === '#admin' ||
      search.includes('admin=true')
    ) {
      return 'admin';
    }

    if (
      path === '/projects' ||
      path.startsWith('/projects') ||
      hash === '#/projects' ||
      hash === '#projects-vault' ||
      hash === '#projects-archive'
    ) {
      return 'projects';
    }

    if (
      path === '/certificates' ||
      path.startsWith('/certificates') ||
      hash === '#/certificates' ||
      hash === '#certificates-vault' ||
      hash === '#certificates-archive'
    ) {
      return 'certificates';
    }
  }

  return 'home';
}

function PortfolioAppRoot() {
  const { data } = usePortfolio();
  useDynamicSEO(data?.profile?.seo, data?.profile?.name);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromUrl);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('saheera_admin_authenticated') === 'true';
    }
    return false;
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Modals
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificationItem | null>(null);
  const [liveNoticeProject, setLiveNoticeProject] = useState<ProjectData | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Sync route on popstate, hashchange, or keyboard shortcut
  useEffect(() => {
    const handleLocationCheck = () => {
      setCurrentRoute(getRouteFromUrl());
      setIsAuthenticated(
        sessionStorage.getItem('saheera_admin_authenticated') === 'true'
      );
    };

    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);

    // Secret shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'A' || e.key === 'a')
      ) {
        e.preventDefault();

        if (currentRoute === 'admin') {
          window.history.pushState(null, '', '/');
          setCurrentRoute('home');
        } else {
          window.history.pushState(null, '', '/admin');
          setCurrentRoute('admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentRoute]);

  const navigateTo = (route: AppRoute, sectionId?: string) => {
    if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
      setCurrentRoute('admin');
    } else if (route === 'projects') {
      window.history.pushState(null, '', '/projects');
      setCurrentRoute('projects');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'certificates') {
      window.history.pushState(null, '', '/certificates');
      setCurrentRoute('certificates');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', '/');
      setCurrentRoute('home');

      if (sectionId) {
        setTimeout(() => {
          const target = document.getElementById(sectionId);

          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const navigateToAdmin = () => navigateTo('admin');
  const navigateToHome = () => navigateTo('home');

  // Global Mouse Tracking for Subtle Camera & Parallax Tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;

      setMousePos({
        x: normalizedX,
        y: normalizedY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Global Scroll Tracking for Continuous Camera Progression
  useEffect(() => {
    if (currentRoute !== 'home') return;

    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (totalScroll > 0) {
        const progress = Math.min(
          1,
          Math.max(0, window.scrollY / totalScroll)
        );

        setScrollProgress(progress);
      }

      // Detect active section for navigation
      const sections = [
        'hero',
        'story',
        'about',
        'projects',
        'experience',
        'skills',
        'contact',
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);

        if (el) {
          const rect = el.getBoundingClientRect();

          if (
            rect.top <= window.innerHeight * 0.45 &&
            rect.bottom >= window.innerHeight * 0.25
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentRoute]);

  // Scroll Reveal Animation for Home Page Sections
  useEffect(() => {
    if (currentRoute !== 'home') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const sectionIds = [
      'story',
      'about',
      'projects',
      'experience',
      'skills',
      'contact',
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;

          const animation = element.animate(
            [
              {
                opacity: 0,
                transform: 'translateY(32px)',
                filter: 'blur(5px)',
              },
              {
                opacity: 1,
                transform: 'translateY(0)',
                filter: 'blur(0px)',
              },
            ],
            {
              duration: 850,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'both',
            }
          );

          animation.onfinish = () => {
            element.style.opacity = '1';
            animation.cancel();
          };

          // Animate each section only once
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    sections.forEach((section) => {
      section.style.opacity = '0';
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [currentRoute]);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in /admin route
  if (currentRoute === 'admin') {
    if (isAuthenticated) {
      return <AdminDashboard onExit={navigateToHome} />;
    }

    return (
      <AdminLogin
        onSuccess={() => setIsAuthenticated(true)}
        onExit={navigateToHome}
      />
    );
  }

  // If on Dedicated PROJECTS Page
  if (currentRoute === 'projects') {
    return (
      <div className="relative min-h-screen bg-[#07090e] text-[#f1f5f9] selection:bg-sky-500/30 selection:text-sky-200">
        <CustomCursor />

        <Navbar
          scrollProgress={0}
          activeSection="projects"
          currentRoute="projects"
          onNavigate={(r, s) => navigateTo(r, s)}
          onWorkWithMeClick={() => navigateTo('home', 'contact')}
          onResumeClick={() => setIsResumeOpen(true)}
        />

        <main className="pt-20">
          <ProjectsPage
            onSelectProject={(proj) => setSelectedProject(proj)}
            onLiveUrlClick={(proj) => setLiveNoticeProject(proj)}
            onBackToHome={navigateToHome}
            onResumeClick={() => setIsResumeOpen(true)}
            onContactClick={() => navigateTo('home', 'contact')}
          />
        </main>

        {/* Project Deep Dive Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onLiveUrlClick={(proj) => {
            setSelectedProject(null);
            setLiveNoticeProject(proj);
          }}
        />

        {/* Live Website Notice Modal */}
        <LiveWebsiteNoticeModal
          project={liveNoticeProject}
          onClose={() => setLiveNoticeProject(null)}
          onExploreSpec={() => {
            const p = liveNoticeProject;
            setLiveNoticeProject(null);
            setSelectedProject(p);
          }}
        />

        {/* Resume Modal */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />
      </div>
    );
  }

  // If on Dedicated CERTIFICATES Page
  if (currentRoute === 'certificates') {
    return (
      <div className="relative min-h-screen bg-[#07090e] text-[#f1f5f9] selection:bg-sky-500/30 selection:text-sky-200">
        <CustomCursor />

        <Navbar
          scrollProgress={0}
          activeSection="certificates"
          currentRoute="certificates"
          onNavigate={(r, s) => navigateTo(r, s)}
          onWorkWithMeClick={() => navigateTo('home', 'contact')}
          onResumeClick={() => setIsResumeOpen(true)}
        />

        <main className="pt-20">
          <CertificatesPage
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
            onBackToHome={navigateToHome}
            onResumeClick={() => setIsResumeOpen(true)}
            onContactClick={() => navigateTo('home', 'contact')}
          />
        </main>

        {/* Certificate Modal */}
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />

        {/* Resume Modal */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />
      </div>
    );
  }

  // HOME PAGE (Narrative Journey)
  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f1f5f9] selection:bg-sky-500/30 selection:text-sky-200">
      {/* Fixed Viewport Progress Bar */}
      <ViewportProgressBar
        scrollProgress={scrollProgress}
        activeSection={activeSection}
      />

      {/* Interactive Cinematic Cursor with Glow & Stardust Trail */}
      <CustomCursor />

      {/* 1. Cinematic Continuous Background Engine */}
      <CinematicBackground
        scrollProgress={scrollProgress}
        mousePos={mousePos}
        activeStageIndex={activeStageIndex}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        currentRoute="home"
        onNavigate={(r, s) => navigateTo(r, s)}
        onWorkWithMeClick={() => scrollTo('contact')}
        onResumeClick={() => setIsResumeOpen(true)}
      />

      {/* 3. Main Continuous Narrative Document Flow */}
      <main className="relative z-10 space-y-8 sm:space-y-16">
        {/* HERO */}
        <HeroSection
          mousePos={mousePos}
          onBeginJourney={() => scrollTo('story')}
          onExploreWork={() => scrollTo('projects')}
          onResumeClick={() => setIsResumeOpen(true)}
        />

        {/* THE MAIN STORY */}
        <StoryJourneySection
          onStageChange={(idx) => setActiveStageIndex(idx)}
          onExploreProjects={() => scrollTo('projects')}
        />

        {/* ABOUT */}
        <AboutCinematic
          onResumeClick={() => setIsResumeOpen(true)}
        />

        {/* PROJECTS */}
        <ProjectsSection
          onSelectProject={(proj) => setSelectedProject(proj)}
          onLiveUrlClick={(proj) => setLiveNoticeProject(proj)}
          onViewAllProjects={() => navigateTo('projects')}
        />

        {/* EXPERIENCE */}
        <ExperienceSection />

        {/* SKILLS */}
        <SkillsConstellation />

        {/* CONTACT */}
        <ContactSection onAdminClick={navigateToAdmin} />
      </main>

      {/* Project Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onLiveUrlClick={(proj) => {
          setSelectedProject(null);
          setLiveNoticeProject(proj);
        }}
      />

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* Live Website Notice Modal */}
      <LiveWebsiteNoticeModal
        project={liveNoticeProject}
        onClose={() => setLiveNoticeProject(null)}
        onExploreSpec={() => {
          const p = liveNoticeProject;
          setLiveNoticeProject(null);
          setSelectedProject(p);
        }}
      />

      {/* Official Verified Resume Modal & Downloader */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
