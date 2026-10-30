
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA, ProjectData } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectData) => void;
  onLiveUrlClick: (project: ProjectData) => void;
  onViewAllProjects?: () => void;
}

const REPEAT_COUNT = 6;
const SCROLL_SPEED = 35;
const DRAG_THRESHOLD = 6;

export function ProjectsSection({
  onSelectProject,
  onLiveUrlClick,
  onViewAllProjects,
}: ProjectsSectionProps) {
  const { data } = usePortfolio();

  const projects = data?.projects || PORTFOLIO_DATA.projects;
  const gallerySourceProjects = projects;

  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const didDragRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);

  const galleryProjects = Array.from(
    { length: REPEAT_COUNT },
    () => gallerySourceProjects
  ).flat();

  // Continuous automatic scrolling
  useEffect(() => {
    const rail = railRef.current;

    if (!rail || gallerySourceProjects.length === 0) return;

    let animationId = 0;
    let previousTime = 0;

    const animate = (time: number) => {
      if (!previousTime) previousTime = time;

      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (!pausedRef.current && !draggingRef.current) {
        const firstCard = rail.firstElementChild as HTMLElement | null;
        const firstCardWidth =
          firstCard?.getBoundingClientRect().width ?? 0;

        const styles = window.getComputedStyle(rail);
        const gap = parseFloat(styles.columnGap) || 0;

        const loopWidth =
          gallerySourceProjects.length * (firstCardWidth + gap);

        if (loopWidth > 0) {
          rail.scrollLeft += SCROLL_SPEED * delta;

          if (rail.scrollLeft >= loopWidth) {
            rail.scrollLeft -= loopWidth;
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    rail.scrollLeft = 0;
    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [gallerySourceProjects.length]);

  // Start mouse / touch interaction
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const rail = railRef.current;
    if (!rail) return;

    draggingRef.current = true;
    didDragRef.current = false;
    pointerIdRef.current = event.pointerId;

    startXRef.current = event.clientX;
    startScrollLeftRef.current = rail.scrollLeft;

    pausedRef.current = true;

    // Capture the pointer on the project card, not the gallery rail.
    // This allows the card's click event to work on desktop.
    if (event.pointerType === 'mouse') {
      const target = event.target as HTMLElement;
      const captureTarget =
        target.closest('button') ?? event.currentTarget;

      try {
        captureTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore capture errors and allow normal pointer handling.
      }
    }
  };

  // Move gallery while dragging
  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      !draggingRef.current ||
      !railRef.current ||
      pointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const distance = event.clientX - startXRef.current;

    if (Math.abs(distance) > DRAG_THRESHOLD) {
      didDragRef.current = true;
    }

    if (didDragRef.current) {
      railRef.current.scrollLeft =
        startScrollLeftRef.current - distance;
    }
  };

  // End drag interaction
  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (pointerIdRef.current !== event.pointerId) return;

    draggingRef.current = false;
    pointerIdRef.current = null;

    pausedRef.current = isHovered;
  };

  // Handle cancelled pointer interaction
  const handlePointerCancel = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (pointerIdRef.current !== event.pointerId) return;

    draggingRef.current = false;
    pointerIdRef.current = null;
    didDragRef.current = false;

    pausedRef.current = isHovered;
  };

  // Prevent project selection only when the user actually dragged.
  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  };

  // Handle project selection
  const handleProjectClick = (project: ProjectData) => {
    soundEngine.playClick();
    onSelectProject(project);
  };

  return (
    <section
      id="projects"
      className="relative z-10 overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl space-y-12 sm:space-y-16">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <motion.div
            initial={{ y: 25 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/60 px-3.5 py-1.5 font-mono text-xs text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              FEATURED CREATIONS
            </div>

            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
              Things I Brought to Life
            </h2>

            <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
              A selection of projects I have brought to life through code,
              experimentation, and problem-solving.
            </p>

            <p className="font-mono text-xs text-slate-500">
              AUTO-SCROLLING · HOVER TO PAUSE · DRAG OR SWIPE
            </p>
          </motion.div>

          {onViewAllProjects && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onViewAllProjects();
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-sky-400/40 bg-sky-500/15 px-5 py-3 font-mono text-xs tracking-wider text-sky-300 transition hover:scale-105 hover:border-sky-400 hover:bg-sky-500/25 hover:text-white"
            >
              VIEW ALL PROJECTS ({projects.length})
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Continuous Gallery */}
        {gallerySourceProjects.length > 0 ? (
          <div>
            <div
              ref={railRef}
              role="region"
              aria-label="Featured projects gallery"
              tabIndex={0}
              onMouseEnter={() => {
                setIsHovered(true);
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                setIsHovered(false);

                if (!draggingRef.current) {
                  pausedRef.current = false;
                }
              }}
              onFocus={() => {
                pausedRef.current = true;
              }}
              onBlur={() => {
                if (!isHovered && !draggingRef.current) {
                  pausedRef.current = false;
                }
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onClickCapture={handleClickCapture}
              className="flex gap-5 overflow-x-auto overflow-y-hidden rounded-2xl px-4 pb-5 -mx-4 select-none cursor-grab active:cursor-grabbing sm:mx-0 sm:gap-7 sm:px-0"
              style={{
                scrollbarWidth: 'none',
                touchAction: 'pan-y',
                overscrollBehaviorX: 'contain',
              }}
            >
              {galleryProjects.map((project, index) => (
                <button
                  key={`${project.id}-${index}`}
                  type="button"
                  onClick={() => handleProjectClick(project)}
                  className="group relative w-[260px] shrink-0 overflow-hidden rounded-2xl border border-sky-500/25 bg-[#080d1a] text-left transition-colors duration-300 hover:border-sky-400/80 sm:w-[320px] lg:w-[380px]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 p-2 sm:p-3">
                    {typeof project.image === 'string' &&
                    project.image.trim() ? (
                      <img
                        src={project.image}
                        alt={`${project.title} project preview`}
                        draggable={false}
                        loading="lazy"
                        className="h-full w-full rounded-md border border-slate-700/80 bg-[#050811] object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950">
                        <span className="font-mono text-xs tracking-[0.25em] text-sky-300/70">
                          {project.title}
                        </span>
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-full border border-sky-400/30 bg-black/80 px-2.5 py-1 font-mono text-[10px] text-sky-300">
                      PROJECT{' '}
                      {String(
                        (index % gallerySourceProjects.length) + 1
                      ).padStart(2, '0')}
                    </span>

                    <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-slate-950 transition group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-sky-300 sm:text-xl">
                      {project.title}
                    </h3>

                    {project.tagline && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400 sm:text-sm">
                        {project.tagline}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">
            Projects will appear here soon.
          </p>
        )}

        {/* View All Banner */}
        {onViewAllProjects && (
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-sky-500/25 bg-gradient-to-r from-[#090f22]/90 via-[#070d1c]/90 to-[#040810]/95 p-6 shadow-2xl sm:flex-row sm:p-8">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 font-mono text-xs text-sky-400 sm:justify-start">
                <Layers className="h-3.5 w-3.5" />
                EXPANDED CATALOG
              </div>

              <h3 className="text-lg font-bold text-white sm:text-xl">
                Explore All {projects.length} Projects
              </h3>

              <p className="text-xs text-slate-400 sm:text-sm">
                Explore project descriptions, technologies, features, and
                available live links.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onViewAllProjects();
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 font-mono text-xs font-bold tracking-wider text-slate-950 shadow-lg shadow-sky-500/20 transition hover:scale-105 hover:bg-sky-400"
            >
              VIEW FULL PROJECTS ARCHIVE
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
