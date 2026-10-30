 
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:080B18,50:11152B,100:172C46&height=180&section=header&text=FATHIMA%20SAHEERA&fontSize=43&fontColor=E2E8F0&animation=fadeIn&fontAlignY=42&desc=ASPIRING%20FULL%20STACK%20DEVELOPER&descSize=15&descAlignY=65&descColor=67E8F9" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=18&duration=3000&pause=1000&color=8B9CFB&center=true&vCenter=true&width=600&lines=Building+Ideas+Into+Applications;Exploring+Full+Stack+Development;Creating+Interactive+Digital+Experiences;Learning+%7C+Building+%7C+Improving" alt="Typing SVG" />

<br/>

<a href="https://fathima-saheera.web.app">
  <img src="https://img.shields.io/badge/LIVE_PORTFOLIO-Visit_Website-172C46?style=for-the-badge&logo=googlechrome&logoColor=67E8F9"/>
</a>
<a href="https://github.com/Saheera-006">
  <img src="https://img.shields.io/badge/GITHUB-Explore_Projects-172C46?style=for-the-badge&logo=github&logoColor=E2E8F0"/>
</a>
<a href="https://www.linkedin.com/in/fathima-saheera">
  <img src="https://img.shields.io/badge/LINKEDIN-Connect-172C46?style=for-the-badge&logo=linkedin&logoColor=93C5FD"/>
</a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:67E8F9,50:818CF8,100:C4B5FD&height=2&section=header" width="85%"/>

</div>

## ✦ 01 — PROJECT OVERVIEW

A personal portfolio developed to showcase my technical skills, projects, experience, education, and development journey through an interactive digital experience.

Built with **React, TypeScript, and Vite**, this portfolio goes beyond a static website. It integrates Firebase and Cloudinary to support dynamic content management, media handling, and a dedicated Admin CMS.

<div align="center">

<a href="https://fathima-saheera.web.app">
  **↗ Explore the Live Portfolio**
</a>

</div>

### Highlights

- Cinematic dark-themed interface.
- Interactive character and animated storytelling.
- Dynamic content powered by Firebase Firestore.
- Cloudinary-based image and media management.
- Dedicated Admin CMS.
- Responsive project archive and project details.
- Separate certificates page.
- Smooth transitions and scroll-triggered animations.

---

## ✦ 02 — DESIGN & EXPERIENCE

The visual direction combines a cinematic dark interface with cool blue accents, subtle gradients, and interactive motion.

| Feature | Description |
|---|---|
| Cinematic Background | Animated visual atmosphere |
| Interactive Character | Custom character integrated into the experience |
| Story Journey | Visual storytelling of my development journey |
| Motion Effects | Smooth transitions and scroll-based animations |
| Project Rail | Horizontal featured project navigation |
| Responsive UI | Adaptable desktop and mobile layouts |

### Interactive Project Rail

The featured projects section uses a horizontal scrolling layout.

- Desktop: Mouse-wheel gestures move the project rail horizontally.
- Trackpad: Supports horizontal scrolling.
- Mobile: Swipe navigation.
- Keyboard: Arrow-key navigation when focused.
- Normal vertical page scrolling works outside the rail.

---

## ✦ 03 — TECHNOLOGY STACK

<div align="center">

**Frontend Development**

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,html,css&theme=dark" />

<br/><br/>

**Backend & Cloud**

<img src="https://skillicons.dev/icons?i=firebase,nodejs&theme=dark" />

<br/>

<img src="https://img.shields.io/badge/Cloudinary-Media_Management-3448C5?style=flat-square&logo=cloudinary&logoColor=white"/>
<img src="https://img.shields.io/badge/Firestore-Cloud_Database-FFCA28?style=flat-square&logo=firebase&logoColor=black"/>

<br/><br/>

**Development Tools**

<img src="https://skillicons.dev/icons?i=git,github,vscode,figma&theme=dark" />

<br/><br/>

<img src="https://img.shields.io/badge/Motion-Animation-8B5CF6?style=flat-square&logo=framer&logoColor=white"/>

</div>

---

## ✦ 04 — APPLICATION ARCHITECTURE

The portfolio combines a React-based frontend with Firebase cloud services and Cloudinary media management.

```mermaid
flowchart TD
    A["Visitor"] --> B["React + TypeScript Frontend"]
    B --> C["Portfolio Interface"]
    C <--> D["Firebase Firestore"]
    C --> E["Cloudinary Media Assets"]

    F["Admin"] --> G["Admin Dashboard"]
    G --> H["Firebase Authentication"]
    H --> G
    G <--> D
    G <--> I["Cloudinary Media Management"]

    style A fill:#172C46,stroke:#67E8F9,color:#E2E8F0
    style B fill:#202447,stroke:#818CF8,color:#E2E8F0
    style C fill:#202447,stroke:#818CF8,color:#E2E8F0
    style D fill:#172C46,stroke:#67E8F9,color:#E2E8F0
    style E fill:#29203F,stroke:#C4B5FD,color:#E2E8F0
    style F fill:#29203F,stroke:#C4B5FD,color:#E2E8F0
    style G fill:#202447,stroke:#818CF8,color:#E2E8F0
    style H fill:#172C46,stroke:#67E8F9,color:#E2E8F0
    style I fill:#29203F,stroke:#C4B5FD,color:#E2E8F0
```

### Cloud Services

| Service | Purpose |
|---|---|
| Firebase Authentication | Admin authentication |
| Cloud Firestore | Dynamic content storage |
| Firebase Hosting | Website deployment |
| Cloudinary | Image and media management |

### Content Flow

1. Admin accesses the dedicated dashboard.
2. Firebase Authentication handles admin sign-in.
3. Portfolio information is managed through the CMS.
4. Images and media are managed through Cloudinary.
5. Dynamic content is stored and retrieved through Firestore.
6. The frontend displays the updated portfolio content.

---

## ✦ 05 — ADMIN CMS

A dedicated content management system makes it possible to maintain portfolio information without manually editing source code for every content update.

| Module | Management |
|---|---|
| Profile | Personal and professional information |
| Projects | Project details and descriptions |
| Skills | Technical skill information |
| Education | Academic details |
| Experience | Internship and experience information |
| Certificates | Certification information |
| Media | Image uploads and media management |

The CMS separates content management from frontend presentation, making the portfolio easier to maintain and extend.

---

## ✦ 06 — APPLICATION ROUTES

| Route | Description |
|---|---|
| `/` | Cinematic homepage |
| `/projects` | Full project archive |
| `/certificates` | Dedicated certificates page |
| `/admin` | Admin dashboard |

### Latest Homepage Improvements

- Removed certification previews from the homepage while retaining the dedicated certificates page.
- Introduced a horizontal featured projects rail.
- Preserved existing project data and project details modal.
- Retained the live-site notice functionality.
- Maintained the full projects archive.
- Kept `esbuild` on `^0.28.2` to align with the Vite version's peer dependency requirements.

---

## ✦ 07 — FEATURED PROJECTS

### 01. Dynamoz26

**Symposium Registration & Event Platform**

A React and Firebase-powered symposium platform developed for the Computer Science and Engineering Department at University College of Engineering Nagercoil.

- Event information and online registration.
- Firebase-powered registration management.
- Admin dashboard for submissions.
- Registration tracking and data export.

### 02. Artify

**Creative Design Submission & Evaluation Platform**

A creative submission and evaluation platform developed for Dynamoz'26.

- Online creative design submissions.
- AI-assisted evaluation using Google Gemini API.
- Multi-round evaluation workflow.
- Admin dashboard.
- CSV export for submissions and evaluation data.

<div align="center">

<a href="https://artify26.web.app">
  <img src="https://img.shields.io/badge/EXPLORE_ARTIFY-172C46?style=for-the-badge&logo=firebase&logoColor=67E8F9"/>
</a>

</div>

---

## ✦ 08 — PROJECT STRUCTURE

```text
portfolio/
│
├── public/
│   └── Fathima_Saheera_Resume.html
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── CinematicBackground.tsx
│   │   ├── HeroCharacter.tsx
│   │   ├── AboutCinematic.tsx
│   │   ├── StoryJourneySection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsConstellation.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── CertificationsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminLogin.tsx
│   │       ├── ImageUploader.tsx
│   │       └── CloudStorageSettings.tsx
│   │
│   ├── context/
│   │   └── PortfolioContext.tsx
│   │
│   ├── data/
│   │   └── portfolioData.ts
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── portfolioService.ts
│   │   └── storageService.ts
│   │
│   ├── pages/
│   │   ├── ProjectsPage.tsx
│   │   └── CertificatesPage.tsx
│   │
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── firebase.json
├── firestore.rules
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ✦ 09 — RUN LOCALLY

**Prerequisites:** Node.js, npm, and Git.

### Clone the repository

```bash
git clone https://github.com/Saheera-006/fathima-saheera-portfolio.git
```

### Navigate into the project

```bash
cd fathima-saheera-portfolio
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite. The development server uses port `3000`.

### Production build

```bash
npm run build
```

### Lint check

```bash
npm run lint
```

### Configuration

- Use `.env.example` as the configuration reference.
- Configure Firebase and Cloudinary settings for their integrated features.
- Never commit private environment files or secret credentials.
- `.env*` files are excluded through `.gitignore`.

---

## ✦ 10 — GITHUB ACTIVITY

<div align="center">

**Contribution Statistics**

<img width="49%" src="https://github-readme-stats.vercel.app/api?username=Saheera-006&show_icons=true&hide_border=true&bg_color=0B1020&title_color=8B9CFB&icon_color=67E8F9&text_color=C9D1D9&include_all_commits=true" alt="GitHub Stats"/>

<img width="49%" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Saheera-006&layout=compact&hide_border=true&bg_color=0B1020&title_color=C4B5FD&text_color=C9D1D9" alt="Top Languages"/>

<br/><br/>

**Contribution Streak**

<img src="https://streak-stats.demolab.com?user=Saheera-006&theme=tokyonight&hide_border=true&background=0B1020&ring=818CF8&fire=67E8F9&currStreakLabel=C4B5FD" alt="GitHub Streak"/>

<br/><br/>

**Contribution Graph**

<img src="https://github-readme-activity-graph.vercel.app/graph?username=Saheera-006&bg_color=0B1020&color=C9D1D9&line=818CF8&point=67E8F9&area=true&hide_border=true" width="100%" alt="GitHub Contribution Graph"/>

<br/>

<img src="https://komarev.com/ghpvc/?username=Saheera-006&style=flat-square&color=6366F1&label=PROFILE+VIEWS" alt="Profile Views"/>

</div>

---

## ✦ 11 — WHAT I LEARNED

Building this portfolio gave me practical experience in:

- Component-based frontend architecture.
- TypeScript with React.
- Firebase Authentication and Firestore integration.
- Cloudinary-based media management.
- Admin CMS development.
- Dynamic content management.
- Responsive UI and interactive experiences.
- Animation and scroll-based interactions.
- Deploying and maintaining a live application.

---

## ✦ 12 — CONNECT WITH ME

<div align="center">

<a href="https://github.com/Saheera-006">
  <img src="https://img.shields.io/badge/GitHub-0B1020?style=for-the-badge&logo=github&logoColor=E2E8F0"/>
</a>
<a href="https://www.linkedin.com/in/fathima-saheera">
  <img src="https://img.shields.io/badge/LinkedIn-0B1020?style=for-the-badge&logo=linkedin&logoColor=93C5FD"/>
</a>
<a href="https://fathima-saheera.web.app">
  <img src="https://img.shields.io/badge/Portfolio-0B1020?style=for-the-badge&logo=googlechrome&logoColor=67E8F9"/>
</a>

<br/><br/>

### THANK YOU FOR VISITING!

*Ideas become experiences when creativity meets engineering.*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:172C46,50:202447,100:0B1020&height=120&section=footer" width="100%"/>

</div>
