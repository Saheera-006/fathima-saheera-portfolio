import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, ExternalLink, GraduationCap, Briefcase, Code, Award, CheckCircle2, FileText, Phone, Mail, MapPin, Github, Linkedin, Globe } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { data } = usePortfolio();
  const portfolioData = data || PORTFOLIO_DATA;

  if (!isOpen) return null;

  const handlePrint = () => {
    soundEngine.playClick();
    const resumeUrl = portfolioData.profile?.resumeUrl;
    const printTarget = resumeUrl && !resumeUrl.endsWith('.html') ? resumeUrl : '/Fathima_Saheera_Resume.html';
    const printWindow = window.open(printTarget, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const handleDownload = () => {
    soundEngine.playChime(659.25);
    const targetUrl = portfolioData.profile?.resumeUrl || '/Fathima_Saheera_Resume.html';
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = targetUrl.endsWith('.pdf') ? 'Fathima_Saheera_J_Resume.pdf' : 'Fathima_Saheera_J_Resume.html';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#090d16] border border-sky-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Modal Header Bar */}
          <div className="px-6 py-4 border-b border-slate-800 bg-[#0c1220]/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>RESUME // FATHIMA SAHEERA J</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-normal">
                    VERIFIED
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  B.E. Computer Science &amp; Engineering &bull; Full-Stack Developer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-colors"
                title="Download formatted resume"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Open print view or save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Document Preview */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
            {portfolioData.profile?.resumeUrl ? (
              <iframe
                title="Uploaded resume preview"
                src={portfolioData.profile.resumeUrl}
                className="w-full min-h-[65vh] rounded-lg bg-white"
              />
            ) : (
            <>
            {/* Header info inside document */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">FATHIMA SAHEERA J</h1>
                  <p className="text-xs font-mono text-sky-400">Full-Stack Developer &amp; CSE Student (2023–2027)</p>
                </div>
                <div className="text-xs font-mono text-slate-400 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>Nagercoil, Tamil Nadu, India</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-sky-400" />
                    <span>+91 8015580602</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-sky-400" />
                    <span>saheera006@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1 text-xs font-mono">
                <a
                  href="https://github.com/Saheera-006/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-300 hover:text-sky-200 underline underline-offset-2"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>github.com/Saheera-006</span>
                </a>
                <span className="text-slate-600">&bull;</span>
                <a
                  href="https://www.linkedin.com/in/fathima-saheera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-300 hover:text-sky-200 underline underline-offset-2"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>linkedin.com/in/fathima-saheera</span>
                </a>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Interactive Portfolio &amp; App</span>
                </span>
              </div>
            </div>

            {/* Objective / Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>// Professional Summary</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                Final-year Computer Science and Engineering student at University College of Engineering Nagercoil (2023–2027) pursuing a career in full-stack software development. Hands-on experience building production-ready React-Firebase web applications and Flutter mobile applications. Strong foundations in data structures, algorithms, database systems, and UI/UX design.
              </p>
            </div>

            {/* Education */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>// Education</span>
              </h4>
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h5 className="font-semibold text-white text-xs sm:text-sm">
                      University College of Engineering Nagercoil
                    </h5>
                    <p className="text-xs text-sky-300">
                      Bachelor of Engineering (B.E.) in Computer Science and Engineering
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/20 text-sky-300">
                      2023 – 2027
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h5 className="font-semibold text-white text-xs sm:text-sm">
                      Government Higher Secondary School, Aloor
                    </h5>
                    <p className="text-xs text-slate-400">
                      Higher Secondary Certificate (HSC) &amp; SSLC
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-slate-400">
                      2021 – 2023
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience / Internships */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>// Experience &amp; Internships</span>
              </h4>
              <div className="space-y-3">
                {portfolioData.experience.map((exp) => (
                  <div key={exp.company} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h5 className="font-bold text-white text-xs sm:text-sm">{exp.role}</h5>
                        <p className="text-xs text-sky-300">{exp.company}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{exp.period}</span>
                    </div>
                    <p className="text-xs text-slate-300">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                <span>// Key Projects</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {portfolioData.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-xs sm:text-sm">{proj.title}</h5>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                        >
                          <span>{proj.liveUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tags.slice(0, 4).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-500/20 text-sky-300 text-[10px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                <span>// Technical Skills</span>
              </h4>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-mono text-sky-400 block mb-1">Languages:</span>
                  <span className="text-slate-300">Java, Python, C, C++, JavaScript (ES6+), Dart</span>
                </div>
                <div>
                  <span className="font-mono text-sky-400 block mb-1">Frontend &amp; Mobile:</span>
                  <span className="text-slate-300">React.js, Tailwind CSS, HTML5, CSS3, Flutter</span>
                </div>
                <div>
                  <span className="font-mono text-sky-400 block mb-1">Backend &amp; Databases:</span>
                  <span className="text-slate-300">Firebase (Firestore, Auth, Storage), Node.js, Express, MySQL</span>
                </div>
                <div>
                  <span className="font-mono text-sky-400 block mb-1">Tools &amp; Concepts:</span>
                  <span className="text-slate-300">Git, GitHub, Figma, VS Code, REST APIs, OOPs, Computer Networks</span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>// Certifications</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {portfolioData.certifications.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/50 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-200 block">{c.title}</span>
                      <span className="text-[10px] text-slate-400">{c.issuer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0c1220]/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-slate-400">
              Direct Contact: <a href="mailto:saheera006@gmail.com" className="text-sky-400 hover:underline">saheera006@gmail.com</a>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/25 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE RESUME (HTML/PDF)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
