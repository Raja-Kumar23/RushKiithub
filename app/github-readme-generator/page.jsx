"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
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
} from "lucide-react"
import "./styles.css"

const KiitHubReadmeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [user] = useState({ email: "test@kiit.ac.in" })
  const [showGitHubGuide, setShowGitHubGuide] = useState(false)
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [previewMode, setPreviewMode] = useState("rendered")
  const [validationErrors, setValidationErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [githubApiError, setGithubApiError] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("modern")

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

  const isKiitUser = useMemo(() => {
    return user?.email?.endsWith("@kiit.ac.in")
  }, [user?.email])

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
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (Math.random() < 0.15) {
        throw new Error("GitHub API Rate Limit")
      }
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
        readme += `<div align="center">
<img src="https://capsule-render.vercel.app/api?type=${headerType}&color=gradient&customColorList=6,11,20&height=300&section=header&text=${encodeURIComponent(formData.name || "Your Name")}&fontSize=80&fontAlign=50&fontAlignY=35&fontColor=fff&desc=${encodeURIComponent(formData.title || "Developer")}&descSize=20&descAlign=50&descAlignY=55&animation=fadeIn" />
</div>

`
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

        readme += `<div align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=${theme.colors.primary}&center=true&vCenter=true&width=800&lines=${encodeURIComponent(typingLines.join(";"))}" alt="Typing Animation" />
</div>

`
      }

      // Professional badges section
      if (formData.advanced.showVisitors && apiAvailable) {
        readme += `<div align="center">
<img src="https://komarev.com/ghpvc/?username=${formData.github}&style=for-the-badge&color=${theme.colors.primary}&labelColor=${theme.colors.secondary}" alt="Profile Views" />
<img src="https://img.shields.io/github/followers/${formData.github}?style=for-the-badge&color=${theme.colors.primary}&labelColor=${theme.colors.secondary}" alt="Followers" />
<img src="https://img.shields.io/badge/Open%20Source-❤️-${theme.colors.accent}?style=for-the-badge" alt="Open Source Love" />
</div>

`
      }

      readme += `---

## 🚀 About Me

${formData.bio ? `> ${formData.bio}\n\n` : ""}

<img align="right" alt="Coding" width="400" src="https://raw.githubusercontent.com/devSouvik/devSouvik/master/gif3.gif">

${formData.currentWork ? `🔭 **Currently working on:** ${formData.currentWork}\n\n` : ""}${formData.learning ? `🌱 **Currently learning:** ${formData.learning}\n\n` : ""}${formData.collaboration ? `👯 **Looking to collaborate on:** ${formData.collaboration}\n\n` : ""}${formData.askMeAbout ? `💬 **Ask me about:** ${formData.askMeAbout}\n\n` : ""}${formData.funFact ? `⚡ **Fun fact:** ${formData.funFact}\n\n` : ""}${formData.location ? `📍 **Location:** ${formData.location}\n\n` : ""}${formData.company ? `🏢 **Company:** ${formData.company}\n\n` : ""}

---

## 🛠️ Tech Stack & Skills

<div align="center">

### Languages & Frameworks
${
  formData.skills.length > 0
    ? `<p>
${formData.skills
  .map((skill) => {
    const skillLower = skill.toLowerCase().replace(/[^a-z0-9]/g, "")
    return `<img src="https://skillicons.dev/icons?i=${skillLower}" alt="${skill}" width="50" height="50"/>`
  })
  .join("")}
</p>`
    : "<p>No skills selected</p>"
}

### GitHub Statistics
<div align="center">
<img src="https://github-readme-stats.vercel.app/api?username=${formData.github}&show_icons=true&theme=${formData.stats.theme}&hide_border=true&count_private=true&include_all_commits=true&bg_color=0d1117&title_color=${theme.colors.primary}&icon_color=${theme.colors.primary}&text_color=ffffff" height="180"/>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${formData.github}&theme=${formData.stats.theme}&hide_border=true&layout=compact&langs_count=8&bg_color=0d1117&title_color=${theme.colors.primary}&text_color=ffffff" height="180"/>
</div>

</div>

---`

      // Enhanced GitHub Statistics
      if (formData.sections.stats && formData.github) {
        if (apiAvailable) {
          readme += `
## 📊 GitHub Analytics

<div align="center">
  
<img src="https://github-readme-streak-stats.herokuapp.com/?user=${formData.github}&theme=${formData.stats.theme}&hide_border=true&background=0d1117&stroke=${theme.colors.primary}&ring=${theme.colors.primary}&fire=${theme.colors.accent}&currStreakLabel=${theme.colors.primary}" />

${
  formData.stats.showActivity
    ? `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${formData.github}&theme=tokyo-night&hide_border=true&bg_color=0d1117&color=${theme.colors.primary}&line=${theme.colors.primary}&point=ffffff" />`
    : ""
}

${
  formData.stats.showTrophies
    ? `<img src="https://github-profile-trophy.vercel.app/?username=${formData.github}&theme=discord&no-frame=true&no-bg=true&margin-w=4&row=2&column=4" />`
    : ""
}

</div>

---`
        } else {
          readme += `
## 📊 GitHub Analytics

<div align="center">
<div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2rem; border-radius: 16px; border: 2px solid #${theme.colors.primary}; margin: 1rem 0;">
  <h3 style="color: #${theme.colors.primary}; margin-bottom: 1rem;">⚠️ GitHub API Temporarily Unavailable</h3>
  <p style="color: #cbd5e1;">Stats will automatically load when you upload this README to your profile repository.</p>
</div>
</div>

---`
        }
      }

      // Enhanced Projects Section
      if (formData.sections.projects && formData.projects.length > 0) {
        readme += `
## 🎯 Featured Projects

<div align="center">

${formData.projects
  .map(
    (project, index) => `
### 🚀 [${project.name}](${project.link})

<div align="center">
<img src="https://img.shields.io/badge/Project-${index + 1}-${theme.colors.primary}?style=for-the-badge&logo=github&logoColor=white" />
${project.demo ? `<a href="${project.demo}"><img src="https://img.shields.io/badge/Live-Demo-${theme.colors.accent}?style=for-the-badge&logo=vercel&logoColor=white" /></a>` : ""}
</div>

${project.description}

${project.tech ? `**🛠️ Built with:** \`${project.tech}\`` : ""}

${project.demo ? `**🌐 [Live Demo](${project.demo})** | ` : ""}**📂 [Source Code](${project.link})**

---`,
  )
  .join("")}

</div>`
      }

      // Enhanced Achievements
      if (formData.sections.achievements && formData.achievements.length > 0) {
        readme += `
## 🏆 Achievements & Certifications

<div align="center">

${formData.achievements
  .map(
    (achievement, index) => `
🎖️ ${achievement}

`,
  )
  .join("")}

</div>

---`
      }

      // Enhanced Connect Section
      readme += `
## 🤝 Let's Connect & Collaborate

<div align="center">

${formData.linkedin ? `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${formData.linkedin})` : ""}
${formData.twitter ? `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${formData.twitter})` : ""}
${formData.instagram ? `[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](${formData.instagram})` : ""}
${formData.email ? `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${formData.email})` : ""}
${formData.portfolio ? `[![Portfolio](https://img.shields.io/badge/Portfolio-${theme.colors.primary}?style=for-the-badge&logo=google-chrome&logoColor=white)](${formData.portfolio})` : ""}

</div>

---`

      // Enhanced Contribution Graph
      readme += `
## 📈 Contribution Graph

<div align="center">
<img src="https://github-readme-activity-graph.vercel.app/graph?username=${formData.github}&bg_color=0d1117&color=${theme.colors.primary}&line=${theme.colors.primary}&point=ffffff&area=true&hide_border=true" />
</div>

---`

      // Enhanced Footer
      if (formData.advanced.showWaveFooter) {
        readme += `
<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" />

<br>

<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Powered%20by-KiitHub-${theme.colors.primary}?style=for-the-badge" />
</div>

<br>

<i>⭐️ From <a href="https://github.com/${formData.github}">${formData.github}</a> | Generated with 💚 by KiitHub</i>

<br><br>


</div>`
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

  if (!isKiitUser) {
    return (
      <div className="access-denied">
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <AlertTriangle size={64} />
          </div>
          <h1 className="access-denied-title">Access Restricted</h1>
          <p className="access-denied-text">
            This GitHub README Generator is exclusively available for KIIT students. Please login with your KIIT email
            (@kiit.ac.in) to access this feature.
          </p>
          <div className="kiithub-branding">
            <Github size={20} />
            <span>Powered by KiitHub</span>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Raja Sah"
                  className={`form-input ${validationErrors.name ? "error" : ""}`}
                />
                {validationErrors.name && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    Name is required
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
                  className="form-input"
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
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Github size={16} />
                  GitHub Username *
                </label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  placeholder="Raja-Kumar23"
                  className={`form-input ${validationErrors.github ? "error" : ""}`}
                />
                {validationErrors.github && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    GitHub username is required
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
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
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
                  className="form-input"
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
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
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
                  className="form-input"
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
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )

      case 1: // Skills
        return (
          <div className="step-content">
            <div className="skills-header">
              <h3 className="skills-title">
                <Code size={24} />
                Select Your Tech Stack *
              </h3>
              {validationErrors.skills && (
                <div className="error-banner">
                  <AlertCircle size={16} />
                  {validationErrors.skills}
                </div>
              )}
            </div>

            <div className="skills-categories">
              {skillCategories.map((category) => (
                <div key={category.name} className="skill-category">
                  <h4 className="category-title">
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                    <span className="category-count">
                      ({category.skills.filter((skill) => formData.skills.includes(skill)).length}/
                      {category.skills.length})
                    </span>
                  </h4>
                  <div className="skills-grid">
                    {category.skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => (formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill))}
                        className={`skill-button ${formData.skills.includes(skill) ? "selected" : ""}`}
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
                    <span key={skill} className="selected-skill">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="remove-skill">
                        <X size={14} />
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
          <div className="step-content">
            <div className="projects-header">
              <h3 className="section-title">
                <Trophy size={24} />
                Featured Projects
              </h3>
              <button onClick={addProject} className="add-button">
                <Plus size={16} />
                Add Project
              </button>
            </div>

            <div className="projects-list">
              {formData.projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-header">
                    <h4 className="project-title">
                      <Github size={20} />
                      Project {index + 1}
                    </h4>
                    <button onClick={() => removeProject(index)} className="remove-button">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                      placeholder="Project Name"
                      className="form-input"
                    />
                    <input
                      type="url"
                      value={project.link}
                      onChange={(e) => updateProject(index, "link", e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="form-input"
                    />
                  </div>

                  <input
                    type="url"
                    value={project.demo}
                    onChange={(e) => updateProject(index, "demo", e.target.value)}
                    placeholder="Live Demo URL (optional)"
                    className="form-input"
                  />

                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    placeholder="Brief description of your project and its impact..."
                    rows={3}
                    className="form-textarea"
                  />

                  <input
                    type="text"
                    value={project.tech}
                    onChange={(e) => updateProject(index, "tech", e.target.value)}
                    placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                    className="form-input"
                  />
                </div>
              ))}

              {formData.projects.length === 0 && (
                <div className="empty-state">
                  <Trophy size={48} className="empty-icon" />
                  <p>No projects added yet. Click "Add Project" to showcase your work!</p>
                </div>
              )}
            </div>

            <div className="additional-info">
              <h4 className="subsection-title">
                <Trophy size={20} />
                Achievements (Optional)
              </h4>
              <div className="achievements-section">
                <div className="achievements-header">
                  <button onClick={addAchievement} className="add-button small">
                    <Plus size={16} />
                    Add Achievement
                  </button>
                </div>
                <div className="achievements-list">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        placeholder="e.g., Winner of XYZ Hackathon 2024"
                        className="form-input"
                      />
                      <button onClick={() => removeAchievement(index)} className="remove-button">
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
          <div className="step-content">
            <h3 className="section-title center">
              <Link size={24} />
              Connect Your Social Profiles
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782" />
                  </svg>
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.643 4.09359C23.481 4.15459 23.307 4.19559 23.129 4.22259C23.311 4.10959 23.474 3.95759 23.589 3.77959C23.414 3.88459 23.221 3.96159 23.013 4.01359C22.842 3.83459 22.633 3.69559 22.392 3.59359C22.151 3.49159 21.887 3.42859 21.615 3.40759C21.342 3.38559 21.066 3.40759 20.801 3.46959C20.536 3.53159 20.287 3.63159 20.066 3.76359C19.844 3.89559 19.652 4.05559 19.497 4.23759C19.342 4.41959 19.220 4.61859 19.136 4.83059C18.324 4.78659 17.536 4.58959 16.813 4.25059C16.09 3.91159 15.444 3.44559 14.906 2.88759C14.368 2.32959 13.952 1.69259 13.683 0.994587C13.414 0.296587 13.297 0.275587 13.069 0.275587C12.841 0.275587 12.724 0.296587 12.455 0.994587C12.186 1.69259 11.77 2.32959 11.232 2.88759C10.694 3.44559 10.048 3.91159 9.325 4.25059C8.602 4.58959 7.814 4.78659 7.002 4.83059C6.818 4.61859 6.696 4.41959 6.541 4.23759C6.386 4.05559 6.194 3.89559 5.972 3.76359C5.751 3.63159 5.502 3.53159 5.237 3.46959C4.972 3.40759 4.696 3.38559 4.423 3.40759C4.151 3.42859 3.887 3.49159 3.646 3.59359C3.405 3.69559 3.196 3.83459 3.025 4.01359C2.817 3.96159 2.624 3.88459 2.449 3.77959C2.564 3.95759 2.727 4.10959 2.909 4.22259C2.731 4.19559 2.557 4.15459 2.395 4.09359C1.664 4.61159 0.747 5.10459 0 5.54759C1.007 11.2216 4.736 15.7416 9.787 18.6356C14.838 21.5296 20.273 21.8396 23.985 17.8246C23.278 18.4176 22.493 18.8766 21.642 19.1706C22.534 18.3776 23.111 17.3416 23.405 16.1706C22.561 16.7636 21.626 17.2156 20.621 17.5096C19.77 17.8036 18.865 17.9996 17.932 18.0876C17.000 18.1756 16.054 18.1556 15.121 18.0276C14.188 17.8996 13.273 17.6646 12.404 17.3226C11.535 16.9806 10.713 16.5346 9.961 15.9906C9.209 15.4466 8.531 14.8126 7.951 14.0986C7.371 13.3846 6.891 12.5946 6.521 11.7436C6.151 10.8926 5.898 9.99059 5.769 9.06059C5.640 8.13059 5.640 7.18459 5.769 6.25459C5.898 5.32459 6.151 4.42259 6.521 3.57159C6.805 2.87359 7.199 2.23659 7.687 1.74359C8.175 1.25059 8.768 0.873587 9.424 0.630587C10.08 0.387587 10.77 0.287587 11.469 0.339587C12.168 0.391587 12.852 0.583587 13.478 0.909587C14.104 1.23559 14.658 1.68759 15.11 2.23659C15.562 2.78559 15.918 3.41959 16.169 4.11359C16.42 4.80759 16.561 5.53959 16.582 6.27159C16.603 7.00359 16.503 7.73559 16.282 8.43359C16.061 9.13159 15.721 9.77859 15.27 10.3486C14.819 10.9186 14.268 11.4026 13.64 11.7726C14.236 11.1796 14.73 10.4816 15.101 9.70959C15.472 8.93759 15.715 8.10759 15.829 7.24359C15.943 6.37959 15.927 5.50459 15.782 4.64859C15.637 3.79259 15.365 2.96659 14.971 2.19459C15.354 2.08159 15.71 1.92959 16.025 1.74359C16.34 1.55759 16.612 1.34159 16.833 1.10059C17.054 0.859587 17.221 0.605587 17.335 0.341587C17.449 0.077587 17.51 0 17.51 0C17.51 0 17.571 0.077587 17.685 0.341587C17.799 0.605587 17.966 0.859587 18.187 1.10059C18.408 1.34159 18.68 1.55759 18.995 1.74359C19.31 1.92959 19.666 2.08159 20.049 2.19459C19.655 2.96659 19.383 3.79259 19.238 4.64859C19.093 5.50459 19.077 6.37959 19.191 7.24359C19.305 8.10759 19.548 8.93759 19.919 9.70959C20.29 10.4816 20.784 11.1796 21.38 11.7726C20.752 11.4026 20.201 10.9186 19.75 10.3486C19.299 9.77859 18.959 9.13159 18.738 8.43359C18.517 7.73559 18.417 7.00359 18.438 6.27159C18.459 5.53959 18.6 4.80759 18.851 4.11359Z" />
                  </svg>
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.691-4.919-4.919-.057-1.265-.069-1.644-.069-4.849 0-3.205.012-3.584.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073 3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 1.137c2.762 0 5.025 2.263 5.025 5.025 0 2.762-2.263 5.025-5.025 5.025-2.762 0-5.025-2.263-5.025-5.025 0-2.762 2.263-5.025 5.025-5.025zm6.665-1.559c-.962 0-1.741.779-1.741 1.741 0 .962.779 1.741 1.741 1.741.962 0 1.741-.779 1.741-1.741 0-.962-.779-1.741-1.741-1.741zm-3.999 1.815c-2.154 0-3.904 1.75-3.904 3.904 0 2.154 1.75 3.904 3.904 3.904 2.154 0 3.904-1.75 3.904-3.904 0-2.154-1.75-3.904-3.904-3.904z" />
                  </svg>
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="form-input"
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
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )

      case 4: // Theme & Style
        return (
          <div className="step-content">
            <h3 className="section-title center">
              <Palette size={24} />
              Choose Your Theme & Style
            </h3>

            <div className="theme-grid">
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
                      <div className="color-dot" style={{ backgroundColor: `#${theme.colors.primary}` }}></div>
                      <div className="color-dot" style={{ backgroundColor: `#${theme.colors.accent}` }}></div>
                      <div className="color-dot" style={{ backgroundColor: `#${theme.colors.secondary}` }}></div>
                    </div>
                  </div>
                  <h4 className="theme-name">{theme.name}</h4>
                  <p className="theme-style">{theme.style} style</p>
                  {selectedTheme === theme.id && <CheckCircle className="theme-check" size={20} />}
                </div>
              ))}
            </div>

            <div className="stats-theme-section">
              <h4 className="subsection-title">
                <Settings size={20} />
                GitHub Stats Theme
              </h4>
              <select
                value={formData.stats.theme}
                onChange={(e) => handleNestedChange("stats", "theme", e.target.value)}
                className="form-select"
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
          <div className="step-content">
            <h3 className="section-title center">
              <Settings size={24} />
              Advanced Features
            </h3>

            <div className="advanced-grid">
              <div className="feature-card">
                <h4 className="feature-title">
                  <Eye size={20} />
                  Profile Views
                </h4>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.advanced.profileViews}
                      onChange={(e) => handleNestedChange("advanced", "profileViews", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <Eye size={16} />
                      Show Profile Views Counter
                    </span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.advanced.showVisitors}
                      onChange={(e) => handleNestedChange("advanced", "showVisitors", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <ExternalLink size={16} />
                      Show Visitors Badge
                    </span>
                  </label>
                </div>
              </div>

              <div className="feature-card">
                <h4 className="feature-title">
                  <Code size={20} />
                  Typing Animation
                </h4>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.advanced.showTyping}
                      onChange={(e) => handleNestedChange("advanced", "showTyping", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <Code size={16} />
                      Enable Typing Animation
                    </span>
                  </label>
                </div>
              </div>

              <div className="feature-card">
                <h4 className="feature-title">
                  <Sparkles size={20} />
                  Wave Effects
                </h4>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.advanced.showWaveHeader}
                      onChange={(e) => handleNestedChange("advanced", "showWaveHeader", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <Sparkles size={16} />
                      Show Wave Header
                    </span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.advanced.showWaveFooter}
                      onChange={(e) => handleNestedChange("advanced", "showWaveFooter", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <Zap size={16} />
                      Show Wave Footer
                    </span>
                  </label>
                </div>
              </div>

              <div className="feature-card">
                <h4 className="feature-title">
                  <Trophy size={20} />
                  GitHub Stats
                </h4>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.stats.showStats}
                      onChange={(e) => handleNestedChange("stats", "showStats", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <Trophy size={16} />
                      Show GitHub Stats
                    </span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.stats.showStreak}
                      onChange={(e) => handleNestedChange("stats", "showStreak", e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <Zap size={16} />
                      Show Streak Stats
                    </span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.stats.showTrophies}
                      onChange={(e) => handleNestedChange("stats", "showTrophies", e.target.checked)}
                    />
                    <span className="checkbox-text">
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
          <div className="step-content">
            <div className="preview-header">
              <div className="preview-info">
                <h3 className="section-title">
                  <Eye size={24} />
                  Preview & Export
                </h3>
                <p className="preview-description">
                  Review your generated README and export it to your GitHub profile.
                </p>
                {githubApiError && (
                  <div className="api-error-notice">
                    <AlertTriangle size={20} />
                    <strong>GitHub API Error:</strong> Rate limit exceeded or profile not found. Some stats may not load
                    correctly.
                  </div>
                )}
              </div>

              <div className="preview-controls">
                <div className="preview-mode-toggle">
                  <button
                    className={`mode-button ${previewMode === "rendered" ? "active" : ""}`}
                    onClick={() => setPreviewMode("rendered")}
                  >
                    <Eye size={16} />
                    Rendered
                  </button>
                  <button
                    className={`mode-button ${previewMode === "code" ? "active" : ""}`}
                    onClick={() => setPreviewMode("code")}
                  >
                    <Code size={16} />
                    Code
                  </button>
                </div>

                <div className="action-buttons">
                  <button
                    className={`action-button copy ${copySuccess ? "success" : ""}`}
                    onClick={copyToClipboard}
                    disabled={isGenerating}
                  >
                    {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copySuccess ? "Copied!" : "Copy to Clipboard"}
                  </button>
                  <button
                    className={`action-button download ${downloadSuccess ? "success" : ""}`}
                    onClick={downloadReadme}
                    disabled={isGenerating}
                  >
                    {downloadSuccess ? <CheckCircle size={16} /> : <Download size={16} />}
                    {downloadSuccess ? "Downloaded!" : "Download README"}
                  </button>
                </div>
              </div>
            </div>

            <div className="preview-container">
              {isGenerating ? (
                <div className="loading-state">
                  <Loader2 size={48} className="spinner" />
                  <p>Generating your awesome README...</p>
                  <div className="loading-steps">
                    <span className={`loading-step ${generatedReadme ? "active" : ""}`}>
                      <span className="step-number">1</span>
                      Fetching GitHub Stats
                    </span>
                    <span className={`loading-step ${generatedReadme ? "active" : ""}`}>
                      <span className="step-number">2</span>
                      Crafting the Perfect Layout
                    </span>
                    <span className={`loading-step ${generatedReadme ? "active" : ""}`}>
                      <span className="step-number">3</span>
                      Adding Finishing Touches
                    </span>
                  </div>
                </div>
              ) : (
                <div className="preview-content">
                  {previewMode === "code" ? (
                    <pre className="code-preview">{generatedReadme || "No README generated yet."}</pre>
                  ) : (
                    <div className="rendered-preview">
                      {generatedReadme ? (
                        <div
                          className="markdown-content"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(generatedReadme) }}
                        />
                      ) : (
                        <div className="preview-notice">
                          <AlertCircle size={16} />
                          No README generated yet. Fill out the form and click "Generate README" to see your preview.
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
        return <div>Unknown step</div>
    }
  }

  // Get current step icon component
  const CurrentStepIcon = steps[currentStep].icon

  return (
    <div className="app">
      <div className="container">
        {showGitHubGuide && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  <Github size={24} />
                  GitHub README Guide
                </h3>
                <button className="modal-close" onClick={() => setShowGitHubGuide(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="quick-steps">
                  <div className="quick-steps-header">
                    <CheckCircle size={32} className="success-icon" />
                    <h4 className="quick-steps-title">Quick Steps to Setup Your GitHub Profile README</h4>
                  </div>
                  <div className="steps-grid">
                    <div className="step-item">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h5 className="step-name">Create a New Repository</h5>
                        <p className="step-desc">
                          Create a new repository with the <strong>same name</strong> as your GitHub username. For
                          example, if your username is <code>Raja-Kumar23</code>, name the repository{" "}
                          <code>Raja-Kumar23</code>.
                        </p>
                      </div>
                    </div>

                    <div className="step-item">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h5 className="step-name">Initialize with a README</h5>
                        <p className="step-desc">
                          When creating the repository, make sure to initialize it with a README file. This will
                          automatically create a <code>README.md</code> file in your repository.
                        </p>
                      </div>
                    </div>

                    <div className="step-item">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h5 className="step-name">Copy and Paste the Generated Content</h5>
                        <p className="step-desc">
                          Copy the generated README content from the preview section and paste it into your{" "}
                          <code>README.md</code> file.
                        </p>
                      </div>
                    </div>

                    <div className="step-item">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h5 className="step-name">Commit and Push Changes</h5>
                        <p className="step-desc">
                          Commit the changes to your local repository and push them to GitHub. Your profile README will
                          be automatically updated.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-cards">
                  <div className="action-card">
                    <h4 className="action-title">
                      <Github size={20} />
                      Go to GitHub
                    </h4>
                    <p className="action-desc">
                      Visit GitHub to create your profile repository and set up your README.
                    </p>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="action-link">
                      Open GitHub
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div className="action-card">
                    <h4 className="action-title">
                      <Code size={20} />
                      Edit README.md
                    </h4>
                    <p className="action-desc">
                      Edit your <code>README.md</code> file directly on GitHub to customize your profile.
                    </p>
                    <a
                      href={`https://github.com/${formData.github}/${formData.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      Edit README
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="pro-tips">
                  <h4 className="tips-title">
                    <Settings size={20} />
                    Pro Tips for a Stunning Profile
                  </h4>
                  <ul className="tips-list">
                    <li>
                      <span className="tip-icon">💡</span>Use a clear and concise bio to introduce yourself.
                    </li>
                    <li>
                      <span className="tip-icon">🎨</span>Showcase your top skills and technologies.
                    </li>
                    <li>
                      <span className="tip-icon">🏆</span>Highlight your featured projects and achievements.
                    </li>
                    <li>
                      <span className="tip-icon">🤝</span>Include links to your social profiles and portfolio.
                    </li>
                    <li>
                      <span className="tip-icon">✨</span>Keep your profile updated with your latest activities and
                      contributions.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-close-button" onClick={() => setShowGitHubGuide(false)}>
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}

        <button className="github-guide-button" onClick={() => setShowGitHubGuide(true)}>
          <Github size={20} />
          <span>GitHub Guide</span>
        </button>

        <header className="header">
          <div className="logo-section">
            <div className="logo-container">
              <Code size={32} />
            </div>
            <div className="title-section">
              <h1 className="main-title">KiitHub README Generator</h1>
              <p className="main-subtitle">Create a stunning GitHub profile in minutes</p>
            </div>
          </div>
        </header>

        <section className="progress-section">
          <div className="steps-container">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <div
                  key={step.id}
                  className={`step-item ${index === currentStep ? "current" : ""} ${index < currentStep ? "completed" : ""} ${index === currentStep && Object.keys(validationErrors).length > 0 ? "error" : ""}`}
                >
                  <div className="step-circle">
                    <StepIcon size={24} />
                  </div>
                  <div className="step-info">
                    <h6 className="step-name">{step.title}</h6>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
        </section>

        <main className="main-content">
          <div className="content-card">
            <div className="step-header">
              <h2 className="step-title">
                <CurrentStepIcon size={32} />
                {steps[currentStep].title}
              </h2>
              <p className="step-description">{steps[currentStep].description}</p>
            </div>

            <div className="step-body">{renderStepContent()}</div>

            <nav className="navigation">
              <button
                className={`nav-button prev ${currentStep === 0 ? "disabled" : ""}`}
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
                className={`nav-button next ${!canProceedToNext || currentStep === steps.length - 1 ? "disabled" : ""}`}
                onClick={nextStep}
                disabled={!canProceedToNext || currentStep === steps.length - 1}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  )
}

export default KiitHubReadmeGenerator
