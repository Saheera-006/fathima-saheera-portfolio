import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderGit2,
  Award,
  Cpu,
  User,
  Plus,
  Trash2,
  Edit3,
  Save,
  ExternalLink,
  ArrowLeft,
  Database,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  X,
  Code,
  Menu,
  Image as ImageIcon,
  Upload,
  Eye,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  FileDown,
  FileText,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Search,
  Share2,
  Tag,
  Cloud,
} from 'lucide-react';
import { usePortfolioData, seedInitialFirestoreData } from '../../lib/portfolioService';
import {
  ProjectData,
  CertificationItem,
  SkillItem,
  ExperienceData,
  MetaTagsData,
} from '../../data/portfolioData';
import { soundEngine } from '../../utils/soundEffects';
import { uploadFileToStorage } from '../../lib/storageService';
import { ImageUploader } from './ImageUploader';
import { CloudStorageSettings } from './CloudStorageSettings';

interface AdminDashboardProps {
  onExit: () => void;
}

type TabType =
  | 'projects'
  | 'certifications'
  | 'experience'
  | 'skills'
  | 'profile'
  | 'education'
  | 'resume'
  | 'seo'
  | 'cloud';

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const {
    data,
    loading,
    syncStatus,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addSkill,
    updateSkill,
    deleteSkill,
    updateProfile,
    updateExperience,
    addExperience,
    updateExperienceItem,
    deleteExperience,
    updateAllData,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [educationItems, setEducationItems] = useState<Array<{id:string; institution:string; degree:string; years:string; status:string; statement:string}>>(data.profile.educationItems || [{ id: 'education-main', institution: data.profile.education.institution, degree: data.profile.education.degree, years: data.profile.education.years, status: data.profile.education.status, statement: data.profile.education.statement }, { id: 'education-school', institution: 'Government Higher Secondary School, Aloor', degree: 'HSC & SSLC', years: '2021 – 2023', status: '', statement: '' }]);

  useEffect(() => {
    setEducationItems(data.profile.educationItems || [{ id: 'education-main', institution: data.profile.education.institution, degree: data.profile.education.degree, years: data.profile.education.years, status: data.profile.education.status, statement: data.profile.education.statement }, { id: 'education-school', institution: 'Government Higher Secondary School, Aloor', degree: 'HSC & SSLC', years: '2021 – 2023', status: '', statement: '' }]);
  }, [data.profile.educationItems, data.profile.education.institution, data.profile.education.degree, data.profile.education.years, data.profile.education.status, data.profile.education.statement]);

  // Modals state
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);

  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Profile editable state
  const [profileForm, setProfileForm] = useState(data.profile);

  // Keep profileForm in sync when data loads
  const currentProfile = { ...data.profile, ...profileForm };

  const moveItemInSection = async (section: 'projects' | 'experience' | 'skills' | 'certifications', index: number, direction: -1 | 1) => {
    const items = [...data[section]];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    try {
      await updateAllData({ ...data, [section]: items } as typeof data);
      showToast(`${section[0].toUpperCase()}${section.slice(1)} order saved!`);
    } catch (error) {
      showToast('Could not save order. Please try again.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    soundEngine.playChime(659.25);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    soundEngine.playClick();
    sessionStorage.removeItem('saheera_admin_authenticated');
    onExit();
  };

  const handleSeedFirebase = async () => {
    if (!confirm('This will write the complete portfolio data structure into your Firebase Firestore project (fathima-saheera). Proceed?')) return;
    setSeedingLoading(true);
    soundEngine.playClick();
    const res = await seedInitialFirestoreData();
    setSeedingLoading(false);
    if (res.success) {
      showToast('Successfully seeded Firestore with default portfolio data! 🚀');
    } else {
      showToast(`Firebase error: ${res.error}`);
    }
  };

  // Direct quick photo update for a project card
  const handleQuickProjectCoverUpload = async (proj: ProjectData, file: File) => {
    try {
      showToast(`Uploading cover image to Cloud / Firebase for "${proj.title}"...`);
      const { url, source } = await uploadFileToStorage(file, 'projects');
      const updatedProj: ProjectData = { ...proj, image: url };
      await updateProject(updatedProj);
      showToast(`Cover photo updated for "${proj.title}" (${source === 'firebase_storage' ? 'Firebase Storage' : source === 'cloudinary' ? 'Cloudinary' : 'Optimized'})`);
    } catch (err: any) {
      showToast(`Image upload notice: ${err?.message || err}`);
    }
  };

  // Direct quick photo remove for a project card
  const handleQuickProjectCoverRemove = async (proj: ProjectData) => {
    if (confirm(`Remove cover image from project "${proj.title}"?`)) {
      const updatedProj: ProjectData = { ...proj, image: '' };
      await updateProject(updatedProj);
      showToast(`Cover photo removed for "${proj.title}". You can update it anytime.`);
    }
  };

  // Direct quick photo update for a certification card
  const handleQuickCertImageUpload = async (cert: CertificationItem, file: File) => {
    try {
      showToast(`Uploading certificate document to Cloud / Firebase...`);
      const { url } = await uploadFileToStorage(file, 'certificates');
      const updatedCert: CertificationItem = { ...cert, imageUrl: url };
      await updateCertification(updatedCert);
      showToast(`Certificate document updated for "${cert.title}"`);
    } catch (err: any) {
      showToast(`Certificate upload notice: ${err?.message || err}`);
    }
  };

  // Direct quick photo remove for a certification card
  const handleQuickCertImageRemove = async (cert: CertificationItem) => {
    if (confirm(`Remove certificate image from "${cert.title}"?`)) {
      const updatedCert: CertificationItem = { ...cert, imageUrl: '' };
      await updateCertification(updatedCert);
      showToast(`Certificate image removed from "${cert.title}".`);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#090e1a]/95 border-b border-sky-500/20 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSidebarOpen((v) => !v);
              setIsMobileMenuOpen((v) => !v);
            }}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-slate-700/80 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            title="Toggle Admin Sidebar Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onExit}
            className="hidden sm:flex p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Return to public portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white tracking-wide font-mono flex items-center gap-1.5">
                <span>ADMIN CONSOLE</span>
                <span className="text-slate-600 font-normal">//</span>
                <span className="text-sky-400">SAHEERA</span>
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{syncStatus === 'synced' ? 'Firebase Live' : 'Firebase Ready'}</span>
              </span>
            </div>
            <p className="hidden sm:block text-[11px] font-mono text-slate-400">
              Active: <span className="text-sky-400 capitalize">{activeTab}</span> &bull; <span className="text-slate-400">Project: fathima-saheera</span> &bull; <span className="text-slate-500">Cloudinary: kxbonqcr</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleSeedFirebase}
            disabled={seedingLoading}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Upload default structure to Firestore"
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Sync Default</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Log Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Area: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Slide-Out Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#080d18] border-r border-sky-500/25 shadow-2xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-500/40 relative shadow-sm">
                        <img
                          src="/cute_hijabi_headphones_1790087241274.jpg"
                          alt="Saheera"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">Fathima Saheera</div>
                        <div className="text-[10px] font-mono text-sky-400">Admin Control Panel</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation Links Mobile */}
                  <div className="space-y-1.5">
                    <SidebarItem
                      active={activeTab === 'projects'}
                      onClick={() => {
                        setActiveTab('projects');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<FolderGit2 className="w-4 h-4" />}
                      label="Projects"
                      count={data.projects.length}
                    />
                    <SidebarItem
                      active={activeTab === 'certifications'}
                      onClick={() => {
                        setActiveTab('certifications');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<Award className="w-4 h-4" />}
                      label="Certifications"
                      count={data.certifications.length}
                    />
                    <SidebarItem
                      active={activeTab === 'experience'}
                      onClick={() => {
                        setActiveTab('experience');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<Briefcase className="w-4 h-4" />}
                      label="Experience"
                      count={data.experience.length}
                    />
                    <SidebarItem
                      active={activeTab === 'skills'}
                      onClick={() => {
                        setActiveTab('skills');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<Cpu className="w-4 h-4" />}
                      label="Skills Ecosystem"
                      count={data.skills.length}
                    />
                    <SidebarItem
                      active={activeTab === 'profile'}
                      onClick={() => {
                        setActiveTab('profile');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<User className="w-4 h-4" />}
                      label="Profile & Hero"
                    />
                    <SidebarItem
                      active={activeTab === 'education'}
                      onClick={() => {
                        setActiveTab('education');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<GraduationCap className="w-4 h-4" />}
                      label="Education & About"
                    />
                    <SidebarItem
                      active={activeTab === 'resume'}
                      onClick={() => {
                        setActiveTab('resume');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<FileText className="w-4 h-4" />}
                      label="Resume Manager"
                    />
                    <SidebarItem
                      active={activeTab === 'seo'}
                      onClick={() => {
                        setActiveTab('seo');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<Globe className="w-4 h-4" />}
                      label="SEO & Meta Tags"
                    />
                    <SidebarItem
                      active={activeTab === 'cloud'}
                      onClick={() => {
                        setActiveTab('cloud');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<Cloud className="w-4 h-4" />}
                      label="Cloud & Storage Hub"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onExit}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Public Website</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden md:flex flex-col justify-between border-r border-sky-500/20 bg-[#080d18] transition-all duration-300 ease-in-out z-30 shrink-0 ${
            isSidebarOpen ? 'w-64 p-4' : 'w-20 p-3'
          }`}
        >
          <div className="space-y-6 flex flex-col items-center">
            {isSidebarOpen ? (
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-500/40 relative shadow-sm shrink-0">
                    <img
                      src="/cute_hijabi_headphones_1790087241274.jpg"
                      alt="Saheera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white font-mono truncate">Fathima Saheera</div>
                    <div className="text-[10px] font-mono text-sky-400 truncate">Portfolio Admin</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-500/40 relative shadow-sm shrink-0 mb-2">
                <img
                  src="/cute_hijabi_headphones_1790087241274.jpg"
                  alt="Saheera"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
              </div>
            )}

            {/* Sidebar Navigation Items */}
            <nav className="space-y-1.5 w-full">
              <SidebarItem
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
                icon={<FolderGit2 className="w-4 h-4" />}
                label="Projects"
                count={data.projects.length}
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'certifications'}
                onClick={() => setActiveTab('certifications')}
                icon={<Award className="w-4 h-4" />}
                label="Certifications"
                count={data.certifications.length}
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'experience'}
                onClick={() => setActiveTab('experience')}
                icon={<Briefcase className="w-4 h-4" />}
                label="Experience"
                count={data.experience.length}
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'skills'}
                onClick={() => setActiveTab('skills')}
                icon={<Cpu className="w-4 h-4" />}
                label="Skills Ecosystem"
                count={data.skills.length}
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                icon={<User className="w-4 h-4" />}
                label="Profile & Hero"
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'education'}
                onClick={() => setActiveTab('education')}
                icon={<GraduationCap className="w-4 h-4" />}
                label="Education & About"
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'resume'}
                onClick={() => setActiveTab('resume')}
                icon={<FileText className="w-4 h-4" />}
                label="Resume Manager"
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'seo'}
                onClick={() => setActiveTab('seo')}
                icon={<Globe className="w-4 h-4" />}
                label="SEO & Meta Tags"
                collapsed={!isSidebarOpen}
              />
              <SidebarItem
                active={activeTab === 'cloud'}
                onClick={() => setActiveTab('cloud')}
                icon={<Cloud className="w-4 h-4" />}
                label="Cloud & Storage Hub"
                collapsed={!isSidebarOpen}
              />
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="w-full pt-4 border-t border-slate-800/80 space-y-2">
            {isSidebarOpen ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="truncate">Firebase Storage</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-1.5 px-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                  <span>Collapse Sidebar</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="w-full p-2 rounded-xl text-slate-400 hover:text-sky-300 hover:bg-slate-800/80 flex items-center justify-center transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* 1. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Projects Management</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                      {data.projects.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload and manage project cover images and multiple screenshots via Firebase Storage. All edits sync directly to Firebase Firestore.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsAddingProject(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all w-fit shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.projects.map((proj, itemIndex) => {
                  const galleryCount = (proj.images || []).length;
                  return (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-[#090d18] border border-sky-500/15 hover:border-sky-400/30 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                              {proj.subtitle}
                            </span>
                            <h3 className="text-base font-bold text-white mt-0.5">{proj.title}</h3>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button type="button" disabled={itemIndex===0} onClick={() => void moveItemInSection('projects', itemIndex, -1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move project up" aria-label="Move project up">↑</button>
                            <button type="button" disabled={itemIndex===data.projects.length-1} onClick={() => void moveItemInSection('projects', itemIndex, 1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move project down" aria-label="Move project down">↓</button>
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                setEditingProject(proj);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit project specifications and images"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Delete project "${proj.title}"?`)) {
                                  soundEngine.playClick();
                                  await deleteProject(proj.id);
                                  showToast(`Deleted "${proj.title}"`);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Visual Image Preview & Quick Controls */}
                        <div className="relative rounded-xl overflow-hidden border border-sky-500/20 bg-slate-950 aspect-video group">
                          {proj.image ? (
                            <img
                              src={proj.image}
                              alt={proj.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1.5">
                              <ImageIcon className="w-8 h-8 opacity-40 text-sky-400" />
                              <span className="text-xs font-mono">No Cover Photo</span>
                            </div>
                          )}

                          {/* Hover Quick Actions Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
                            {/* Update Cover Photo Button */}
                            <label className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Update Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleQuickProjectCoverUpload(proj, file);
                                }}
                              />
                            </label>

                            {/* Remove Photo Button */}
                            {proj.image && (
                              <button
                                type="button"
                                onClick={() => handleQuickProjectCoverRemove(proj)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-mono text-[11px] border border-rose-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            )}

                            {proj.image && (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(proj.image)}
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 cursor-pointer"
                                title="View Large"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 rounded bg-black/70 border border-slate-800 text-[10px] font-mono text-sky-300">
                              Cover Photo
                            </span>
                            {galleryCount > 0 && (
                              <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-[10px] font-mono text-sky-300 flex items-center gap-1">
                                <span>📷 +{galleryCount} Gallery Photos</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Role: <span className="text-sky-300">{proj.role}</span></span>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setEditingProject(proj);
                          }}
                          className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                        >
                          <span>Manage Photos &amp; Spec &rarr;</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Certifications &amp; Credentials</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                      {data.certifications.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage course credentials, digital documents, and verification links. Remember: certificate images are hidden on the home page and displayed when viewing the certificate modal!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsAddingCert(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all w-fit shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certifications.map((cert, itemIndex) => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-2xl bg-[#090d18] border border-sky-500/15 hover:border-sky-400/30 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-[10px] font-mono text-sky-300">
                            {cert.issuer}
                          </span>
                          <h3 className="text-base font-bold text-white mt-2 leading-snug">{cert.title}</h3>
                          <p className="text-xs font-mono text-slate-400 mt-1">{cert.category}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button type="button" disabled={itemIndex===0} onClick={() => void moveItemInSection('certifications', itemIndex, -1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move certificate up" aria-label="Move certificate up">↑</button>
                          <button type="button" disabled={itemIndex===data.certifications.length-1} onClick={() => void moveItemInSection('certifications', itemIndex, 1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move certificate down" aria-label="Move certificate down">↓</button>
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setEditingCert(cert);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit certification"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Delete certification "${cert.title}"?`)) {
                                soundEngine.playClick();
                                await deleteCertification(cert.id);
                                showToast(`Deleted "${cert.title}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete certification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Certificate Photo / Document preview and Update / Remove buttons */}
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                            <span>Certificate Document:</span>
                          </span>
                          {cert.imageUrl ? (
                            <span className="text-emerald-400 text-[10px]">Attached</span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">No image attached</span>
                          )}
                        </div>

                        {cert.imageUrl ? (
                          <div className="relative rounded-lg overflow-hidden border border-sky-500/25 bg-black/60 h-28 group">
                            <img
                              src={cert.imageUrl}
                              alt={cert.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="px-2.5 py-1 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-[10px] font-bold cursor-pointer flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                <span>Update Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleQuickCertImageUpload(cert, file);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleQuickCertImageRemove(cert)}
                                className="px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-mono text-[10px] border border-rose-500/30 cursor-pointer"
                              >
                                Remove
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(cert.imageUrl!)}
                                className="p-1 rounded-md bg-slate-800 text-slate-200"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <label className="flex-1 py-2 px-3 rounded-lg border border-dashed border-sky-500/40 bg-sky-950/20 hover:bg-sky-500/10 text-sky-300 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5 text-sky-400" />
                              <span>Upload Certificate Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleQuickCertImageUpload(cert, file);
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{cert.date || 'Completed'}</span>
                      {cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-300 hover:underline flex items-center gap-1"
                        >
                          <span>Verification Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Experience &amp; Internships</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                      {data.experience.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage internships, industry roles, and professional contributions with live Firestore sync.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsAddingExp(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all w-fit shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#090d18] border border-sky-500/15 hover:border-sky-400/30 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{exp.role}</h3>
                        <p className="text-xs font-mono text-sky-400">{exp.company} &bull; {exp.tag}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 mr-2">{exp.period}</span>
                        <button type="button" disabled={idx===0} onClick={() => void moveItemInSection('experience', idx, -1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move experience up" aria-label="Move experience up">↑</button>
                        <button type="button" disabled={idx===data.experience.length-1} onClick={() => void moveItemInSection('experience', idx, 1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move experience down" aria-label="Move experience down">↓</button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setEditingExpIndex(idx);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit experience"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Delete experience entry for "${exp.company}"?`)) {
                              soundEngine.playClick();
                              await deleteExperience(idx);
                              showToast(`Deleted experience at ${exp.company}`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((s, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Skills Ecosystem</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                      {data.skills.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage languages, frontend libraries, cloud backends, and CS foundational competencies.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsAddingSkill(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all w-fit shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.skills.map((skill, itemIndex) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-xl bg-[#090d18] border border-sky-500/15 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{skill.name}</span>

                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{skill.description}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" disabled={itemIndex===0} onClick={() => void moveItemInSection('skills', itemIndex, -1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move skill up" aria-label="Move skill up">↑</button>
                      <button type="button" disabled={itemIndex===data.skills.length-1} onClick={() => void moveItemInSection('skills', itemIndex, 1)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30" title="Move skill down" aria-label="Move skill down">↓</button>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setEditingSkill(skill);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete skill "${skill.name}"?`)) {
                            soundEngine.playClick();
                            await deleteSkill(skill.name);
                            showToast(`Deleted skill "${skill.name}"`);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PROFILE & HERO TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Profile, Hero &amp; Contact Info</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update headlines, contact details, social links, and bio statement with live sync to Firebase.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#090d18] border border-sky-500/20 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Full Name:</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Role Title:</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Hero Headline:</label>
                    <input
                      type="text"
                      value={profileForm.heroHeadline}
                      onChange={(e) => setProfileForm({ ...profileForm, heroHeadline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Hero Subheadline:</label>
                    <input
                      type="text"
                      value={profileForm.heroSubheadline}
                      onChange={(e) => setProfileForm({ ...profileForm, heroSubheadline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Permanent Idea Message (Conviction):</label>
                    <input
                      type="text"
                      value={profileForm.permanentMessage}
                      onChange={(e) => setProfileForm({ ...profileForm, permanentMessage: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Email Address:</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Phone Number:</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Location:</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">GitHub Profile URL:</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.github}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, github: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">LinkedIn Profile URL:</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.linkedin}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Engineering Approach / Bio:</label>
                  <textarea
                    rows={3}
                    value={profileForm.approach}
                    onChange={(e) => setProfileForm({ ...profileForm, approach: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:border-sky-400 focus:outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      soundEngine.playClick();
                      await updateProfile(profileForm);
                      showToast('Profile information successfully saved to Firebase!');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile to Firebase</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. EDUCATION & ABOUT TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Education &amp; Academic Credentials</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edit university, degree, academic years, and formal statement displayed on the About section.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#090d18] border border-sky-500/20 space-y-4">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-white">Education Entries</h3><button type="button" onClick={() => setEducationItems(old => [...old, {id: `education-${Date.now()}`, institution:'', degree:'', years:'', status:'', statement:''}])} className="px-3 py-2 rounded-lg bg-sky-500 text-slate-950 text-xs font-bold">+ Add Education</button></div>
                {educationItems.map((item, index) => <div key={item.id} className="space-y-3 p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                  <div className="flex justify-between items-center"><span className="text-xs font-mono text-sky-300">Education {index+1}</span><div className="flex items-center gap-2"><button type="button" disabled={index===0} onClick={() => setEducationItems(old => { const next=[...old]; [next[index-1],next[index]]=[next[index],next[index-1]]; return next; })} className="px-2 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-30" aria-label="Move education up">↑</button><button type="button" disabled={index===educationItems.length-1} onClick={() => setEducationItems(old => { const next=[...old]; [next[index+1],next[index]]=[next[index],next[index+1]]; return next; })} className="px-2 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-30" aria-label="Move education down">↓</button><button type="button" onClick={() => setEducationItems(old => old.filter(entry => entry.id !== item.id))} className="text-rose-300 text-xs flex items-center gap-1"><Trash2 className="w-3 h-3"/> Delete</button></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(['institution','degree','years','status'] as const).map(field => <input key={field} value={item[field]} placeholder={field[0].toUpperCase()+field.slice(1)} onChange={e => setEducationItems(old => old.map(entry => entry.id===item.id ? {...entry,[field]:e.target.value} : entry))} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs" />)}
                  </div>
                  <textarea value={item.statement} placeholder="Education summary" onChange={e => setEducationItems(old => old.map(entry => entry.id===item.id ? {...entry,statement:e.target.value} : entry))} rows={2} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs" />
                </div>)}
                <button type="button" onClick={async () => { const first=educationItems[0]; const updated={...profileForm, educationItems, ...(first ? {education:{...profileForm.education, institution:first.institution, degree:first.degree, years:first.years, status:first.status, statement:first.statement}} : {})}; setProfileForm(updated); await updateProfile(updated); showToast('Education entries saved to Firebase!'); }} className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs">Save Education Changes</button>
              </div>

              <div className="p-6 rounded-2xl bg-[#090d18] border border-sky-500/20 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">University / College:</label>
                    <input
                      type="text"
                      value={profileForm.education.institution}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, institution: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Degree &amp; Branch:</label>
                    <input
                      type="text"
                      value={profileForm.education.degree}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, degree: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Academic Years:</label>
                    <input
                      type="text"
                      value={profileForm.education.years}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, years: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Current Academic Status:</label>
                    <input
                      type="text"
                      value={profileForm.education.status}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, status: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Formal Statement / Profile Summary:</label>
                  <textarea
                    rows={4}
                    value={profileForm.education.statement}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        education: { ...profileForm.education, statement: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:border-sky-400 focus:outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      soundEngine.playClick();
                      await updateProfile(profileForm);
                      showToast('Education details saved to Firebase!');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Education Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. RESUME MANAGER TAB */}
          {activeTab === 'resume' && (
            <ResumeManagerSection
              currentResumeUrl={profileForm.resumeUrl}
              onUpdateResumeUrl={async (newUrl) => {
                const updated = { ...profileForm, resumeUrl: newUrl };
                setProfileForm(updated);
                await updateProfile(updated);
                showToast('Resume updated and saved to Firebase!');
              }}
            />
          )}

          {/* 8. SEO & META TAGS TAB */}
          {activeTab === 'seo' && (
            <SeoManagerSection
              initialSeo={profileForm.seo}
              profileName={profileForm.name}
              onSaveSeo={async (updatedSeo) => {
                const updated = { ...profileForm, seo: updatedSeo };
                setProfileForm(updated);
                await updateProfile(updated);
                showToast('SEO & Meta Tags successfully saved to Firebase!');
              }}
            />
          )}

          {/* 9. CLOUD & STORAGE HUB */}
          {activeTab === 'cloud' && (
            <CloudStorageSettings
              syncStatus={syncStatus}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* MODAL: Fullscreen Image Viewer */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-xs font-mono text-sky-400">Media Preview</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImage}
              alt="Media Preview"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto max-w-full rounded-2xl border border-sky-500/30 object-contain shadow-2xl bg-black/60"
            />
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Project */}
      {(isAddingProject || editingProject) && (
        <ProjectEditorModal
          initial={editingProject}
          onClose={() => {
            setIsAddingProject(false);
            setEditingProject(null);
          }}
          onSave={async (project) => {
            if (editingProject) {
              await updateProject(project);
              showToast(`Updated project "${project.title}"!`);
            } else {
              await addProject(project);
              showToast(`Added project "${project.title}"!`);
            }
            setIsAddingProject(false);
            setEditingProject(null);
          }}
        />
      )}

      {/* MODAL: Add / Edit Certification */}
      {(isAddingCert || editingCert) && (
        <CertificationEditorModal
          initial={editingCert}
          onClose={() => {
            setIsAddingCert(false);
            setEditingCert(null);
          }}
          onSave={async (cert) => {
            if (editingCert) {
              await updateCertification(cert);
              showToast(`Updated certification "${cert.title}"!`);
            } else {
              await addCertification(cert);
              showToast(`Added certification "${cert.title}"!`);
            }
            setIsAddingCert(false);
            setEditingCert(null);
          }}
        />
      )}

      {/* MODAL: Add / Edit Experience */}
      {(isAddingExp || editingExpIndex !== null) && (
        <ExperienceEditorModal
          initial={editingExpIndex !== null ? data.experience[editingExpIndex] : null}
          onClose={() => {
            setIsAddingExp(false);
            setEditingExpIndex(null);
          }}
          onSave={async (exp) => {
            if (editingExpIndex !== null) {
              await updateExperienceItem(editingExpIndex, exp);
              showToast(`Updated experience at "${exp.company}"!`);
            } else {
              await addExperience(exp);
              showToast(`Added experience at "${exp.company}"!`);
            }
            setIsAddingExp(false);
            setEditingExpIndex(null);
          }}
        />
      )}

      {/* MODAL: Add / Edit Skill */}
      {(isAddingSkill || editingSkill) && (
        <SkillEditorModal
          initial={editingSkill}
          onClose={() => {
            setIsAddingSkill(false);
            setEditingSkill(null);
          }}
          onSave={async (skill) => {
            if (editingSkill) {
              await updateSkill(skill);
              showToast(`Updated skill "${skill.name}"!`);
            } else {
              await addSkill(skill);
              showToast(`Added skill "${skill.name}"!`);
            }
            setIsAddingSkill(false);
            setEditingSkill(null);
          }}
        />
      )}
    </div>
  );
}

// ----------------- SUB-COMPONENTS -----------------

function SidebarItem({
  active,
  onClick,
  icon,
  label,
  count,
  collapsed,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
  collapsed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        soundEngine.playClick();
        onClick();
      }}
      title={collapsed ? label : undefined}
      className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs transition-all flex items-center cursor-pointer ${
        collapsed ? 'justify-center' : 'justify-between'
      } ${
        active
          ? 'bg-sky-500/15 border border-sky-400/40 text-sky-200 font-bold shadow-sm'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-sky-400' : 'text-slate-400'}>{icon}</span>
        {!collapsed && <span className="font-medium">{label}</span>}
      </div>
      {!collapsed && count !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            active ? 'bg-sky-500/30 text-sky-300 font-semibold' : 'bg-slate-800/90 text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ----------------- RESUME MANAGER SECTION -----------------

function ResumeManagerSection({
  currentResumeUrl,
  onUpdateResumeUrl,
}: {
  currentResumeUrl?: string;
  onUpdateResumeUrl: (url: string) => Promise<void>;
}) {
  const [urlInput, setUrlInput] = useState(currentResumeUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus(`Uploading "${file.name}" to Firebase Storage...`);
      const { url } = await uploadFileToStorage(file, 'resume');
      setUrlInput(url);
      await onUpdateResumeUrl(url);
      setUploadStatus('Resume uploaded successfully to Firebase Storage!');
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      alert(`Resume upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveResume = async () => {
    if (confirm('Remove current resume document? (Default HTML resume format will be used as fallback)')) {
      setUrlInput('');
      await onUpdateResumeUrl('');
    }
  };

  const handleSaveUrl = async () => {
    await onUpdateResumeUrl(urlInput);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Resume Management</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
            Firebase Enabled
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Upload and update your official resume PDF or document dynamically. Any visitor clicking "Download Resume" or "Print / PDF" will access this file.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#090d18] border border-sky-500/20 space-y-6 max-w-3xl">
        {/* Status indicator */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Current Active Resume File:</span>
            </span>
            {currentResumeUrl ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                Custom File Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                Default HTML Template
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-sky-300 break-all bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            {currentResumeUrl || '/Fathima_Saheera_Resume.html (Built-in Web Spec)'}
          </div>
        </div>

        {/* Upload & Update Buttons */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-300 block">
            Update Resume Document:
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {/* Upload / Update Button */}
            <label className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading to Firebase...' : 'Upload / Update Resume File'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.html"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* Remove Button */}
            {currentResumeUrl && (
              <button
                type="button"
                onClick={handleRemoveResume}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove File</span>
              </button>
            )}

            {/* Test Download Button */}
            <a
              href={currentResumeUrl || '/Fathima_Saheera_Resume.html'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Test / Open Resume</span>
            </a>
          </div>

          {uploadStatus && (
            <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{uploadStatus}</span>
            </p>
          )}
        </div>

        {/* Manual URL Input */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <label className="text-xs font-mono text-slate-300">
            Or Set Direct Resume URL (Firebase Storage / Cloud Drive):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://firebasestorage.googleapis.com/... or /Fathima_Saheera_Resume.pdf"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveUrl}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save URL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- PROJECT EDITOR MODAL -----------------

function ProjectEditorModal({
  initial,
  onClose,
  onSave,
}: {
  initial: ProjectData | null;
  onClose: () => void;
  onSave: (p: ProjectData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<ProjectData>(
    initial || {
      id: `proj-${Date.now()}`,
      title: '',
      subtitle: 'Full-Stack Platform',
      tagline: 'Modern Digital Experience',
      description: '',
      longDescription: '',
      role: 'Full-Stack Developer',
      image: '/src/assets/images/dynamoz_hero_real_1790085000814.jpg',
      images: [],
      tags: ['React', 'Firebase', 'Tailwind CSS'],
      liveUrl: 'https://example.web.app',
      repoUrl: 'https://github.com/Saheera-006/',
      metrics: [
        { label: 'Latency', value: '<200ms' },
        { label: 'Uptime', value: '99.9%' },
      ],
      keyFeatures: ['Feature 1', 'Feature 2'],
      architecture: [
        { layer: 'Frontend', description: 'React with Vite' },
        { layer: 'Backend', description: 'Firebase Cloud Functions' },
      ],
    }
  );

  const [tagsString, setTagsString] = useState(formData.tags.join(', '));
  const [featuresString, setFeaturesString] = useState(formData.keyFeatures.join('\n'));
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Cover Image upload to Firebase Storage
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const { url } = await uploadFileToStorage(file, 'projects');
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      alert(`Cover upload error: ${err.message}`);
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Add new image to Gallery
  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingGallery(true);
      const { url } = await uploadFileToStorage(file, 'projects');
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
    } catch (err: any) {
      alert(`Gallery upload error: ${err.message}`);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Update a specific image in the Gallery
  const handleUpdateGalleryImage = async (index: number, file: File) => {
    try {
      setIsUploadingGallery(true);
      const { url } = await uploadFileToStorage(file, 'projects');
      setFormData((prev) => {
        const copy = [...(prev.images || [])];
        copy[index] = url;
        return { ...prev, images: copy };
      });
    } catch (err: any) {
      alert(`Gallery image update error: ${err.message}`);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Remove a specific image in the Gallery
  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => {
      const copy = [...(prev.images || [])];
      copy.splice(index, 1);
      return { ...prev, images: copy };
    });
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), galleryUrlInput.trim()],
    }));
    setGalleryUrlInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated: ProjectData = {
      ...formData,
      tags: tagsString.split(',').map((t) => t.trim()).filter(Boolean),
      keyFeatures: featuresString.split('\n').map((f) => f.trim()).filter(Boolean),
    };
    await onSave(updated);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#090d18] border border-sky-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-sky-400" />
            <span>{initial ? 'EDIT PROJECT' : 'ADD NEW PROJECT'}</span>
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Project Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g. Dynamoz'26"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Subtitle / Category:</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                required
                placeholder="e.g. Symposium Platform"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Role:</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Tagline:</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 1. COVER PHOTO MANAGEMENT (With both Update and Remove options) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-300 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                <span>Primary Front Cover Photo:</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Displayed in home project cards &amp; header
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Thumbnail preview */}
              <div className="sm:col-span-4 relative rounded-xl overflow-hidden border border-sky-500/30 bg-black aspect-video flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-500 text-xs font-mono text-center p-2">
                    No image set
                  </div>
                )}
              </div>

              {/* Action controls: UPDATE & REMOVE */}
              <div className="sm:col-span-8 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingCover ? 'Uploading to Firebase...' : 'Update / Replace Cover Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                      className="hidden"
                    />
                  </label>

                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">Or URL:</span>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or stored download URL"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. MULTIPLE GALLERY PHOTOS MANAGEMENT */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Multiple Gallery Photos (Optional):</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {(formData.images || []).length} photo(s) added
              </span>
            </div>

            {/* List of gallery photos with UPDATE and REMOVE buttons */}
            {(formData.images || []).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(formData.images || []).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0">
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-sky-300 text-center">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        Gallery Photo #{idx + 1}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* Update Photo button */}
                        <label className="px-2 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-colors border border-sky-500/30">
                          <Upload className="w-3 h-3" />
                          <span>Update</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUpdateGalleryImage(idx, file);
                            }}
                            className="hidden"
                          />
                        </label>

                        {/* Remove Photo button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-mono text-[10px] flex items-center gap-1 transition-colors border border-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-500 py-1">
                No additional gallery screenshots attached yet. You can add multiple screenshots for visitors to browse in the Project Modal.
              </p>
            )}

            {/* Add new gallery photo controls */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              <label className="px-3 py-1.5 rounded-xl bg-sky-950 hover:bg-sky-900/80 text-sky-300 border border-sky-500/40 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                <span>{isUploadingGallery ? 'Uploading to Firebase...' : '+ Upload & Add Gallery Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddGalleryImage}
                  disabled={isUploadingGallery}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="Or enter gallery image URL..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={!galleryUrlInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs disabled:opacity-40 cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Live Website URL:</label>
              <input
                type="text"
                value={formData.liveUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">GitHub Repo URL:</label>
              <input
                type="text"
                value={formData.repoUrl || ''}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Short Summary / Description:</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-sky-400 focus:outline-none font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Deep Architectural / Engineering Context:</label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              required
              placeholder="Deep engineering specification displayed inside the project modal..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-sky-400 focus:outline-none font-sans"
            />
          </div>
          
{/* Implementation Details */}
<div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-sky-500/25">
  <div className="flex items-center justify-between gap-3">
    <div>
      <h4 className="text-xs font-mono font-bold text-sky-300">
        IMPLEMENTATION DETAILS
      </h4>
      <p className="text-[10px] font-mono text-slate-500 mt-1">
        Explain the technologies and architecture of your project.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          architecture: [
            ...(prev.architecture || []),
            { layer: '', description: '' },
          ],
        }))
      }
      className="shrink-0 px-3 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-mono text-xs cursor-pointer"
    >
      + Add Detail
    </button>
  </div>

  {(formData.architecture || []).length === 0 ? (
    <p className="text-xs font-mono text-slate-500 py-2">
      No implementation details yet. Click "+ Add Detail" to add one.
    </p>
  ) : (
    <div className="space-y-3">
      {(formData.architecture || []).map((item, index) => (
        <div
          key={index}
          className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-sky-400">
              DETAIL #{index + 1}
            </span>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  architecture: (prev.architecture || []).filter(
                    (_, i) => i !== index
                  ),
                }))
              }
              className="text-[10px] font-mono text-rose-300 hover:text-rose-200 cursor-pointer"
            >
              Remove
            </button>
          </div>

          <input
            type="text"
            value={item.layer}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                architecture: (prev.architecture || []).map((detail, i) =>
                  i === index
                    ? { ...detail, layer: e.target.value }
                    : detail
                ),
              }))
            }
            placeholder="Layer title (e.g. Frontend, Database, Security)"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
          />

          <textarea
            rows={2}
            value={item.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                architecture: (prev.architecture || []).map((detail, i) =>
                  i === index
                    ? { ...detail, description: e.target.value }
                    : detail
                ),
              }))
            }
            placeholder="Describe how this layer is implemented..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:border-sky-400 focus:outline-none resize-y"
          />
        </div>
      ))}
    </div>
  )}
</div>


          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Tags (comma separated):</label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="React, Firebase, Tailwind CSS"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Key Features (one per line):</label>
            <textarea
              rows={3}
              value={featuresString}
              onChange={(e) => setFeaturesString(e.target.value)}
              placeholder="Real-time multi-stage evaluation&#10;Google Gemini integration"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-sky-400 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save to Firebase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- CERTIFICATION EDITOR MODAL -----------------

function CertificationEditorModal({
  initial,
  onClose,
  onSave,
}: {
  initial: CertificationItem | null;
  onClose: () => void;
  onSave: (c: CertificationItem) => Promise<void>;
}) {
  const [form, setForm] = useState<CertificationItem>(
    initial || {
      id: `cert-${Date.now()}`,
      title: '',
      issuer: 'Infosys Springboard',
      category: 'Programming & Logic',
      date: 'Completed',
      certificateUrl: '',
      imageUrl: '',
    }
  );
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { url } = await uploadFileToStorage(file, 'certificates');
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      alert(`Certificate upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#090d18] border border-sky-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-400" />
            <span>{initial ? 'EDIT CERTIFICATION' : 'ADD CERTIFICATION'}</span>
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Course / Certificate Title:</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Programming Fundamentals using Python"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Issuer / Organization:</label>
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                required
                placeholder="e.g. Infosys Springboard"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Category:</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                placeholder="e.g. Programming & Logic"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Verification / Credential URL (Optional):</label>
            <input
              type="url"
              value={form.certificateUrl || ''}
              onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })}
              placeholder="https://credly.com/... or https://coursera.org/verify/..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Certificate Photo / Document (With UPDATE and REMOVE buttons) */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-sky-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-sky-300 flex items-center gap-1.5 font-bold">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Certificate Document / Photo:</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Visible only in modal viewer
              </span>
            </div>

            {form.imageUrl ? (
              <div className="space-y-2.5">
                <div className="relative rounded-xl overflow-hidden border border-sky-500/30 bg-black/60 h-36 flex items-center justify-center">
                  <img
                    src={form.imageUrl}
                    alt="Certificate Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  {/* Update Photo button */}
                  <label className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Update / Replace Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {/* Remove Photo button */}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-mono text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-sky-500/40 hover:border-sky-400 rounded-xl bg-slate-900/40 cursor-pointer transition-colors group">
                  <Upload className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-mono text-slate-300 font-medium">
                    {isUploading ? 'Uploading to Firebase Storage...' : 'Upload Certificate Photo / Screenshot'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">PNG, JPG, WebP supported</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">Or URL:</span>
                  <input
                    type="url"
                    value={form.imageUrl || ''}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://.../certificate.png"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-[11px] font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Status / Date:</label>
            <input
              type="text"
              value={form.date || 'Completed'}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save to Firebase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- EXPERIENCE EDITOR MODAL -----------------

function ExperienceEditorModal({
  initial,
  onClose,
  onSave,
}: {
  initial: ExperienceData | null;
  onClose: () => void;
  onSave: (exp: ExperienceData) => Promise<void>;
}) {
  const [form, setForm] = useState<ExperienceData>(
    initial || {
      company: '',
      role: '',
      period: 'June 2026 – July 2026',
      tag: 'Chennai, Tamil Nadu',
      description: '',
      skills: [],
    }
  );
  const [skillsInput, setSkillsInput] = useState((initial?.skills || []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    await onSave({ ...form, skills: parsedSkills });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#090d18] border border-sky-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>{initial ? 'EDIT EXPERIENCE' : 'ADD NEW EXPERIENCE'}</span>
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Job Title / Role:</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                placeholder="e.g. Mobile App Development Intern"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Company / Organization:</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
                placeholder="e.g. Zeptoware Systems Pvt. Ltd."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Time Period:</label>
              <input
                type="text"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                required
                placeholder="e.g. June 2026 – July 2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Location / Mode:</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                required
                placeholder="e.g. Chennai, Tamil Nadu / Remote"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Description of Work &amp; Responsibilities:</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              placeholder="Describe key responsibilities, contributions, and outcomes..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:border-sky-400 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Technologies &amp; Skills (comma-separated):</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Flutter, Dart, Local Storage, Maps, Firebase"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save to Firebase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- SKILL EDITOR MODAL -----------------

function SkillEditorModal({
  initial,
  onClose,
  onSave,
}: {
  initial: SkillItem | null;
  onClose: () => void;
  onSave: (s: SkillItem) => Promise<void>;
}) {
  const [form, setForm] = useState<SkillItem>(
    initial || {
      name: '',
      category: 'frontend',
      iconName: 'Code',
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#090d18] border border-sky-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-mono">
            {initial ? 'EDIT SKILL' : 'ADD SKILL'}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Skill Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Next.js / TypeScript"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Short Description:</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              placeholder="e.g. Component architecture, hooks &amp; state"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Firebase</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- SEO & META TAGS MANAGER SECTION -----------------

function SeoManagerSection({
  initialSeo,
  profileName,
  onSaveSeo,
}: {
  initialSeo?: MetaTagsData;
  profileName?: string;
  onSaveSeo: (seo: MetaTagsData) => Promise<void>;
}) {
  const [form, setForm] = useState<MetaTagsData>({
    title:
      initialSeo?.title ||
      `${profileName || 'Fathima Saheera J'} — Aspiring Full-Stack Developer | Portfolio`,
    description:
      initialSeo?.description ||
      'Interactive cinematic portfolio of Fathima Saheera J, an Aspiring Full-Stack Developer turning ideas into real digital experiences with React, Firebase, and Flutter.',
    keywords:
      initialSeo?.keywords ||
      'Fathima Saheera J, Full-Stack Developer, React, Firebase, Flutter, Portfolio, Software Engineer, Web Developer',
    author: initialSeo?.author || profileName || 'Fathima Saheera J',
    ogImage: initialSeo?.ogImage || '/cute_hijabi_headphones_1790087241274.jpg',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if initialSeo updates from Firestore
  useEffect(() => {
    if (initialSeo) {
      setForm((prev) => ({
        ...prev,
        ...initialSeo,
      }));
    }
  }, [initialSeo]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    soundEngine.playClick();
    const res = await uploadFileToStorage(file, 'seo');
    setForm((prev) => ({ ...prev, ogImage: res.url }));
    setUploadingImage(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    soundEngine.playClick();
    await onSaveSeo(form);
    setSaving(false);
  };

  const titleLength = form.title.length;
  const descLength = form.description.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Globe className="w-4 h-4" />
            <span>METADATA &amp; SOCIAL SHARING MANAGEMENT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            SEO &amp; Meta Tags Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Dynamically update your portfolio’s browser tab title, Google search description, social media link cards (OpenGraph &amp; Twitter), and keywords directly in Firebase Firestore.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving to Firebase...' : 'Save Meta Tags to Firebase'}</span>
        </button>
      </div>

      {/* Visual Live Previews (Search & Social) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Google Search Simulation */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-sky-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5 font-bold">
              <Search className="w-3.5 h-3.5" />
              <span>Google Search Result Snippet Preview</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Simulation</span>
          </div>

          <div className="p-4 rounded-xl bg-[#030712] border border-slate-800/80 font-sans space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-sky-400 font-mono">
                S
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-300 font-medium leading-none">saheera-portfolio.web.app</span>
                <span className="text-[9px] text-slate-500 leading-none">https://saheera-portfolio.web.app/</span>
              </div>
            </div>

            <div className="text-sky-400 hover:underline text-sm font-medium cursor-pointer leading-snug">
              {form.title || 'Portfolio Title Placeholder'}
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {form.description || 'Provide a meta description to see how your portfolio appears in Google search engine results snippets...'}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>
              Snippet Title:{' '}
              <strong className={titleLength >= 30 && titleLength <= 60 ? 'text-emerald-400' : 'text-amber-400'}>
                {titleLength}
              </strong>{' '}
              / 60 chars
            </span>
            <span>
              Snippet Desc:{' '}
              <strong className={descLength >= 120 && descLength <= 160 ? 'text-emerald-400' : 'text-amber-400'}>
                {descLength}
              </strong>{' '}
              / 160 chars
            </span>
          </div>
        </div>

        {/* 2. OpenGraph Social Share Card Simulation */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-sky-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5 font-bold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Share Card Preview (WhatsApp, LinkedIn, Twitter)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">OpenGraph</span>
          </div>

          <div className="rounded-xl bg-[#030712] border border-slate-800 overflow-hidden shadow-lg font-sans">
            <div className="relative aspect-[1200/630] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
              {form.ogImage ? (
                <img
                  src={form.ogImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-600 text-xs font-mono">No Image Configured</div>
              )}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-sky-300 border border-sky-500/20">
                1200 × 630 Card
              </div>
            </div>

            <div className="p-3.5 space-y-1 bg-slate-900/60 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">saheera-portfolio.web.app</div>
              <div className="text-xs font-bold text-white line-clamp-1">{form.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{form.description}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-[#090d18] border border-sky-500/20 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Page Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                <span>Page &amp; Browser Tab Title</span>
                <span className="text-rose-400">*</span>
                <span className="text-[10px] font-mono text-slate-500">(&lt;title&gt; and og:title)</span>
              </label>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                titleLength >= 30 && titleLength <= 60
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {titleLength} characters {titleLength >= 30 && titleLength <= 60 ? '(Optimal: 30-60)' : '(Recommended 30-60)'}
              </span>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Fathima Saheera J — Aspiring Full-Stack Developer | Portfolio"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                <span>Meta Description</span>
                <span className="text-rose-400">*</span>
                <span className="text-[10px] font-mono text-slate-500">(&lt;meta name="description"&gt; and og:description)</span>
              </label>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                descLength >= 120 && descLength <= 160
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {descLength} characters {descLength >= 120 && descLength <= 160 ? '(Optimal: 120-160)' : '(Recommended 120-160)'}
              </span>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              placeholder="A compelling, search-optimized summary of your development skillset, projects, and impact..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:border-sky-400 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Keywords & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-bold">
                Search Engine Keywords (comma-separated):
              </label>
              <input
                type="text"
                value={form.keywords || ''}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="React, Firebase, Flutter, Portfolio, Full-Stack Developer, CSE"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-bold">
                Author &amp; Publisher Name:
              </label>
              <input
                type="text"
                value={form.author || ''}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Fathima Saheera J"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Share OG Image */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-mono text-slate-300 font-bold block">
              Social Share Banner / OpenGraph Image (og:image):
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Thumbnail */}
              <div className="w-28 h-20 rounded-xl overflow-hidden border border-sky-500/30 bg-slate-950 shrink-0 relative">
                {form.ogImage ? (
                  <img
                    src={form.ogImage}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] font-mono">
                    No Image
                  </div>
                )}
              </div>

              {/* Upload & Remove buttons */}
              <div className="space-y-2 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading to Firebase Storage...' : 'Upload / Replace OG Image'}</span>
                  </button>

                  {form.ogImage && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, ogImage: '' })}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={form.ogImage || ''}
                  onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                  placeholder="Or enter direct image URL (Firebase Storage / public URL)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block">
              Quick SEO Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setForm({
                    ...form,
                    title: 'Fathima Saheera J — Aspiring Full-Stack Developer | Portfolio',
                    description:
                      'Official portfolio of Fathima Saheera J, an Aspiring Full-Stack Developer turning ideas into real digital experiences with React, Firebase, and Flutter.',
                    keywords:
                      'Fathima Saheera J, Full-Stack Developer, React, Firebase, Flutter, Portfolio, Software Engineer, Web Developer',
                  });
                }}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 font-mono text-[11px] transition-colors cursor-pointer"
              >
                + Recommended Full-Stack Preset
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setForm({
                    ...form,
                    title: 'Fathima Saheera — Production Web & Mobile Systems Developer',
                    description:
                      'Explore production symposium platforms and mobile systems engineered by Fathima Saheera J. React, Firebase, Tailwind CSS, and Flutter.',
                    keywords:
                      'Fathima Saheera, Mobile Systems, Symposium Platforms, React Developer, CSE 2027',
                  });
                }}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 font-mono text-[11px] transition-colors cursor-pointer"
              >
                + Systems &amp; Symposium Preset
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Meta Tags to Firebase'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
