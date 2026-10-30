import { useState } from 'react';
import { Mail, Copy, Check, Send, Sparkles, ArrowRight, Github, Linkedin, MessageSquare, Phone, MapPin, Lock } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface ContactSectionProps {
  onAdminClick?: () => void;
}

export function ContactSection({ onAdminClick }: ContactSectionProps) {
  const { data } = usePortfolio();
  const profile = data?.profile || PORTFOLIO_DATA.profile;

  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [sentSuccess, setSentSuccess] = useState(false);

  const email = profile.email;

  const copyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    // Open default mail client with formatted subject and body
    const subject = encodeURIComponent(
      `Message from ${formState.name || 'Visitor'} (Portfolio Contact)`
    );
    const body = encodeURIComponent(
      `Hi Fathima,\n\n${formState.message}\n\nBest regards,\n${formState.name}\nEmail: ${formState.email}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <section
      id="contact"
      className="relative py-28 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* The Final Scene / Conversion Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-sky-400 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE NEXT CHAPTER</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase">
            HAVE AN IDEA?
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-300">
              LET&apos;S BUILD IT.
            </span>
          </h2>

          <p className="text-lg sm:text-xl font-mono text-sky-300 font-light">
            INTERESTED IN WORKING WITH ME? → LET&apos;S CONNECT
          </p>

          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
            Whether you are a recruiter looking for a disciplined full-stack engineer, an organization
            needing a production web platform, or a team with an ambitious digital vision.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Communication Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl border border-sky-500/20 bg-gradient-to-b from-[#090f20]/90 to-[#050811] backdrop-blur-xl shadow-2xl space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                  Direct Inquiries
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Get in Touch Directly
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Available for full-stack developer roles, client web applications, and collaborative engineering projects.
                </p>
              </div>

              {/* Email One-Click Copy Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Email Address</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">Active Inbox</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm text-sky-200 select-all font-semibold truncate">
                    {email}
                  </span>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="p-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 transition-colors shrink-0"
                    title="Copy email to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-[11px] font-mono text-emerald-400 animate-pulse">
                    ✓ Email address copied to clipboard!
                  </p>
                )}
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {typeof profile.phone === 'string' && profile.phone.trim() && (
                  <a
                    href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                    className="p-3 rounded-xl bg-black/60 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{profile.phone}</span>
                  </a>
                )}
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-slate-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Professional Channels
                </span>
                <div className="flex gap-2">
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400/40 text-slate-300 hover:text-white font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <span>LinkedIn Profile</span>
                  </a>
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400/40 text-slate-300 hover:text-white font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-sky-400" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Fast Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl border border-sky-500/20 bg-gradient-to-b from-[#080d19]/90 to-[#04060d] backdrop-blur-xl shadow-2xl space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                  Quick Message Dispatch
                </span>
                <h3 className="text-xl font-bold text-white">
                  Send a Direct Message
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-mono text-slate-300">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-400 text-slate-200 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-mono text-slate-300">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-400 text-slate-200 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-mono text-slate-300">
                  Message Details
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me about your team, project requirements, or idea you want to build..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-400 text-slate-200 text-xs font-mono focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                id="submit-message-btn"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold font-mono text-xs tracking-wider shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>TRANSMIT MESSAGE VIA MAIL</span>
                <Send className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {sentSuccess && (
                <p className="text-center text-xs font-mono text-emerald-400 pt-1">
                  ✓ Mail client initiated with your formatted message!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Permanent Portfolio Footer */}
        <div className="pt-16 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>FATHIMA SAHEERA • {profile.permanentMessage}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Engineered with React, Vite, Tailwind CSS &amp; Motion</span>
            {onAdminClick && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onAdminClick();
                }}
                className="opacity-25 hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-sky-400"
                title="Admin Control Center (or press Ctrl+Shift+A)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
