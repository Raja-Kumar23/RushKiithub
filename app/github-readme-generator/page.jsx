// "use client"
// import { useState, useEffect, useCallback, useMemo } from "react"
// import {
//   User,
//   Code,
//   Trophy,
//   Link,
//   Eye,
//   Download,
//   Copy,
//   Github,
//   ChevronRight,
//   ChevronLeft,
//   Settings,
//   CheckCircle,
//   AlertCircle,
//   ExternalLink,
//   Plus,
//   X,
//   Star,
//   Loader2,
//   AlertTriangle,
//   Sparkles,
//   Zap,
//   Heart,
//   Coffee,
//   MapPin,
//   Palette,
//   Globe,
//   Mail,
//   Monitor,
//   Smartphone,
//   TrendingUp,
// } from "lucide-react"
// import "./styles.css"
// const KiitHubReadmeGenerator = () => {
//   const [currentStep, setCurrentStep] = useState(0)
//   const [user] = useState({ email: "test@kiit.ac.in" })
//   const [showGitHubGuide, setShowGitHubGuide] = useState(false)
//   const [generatedReadme, setGeneratedReadme] = useState("")
//   const [previewMode, setPreviewMode] = useState("rendered")
//   const [validationErrors, setValidationErrors] = useState({})
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [githubApiError, setGithubApiError] = useState(false)
//   const [copySuccess, setCopySuccess] = useState(false)
//   const [downloadSuccess, setDownloadSuccess] = useState(false)
//   const [selectedTheme, setSelectedTheme] = useState("modern")
//   const [isMobile, setIsMobile] = useState(false)

//   // Global stats for copy/download counts
//   const [globalStats, setGlobalStats] = useState({
//     totalCopies: 0,
//     totalDownloads: 0,
//     todayCopies: 5,
//     todayDownloads: 5,
//   })

//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     bio: "",
//     location: "",
//     company: "",
//     website: "",
//     email: "",
//     github: "",
//     linkedin: "",
//     twitter: "",
//     instagram: "",
//     portfolio: "",
//     skills: [],
//     projects: [],
//     achievements: [],
//     currentWork: "",
//     learning: "",
//     collaboration: "",
//     askMeAbout: "",
//     funFact: "",
//     stats: {
//       showStats: true,
//       showLanguages: true,
//       showStreak: true,
//       showTrophies: true,
//       showActivity: true,
//       theme: "tokyonight",
//     },
//     sections: {
//       about: true,
//       skills: true,
//       projects: true,
//       stats: true,
//       contact: true,
//       achievements: true,
//       activity: true,
//     },
//     advanced: {
//       showVisitors: true,
//       showTyping: true,
//       customBadges: [],
//       profileViews: true,
//       showWaveHeader: true,
//       showWaveFooter: true,
//     },
//   })

//   // Check if device is mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768)
//     }

//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   const themes = useMemo(
//     () => [
//       {
//         id: "modern",
//         name: "Modern Tech",
//         colors: { primary: "00D4AA", secondary: "1a1a1a", accent: "00b894" },
//         style: "sleek",
//       },
//       {
//         id: "cyberpunk",
//         name: "Cyberpunk",
//         colors: { primary: "ff0080", secondary: "0a0a0a", accent: "00ffff" },
//         style: "neon",
//       },
//       {
//         id: "ocean",
//         name: "Ocean Blue",
//         colors: { primary: "0077be", secondary: "001f3f", accent: "39cccc" },
//         style: "wave",
//       },
//       {
//         id: "sunset",
//         name: "Sunset",
//         colors: { primary: "ff6b35", secondary: "2d1b69", accent: "f7931e" },
//         style: "gradient",
//       },
//     ],
//     [],
//   )

//   const skillCategories = useMemo(
//     () => [
//       {
//         name: "Programming Languages",
//         icon: "💻",
//         skills: [
//           "JavaScript",
//           "TypeScript",
//           "Python",
//           "Java",
//           "C++",
//           "Go",
//           "Rust",
//           "PHP",
//           "C#",
//           "Kotlin",
//           "Swift",
//           "Dart",
//           "Ruby",
//           "Scala",
//           "R",
//           "C",
//         ],
//       },
//       {
//         name: "Frontend Development",
//         icon: "🎨",
//         skills: [
//           "React",
//           "Vue.js",
//           "Angular",
//           "Next.js",
//           "Nuxt.js",
//           "Svelte",
//           "SvelteKit",
//           "HTML5",
//           "CSS3",
//           "Tailwind CSS",
//           "Bootstrap",
//           "Material-UI",
//           "Chakra UI",
//           "Sass",
//         ],
//       },
//       {
//         name: "Backend Development",
//         icon: "⚙️",
//         skills: [
//           "Node.js",
//           "Express.js",
//           "Django",
//           "Flask",
//           "Spring Boot",
//           "Laravel",
//           "Ruby on Rails",
//           "ASP.NET",
//           "FastAPI",
//           "NestJS",
//           "Koa.js",
//           "Gin",
//         ],
//       },
//       {
//         name: "Mobile Development",
//         icon: "📱",
//         skills: [
//           "React Native",
//           "Flutter",
//           "Swift",
//           "Kotlin",
//           "Xamarin",
//           "Ionic",
//           "Cordova",
//           "Unity",
//           "Android Studio",
//           "Xcode",
//         ],
//       },
//       {
//         name: "Database & Storage",
//         icon: "🗄️",
//         skills: [
//           "MongoDB",
//           "PostgreSQL",
//           "MySQL",
//           "Redis",
//           "SQLite",
//           "Firebase",
//           "Supabase",
//           "DynamoDB",
//           "Cassandra",
//           "Neo4j",
//           "InfluxDB",
//           "Elasticsearch",
//         ],
//       },
//       {
//         name: "Cloud & DevOps",
//         icon: "☁️",
//         skills: [
//           "AWS",
//           "Google Cloud",
//           "Azure",
//           "Docker",
//           "Kubernetes",
//           "Jenkins",
//           "GitHub Actions",
//           "Terraform",
//           "Vercel",
//           "Netlify",
//           "Heroku",
//           "DigitalOcean",
//         ],
//       },
//       {
//         name: "AI & Machine Learning",
//         icon: "🤖",
//         skills: [
//           "TensorFlow",
//           "PyTorch",
//           "Scikit-learn",
//           "OpenCV",
//           "Pandas",
//           "NumPy",
//           "Jupyter",
//           "Keras",
//           "Hugging Face",
//           "LangChain",
//           "OpenAI",
//           "Anthropic",
//         ],
//       },
//       {
//         name: "Tools & Others",
//         icon: "🛠️",
//         skills: [
//           "Git",
//           "VS Code",
//           "IntelliJ",
//           "Figma",
//           "Postman",
//           "Jira",
//           "Slack",
//           "Notion",
//           "Linux",
//           "GraphQL",
//           "REST API",
//           "Webpack",
//           "Vite",
//           "ESLint",
//         ],
//       },
//     ],
//     [],
//   )

//   const steps = useMemo(
//     () => [
//       {
//         id: "personal",
//         title: "Personal Info",
//         icon: User,
//         description: "Tell us about yourself",
//         required: ["name", "github"],
//       },
//       {
//         id: "skills",
//         title: "Skills & Tech",
//         icon: Code,
//         description: "Your technical expertise",
//         required: ["skills"],
//       },
//       {
//         id: "projects",
//         title: "Projects",
//         icon: Trophy,
//         description: "Showcase your work",
//         required: [],
//       },
//       {
//         id: "social",
//         title: "Social Links",
//         icon: Link,
//         description: "Connect with others",
//         required: [],
//       },
//       {
//         id: "theme",
//         title: "Theme & Style",
//         icon: Palette,
//         description: "Customize appearance",
//         required: [],
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         icon: Settings,
//         description: "Special features",
//         required: [],
//       },
//       {
//         id: "preview",
//         title: "Preview & Export",
//         icon: Eye,
//         description: "Generate your README",
//         required: [],
//       },
//     ],
//     [],
//   )

//   const isKiitUser = useMemo(() => {
//     return user?.email?.endsWith("@kiit.ac.in")
//   }, [user?.email])

//   const validateCurrentStep = useMemo(() => {
//     const step = steps[currentStep]
//     const errors = {}
//     step.required.forEach((field) => {
//       if (field === "skills") {
//         if (formData.skills.length === 0) {
//           errors[field] = "Please select at least one skill"
//         }
//       } else if (!formData[field] || String(formData[field]).trim() === "") {
//         errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
//       }
//     })
//     return errors
//   }, [currentStep, steps, formData])

//   useEffect(() => {
//     setValidationErrors(validateCurrentStep)
//   }, [validateCurrentStep])

//   const canProceedToNext = useMemo(() => {
//     return Object.keys(validateCurrentStep).length === 0
//   }, [validateCurrentStep])

//   const checkGitHubAPI = useCallback(async (username) => {
//     if (!username) return true
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500))
//       if (Math.random() < 0.15) {
//         throw new Error("GitHub API Rate Limit")
//       }
//       setGithubApiError(false)
//       return true
//     } catch (error) {
//       setGithubApiError(true)
//       return false
//     }
//   }, [])

//   const generateModernReadme = useCallback(async () => {
//     setIsGenerating(true)
//     setGithubApiError(false)
//     const apiAvailable = await checkGitHubAPI(formData.github)
//     const theme = themes.find((t) => t.id === selectedTheme) || themes[0]

//     setTimeout(() => {
//       let readme = ""

//       // Enhanced header with wave animation
//       if (formData.advanced.showWaveHeader) {
//         const headerType = theme.style === "wave" ? "waving" : theme.style === "neon" ? "cylinder" : "waving"
//         readme += `<div align="center"><img src="https://capsule-render.vercel.app/api?type=${headerType}&color=gradient&customColorList=6,11,20&height=300&section=header&text=${encodeURIComponent(formData.name || "Your Name")}&fontSize=80&fontAlign=50&fontAlignY=35&fontColor=fff&desc=${encodeURIComponent(formData.title || "Developer")}&descSize=20&descAlign=50&descAlignY=55&animation=fadeIn" /></div>

// `
//       }

//       // Enhanced typing animation with dynamic content
//       if (formData.advanced.showTyping) {
//         const typingLines = [
//           `👋 Hi, I'm ${formData.name || "Developer"}!`,
//           formData.title || "Full Stack Developer",
//           formData.currentWork || "Building Amazing Things",
//           formData.learning || "Always Learning New Tech",
//           "Welcome to my GitHub Profile! 🚀",
//           formData.funFact || "Code is Poetry 💫",
//         ].filter(Boolean)
//         readme += `<div align="center"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=${theme.colors.primary}&center=true&vCenter=true&width=800&lines=${encodeURIComponent(typingLines.join(";"))}" alt="Typing Animation" /></div>

// `
//       }

//       // Professional badges section
//       if (formData.advanced.showVisitors && apiAvailable) {
//         readme += `<div align="center">
// <img src="https://komarev.com/ghpvc/?username=${formData.github}&style=for-the-badge&color=${theme.colors.primary}&labelColor=${theme.colors.secondary}" alt="Profile Views" />
// <img src="https://img.shields.io/github/followers/${formData.github}?style=for-the-badge&color=${theme.colors.primary}&labelColor=${theme.colors.secondary}" alt="Followers" />
// <img src="https://img.shields.io/badge/Open%20Source-❤️-${theme.colors.accent}?style=for-the-badge" alt="Open Source Love" />
// </div>

// `
//       }

//       readme += `---

// ## 🚀 About Me

// ${
//   formData.bio
//     ? `> ${formData.bio}

// `
//     : ""
// }<img align="right" alt="Coding" width="400" src="https://raw.githubusercontent.com/devSouvik/devSouvik/master/gif3.gif">

// ${
//   formData.currentWork
//     ? `🔭 **Currently working on:** ${formData.currentWork}

// `
//     : ""
// }${
//   formData.learning
//     ? `🌱 **Currently learning:** ${formData.learning}

// `
//     : ""
// }${
//   formData.collaboration
//     ? `👯 **Looking to collaborate on:** ${formData.collaboration}

// `
//     : ""
// }${
//   formData.askMeAbout
//     ? `💬 **Ask me about:** ${formData.askMeAbout}

// `
//     : ""
// }${
//   formData.funFact
//     ? `⚡ **Fun fact:** ${formData.funFact}

// `
//     : ""
// }${
//   formData.location
//     ? `📍 **Location:** ${formData.location}

// `
//     : ""
// }${
//   formData.company
//     ? `🏢 **Company:** ${formData.company}

// `
//     : ""
// }---

// ## 🛠️ Tech Stack & Skills

// <div align="center">

// ### Languages & Frameworks

// ${
//   formData.skills.length > 0
//     ? `<p>
// ${formData.skills
//   .map((skill) => {
//     const skillLower = skill.toLowerCase().replace(/[^a-z0-9]/g, "")
//     return `<img src="https://skillicons.dev/icons?i=${skillLower}" alt="${skill}" width="50" height="50"/>`
//   })
//   .join("\n")}
// </p>`
//     : "<p>No skills selected</p>"
// }

// ### GitHub Statistics

// <div align="center">
// <img src="https://github-readme-stats.vercel.app/api?username=${formData.github}&show_icons=true&theme=${formData.stats.theme}&hide_border=true&count_private=true&include_all_commits=true&bg_color=0d1117&title_color=${theme.colors.primary}&icon_color=${theme.colors.primary}&text_color=ffffff" height="180"/>
// <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${formData.github}&theme=${formData.stats.theme}&hide_border=true&layout=compact&langs_count=8&bg_color=0d1117&title_color=${theme.colors.primary}&text_color=ffffff" height="180"/>
// </div>

// </div>

// ---

// `

//       // Enhanced GitHub Statistics
//       if (formData.sections.stats && formData.github) {
//         if (apiAvailable) {
//           readme += `## 📊 GitHub Analytics

// <div align="center">

// <img src="https://github-readme-streak-stats.herokuapp.com/?user=${formData.github}&theme=${formData.stats.theme}&hide_border=true&background=0d1117&stroke=${theme.colors.primary}&ring=${theme.colors.primary}&fire=${theme.colors.accent}&currStreakLabel=${theme.colors.primary}" />

// ${
//   formData.stats.showActivity
//     ? `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${formData.github}&theme=tokyo-night&hide_border=true&bg_color=0d1117&color=${theme.colors.primary}&line=${theme.colors.primary}&point=ffffff" />

// `
//     : ""
// }${
//   formData.stats.showTrophies
//     ? `<img src="https://github-profile-trophy.vercel.app/?username=${formData.github}&theme=discord&no-frame=true&no-bg=true&margin-w=4&row=2&column=4" />

// `
//     : ""
// }</div>

// ---

// `
//         } else {
//           readme += `## 📊 GitHub Analytics

// <div align="center">
// <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2rem; border-radius: 16px; border: 2px solid #${theme.colors.primary}; margin: 1rem 0;">
// <h3 style="color: #${theme.colors.primary}; margin-bottom: 1rem;">⚠️ GitHub API Temporarily Unavailable</h3>
// <p style="color: #cbd5e1;">Stats will automatically load when you upload this README to your profile repository.</p>
// </div>
// </div>

// ---

// `
//         }
//       }

//       // Enhanced Projects Section
//       if (formData.sections.projects && formData.projects.length > 0) {
//         readme += `## 🎯 Featured Projects

// <div align="center">

// ${formData.projects
//   .map(
//     (project, index) =>
//       `### 🚀 [${project.name}](${project.link})

// <div align="center">
// <img src="https://img.shields.io/badge/Project-${index + 1}-${theme.colors.primary}?style=for-the-badge&logo=github&logoColor=white" />
// ${project.demo ? `<a href="${project.demo}"><img src="https://img.shields.io/badge/Live-Demo-${theme.colors.accent}?style=for-the-badge&logo=vercel&logoColor=white" /></a>` : ""}
// </div>

// ${project.description}

// ${
//   project.tech
//     ? `**🛠️ Built with:** \`${project.tech}\`

// `
//     : ""
// }${project.demo ? `**🌐 [Live Demo](${project.demo})** | ` : ""}**📂 [Source Code](${project.link})**

// ---

// `,
//   )
//   .join("")}</div>

// `
//       }

//       // Enhanced Achievements
//       if (formData.sections.achievements && formData.achievements.length > 0) {
//         readme += `## 🏆 Achievements & Certifications

// <div align="center">

// ${formData.achievements.map((achievement, index) => `🎖️ ${achievement}`).join("\n")}

// </div>

// ---

// `
//       }

//       // Enhanced Connect Section
//       readme += `## 🤝 Let's Connect & Collaborate

// <div align="center">

// ${formData.linkedin ? `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${formData.linkedin})` : ""}
// ${formData.twitter ? `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${formData.twitter})` : ""}
// ${formData.instagram ? `[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](${formData.instagram})` : ""}
// ${formData.email ? `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${formData.email})` : ""}
// ${formData.portfolio ? `[![Portfolio](https://img.shields.io/badge/Portfolio-${theme.colors.primary}?style=for-the-badge&logo=google-chrome&logoColor=white)](${formData.portfolio})` : ""}

// </div>

// ---

// `

//       // Enhanced Contribution Graph
//       readme += `## 📈 Contribution Graph

// <div align="center">
// <img src="https://github-readme-activity-graph.vercel.app/graph?username=${formData.github}&bg_color=0d1117&color=${theme.colors.primary}&line=${theme.colors.primary}&point=ffffff&area=true&hide_border=true" />
// </div>

// ---

// `

//       // Enhanced Footer
//       if (formData.advanced.showWaveFooter) {
//         readme += `<div align="center">
// <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" />
// <br>
// <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
// <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" />
// <img src="https://img.shields.io/badge/Powered%20by-KiitHub-${theme.colors.primary}?style=for-the-badge" />
// </div>
// <br>
// <i>⭐️ From <a href="https://github.com/${formData.github}">${formData.github}</a> | Generated with 💚 by KiitHub</i>
// <br><br>
// </div>`
//       }

//       setGeneratedReadme(readme)
//       setIsGenerating(false)
//     }, 2500)
//   }, [formData, checkGitHubAPI, selectedTheme, themes])

//   useEffect(() => {
//     if (currentStep === steps.length - 1) {
//       generateModernReadme()
//     }
//   }, [currentStep, generateModernReadme, steps.length])

//   const handleInputChange = useCallback((field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }, [])

//   const handleNestedChange = useCallback((parent, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [parent]: { ...prev[parent], [field]: value },
//     }))
//   }, [])

//   const addSkill = useCallback((skill) => {
//     setFormData((prev) => {
//       if (!prev.skills.includes(skill)) {
//         return { ...prev, skills: [...prev.skills, skill] }
//       }
//       return prev
//     })
//   }, [])

//   const removeSkill = useCallback((skill) => {
//     setFormData((prev) => ({
//       ...prev,
//       skills: prev.skills.filter((s) => s !== skill),
//     }))
//   }, [])

//   const addProject = useCallback(() => {
//     setFormData((prev) => ({
//       ...prev,
//       projects: [...prev.projects, { name: "", description: "", link: "", tech: "", demo: "" }],
//     }))
//   }, [])

//   const updateProject = useCallback((index, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       projects: prev.projects.map((project, i) => (i === index ? { ...project, [field]: value } : project)),
//     }))
//   }, [])

//   const removeProject = useCallback((index) => {
//     setFormData((prev) => ({
//       ...prev,
//       projects: prev.projects.filter((_, i) => i !== index),
//     }))
//   }, [])

//   const addAchievement = useCallback(() => {
//     setFormData((prev) => ({
//       ...prev,
//       achievements: [...prev.achievements, ""],
//     }))
//   }, [])

//   const updateAchievement = useCallback((index, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       achievements: prev.achievements.map((achievement, i) => (i === index ? value : achievement)),
//     }))
//   }, [])

//   const removeAchievement = useCallback((index) => {
//     setFormData((prev) => ({
//       ...prev,
//       achievements: prev.achievements.filter((_, i) => i !== index),
//     }))
//   }, [])

//   const copyToClipboard = useCallback(async () => {
//     try {
//       await navigator.clipboard.writeText(generatedReadme)
//       setCopySuccess(true)

//       // Update global stats
//       setGlobalStats((prev) => ({
//         ...prev,
//         totalCopies: prev.totalCopies + 1,
//         todayCopies: prev.todayCopies + 1,
//       }))

//       setTimeout(() => setCopySuccess(false), 2000)
//     } catch (err) {
//       alert("Failed to copy to clipboard")
//     }
//   }, [generatedReadme])

//   const downloadReadme = useCallback(() => {
//     const blob = new Blob([generatedReadme], { type: "text/markdown" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "README.md"
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)

//     setDownloadSuccess(true)

//     // Update global stats
//     setGlobalStats((prev) => ({
//       ...prev,
//       totalDownloads: prev.totalDownloads + 1,
//       todayDownloads: prev.todayDownloads + 1,
//     }))

//     setTimeout(() => setDownloadSuccess(false), 2000)
//   }, [generatedReadme])

//   const nextStep = useCallback(() => {
//     if (canProceedToNext && currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1)
//     }
//   }, [canProceedToNext, currentStep, steps.length])

//   const prevStep = useCallback(() => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1)
//     }
//   }, [currentStep])

//   // Simple markdown to HTML converter for preview
//   const markdownToHtml = useCallback((markdown) => {
//     return markdown
//       .replace(/^### (.*$)/gim, "<h3>$1</h3>")
//       .replace(/^## (.*$)/gim, "<h2>$1</h2>")
//       .replace(/^# (.*$)/gim, "<h1>$1</h1>")
//       .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
//       .replace(/\*(.*)\*/gim, "<em>$1</em>")
//       .replace(/`([^`]*)`/gim, "<code>$1</code>")
//       .replace(/\n/gim, "<br>")
//       .replace(/---/gim, "<hr>")
//   }, [])

//   if (!isKiitUser) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
//         <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center text-white shadow-2xl">
//           <div className="text-amber-500 mb-6 flex justify-center">
//             <AlertTriangle size={64} />
//           </div>
//           <h1 className="text-2xl md:text-3xl font-bold mb-4">Access Restricted</h1>
//           <p className="text-slate-300 mb-8 leading-relaxed">
//             This GitHub README Generator is exclusively available for KIIT students. Please login with your KIIT email
//             (@kiit.ac.in) to access this feature.
//           </p>
//           <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
//             <Github size={20} />
//             <span>Powered by KiitHub</span>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Mobile device warning
// if (isMobile) {
//   return (
//     <div className="mobile-warning-wrapper">
//       <div className="mobile-warning-card">
//         <div className="mobile-warning-icon">
//           <Monitor size={64} />
//         </div>
//         <h1 className="mobile-warning-title">Use Your Windows</h1>
//         <p className="mobile-warning-text">
//           This feature is available for <strong>Windows only</strong>. Please use a desktop or laptop computer for the
//           best experience.
//         </p>
//         <div className="mobile-warning-devices">
//           <div className="device desktop">
//             <Monitor size={20} />
//             <span>Desktop</span>
//           </div>
//           <div className="device mobile">
//             <Smartphone size={20} />
//             <span>Mobile</span>
//           </div>
//         </div>
//         <div className="powered-by">
//           <Github size={20} />
//           <span>Powered by KIITHub</span>
//         </div>
//       </div>
//     </div>
//   );
// }

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0: // Personal Info
//         return (
//           <div className="space-y-6">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">
//                   <User size={16} />
//                   Full Name <span className="required-indicator">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange("name", e.target.value)}
//                   placeholder="Raja Sah"
//                   className={`modern-input ${validationErrors.name ? "error-input" : ""}`}
//                 />
//                 {validationErrors.name && (
//                   <div className="form-error">
//                     <AlertCircle size={16} />
//                     {validationErrors.name}
//                   </div>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <Sparkles size={16} />
//                   Professional Title
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange("title", e.target.value)}
//                   placeholder="Full Stack Developer | AI Enthusiast"
//                   className="modern-input"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 <Heart size={16} />
//                 Bio
//               </label>
//               <textarea
//                 value={formData.bio}
//                 onChange={(e) => handleInputChange("bio", e.target.value)}
//                 placeholder="Passionate developer who loves creating amazing web experiences and solving complex problems..."
//                 rows={4}
//                 className="modern-input modern-textarea"
//               />
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">
//                   <Github size={16} />
//                   GitHub Username <span className="required-indicator">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.github}
//                   onChange={(e) => handleInputChange("github", e.target.value)}
//                   placeholder="Raja-Kumar23"
//                   className={`modern-input ${validationErrors.github ? "error-input" : ""}`}
//                 />
//                 {validationErrors.github && (
//                   <div className="form-error">
//                     <AlertCircle size={16} />
//                     {validationErrors.github}
//                   </div>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <MapPin size={16} />
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.location}
//                   onChange={(e) => handleInputChange("location", e.target.value)}
//                   placeholder="Bhubaneswar, India"
//                   className="modern-input"
//                 />
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">
//                   <Zap size={16} />
//                   Currently Working On
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.currentWork}
//                   onChange={(e) => handleInputChange("currentWork", e.target.value)}
//                   placeholder="Building a revolutionary web application"
//                   className="modern-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <Coffee size={16} />
//                   Currently Learning
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.learning}
//                   onChange={(e) => handleInputChange("learning", e.target.value)}
//                   placeholder="Machine Learning and Cloud Architecture"
//                   className="modern-input"
//                 />
//               </div>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">
//                   <Mail size={16} />
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange("email", e.target.value)}
//                   placeholder="your.email@example.com"
//                   className="modern-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   <Globe size={16} />
//                   Fun Fact
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.funFact}
//                   onChange={(e) => handleInputChange("funFact", e.target.value)}
//                   placeholder="I can solve a Rubik's cube in under 2 minutes!"
//                   className="modern-input"
//                 />
//               </div>
//             </div>
//           </div>
//         )

//       case 1: // Skills
//         return (
//           <div className="space-y-8">
//             <div className="text-center">
//               <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
//                 <Code size={24} />
//                 Select Your Tech Stack <span className="required-indicator">*</span>
//               </h3>
//               {validationErrors.skills && (
//                 <div className="bg-amber-500/10 border border-amber-500 text-amber-500 px-6 py-4 rounded-xl mb-6 flex items-center justify-center gap-2 font-medium">
//                   <AlertCircle size={16} />
//                   {validationErrors.skills}
//                 </div>
//               )}
//             </div>

//             <div className="space-y-8">
//               {skillCategories.map((category) => (
//                 <div key={category.name} className="skill-category">
//                   <h4 className="skill-category-title">
//                     <span className="skill-category-icon">{category.icon}</span>
//                     <span>{category.name}</span>
//                     <span className="skill-category-count">
//                       ({category.skills.filter((skill) => formData.skills.includes(skill)).length}/
//                       {category.skills.length})
//                     </span>
//                   </h4>
//                   <div className="skill-tags-container">
//                     {category.skills.map((skill) => (
//                       <button
//                         key={skill}
//                         onClick={() => (formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill))}
//                         className={`skill-tag ${formData.skills.includes(skill) ? "selected" : ""}`}
//                       >
//                         {skill}
//                         {formData.skills.includes(skill) && <CheckCircle size={14} />}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {formData.skills.length > 0 && (
//               <div className="selected-skills">
//                 <h4 className="selected-skills-title">
//                   <Star size={20} />
//                   Selected Skills ({formData.skills.length})
//                 </h4>
//                 <div className="selected-skills-list">
//                   {formData.skills.map((skill) => (
//                     <span key={skill} className="selected-skill-item">
//                       {skill}
//                       <button onClick={() => removeSkill(skill)} className="remove-skill-btn">
//                         <X size={12} />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )

//       case 2: // Projects
//         return (
//           <div className="space-y-8">
//             <div className="projects-header">
//               <h3 className="projects-title">
//                 <Trophy size={24} />
//                 Featured Projects
//               </h3>
//               <button onClick={addProject} className="add-project-btn">
//                 <Plus size={16} />
//                 Add Project
//               </button>
//             </div>

//             <div className="projects-list">
//               {formData.projects.map((project, index) => (
//                 <div key={index} className="project-item">
//                   <div className="project-header">
//                     <h4 className="project-number">
//                       <Github size={20} />
//                       Project {index + 1}
//                     </h4>
//                     <button onClick={() => removeProject(index)} className="remove-project-btn">
//                       <X size={16} />
//                     </button>
//                   </div>

//                   <div className="project-form">
//                     <div className="form-grid">
//                       <input
//                         type="text"
//                         value={project.name}
//                         onChange={(e) => updateProject(index, "name", e.target.value)}
//                         placeholder="Project Name"
//                         className="modern-input"
//                       />
//                       <input
//                         type="url"
//                         value={project.link}
//                         onChange={(e) => updateProject(index, "link", e.target.value)}
//                         placeholder="https://github.com/username/project"
//                         className="modern-input"
//                       />
//                     </div>

//                     <input
//                       type="url"
//                       value={project.demo}
//                       onChange={(e) => updateProject(index, "demo", e.target.value)}
//                       placeholder="Live Demo URL (optional)"
//                       className="modern-input"
//                     />

//                     <textarea
//                       value={project.description}
//                       onChange={(e) => updateProject(index, "description", e.target.value)}
//                       placeholder="Brief description of your project and its impact..."
//                       rows={3}
//                       className="modern-input modern-textarea"
//                     />

//                     <input
//                       type="text"
//                       value={project.tech}
//                       onChange={(e) => updateProject(index, "tech", e.target.value)}
//                       placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
//                       className="modern-input"
//                     />
//                   </div>
//                 </div>
//               ))}

//               {formData.projects.length === 0 && (
//                 <div className="empty-projects">
//                   <Trophy size={48} />
//                   <p>No projects added yet. Click "Add Project" to showcase your work!</p>
//                 </div>
//               )}
//             </div>

//             <div className="achievements-section">
//               <h4 className="achievements-title">
//                 <Trophy size={20} />
//                 Achievements (Optional)
//               </h4>

//               <div className="achievements-form">
//                 <button onClick={addAchievement} className="add-achievement-btn">
//                   <Plus size={16} />
//                   Add Achievement
//                 </button>

//                 <div className="achievements-list">
//                   {formData.achievements.map((achievement, index) => (
//                     <div key={index} className="achievement-item">
//                       <input
//                         type="text"
//                         value={achievement}
//                         onChange={(e) => updateAchievement(index, e.target.value)}
//                         placeholder="e.g., Winner of XYZ Hackathon 2024"
//                         className="modern-input"
//                       />
//                       <button onClick={() => removeAchievement(index)} className="remove-achievement-btn">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )

//       case 3: // Social Links
//         return (
//           <div className="space-y-8">
//             <h3 className="social-title">
//               <Link size={24} />
//               Connect Your Social Profiles
//             </h3>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label className="form-label">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                   </svg>
//                   LinkedIn
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.linkedin}
//                   onChange={(e) => handleInputChange("linkedin", e.target.value)}
//                   placeholder="https://linkedin.com/in/yourprofile"
//                   className="modern-input"
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
//                   </svg>
//                   Twitter
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.twitter}
//                   onChange={(e) => handleInputChange("twitter", e.target.value)}
//                   placeholder="https://twitter.com/yourhandle"
//                   className="modern-input"
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.691-4.919-4.919-.057-1.265-.069-1.644-.069-4.849 0-3.205.012-3.584.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073 3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//                   </svg>
//                   Instagram
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.instagram}
//                   onChange={(e) => handleInputChange("instagram", e.target.value)}
//                   placeholder="https://instagram.com/yourhandle"
//                   className="modern-input"
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   <Globe size={16} />
//                   Portfolio / Website
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.portfolio}
//                   onChange={(e) => handleInputChange("portfolio", e.target.value)}
//                   placeholder="https://yourportfolio.com"
//                   className="modern-input"
//                 />
//               </div>
//             </div>
//           </div>
//         )

//       case 4: // Theme & Style
//         return (
//           <div className="space-y-8">
//             <h3 className="theme-title">
//               <Palette size={24} />
//               Choose Your Theme & Style
//             </h3>

//             <div className="themes-grid">
//               {themes.map((theme) => (
//                 <div
//                   key={theme.id}
//                   className={`theme-card ${selectedTheme === theme.id ? "selected" : ""}`}
//                   onClick={() => setSelectedTheme(theme.id)}
//                 >
//                   <div
//                     className="theme-preview"
//                     style={{
//                       background: `linear-gradient(135deg, #${theme.colors.primary}20 0%, #${theme.colors.secondary}40 100%)`,
//                     }}
//                   >
//                     <div className="theme-colors">
//                       <div className="theme-color" style={{ backgroundColor: `#${theme.colors.primary}` }}></div>
//                       <div className="theme-color" style={{ backgroundColor: `#${theme.colors.accent}` }}></div>
//                       <div className="theme-color" style={{ backgroundColor: `#${theme.colors.secondary}` }}></div>
//                     </div>
//                   </div>
//                   <h4 className="theme-name">{theme.name}</h4>
//                   <p className="theme-style">{theme.style} style</p>
//                   {selectedTheme === theme.id && <CheckCircle className="theme-selected-icon" size={20} />}
//                 </div>
//               ))}
//             </div>

//             <div className="stats-theme-section">
//               <h4 className="stats-theme-title">
//                 <Settings size={20} />
//                 GitHub Stats Theme
//               </h4>
//               <select
//                 value={formData.stats.theme}
//                 onChange={(e) => handleNestedChange("stats", "theme", e.target.value)}
//                 className="modern-input"
//               >
//                 <option value="tokyonight">Tokyo Night</option>
//                 <option value="dark">Dark</option>
//                 <option value="radical">Radical</option>
//                 <option value="merko">Merko</option>
//                 <option value="gruvbox">Gruvbox</option>
//                 <option value="dracula">Dracula</option>
//                 <option value="highcontrast">High Contrast</option>
//                 <option value="cobalt">Cobalt</option>
//               </select>
//             </div>
//           </div>
//         )

//       case 5: // Advanced
//         return (
//           <div className="space-y-8">
//             <h3 className="advanced-title">
//               <Settings size={24} />
//               Advanced Features
//             </h3>

//             <div className="advanced-grid">
//               <div className="advanced-card">
//                 <h4 className="advanced-card-title">
//                   <Eye size={20} />
//                   Profile Views
//                 </h4>
//                 <div className="advanced-options">
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.advanced.profileViews}
//                       onChange={(e) => handleNestedChange("advanced", "profileViews", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Eye size={16} />

//                       Show Profile Views Counter
//                     </span>
//                   </label>
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.advanced.showVisitors}
//                       onChange={(e) => handleNestedChange("advanced", "showVisitors", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <ExternalLink size={16} />
//                       Show Visitors Badge
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               <div className="advanced-card">
//                 <h4 className="advanced-card-title">
//                   <Code size={20} />
//                   Typing Animation
//                 </h4>
//                 <div className="advanced-options">
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.advanced.showTyping}
//                       onChange={(e) => handleNestedChange("advanced", "showTyping", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Code size={16} />
//                       Enable Typing Animation
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               <div className="advanced-card">
//                 <h4 className="advanced-card-title">
//                   <Sparkles size={20} />
//                   Wave Effects
//                 </h4>
//                 <div className="advanced-options">
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.advanced.showWaveHeader}
//                       onChange={(e) => handleNestedChange("advanced", "showWaveHeader", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Sparkles size={16} />
//                       Show Wave Header
//                     </span>
//                   </label>
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.advanced.showWaveFooter}
//                       onChange={(e) => handleNestedChange("advanced", "showWaveFooter", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Zap size={16} />
//                       Show Wave Footer
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               <div className="advanced-card">
//                 <h4 className="advanced-card-title">
//                   <Trophy size={20} />
//                   GitHub Stats
//                 </h4>
//                 <div className="advanced-options">
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.stats.showStats}
//                       onChange={(e) => handleNestedChange("stats", "showStats", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Trophy size={16} />
//                       Show GitHub Stats
//                     </span>
//                   </label>
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.stats.showStreak}
//                       onChange={(e) => handleNestedChange("stats", "showStreak", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Zap size={16} />
//                       Show Streak Stats
//                     </span>
//                   </label>
//                   <label className="advanced-option">
//                     <input
//                       type="checkbox"
//                       className="modern-checkbox"
//                       checked={formData.stats.showTrophies}
//                       onChange={(e) => handleNestedChange("stats", "showTrophies", e.target.checked)}
//                     />
//                     <span className="advanced-option-text">
//                       <Trophy size={16} />
//                       Show Trophies
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )

//       case 6: // Preview
//         return (
//           <div className="space-y-8">
//             <div className="preview-header">
//               <div className="preview-info">
//                 <h3 className="preview-title">
//                   <Eye size={24} />
//                   Preview & Export
//                 </h3>
//                 <p className="preview-description">
//                   Review your generated README and export it to your GitHub profile.
//                 </p>
//                 {githubApiError && (
//                   <div className="github-error">
//                     <AlertTriangle size={20} />
//                     <div>
//                       <strong>GitHub API Error:</strong> Rate limit exceeded or profile not found. Some stats may not
//                       load correctly.
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="preview-controls">
//                 <div className="preview-mode-toggle">
//                   <button
//                     className={`preview-mode-btn ${previewMode === "rendered" ? "active" : ""}`}
//                     onClick={() => setPreviewMode("rendered")}
//                   >
//                     <Eye size={16} />
//                     Rendered
//                   </button>
//                   <button
//                     className={`preview-mode-btn ${previewMode === "code" ? "active" : ""}`}
//                     onClick={() => setPreviewMode("code")}
//                   >
//                     <Code size={16} />
//                     Code
//                   </button>
//                 </div>

//                 <div className="preview-actions">
//                   <button
//                     className={`preview-action-btn ${copySuccess ? "success" : ""}`}
//                     onClick={copyToClipboard}
//                     disabled={isGenerating}
//                   >
//                     {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
//                     {copySuccess ? "Copied!" : "Copy"}
//                   </button>
//                   <button
//                     className={`preview-action-btn ${downloadSuccess ? "success" : ""}`}
//                     onClick={downloadReadme}
//                     disabled={isGenerating}
//                   >
//                     {downloadSuccess ? <CheckCircle size={16} /> : <Download size={16} />}
//                     {downloadSuccess ? "Downloaded!" : "Download"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Global Stats Display */}
//             <div className="global-stats">
//               <h4 className="global-stats-title">
//                 <TrendingUp size={20} />
//                 Community Usage Stats
//               </h4>
//               <div className="stats-grid">
//                 <div className="stat-card">
//                   <div className="stat-icon">
//                     <Copy size={24} />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-number">{globalStats.totalCopies.toLocaleString()}</div>
//                     <div className="stat-label">Total Copies</div>
//                     <div className="stat-today">+{globalStats.todayCopies} today</div>
//                   </div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-icon">
//                     <Download size={24} />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-number">{globalStats.totalDownloads.toLocaleString()}</div>
//                     <div className="stat-label">Total Downloads</div>
//                     <div className="stat-today">+{globalStats.todayDownloads} today</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="preview-container">
//               {isGenerating ? (
//                 <div className="preview-loading">
//                   <Loader2 size={48} className="animate-spin" />
//                   <p className="loading-title">Generating your awesome README...</p>
//                   <div className="loading-steps">
//                     <span className="loading-step">
//                       <span className="loading-dot"></span>
//                       Fetching GitHub Stats
//                     </span>
//                     <span className="loading-step">
//                       <span className="loading-dot"></span>
//                       Crafting the Perfect Layout
//                     </span>
//                     <span className="loading-step">
//                       <span className="loading-dot"></span>
//                       Adding Finishing Touches
//                     </span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="preview-content">
//                   {previewMode === "code" ? (
//                     <pre className="code-block">{generatedReadme || "No README generated yet."}</pre>
//                   ) : (
//                     <div className="rendered-preview">
//                       {generatedReadme ? (
//                         <div
//                           className="prose prose-invert max-w-none"
//                           dangerouslySetInnerHTML={{ __html: markdownToHtml(generatedReadme) }}
//                         />
//                       ) : (
//                         <div className="empty-preview">
//                           <AlertCircle size={48} />
//                           <p>
//                             No README generated yet. Fill out the form and navigate to this step to see your preview.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="text-center py-20">
//             <p className="text-xl text-white/70">Step content will be implemented here</p>
//           </div>
//         )
//     }
//   }

//   const CurrentStepIcon = steps[currentStep].icon

//   return (
//     <div className="app-container">
//       {/* GitHub Guide Modal */}
//       {showGitHubGuide && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3 className="modal-title">
//                 <Github size={24} />
//                 GitHub README Guide
//               </h3>
//               <button className="modal-close-btn" onClick={() => setShowGitHubGuide(false)}>
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="modal-body">
//               <div className="guide-section">
//                 <div className="guide-header">
//                   <CheckCircle size={32} />
//                   <h4 className="guide-title">Quick Steps to Setup Your GitHub Profile README</h4>
//                 </div>

//                 <div className="guide-steps">
//                   <div className="guide-step">
//                     <div className="step-number">1</div>
//                     <div className="step-content">
//                       <h5 className="step-title">Create a New Repository</h5>
//                       <p className="step-description">
//                         Create a new repository with the <strong>same name</strong> as your GitHub username. For
//                         example, if your username is <code>Raja-Kumar23</code>, name the repository{" "}
//                         <code>Raja-Kumar23</code>.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="guide-step">
//                     <div className="step-number">2</div>
//                     <div className="step-content">
//                       <h5 className="step-title">Initialize with a README</h5>
//                       <p className="step-description">
//                         When creating the repository, make sure to initialize it with a README file. This will
//                         automatically create a <code>README.md</code> file in your repository.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="guide-step">
//                     <div className="step-number">3</div>
//                     <div className="step-content">
//                       <h5 className="step-title">Copy and Paste the Generated Content</h5>
//                       <p className="step-description">
//                         Copy the generated README content from the preview section and paste it into your{" "}
//                         <code>README.md</code> file.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="guide-step">
//                     <div className="step-number">4</div>
//                     <div className="step-content">
//                       <h5 className="step-title">Commit and Push Changes</h5>
//                       <p className="step-description">
//                         Commit the changes to your local repository and push them to GitHub. Your profile README will be
//                         automatically updated.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="guide-actions">
//                 <div className="guide-action-card">
//                   <h4 className="action-title">
//                     <Github size={20} />
//                     Go to GitHub
//                   </h4>
//                   <p className="action-description">
//                     Visit GitHub to create your profile repository and set up your README.
//                   </p>
//                   <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="action-btn">
//                     Open GitHub
//                     <ExternalLink size={16} />
//                   </a>
//                 </div>

//                 <div className="guide-action-card">
//                   <h4 className="action-title">
//                     <Code size={20} />
//                     Edit README.md
//                   </h4>
//                   <p className="action-description">
//                     Edit your <code>README.md</code> file directly on GitHub to customize your profile.
//                   </p>
//                   <a
//                     href={`https://github.com/${formData.github}/${formData.github}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="action-btn"
//                   >
//                     Edit README
//                     <ExternalLink size={16} />
//                   </a>
//                 </div>
//               </div>

//               <div className="guide-tips">
//                 <h4 className="tips-title">
//                   <Settings size={20} />
//                   Pro Tips for a Stunning Profile
//                 </h4>
//                 <ul className="tips-list">
//                   <li className="tip-item">
//                     <span className="tip-icon">💡</span>
//                     <span className="tip-text">Use a clear and concise bio to introduce yourself.</span>
//                   </li>
//                   <li className="tip-item">
//                     <span className="tip-icon">🎨</span>
//                     <span className="tip-text">Showcase your top skills and technologies.</span>
//                   </li>
//                   <li className="tip-item">
//                     <span className="tip-icon">🏆</span>
//                     <span className="tip-text">Highlight your featured projects and achievements.</span>
//                   </li>
//                   <li className="tip-item">
//                     <span className="tip-icon">🤝</span>
//                     <span className="tip-text">Include links to your social profiles and portfolio.</span>
//                   </li>
//                   <li className="tip-item">
//                     <span className="tip-icon">✨</span>
//                     <span className="tip-text">
//                       Keep your profile updated with your latest activities and contributions.
//                     </span>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button className="modal-close-btn-primary" onClick={() => setShowGitHubGuide(false)}>
//                 Close Guide
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* GitHub Guide Button */}
//       <button className="github-guide-btn" onClick={() => setShowGitHubGuide(true)}>
//         <Github size={20} />
//         <span>GitHub Guide</span>
//       </button>

//       {/* Sidebar Navigation */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <h1 className="sidebar-title">KiitHub README Generator</h1>
//           <p className="sidebar-subtitle">Create a stunning GitHub profile in minutes</p>
//         </div>

//         <nav className="sidebar-nav">
//           {steps.map((step, index) => {
//             const StepIcon = step.icon
//             return (
//               <div
//                 key={step.id}
//                 className={`nav-item ${index === currentStep ? "active" : index < currentStep ? "completed" : ""}`}
//                 onClick={() => setCurrentStep(index)}
//               >
//                 <div className="nav-icon">
//                   <StepIcon size={20} />
//                 </div>
//                 <div className="nav-content">
//                   <div className="nav-title">{step.title}</div>
//                   <div className="nav-description">{step.description}</div>
//                 </div>
//               </div>
//             )
//           })}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Progress Bar */}
//         <div className="progress-section">
//           <div className="progress-container">
//             <div className="progress-bar" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
//           </div>
//         </div>

//         {/* Content Card */}
//         <div className="content-card animate-fadeIn">
//           <div className="section-header">
//             <div className="section-icon">
//               <CurrentStepIcon size={24} />
//             </div>
//             <div>
//               <h2 className="section-title">{steps[currentStep].title}</h2>
//               <p className="section-description">{steps[currentStep].description}</p>
//             </div>
//           </div>

//           <div className="animate-slideInUp">{renderStepContent()}</div>

//           {/* Navigation Buttons */}
//           <div className="nav-buttons">
//             <button
//               className={`nav-btn nav-btn-secondary ${currentStep === 0 ? "nav-btn:disabled" : ""}`}
//               onClick={prevStep}
//               disabled={currentStep === 0}
//             >
//               <ChevronLeft size={20} />
//               Previous
//             </button>

//             <span className="step-counter">
//               Step {currentStep + 1} of {steps.length}
//             </span>

//             <button
//               className={`nav-btn nav-btn-primary ${
//                 !canProceedToNext || currentStep === steps.length - 1 ? "nav-btn:disabled" : ""
//               }`}
//               onClick={nextStep}
//               disabled={!canProceedToNext || currentStep === steps.length - 1}
//             >
//               Next
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default KiitHubReadmeGenerator








"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, setDoc, updateDoc, onSnapshot, increment, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  User,
  Code,
  Trophy,
  Link,
  Eye,
  Download,
  Copy,
  Github,
  ChevronRight,
  ChevronLeft,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Star,
  Loader2,
  AlertTriangle,
  Sparkles,
  Zap,
  Heart,
  Coffee,
  MapPin,
  Palette,
  Globe,
  Mail,
  Monitor,
  Smartphone,
  TrendingUp,
} from "lucide-react"
import "./styles.css"

const KiitHubReadmeGenerator = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [user] = useState({ email: "test@kiit.ac.in" }) // Replace with actual auth user
  const [showGitHubGuide, setShowGitHubGuide] = useState(false)
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [previewMode, setPreviewMode] = useState("rendered")
  const [validationErrors, setValidationErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [githubApiError, setGithubApiError] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("modern")
  const [isMobile, setIsMobile] = useState(false)
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  // Global stats for copy/download counts with Firebase
  const [globalStats, setGlobalStats] = useState({
    totalCopies: 0,
    totalDownloads: 0,
    todayCopies: 0,
    todayDownloads: 0,
  })

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    company: "",
    website: "",
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    portfolio: "",
    skills: [],
    projects: [],
    achievements: [],
    currentWork: "",
    learning: "",
    collaboration: "",
    askMeAbout: "",
    funFact: "",
    stats: {
      showStats: true,
      showLanguages: true,
      showStreak: true,
      showTrophies: true,
      showActivity: true,
      theme: "tokyonight",
    },
    sections: {
      about: true,
      skills: true,
      projects: true,
      stats: true,
      contact: true,
      achievements: true,
      activity: true,
    },
    advanced: {
      showVisitors: true,
      showTyping: true,
      customBadges: [],
      profileViews: true,
      showWaveHeader: true,
      showWaveFooter: true,
    },
  })

  // Check if user is KIIT student
  const isKiitUser = useMemo(() => {
    return user?.email?.endsWith("@kiit.ac.in")
  }, [user?.email])

  // Initialize Firebase stats and real-time listeners
  useEffect(() => {
    const initializeStats = async () => {
      try {
        const statsRef = doc(db, "stats", "global")
        const todayRef = doc(db, "stats", getTodayDateString())

        // Initialize global stats if they don't exist
        const globalStatsDoc = await getDoc(statsRef)
        if (!globalStatsDoc.exists()) {
          await setDoc(statsRef, {
            totalCopies: 0,
            totalDownloads: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }

        // Initialize today's stats if they don't exist
        const todayStatsDoc = await getDoc(todayRef)
        if (!todayStatsDoc.exists()) {
          await setDoc(todayRef, {
            copies: 0,
            downloads: 0,
            date: getTodayDateString(),
            createdAt: serverTimestamp(),
          })
        }

        // Set up real-time listeners
        const unsubscribeGlobal = onSnapshot(statsRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data()
            setGlobalStats((prev) => ({
              ...prev,
              totalCopies: data.totalCopies || 0,
              totalDownloads: data.totalDownloads || 0,
            }))
          }
        })

        const unsubscribeToday = onSnapshot(todayRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data()
            setGlobalStats((prev) => ({
              ...prev,
              todayCopies: data.copies || 0,
              todayDownloads: data.downloads || 0,
            }))
          }
        })

        return () => {
          unsubscribeGlobal()
          unsubscribeToday()
        }
      } catch (error) {
        console.error("Error initializing Firebase stats:", error)
      }
    }

    if (isKiitUser) {
      initializeStats()
    }
  }, [isKiitUser])

  // Helper function to get today's date string
  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0]
  }

  // Update Firebase stats
  const updateFirebaseStats = async (type) => {
    try {
      const statsRef = doc(db, "stats", "global")
      const todayRef = doc(db, "stats", getTodayDateString())

      if (type === "copy") {
        await updateDoc(statsRef, {
          totalCopies: increment(1),
          updatedAt: serverTimestamp(),
        })
        await updateDoc(todayRef, {
          copies: increment(1),
        })
      } else if (type === "download") {
        await updateDoc(statsRef, {
          totalDownloads: increment(1),
          updatedAt: serverTimestamp(),
        })
        await updateDoc(todayRef, {
          downloads: increment(1),
        })
      }
    } catch (error) {
      console.error(`Error updating ${type} stats:`, error)
    }
  }

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle access denied for non-KIIT users
  useEffect(() => {
    if (!isKiitUser) {
      setShowAccessDenied(true)
      // Redirect after 5 seconds
      const timer = setTimeout(() => {
        router.push("/") // Redirect to main page
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isKiitUser, router])

  const themes = useMemo(
    () => [
      {
        id: "modern",
        name: "Modern Tech",
        colors: { primary: "00D4AA", secondary: "1a1a1a", accent: "00b894" },
        style: "sleek",
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        colors: { primary: "ff0080", secondary: "0a0a0a", accent: "00ffff" },
        style: "neon",
      },
      {
        id: "ocean",
        name: "Ocean Blue",
        colors: { primary: "0077be", secondary: "001f3f", accent: "39cccc" },
        style: "wave",
      },
      {
        id: "sunset",
        name: "Sunset",
        colors: { primary: "ff6b35", secondary: "2d1b69", accent: "f7931e" },
        style: "gradient",
      },
    ],
    [],
  )

  const skillCategories = useMemo(
    () => [
      {
        name: "Programming Languages",
        icon: "💻",
        skills: [
          "JavaScript",
          "TypeScript",
          "Python",
          "Java",
          "C++",
          "Go",
          "Rust",
          "PHP",
          "C#",
          "Kotlin",
          "Swift",
          "Dart",
          "Ruby",
          "Scala",
          "R",
          "C",
        ],
      },
      {
        name: "Frontend Development",
        icon: "🎨",
        skills: [
          "React",
          "Vue.js",
          "Angular",
          "Next.js",
          "Nuxt.js",
          "Svelte",
          "SvelteKit",
          "HTML5",
          "CSS3",
          "Tailwind CSS",
          "Bootstrap",
          "Material-UI",
          "Chakra UI",
          "Sass",
        ],
      },
      {
        name: "Backend Development",
        icon: "⚙️",
        skills: [
          "Node.js",
          "Express.js",
          "Django",
          "Flask",
          "Spring Boot",
          "Laravel",
          "Ruby on Rails",
          "ASP.NET",
          "FastAPI",
          "NestJS",
          "Koa.js",
          "Gin",
        ],
      },
      {
        name: "Mobile Development",
        icon: "📱",
        skills: [
          "React Native",
          "Flutter",
          "Swift",
          "Kotlin",
          "Xamarin",
          "Ionic",
          "Cordova",
          "Unity",
          "Android Studio",
          "Xcode",
        ],
      },
      {
        name: "Database & Storage",
        icon: "🗄️",
        skills: [
          "MongoDB",
          "PostgreSQL",
          "MySQL",
          "Redis",
          "SQLite",
          "Firebase",
          "Supabase",
          "DynamoDB",
          "Cassandra",
          "Neo4j",
          "InfluxDB",
          "Elasticsearch",
        ],
      },
      {
        name: "Cloud & DevOps",
        icon: "☁️",
        skills: [
          "AWS",
          "Google Cloud",
          "Azure",
          "Docker",
          "Kubernetes",
          "Jenkins",
          "GitHub Actions",
          "Terraform",
          "Vercel",
          "Netlify",
          "Heroku",
          "DigitalOcean",
        ],
      },
      {
        name: "AI & Machine Learning",
        icon: "🤖",
        skills: [
          "TensorFlow",
          "PyTorch",
          "Scikit-learn",
          "OpenCV",
          "Pandas",
          "NumPy",
          "Jupyter",
          "Keras",
          "Hugging Face",
          "LangChain",
          "OpenAI",
          "Anthropic",
        ],
      },
      {
        name: "Tools & Others",
        icon: "🛠️",
        skills: [
          "Git",
          "VS Code",
          "IntelliJ",
          "Figma",
          "Postman",
          "Jira",
          "Slack",
          "Notion",
          "Linux",
          "GraphQL",
          "REST API",
          "Webpack",
          "Vite",
          "ESLint",
        ],
      },
    ],
    [],
  )

  const steps = useMemo(
    () => [
      {
        id: "personal",
        title: "Personal Info",
        icon: User,
        description: "Tell us about yourself",
        required: ["name", "github"],
      },
      {
        id: "skills",
        title: "Skills & Tech",
        icon: Code,
        description: "Your technical expertise",
        required: ["skills"],
      },
      {
        id: "projects",
        title: "Projects",
        icon: Trophy,
        description: "Showcase your work",
        required: [],
      },
      {
        id: "social",
        title: "Social Links",
        icon: Link,
        description: "Connect with others",
        required: [],
      },
      {
        id: "theme",
        title: "Theme & Style",
        icon: Palette,
        description: "Customize appearance",
        required: [],
      },
      {
        id: "advanced",
        title: "Advanced",
        icon: Settings,
        description: "Special features",
        required: [],
      },
      {
        id: "preview",
        title: "Preview & Export",
        icon: Eye,
        description: "Generate your README",
        required: [],
      },
    ],
    [],
  )

  const validateCurrentStep = useMemo(() => {
    const step = steps[currentStep]
    const errors = {}
    step.required.forEach((field) => {
      if (field === "skills") {
        if (formData.skills.length === 0) {
          errors[field] = "Please select at least one skill"
        }
      } else if (!formData[field] || String(formData[field]).trim() === "") {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })
    return errors
  }, [currentStep, steps, formData])

  useEffect(() => {
    setValidationErrors(validateCurrentStep)
  }, [validateCurrentStep])

  const canProceedToNext = useMemo(() => {
    return Object.keys(validateCurrentStep).length === 0
  }, [validateCurrentStep])

  const checkGitHubAPI = useCallback(async (username) => {
    if (!username) return true
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Remove the artificial error simulation
      setGithubApiError(false)
      return true
    } catch (error) {
      setGithubApiError(true)
      return false
    }
  }, [])

  const generateModernReadme = useCallback(async () => {
    setIsGenerating(true)
    setGithubApiError(false)
    const apiAvailable = await checkGitHubAPI(formData.github)
    const theme = themes.find((t) => t.id === selectedTheme) || themes[0]

    setTimeout(() => {
      let readme = ""
      // Enhanced header with wave animation
      if (formData.advanced.showWaveHeader) {
        const headerType = theme.style === "wave" ? "waving" : theme.style === "neon" ? "cylinder" : "waving"
        readme += `<div align="center"><img src="https://capsule-render.vercel.app/api?type=${headerType}&color=gradient&customColorList=6,11,20&height=300&section=header&text=${encodeURIComponent(formData.name || "Your Name")}&fontSize=80&fontAlign=50&fontAlignY=35&fontColor=fff&desc=${encodeURIComponent(formData.title || "Developer")}&descSize=20&descAlign=50&descAlignY=55&animation=fadeIn" /></div>\n\n`
      }

      // Enhanced typing animation with dynamic content
      if (formData.advanced.showTyping) {
        const typingLines = [
          `👋 Hi, I'm ${formData.name || "Developer"}!`,
          formData.title || "Full Stack Developer",
          formData.currentWork || "Building Amazing Things",
          formData.learning || "Always Learning New Tech",
          "Welcome to my GitHub Profile! 🚀",
          formData.funFact || "Code is Poetry 💫",
        ].filter(Boolean)
        readme += `<div align="center"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=${theme.colors.primary}&center=true&vCenter=true&width=800&lines=${encodeURIComponent(typingLines.join(";"))}" alt="Typing Animation" /></div>\n\n`
      }

      // Professional badges section
      if (formData.advanced.showVisitors && apiAvailable) {
        readme += `<div align="center">\n<img src="https://komarev.com/ghpvc/?username=${formData.github}&style=for-the-badge&color=${theme.colors.primary}&labelColor=${theme.colors.secondary}" alt="Profile Views" />\n<img src="https://img.shields.io/github/followers/${formData.github}?style=for-the-badge&color=${theme.colors.primary}&labelColor=${theme.colors.secondary}" alt="Followers" />\n<img src="https://img.shields.io/badge/Open%20Source-❤️-${theme.colors.accent}?style=for-the-badge" alt="Open Source Love" />\n</div>\n\n`
      }

      readme += `---\n\n## 🚀 About Me\n\n${
        formData.bio ? `> ${formData.bio}\n\n` : ""
      }<img align="right" alt="Coding" width="400" src="https://raw.githubusercontent.com/devSouvik/devSouvik/master/gif3.gif">\n\n${
        formData.currentWork ? `🔭 **Currently working on:** ${formData.currentWork}\n\n` : ""
      }${formData.learning ? `🌱 **Currently learning:** ${formData.learning}\n\n` : ""}${
        formData.collaboration ? `👯 **Looking to collaborate on:** ${formData.collaboration}\n\n` : ""
      }${formData.askMeAbout ? `💬 **Ask me about:** ${formData.askMeAbout}\n\n` : ""}${
        formData.funFact ? `⚡ **Fun fact:** ${formData.funFact}\n\n` : ""
      }${formData.location ? `📍 **Location:** ${formData.location}\n\n` : ""}${
        formData.company ? `🏢 **Company:** ${formData.company}\n\n` : ""
      }---\n\n## 🛠️ Tech Stack & Skills\n\n<div align="center">\n\n### Languages & Frameworks\n\n${
        formData.skills.length > 0
          ? `<p>\n${formData.skills
              .map((skill) => {
                const skillLower = skill.toLowerCase().replace(/[^a-z0-9]/g, "")
                return `<img src="https://skillicons.dev/icons?i=${skillLower}" alt="${skill}" width="50" height="50"/>`
              })
              .join("\n")}\n</p>`
          : "<p>No skills selected</p>"
      }\n\n### GitHub Statistics\n\n<div align="center">\n<img src="https://github-readme-stats.vercel.app/api?username=${formData.github}&show_icons=true&theme=${formData.stats.theme}&hide_border=true&count_private=true&include_all_commits=true&bg_color=0d1117&title_color=${theme.colors.primary}&icon_color=${theme.colors.primary}&text_color=ffffff" height="180"/>\n<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${formData.github}&theme=${formData.stats.theme}&hide_border=true&layout=compact&langs_count=8&bg_color=0d1117&title_color=${theme.colors.primary}&text_color=ffffff" height="180"/>\n</div>\n\n</div>\n\n---\n\n`

      // Enhanced GitHub Statistics
      if (formData.sections.stats && formData.github) {
        if (apiAvailable) {
          readme += `## 📊 GitHub Analytics\n\n<div align="center">\n\n<img src="https://github-readme-streak-stats.herokuapp.com/?user=${formData.github}&theme=${formData.stats.theme}&hide_border=true&background=0d1117&stroke=${theme.colors.primary}&ring=${theme.colors.primary}&fire=${theme.colors.accent}&currStreakLabel=${theme.colors.primary}" />\n\n${
            formData.stats.showActivity
              ? `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${formData.github}&theme=tokyo-night&hide_border=true&bg_color=0d1117&color=${theme.colors.primary}&line=${theme.colors.primary}&point=ffffff" />\n\n`
              : ""
          }${
            formData.stats.showTrophies
              ? `<img src="https://github-profile-trophy.vercel.app/?username=${formData.github}&theme=discord&no-frame=true&no-bg=true&margin-w=4&row=2&column=4" />\n\n`
              : ""
          }</div>\n\n---\n\n`
        } else {
          readme += `## 📊 GitHub Analytics\n\n<div align="center">\n<div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2rem; border-radius: 16px; border: 2px solid #${theme.colors.primary}; margin: 1rem 0;">\n<h3 style="color: #${theme.colors.primary}; margin-bottom: 1rem;">⚠️ GitHub API Temporarily Unavailable</h3>\n<p style="color: #cbd5e1;">Stats will automatically load when you upload this README to your profile repository.</p>\n</div>\n</div>\n\n---\n\n`
        }
      }

      // Enhanced Projects Section
      if (formData.sections.projects && formData.projects.length > 0) {
        readme += `## 🎯 Featured Projects\n\n<div align="center">\n\n${formData.projects
          .map(
            (project, index) =>
              `### 🚀 [${project.name}](${project.link})\n\n<div align="center">\n<img src="https://img.shields.io/badge/Project-${index + 1}-${theme.colors.primary}?style=for-the-badge&logo=github&logoColor=white" />\n${project.demo ? `<a href="${project.demo}"><img src="https://img.shields.io/badge/Live-Demo-${theme.colors.accent}?style=for-the-badge&logo=vercel&logoColor=white" /></a>` : ""}\n</div>\n\n${project.description}\n\n${
                project.tech ? `**🛠️ Built with:** \`${project.tech}\`\n\n` : ""
              }${project.demo ? `**🌐 [Live Demo](${project.demo})** | ` : ""}**📂 [Source Code](${project.link})**\n\n---\n\n`,
          )
          .join("")}</div>\n\n`
      }

      // Enhanced Achievements
      if (formData.sections.achievements && formData.achievements.length > 0) {
        readme += `## 🏆 Achievements & Certifications\n\n<div align="center">\n\n${formData.achievements.map((achievement, index) => `🎖️ ${achievement}`).join("\n\n")}\n\n</div>\n\n---\n\n`
      }

      // Enhanced Connect Section
      readme += `## 🤝 Let's Connect & Collaborate\n\n<div align="center">\n\n${formData.linkedin ? `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${formData.linkedin})` : ""}${formData.twitter ? `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${formData.twitter})` : ""}${formData.instagram ? `[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](${formData.instagram})` : ""}${formData.email ? `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${formData.email})` : ""}${formData.portfolio ? `[![Portfolio](https://img.shields.io/badge/Portfolio-${theme.colors.primary}?style=for-the-badge&logo=google-chrome&logoColor=white)](${formData.portfolio})` : ""}\n\n</div>\n\n---\n\n`

      // Enhanced Contribution Graph
      readme += `## 📈 Contribution Graph\n\n<div align="center">\n<img src="https://github-readme-activity-graph.vercel.app/graph?username=${formData.github}&bg_color=0d1117&color=${theme.colors.primary}&line=${theme.colors.primary}&point=ffffff&area=true&hide_border=true" />\n</div>\n\n---\n\n`

      // Enhanced Footer
      if (formData.advanced.showWaveFooter) {
        readme += `<div align="center">\n<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" />\n<br>\n<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">\n<img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" />\n<img src="https://img.shields.io/badge/Powered%20by-KiitHub-${theme.colors.primary}?style=for-the-badge" />\n</div>\n<br>\n<i>⭐️ From <a href="https://github.com/${formData.github}">${formData.github}</a> | Generated with 💚 by KiitHub</i>\n<br><br>\n</div>`
      }

      setGeneratedReadme(readme)
      setIsGenerating(false)
    }, 2500)
  }, [formData, checkGitHubAPI, selectedTheme, themes])

  useEffect(() => {
    if (currentStep === steps.length - 1) {
      generateModernReadme()
    }
  }, [currentStep, generateModernReadme, steps.length])

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleNestedChange = useCallback((parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }))
  }, [])

  const addSkill = useCallback((skill) => {
    setFormData((prev) => {
      if (!prev.skills.includes(skill)) {
        return { ...prev, skills: [...prev.skills, skill] }
      }
      return prev
    })
  }, [])

  const removeSkill = useCallback((skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }, [])

  const addProject = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", link: "", tech: "", demo: "" }],
    }))
  }, [])

  const updateProject = useCallback((index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) => (i === index ? { ...project, [field]: value } : project)),
    }))
  }, [])

  const removeProject = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }, [])

  const addAchievement = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }))
  }, [])

  const updateAchievement = useCallback((index, value) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => (i === index ? value : achievement)),
    }))
  }, [])

  const removeAchievement = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }, [])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedReadme)
      setCopySuccess(true)
      // Update Firebase stats
      await updateFirebaseStats("copy")
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      alert("Failed to copy to clipboard")
    }
  }, [generatedReadme])

  const downloadReadme = useCallback(() => {
    const blob = new Blob([generatedReadme], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "README.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadSuccess(true)
    // Update Firebase stats
    updateFirebaseStats("download")
    setTimeout(() => setDownloadSuccess(false), 2000)
  }, [generatedReadme])

  const nextStep = useCallback(() => {
    if (canProceedToNext && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [canProceedToNext, currentStep, steps.length])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  // Simple markdown to HTML converter for preview
  const markdownToHtml = useCallback((markdown) => {
    return markdown
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/`([^`]*)`/gim, "<code>$1</code>")
      .replace(/\n/gim, "<br>")
      .replace(/---/gim, "<hr>")
  }, [])

  // Access denied screen for non-KIIT users
  if (!isKiitUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center text-white shadow-2xl">
          <div className="text-amber-500 mb-6 flex justify-center">
            <AlertTriangle size={64} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Access Restricted</h1>
          <p className="text-slate-300 mb-8 leading-relaxed">
            This GitHub README Generator is exclusively available for KIIT students. Please login with your KIIT email
            (@kiit.ac.in) to access this feature.
          </p>
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              <strong>Redirecting to main page in 5 seconds...</strong>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Go to Main Page Now
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
            <Github size={20} />
            <span>Powered by KiitHub</span>
          </div>
        </div>
      </div>
    )
  }

  // Mobile device warning
  if (isMobile) {
    return (
      <div className="mobile-warning-wrapper">
        <div className="mobile-warning-card">
          <div className="mobile-warning-icon">
            <Monitor size={64} />
          </div>
          <h1 className="mobile-warning-title">Use Your Desktop</h1>
          <p className="mobile-warning-text">
            This feature is optimized for <strong>desktop/laptop</strong> use. Please use a desktop or laptop computer
            for the best experience.
          </p>
          <div className="mobile-warning-devices">
            <div className="device desktop">
              <Monitor size={20} />
              <span>Desktop</span>
            </div>
            <div className="device mobile">
              <Smartphone size={20} />
              <span>Mobile</span>
            </div>
          </div>
          <div className="powered-by">
            <Github size={20} />
            <span>Powered by KIITHub</span>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-6">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Full Name <span className="required-indicator">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Raja Sah"
                  className={`modern-input ${validationErrors.name ? "error-input" : ""}`}
                />
                {validationErrors.name && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    {validationErrors.name}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Sparkles size={16} />
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Full Stack Developer | AI Enthusiast"
                  className="modern-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                <Heart size={16} />
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Passionate developer who loves creating amazing web experiences and solving complex problems..."
                rows={4}
                className="modern-input modern-textarea"
              />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Github size={16} />
                  GitHub Username <span className="required-indicator">*</span>
                </label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  placeholder="Raja-Kumar23"
                  className={`modern-input ${validationErrors.github ? "error-input" : ""}`}
                />
                {validationErrors.github && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    {validationErrors.github}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Bhubaneswar, India"
                  className="modern-input"
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Zap size={16} />
                  Currently Working On
                </label>
                <input
                  type="text"
                  value={formData.currentWork}
                  onChange={(e) => handleInputChange("currentWork", e.target.value)}
                  placeholder="Building a revolutionary web application"
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Coffee size={16} />
                  Currently Learning
                </label>
                <input
                  type="text"
                  value={formData.learning}
                  onChange={(e) => handleInputChange("learning", e.target.value)}
                  placeholder="Machine Learning and Cloud Architecture"
                  className="modern-input"
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Globe size={16} />
                  Fun Fact
                </label>
                <input
                  type="text"
                  value={formData.funFact}
                  onChange={(e) => handleInputChange("funFact", e.target.value)}
                  placeholder="I can solve a Rubik's cube in under 2 minutes!"
                  className="modern-input"
                />
              </div>
            </div>
          </div>
        )
      case 1: // Skills
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Code size={24} />
                Select Your Tech Stack <span className="required-indicator">*</span>
              </h3>
              {validationErrors.skills && (
                <div className="bg-amber-500/10 border border-amber-500 text-amber-500 px-6 py-4 rounded-xl mb-6 flex items-center justify-center gap-2 font-medium">
                  <AlertCircle size={16} />
                  {validationErrors.skills}
                </div>
              )}
            </div>
            <div className="space-y-8">
              {skillCategories.map((category) => (
                <div key={category.name} className="skill-category">
                  <h4 className="skill-category-title">
                    <span className="skill-category-icon">{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="skill-category-count">
                      ({category.skills.filter((skill) => formData.skills.includes(skill)).length}/
                      {category.skills.length})
                    </span>
                  </h4>
                  <div className="skill-tags-container">
                    {category.skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => (formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill))}
                        className={`skill-tag ${formData.skills.includes(skill) ? "selected" : ""}`}
                      >
                        {skill}
                        {formData.skills.includes(skill) && <CheckCircle size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {formData.skills.length > 0 && (
              <div className="selected-skills">
                <h4 className="selected-skills-title">
                  <Star size={20} />
                  Selected Skills ({formData.skills.length})
                </h4>
                <div className="selected-skills-list">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="selected-skill-item">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="remove-skill-btn">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      case 2: // Projects
        return (
          <div className="space-y-8">
            <div className="projects-header">
              <h3 className="projects-title">
                <Trophy size={24} />
                Featured Projects
              </h3>
              <button onClick={addProject} className="add-project-btn">
                <Plus size={16} />
                Add Project
              </button>
            </div>
            <div className="projects-list">
              {formData.projects.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-header">
                    <h4 className="project-number">
                      <Github size={20} />
                      Project {index + 1}
                    </h4>
                    <button onClick={() => removeProject(index)} className="remove-project-btn">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="project-form">
                    <div className="form-grid">
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                        placeholder="Project Name"
                        className="modern-input"
                      />
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="modern-input"
                      />
                    </div>
                    <input
                      type="url"
                      value={project.demo}
                      onChange={(e) => updateProject(index, "demo", e.target.value)}
                      placeholder="Live Demo URL (optional)"
                      className="modern-input"
                    />
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      placeholder="Brief description of your project and its impact..."
                      rows={3}
                      className="modern-input modern-textarea"
                    />
                    <input
                      type="text"
                      value={project.tech}
                      onChange={(e) => updateProject(index, "tech", e.target.value)}
                      placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                      className="modern-input"
                    />
                  </div>
                </div>
              ))}
              {formData.projects.length === 0 && (
                <div className="empty-projects">
                  <Trophy size={48} />
                  <p>No projects added yet. Click "Add Project" to showcase your work!</p>
                </div>
              )}
            </div>
            <div className="achievements-section">
              <h4 className="achievements-title">
                <Trophy size={20} />
                Achievements (Optional)
              </h4>
              <div className="achievements-form">
                <button onClick={addAchievement} className="add-achievement-btn">
                  <Plus size={16} />
                  Add Achievement
                </button>
                <div className="achievements-list">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        placeholder="e.g., Winner of XYZ Hackathon 2024"
                        className="modern-input"
                      />
                      <button onClick={() => removeAchievement(index)} className="remove-achievement-btn">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 3: // Social Links
        return (
          <div className="space-y-8">
            <h3 className="social-title">
              <Link size={24} />
              Connect Your Social Profiles
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.691-4.919-4.919-.057-1.265-.069-1.644-.069-4.849 0-3.205.012-3.584.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073 3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Globe size={16} />
                  Portfolio / Website
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange("portfolio", e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="modern-input"
                />
              </div>
            </div>
          </div>
        )
      case 4: // Theme & Style
        return (
          <div className="space-y-8">
            <h3 className="theme-title">
              <Palette size={24} />
              Choose Your Theme & Style
            </h3>
            <div className="themes-grid">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`theme-card ${selectedTheme === theme.id ? "selected" : ""}`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div
                    className="theme-preview"
                    style={{
                      background: `linear-gradient(135deg, #${theme.colors.primary}20 0%, #${theme.colors.secondary}40 100%)`,
                    }}
                  >
                    <div className="theme-colors">
                      <div className="theme-color" style={{ backgroundColor: `#${theme.colors.primary}` }}></div>
                      <div className="theme-color" style={{ backgroundColor: `#${theme.colors.accent}` }}></div>
                      <div className="theme-color" style={{ backgroundColor: `#${theme.colors.secondary}` }}></div>
                    </div>
                  </div>
                  <h4 className="theme-name">{theme.name}</h4>
                  <p className="theme-style">{theme.style} style</p>
                  {selectedTheme === theme.id && <CheckCircle className="theme-selected-icon" size={20} />}
                </div>
              ))}
            </div>
            <div className="stats-theme-section">
              <h4 className="stats-theme-title">
                <Settings size={20} />
                GitHub Stats Theme
              </h4>
              <select
                value={formData.stats.theme}
                onChange={(e) => handleNestedChange("stats", "theme", e.target.value)}
                className="modern-input"
              >
                <option value="tokyonight">Tokyo Night</option>
                <option value="dark">Dark</option>
                <option value="radical">Radical</option>
                <option value="merko">Merko</option>
                <option value="gruvbox">Gruvbox</option>
                <option value="dracula">Dracula</option>
                <option value="highcontrast">High Contrast</option>
                <option value="cobalt">Cobalt</option>
              </select>
            </div>
          </div>
        )
      case 5: // Advanced
        return (
          <div className="space-y-8">
            <h3 className="advanced-title">
              <Settings size={24} />
              Advanced Features
            </h3>
            <div className="advanced-grid">
              <div className="advanced-card">
                <h4 className="advanced-card-title">
                  <Eye size={20} />
                  Profile Views
                </h4>
                <div className="advanced-options">
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.advanced.profileViews}
                      onChange={(e) => handleNestedChange("advanced", "profileViews", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Eye size={16} />
                      Show Profile Views Counter
                    </span>
                  </label>
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.advanced.showVisitors}
                      onChange={(e) => handleNestedChange("advanced", "showVisitors", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <ExternalLink size={16} />
                      Show Visitors Badge
                    </span>
                  </label>
                </div>
              </div>
              <div className="advanced-card">
                <h4 className="advanced-card-title">
                  <Code size={20} />
                  Typing Animation
                </h4>
                <div className="advanced-options">
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.advanced.showTyping}
                      onChange={(e) => handleNestedChange("advanced", "showTyping", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Code size={16} />
                      Enable Typing Animation
                    </span>
                  </label>
                </div>
              </div>
              <div className="advanced-card">
                <h4 className="advanced-card-title">
                  <Sparkles size={20} />
                  Wave Effects
                </h4>
                <div className="advanced-options">
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.advanced.showWaveHeader}
                      onChange={(e) => handleNestedChange("advanced", "showWaveHeader", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Sparkles size={16} />
                      Show Wave Header
                    </span>
                  </label>
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.advanced.showWaveFooter}
                      onChange={(e) => handleNestedChange("advanced", "showWaveFooter", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Zap size={16} />
                      Show Wave Footer
                    </span>
                  </label>
                </div>
              </div>
              <div className="advanced-card">
                <h4 className="advanced-card-title">
                  <Trophy size={20} />
                  GitHub Stats
                </h4>
                <div className="advanced-options">
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.stats.showStats}
                      onChange={(e) => handleNestedChange("stats", "showStats", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Trophy size={16} />
                      Show GitHub Stats
                    </span>
                  </label>
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.stats.showStreak}
                      onChange={(e) => handleNestedChange("stats", "showStreak", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Zap size={16} />
                      Show Streak Stats
                    </span>
                  </label>
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={formData.stats.showTrophies}
                      onChange={(e) => handleNestedChange("stats", "showTrophies", e.target.checked)}
                    />
                    <span className="advanced-option-text">
                      <Trophy size={16} />
                      Show Trophies
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      case 6: // Preview
        return (
          <div className="space-y-8">
            <div className="preview-header">
              <div className="preview-info">
                <h3 className="preview-title">
                  <Eye size={24} />
                  Preview & Export
                </h3>
                <p className="preview-description">
                  Review your generated README and export it to your GitHub profile.
                </p>
                {githubApiError && (
                  <div className="github-error">
                    <AlertTriangle size={20} />
                    <div>
                      <strong>GitHub API Error:</strong> Rate limit exceeded or profile not found. Some stats may not
                      load correctly.
                    </div>
                  </div>
                )}
              </div>
              <div className="preview-controls">
                <div className="preview-mode-toggle">
                  <button
                    className={`preview-mode-btn ${previewMode === "rendered" ? "active" : ""}`}
                    onClick={() => setPreviewMode("rendered")}
                  >
                    <Eye size={16} />
                    Rendered
                  </button>
                  <button
                    className={`preview-mode-btn ${previewMode === "code" ? "active" : ""}`}
                    onClick={() => setPreviewMode("code")}
                  >
                    <Code size={16} />
                    Code
                  </button>
                </div>
                <div className="preview-actions">
                  <button
                    className={`preview-action-btn ${copySuccess ? "success" : ""}`}
                    onClick={copyToClipboard}
                    disabled={isGenerating}
                  >
                    {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                  <button
                    className={`preview-action-btn ${downloadSuccess ? "success" : ""}`}
                    onClick={downloadReadme}
                    disabled={isGenerating}
                  >
                    {downloadSuccess ? <CheckCircle size={16} /> : <Download size={16} />}
                    {downloadSuccess ? "Downloaded!" : "Download"}
                  </button>
                </div>
              </div>
            </div>
            {/* Global Stats Display */}
            <div className="global-stats">
              <h4 className="global-stats-title">
                <TrendingUp size={20} />
                Community Usage Stats
              </h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Copy size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{globalStats.totalCopies.toLocaleString()}</div>
                    <div className="stat-label">Total Copies</div>
                    <div className="stat-today">+{globalStats.todayCopies} today</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Download size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{globalStats.totalDownloads.toLocaleString()}</div>
                    <div className="stat-label">Total Downloads</div>
                    <div className="stat-today">+{globalStats.todayDownloads} today</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-container">
              {isGenerating ? (
                <div className="preview-loading">
                  <Loader2 size={48} className="animate-spin" />
                  <p className="loading-title">Generating your awesome README...</p>
                  <div className="loading-steps">
                    <span className="loading-step">
                      <span className="loading-dot"></span>
                      Fetching GitHub Stats
                    </span>
                    <span className="loading-step">
                      <span className="loading-dot"></span>
                      Crafting the Perfect Layout
                    </span>
                    <span className="loading-step">
                      <span className="loading-dot"></span>
                      Adding Finishing Touches
                    </span>
                  </div>
                </div>
              ) : (
                <div className="preview-content">
                  {previewMode === "code" ? (
                    <pre className="code-block">{generatedReadme || "No README generated yet."}</pre>
                  ) : (
                    <div className="rendered-preview">
                      {generatedReadme ? (
                        <div
                          className="prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(generatedReadme) }}
                        />
                      ) : (
                        <div className="empty-preview">
                          <AlertCircle size={48} />
                          <p>
                            No README generated yet. Fill out the form and navigate to this step to see your preview.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      default:
        return (
          <div className="text-center py-20">
            <p className="text-xl text-white/70">Step content will be implemented here</p>
          </div>
        )
    }
  }

  const CurrentStepIcon = steps[currentStep].icon

  return (
    <div className="app-container">
      {/* GitHub Guide Modal */}
      {showGitHubGuide && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <Github size={24} />
                GitHub README Guide
              </h3>
              <button className="modal-close-btn" onClick={() => setShowGitHubGuide(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="guide-section">
                <div className="guide-header">
                  <CheckCircle size={32} />
                  <h4 className="guide-title">Quick Steps to Setup Your GitHub Profile README</h4>
                </div>
                <div className="guide-steps">
                  <div className="guide-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h5 className="step-title">Create a New Repository</h5>
                      <p className="step-description">
                        Create a new repository with the <strong>same name</strong> as your GitHub username. For
                        example, if your username is <code>Raja-Kumar23</code>, name the repository{" "}
                        <code>Raja-Kumar23</code>.
                      </p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h5 className="step-title">Initialize with a README</h5>
                      <p className="step-description">
                        When creating the repository, make sure to initialize it with a README file. This will
                        automatically create a <code>README.md</code> file in your repository.
                      </p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h5 className="step-title">Copy and Paste the Generated Content</h5>
                      <p className="step-description">
                        Copy the generated README content from the preview section and paste it into your{" "}
                        <code>README.md</code> file.
                      </p>
                    </div>
                  </div>
                  <div className="guide-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h5 className="step-title">Commit and Push Changes</h5>
                      <p className="step-description">
                        Commit the changes to your local repository and push them to GitHub. Your profile README will be
                        automatically updated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="guide-actions">
                <div className="guide-action-card">
                  <h4 className="action-title">
                    <Github size={20} />
                    Go to GitHub
                  </h4>
                  <p className="action-description">
                    Visit GitHub to create your profile repository and set up your README.
                  </p>
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="action-btn">
                    Open GitHub
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="guide-action-card">
                  <h4 className="action-title">
                    <Code size={20} />
                    Edit README.md
                  </h4>
                  <p className="action-description">
                    Edit your <code>README.md</code> file directly on GitHub to customize your profile.
                  </p>
                  <a
                    href={`https://github.com/${formData.github}/${formData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn"
                  >
                    Edit README
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              <div className="guide-tips">
                <h4 className="tips-title">
                  <Settings size={20} />
                  Pro Tips for a Stunning Profile
                </h4>
                <ul className="tips-list">
                  <li className="tip-item">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">Use a clear and concise bio to introduce yourself.</span>
                  </li>
                  <li className="tip-item">
                    <span className="tip-icon">🎨</span>
                    <span className="tip-text">Showcase your top skills and technologies.</span>
                  </li>
                  <li className="tip-item">
                    <span className="tip-icon">🏆</span>
                    <span className="tip-text">Highlight your featured projects and achievements.</span>
                  </li>
                  <li className="tip-item">
                    <span className="tip-icon">🤝</span>
                    <span className="tip-text">Include links to your social profiles and portfolio.</span>
                  </li>
                  <li className="tip-item">
                    <span className="tip-icon">✨</span>
                    <span className="tip-text">
                      Keep your profile updated with your latest activities and contributions.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn-primary" onClick={() => setShowGitHubGuide(false)}>
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Guide Button */}
      <button className="github-guide-btn" onClick={() => setShowGitHubGuide(true)}>
        <Github size={20} />
        <span>GitHub Guide</span>
      </button>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">github README Generator - KIITHub</h1>
          <p className="sidebar-subtitle">Create a stunning GitHub profile in minutes</p>
        </div>
        <nav className="sidebar-nav">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div
                key={step.id}
                className={`nav-item ${index === currentStep ? "active" : index < currentStep ? "completed" : ""}`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="nav-icon">
                  <StepIcon size={20} />
                </div>
                <div className="nav-content">
                  <div className="nav-title">{step.title}</div>
                  <div className="nav-description">{step.description}</div>
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        {/* Content Card */}
        <div className="content-card animate-fadeIn">
          <div className="section-header">
            <div className="section-icon">
              <CurrentStepIcon size={24} />
            </div>
            <div>
              <h2 className="section-title">{steps[currentStep].title}</h2>
              <p className="section-description">{steps[currentStep].description}</p>
            </div>
          </div>
          <div className="animate-slideInUp">{renderStepContent()}</div>
          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <button
              className={`nav-btn nav-btn-secondary ${currentStep === 0 ? "nav-btn:disabled" : ""}`}
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <span className="step-counter">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              className={`nav-btn nav-btn-primary ${
                !canProceedToNext || currentStep === steps.length - 1 ? "nav-btn:disabled" : ""
              }`}
              onClick={nextStep}
              disabled={!canProceedToNext || currentStep === steps.length - 1}
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default KiitHubReadmeGenerator

