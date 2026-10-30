
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Check,
  Globe,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { ProjectData } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onLiveUrlClick: (project: ProjectData) => void;
}

function allImagesCount(project: ProjectData) {
  return Array.from(
    new Set([project.image, ...(project.images || [])].filter(Boolean))
  ).length;
}

export function ProjectModal({
  project,
  onClose,
  onLiveUrlClick,
}: ProjectModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
    setIsFullscreenImage(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project || allImagesCount(project) < 2) return;

    const timer = window.setInterval(() => {
      setSelectedImageIndex(
        (current) => (current + 1) % allImagesCount(project)
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [project?.id, project?.image, project?.images?.join('|')]);

  if (!project) return null;

  // Aggregate primary cover image + optional gallery images
  const allImages = Array.from(
    new Set(
      [project.image, ...(project.images || [])].filter(Boolean) as string[]
    )
  );

  const activeImage = allImages[selectedImageIndex] || project.image;

  // Validate URLs before displaying action buttons
  const liveUrl = project.liveUrl?.trim();
  const repoUrl = project.repoUrl?.trim();

  const hasLiveUrl = Boolean(liveUrl && liveUrl !== '#');
  const hasRepoUrl = Boolean(repoUrl && repoUrl !== '#');

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto overscroll-y-contain bg-[#050811]">

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full min-h-screen h-auto max-w-none rounded-none border-0 sm:border-x border-sky-500/20 bg-[#080d19] shadow-2xl overflow-visible z-10 flex flex-col"
        >

          {/* Header Bar */}
          <div className="sticky top-0 z-20 px-4 sm:px-8 lg:px-12 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0a101f]/95 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="font-mono text-xs text-sky-300 uppercase tracking-wider">
                {project.title} // DEEP ARCHITECTURAL SPECIFICATION
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="w-full max-w-[1500px] mx-auto p-4 sm:p-8 lg:p-10 flex-none text-slate-200 overflow-visible">

            <div
              className={`grid grid-cols-1 ${
                allImages.length > 0 ? 'lg:grid-cols-2' : ''
              } gap-6 lg:gap-8 items-start`}
            >

              {/* Project Description */}
              <div className="min-w-0 space-y-6">

                {/* Project Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    ease: 'easeOut',
                  }}
                  className="rounded-2xl border border-sky-500/20 bg-[#0a1120]/80 p-5 sm:p-7 space-y-4 shadow-lg"
                >
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                    PROJECT OVERVIEW
                  </span>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {project.title}
                  </h1>

                  {project.subtitle && (
                    <p className="text-sm text-sky-300">
                      {project.subtitle}
                    </p>
                  )}

                  {project.tagline && (
                    <p className="text-sm font-mono text-sky-200">
                      {project.tagline}
                    </p>
                  )}

                  <p className="text-sm sm:text-base text-slate-300 leading-7 font-sans whitespace-pre-line">
                    {project.longDescription ||
                      project.description ||
                      'Project details will be added soon.'}
                  </p>

                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-[#0a1224] border border-sky-500/20 text-sky-300 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Implementation Details */}
                {project.architecture?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.08,
                      ease: 'easeOut',
                    }}
                    className="rounded-2xl border border-sky-500/20 bg-[#0a1120]/80 p-5 sm:p-7 space-y-4 shadow-lg"
                  >
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                      IMPLEMENTATION DETAILS
                    </span>

                    <div className="space-y-3">
                      {project.architecture.map((arch) => (
                        <div
                          key={arch.layer}
                          className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm"
                        >
                          <span className="font-mono text-sky-300 font-semibold block">
                            {arch.layer}
                          </span>

                          <span className="text-slate-300 font-sans mt-1 block leading-relaxed">
                            {arch.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Key Features */}
                {project.keyFeatures?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.12,
                      ease: 'easeOut',
                    }}
                    className="rounded-2xl border border-sky-500/20 bg-[#0a1120]/80 p-5 sm:p-7 space-y-4 shadow-lg"
                  >
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                      KEY FEATURES DELIVERED
                    </span>

                    <div className="space-y-3 text-sm text-slate-300 font-sans">
                      {project.keyFeatures.map((feat, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                        >
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

                          <span className="leading-relaxed">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Project Images */}
              {allImages.length > 0 && (
                <motion.aside
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  className="min-w-0 space-y-3 lg:sticky lg:top-24"
                >

                  {/* Main Image - Centered */}
                  <div className="relative w-full flex items-center justify-center rounded-2xl overflow-hidden border border-sky-500/25 bg-black/90 group">

                    <img
                      src={activeImage}
                      alt={`${project.title} screenshot ${selectedImageIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="block w-full h-auto max-h-[72vh] object-contain object-center bg-black"
                    />

                    {/* Previous / Next Buttons */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-sky-500 text-white hover:text-slate-950 border border-slate-700/80 transition-all cursor-pointer"
                          title="Previous image"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-sky-500 text-white hover:text-slate-950 border border-slate-700/80 transition-all cursor-pointer"
                          title="Next image"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Image Controls */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">

                      <span className="px-2.5 py-1 rounded-full bg-black/75 border border-slate-800 text-[10px] font-mono text-sky-300 backdrop-blur-sm">
                        {allImages.length > 1
                          ? `Image ${selectedImageIndex + 1} / ${allImages.length}`
                          : 'Project Screenshot'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setIsFullscreenImage(true)}
                        className="p-2 rounded-lg bg-black/75 hover:bg-sky-500/20 text-slate-300 hover:text-white border border-slate-800 pointer-events-auto transition-colors"
                        title="View fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Image Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            selectedImageIndex === idx
                              ? 'border-sky-400 ring-2 ring-sky-400/40'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${project.title} screenshot ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain bg-[#050811]"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 font-mono text-center">
                    {allImages.length} project image
                    {allImages.length === 1 ? '' : 's'} · select an image to view it
                  </p>
                </motion.aside>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 pt-5 pb-2 border-t border-slate-800 bg-[#080d19]/95 backdrop-blur-xl flex flex-wrap items-center justify-end gap-3">

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Close Spec
              </button>

              {/* Live Website */}
              {hasLiveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <Globe className="w-3.5 h-3.5" />

                  <span>
                    OPEN LIVE WEBSITE ({liveUrl!.replace(/^https?:\/\//, '')})
                  </span>

                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              )}

              {/* Source Code */}
              {hasRepoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>VIEW SOURCE CODE</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lightbox / Fullscreen Image Viewer */}
        {isFullscreenImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
            onClick={() => setIsFullscreenImage(false)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between pb-3 text-white">
                <span className="text-xs font-mono text-sky-400">
                  {project.title} &bull; Image {selectedImageIndex + 1} of {allImages.length}
                </span>

                <button
                  type="button"
                  onClick={() => setIsFullscreenImage(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img
                src={activeImage}
                alt="Fullscreen Preview"
                referrerPolicy="no-referrer"
                className="max-h-[82vh] w-auto max-w-full rounded-2xl border border-sky-500/30 object-contain shadow-2xl bg-black"
              />
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
