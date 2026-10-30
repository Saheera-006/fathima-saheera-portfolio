export interface MetaTagsData {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  ogImage?: string;
}

export interface EducationData {
  status: string;
  institution: string;
  degree: string;
  years: string;
  statement: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone?: string;
  location: string;
  about: string;
  education: EducationData;
  approach: string;
  permanentMessage: string;
  resumeUrl?: string;
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio?: string;
  };
  seo: MetaTagsData;
  educationItems?: Array<{ id: string; institution: string; degree: string; years: string; status: string; statement: string }>;
}

export interface StoryStage {
  id: string;
  label: string;
  title: string;
  heading: string;
  tagline: string;
  summary: string;
  description: string;
  stageNumber: number;
  milestone: string;
  visualMetaphor: string;
  codeSnippet: string;
  image?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  role: string;
  image: string;
  images?: string[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  metrics: {
    label: string;
    value: string;
  }[];
  keyFeatures: string[];
  architecture: {
    layer: string;
    description: string;
  }[];
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  period: string;
  tag: string;
  description: string;
  skills: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: string;
  certificateUrl?: string;
  imageUrl?: string;
  date?: string;
}

export interface PortfolioData {
  profile: ProfileData;
  storyStages: StoryStage[];
  projects: ProjectData[];
  experience: ExperienceData[];
  skills: SkillItem[];
  certifications: CertificationItem[];
}

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Fathima Saheera",
    title: "Aspiring Full-Stack Developer",
    tagline: "Building ideas into meaningful digital experiences.",
    email: "your-email@example.com",
    location: "Tamil Nadu, India",

    about:
      "I am a final-year Computer Science and Engineering student passionate about full-stack development, building practical applications, and exploring AI-powered tools.",

    educationItems: [
      { id: "education-university", institution: "University College of Engineering Nagercoil", degree: "B.E. Computer Science and Engineering", years: "2023 – 2027", status: "Final-Year B.E. Computer Science & Engineering Student", statement: "" },
      { id: "education-school", institution: "Government Higher Secondary School, Aloor", degree: "HSC & SSLC", years: "2021 – 2023", status: "", statement: "" },
    ],
    education: {
      status: "Final-Year B.E. Computer Science & Engineering Student",
      institution: "University College of Engineering Nagercoil",
      degree: "B.E. Computer Science and Engineering",
      years: "2023 – 2027",
      statement:
        "I am a final-year Computer Science and Engineering student passionate about full-stack development, building practical applications, and exploring AI-powered tools.",
    },

    approach:
      "Building practical applications with modern technologies and user-focused design.",

    permanentMessage:
      "Building ideas into meaningful digital experiences.",

    resumeUrl: "",

    socialLinks: {
      github: "https://github.com/Saheera-006",
      linkedin: "https://www.linkedin.com/in/fathima-saheera",
      portfolio: "",
    },

    seo: {
      title: "Fathima Saheera | Full-Stack Developer",
      description:
        "Explore the portfolio, projects, skills, and experience of Fathima Saheera.",
      keywords: [
        "Fathima Saheera",
        "Full-Stack Developer",
        "React",
        "Java",
        "Web Development",
      ],
      author: "Fathima Saheera",
      ogImage: "",
    },
  },

  // STORY JOURNEY: ALL 7 STAGES
  storyStages: [
    {
      id: "idea",
      label: "IDEA",
      title: "Idea",
      heading: "Every Great Product Starts with an Idea",
      tagline: "From curiosity to a clear vision.",
      summary:
        "Every project begins by identifying a real problem. I explore user needs, understand challenges, and transform initial thoughts into practical software ideas.",
      description:
        "Discovering problems and defining meaningful solutions.",
      stageNumber: 1,
      milestone: "PROBLEM DISCOVERY",
      visualMetaphor:
        "A single spark of inspiration grows into a clear direction for the entire project.",
      codeSnippet:
        "const idea = identifyProblem(userNeeds);",
    },
    {
      id: "design",
      label: "DESIGN",
      title: "Design",
      heading: "Turning Ideas into Experiences",
      tagline: "Structure, creativity, and user experience.",
      summary:
        "I organize information, plan layouts, choose visual styles, and design user-friendly interfaces that make applications intuitive and accessible.",
      description:
        "Creating layouts, wireframes, and user-focused interfaces.",
      stageNumber: 2,
      milestone: "UI/UX BLUEPRINT",
      visualMetaphor:
        "Rough ideas become structured wireframes and polished interface concepts.",
      codeSnippet:
        "const interface = design(idea, userNeeds);",
    },
    {
      id: "develop",
      label: "DEVELOP",
      title: "Develop",
      heading: "Bringing Designs to Life",
      tagline: "Writing code that makes ideas work.",
      summary:
        "I turn designs into functional applications using technologies such as React, JavaScript, Java, Flutter, and other tools suited to each project.",
      description:
        "Building responsive interfaces and application features.",
      stageNumber: 3,
      milestone: "APPLICATION DEVELOPMENT",
      visualMetaphor:
        "Individual components come together to form a working digital product.",
      codeSnippet:
        "const application = build(design, technologies);",
    },
    {
      id: "connect",
      label: "CONNECT",
      title: "Connect",
      heading: "Connecting Every Component",
      tagline: "Frontend, backend, and data working together.",
      summary:
        "I integrate interfaces with backend services, APIs, authentication, and databases so information flows smoothly throughout the application.",
      description:
        "Integrating APIs, backend services, and databases.",
      stageNumber: 4,
      milestone: "SYSTEM INTEGRATION",
      visualMetaphor:
        "Separate components connect through communication pathways to create one unified system.",
      codeSnippet:
        "const system = connect(frontend, api, database);",
    },
    {
      id: "test",
      label: "TEST",
      title: "Test",
      heading: "Making Every Detail Work",
      tagline: "Test, refine, and improve.",
      summary:
        "I check application functionality, identify errors, validate important workflows, and improve usability and reliability before release.",
      description:
        "Checking functionality, fixing errors, and improving quality.",
      stageNumber: 5,
      milestone: "QUALITY ASSURANCE",
      visualMetaphor:
        "Potential issues are detected and resolved before the product reaches its users.",
      codeSnippet:
        "const quality = validate(application);",
    },
    {
      id: "deploy",
      label: "DEPLOY",
      title: "Deploy",
      heading: "Preparing for the Real World",
      tagline: "From local development to production.",
      summary:
        "After testing, I prepare the application for deployment and configure the required hosting and services to make it accessible online.",
      description:
        "Preparing production builds and publishing applications.",
      stageNumber: 6,
      milestone: "PRODUCTION RELEASE",
      visualMetaphor:
        "A completed application moves from the development environment into its live destination.",
      codeSnippet:
        "const release = deploy(application);",
    },
    {
      id: "live",
      label: "LIVE",
      title: "Live",
      heading: "Ideas Become Digital Reality",
      tagline: "Built, launched, and ready to explore.",
      summary:
        "The journey ends with a working digital experience. Explore projects such as Dynamoz26 and Artify to see how ideas become practical applications.",
      description:
        "Presenting completed projects and real digital experiences.",
      stageNumber: 7,
      milestone: "LIVE PROJECTS",
      visualMetaphor:
        "The original spark has become a complete digital product ready to be experienced.",
      codeSnippet:
        "showcase(application, ['Dynamoz26', 'Artify']);",
    },
  ],

  projects: [
    {
      id: "dynamoz26",
      title: "Dynamoz26",
      subtitle: "Symposium Website",
      tagline: "One platform for a complete symposium experience.",
      description:
        "A website created to share symposium information and simplify event registrations.",
      longDescription:
        "Dynamoz26 is a symposium website developed for the Computer Science and Engineering department at University College of Engineering Nagercoil. It helps participants explore event details and register online.",
      role: "Frontend and Web Development",
      image: "/src/assets/images/dynamoz_hero_real_1790085000814.jpg",
      images: [],
      tags: ["React", "Firebase", "JavaScript", "CSS"],
      liveUrl: "",
      repoUrl: "",
      metrics: [
        {
          label: "Platform",
          value: "Web",
        },
        {
          label: "Purpose",
          value: "Symposium",
        },
      ],
      keyFeatures: [
        "Event and symposium information",
        "Online participant registration",
        "Responsive user interface",
        "Firebase integration",
      ],
      architecture: [
        {
          layer: "Frontend",
          description: "React-based user interface",
        },
        {
          layer: "Backend",
          description: "Firebase services",
        },
        {
          layer: "Database",
          description: "Firestore data storage",
        },
      ],
    },

    {
      id: "artify",
      title: "Artify",
      subtitle: "Design Submission Platform",
      tagline: "THINK. CREATE. DEFINE.",
      description:
        "A design submission platform created for a symposium event.",
      longDescription:
        "Artify is a platform designed for participants to submit creative designs during a symposium. It supports design challenges and AI-assisted evaluation of submissions.",
      role: "Platform Development and Event Coordination",
      image: "",
      images: [],
      tags: ["React", "Firebase", "Gemini API", "AI Evaluation"],
      liveUrl: "https://artify26.web.app",
      repoUrl: "",
      metrics: [
        {
          label: "Participants",
          value: "48",
        },
        {
          label: "Evaluation",
          value: "AI-assisted",
        },
      ],
      keyFeatures: [
        "Design submission workflow",
        "AI-assisted design evaluation",
        "Event challenge management",
        "CSV results export",
      ],
      architecture: [
        {
          layer: "Frontend",
          description: "React user interface",
        },
        {
          layer: "Backend",
          description: "Firebase services and evaluation API",
        },
        {
          layer: "AI",
          description: "Gemini API integration",
        },
      ],
    },
  ],

  experience: [
    {
      id: "zeptoware",
      company: "Zeptoware",
      role: "Intern",
      period: "June 2026 – July 2026",
      tag: "Internship",
      description:
        "Gained practical exposure to software development and professional workflows.",
      skills: ["Software Development", "Problem Solving"],
    },
  ],

  skills: [
    {
      id: "java",
      name: "Java",
      category: "Programming",
      iconName: "code",
      description:
        "Object-oriented programming and application development.",
    },
    {
      id: "python",
      name: "Python",
      category: "Programming",
      iconName: "code",
      description: "Programming, scripting, and problem solving.",
    },
    {
      id: "html-css-js",
      name: "HTML, CSS, JavaScript",
      category: "Frontend",
      iconName: "globe",
      description: "Building responsive and interactive web interfaces.",
    },
    {
      id: "react",
      name: "React",
      category: "Frontend",
      iconName: "atom",
      description:
        "Developing reusable component-based web applications.",
    },
    {
      id: "flutter",
      name: "Flutter & Dart",
      category: "Mobile",
      iconName: "smartphone",
      description: "Creating cross-platform mobile applications.",
    },
    {
      id: "firebase",
      name: "Firebase",
      category: "Backend",
      iconName: "database",
      description:
        "Authentication, database, and application integration.",
    },
    {
      id: "mysql",
      name: "MySQL",
      category: "Database",
      iconName: "database",
      description: "Relational database design and SQL queries.",
    },
    {
      id: "git",
      name: "Git & GitHub",
      category: "Tools",
      iconName: "git-branch",
      description: "Version control and collaborative development.",
    },
  ],

  certifications: [
    {
      id: "infosys-python-1",
      title: "Python Programming Fundamentals – Part 1",
      issuer: "Infosys Springboard",
      category: "Programming",
      date: "2024",
      certificateUrl: "",
      imageUrl: "",
    },
    {
      id: "infosys-python-2",
      title: "Python Programming Fundamentals – Part 2",
      issuer: "Infosys Springboard",
      category: "Programming",
      date: "2024",
      certificateUrl: "",
      imageUrl: "",
    },
    {
      id: "ibm-data-analysis",
      title: "Data Analysis with Python",
      issuer: "IBM",
      category: "Data Analysis",
      date: "2025",
      certificateUrl: "",
      imageUrl: "",
    },
    {
      id: "tata-data-visualization",
      title: "Data Visualization",
      issuer: "Forage – Tata",
      category: "Data Visualization",
      date: "October 2025",
      certificateUrl: "",
      imageUrl: "",
    },
    {
      id: "accenture-software-engineering",
      title: "Software Engineering",
      issuer: "Accenture – Forage",
      category: "Software Engineering",
      date: "June 2025",
      certificateUrl: "",
      imageUrl: "",
    },
  ],
};
