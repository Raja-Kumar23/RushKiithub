import React from 'react'
import { Calculator, CheckSquare, Star, Users, HeadphonesIcon, MessageSquare, ArrowUpRight, Map, FileText, Code2, Github } from 'lucide-react'
import './FeatureGrid.css'

const FeatureGrid = ({ theme, user, setShowLoginPrompt, showNotification }) => {
  const features = [
    {
      id: 'cgpa',
      title: 'CGPA Calculator',
      description: 'Calculate your CGPA instantly',
      icon: Calculator,
      gradient: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      action: () => handleFeatureClick('cgpa'),
      available: true
    },
    {
      id: 'todo',
      title: 'Todo List',
      description: 'Organize your tasks efficiently',
      icon: CheckSquare,
      gradient: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.accent} 100%)`,
      action: () => handleFeatureClick('todo'),
      available: true
    },
    {
      id: 'faculty',
      title: 'Faculty Reviews',
      description: 'Read and write reviews about faculty members',
      icon: Star,
      gradient: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`,
      action: () => handleFeatureClick('faculty'),
      available: true
    },
    {
      id: 'section',
      title: 'Section Swapping',
      description: 'Find students to swap sections',
      icon: Users,
      gradient: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.primary} 100%)`,
      action: () => handleFeatureClick('section'),
      available: true
    },
    {
      id: 'support',
      title: 'Support Hub',
      description: 'Get help and support from our community',
      icon: HeadphonesIcon,
      gradient: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
      action: () => handleFeatureClick('support'),
      available: true
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      description: 'Explore tech career paths and learning guides',
      icon: Map,
      gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
      action: () => handleFeatureClick('roadmap'),
      available: true
    },
    {
      id: 'pdf-upload',
      title: 'PDF Upload Hub',
      description: 'Share unavailable PDFs and earn rewards',
      icon: FileText,
      gradient: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
      action: () => handleFeatureClick('pdf-upload'),
      available: true
    },
    {
      id: 'project-ideas',
      title: 'Project Ideas Hub',
      description: 'Discover amazing project ideas with source code tutorials',
      icon: Code2,
      gradient: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`,
      action: () => handleFeatureClick('project-ideas'),
      available: true
    },
    {
      id: 'github-readme',
      title: 'GitHub README Generator',
      description: 'Create stunning GitHub profile READMEs instantly',
      icon: Github,
      gradient: `linear-gradient(135deg, #24292e 0%, #6f42c1 100%)`,
      action: () => handleFeatureClick('github-readme'),
      available: true
    },
  ]

  const checkRollNumberAccess = (rollNumber) => {
    // Extract the year from roll number (assuming format like 22XXXXXXX or 23XXXXXXX)
    const year = rollNumber.substring(0, 2)
    return year === '22' || year === '23'
  }

  const handleFeatureClick = (featureId) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    // Special access control for project-ideas
    if (featureId === 'project-ideas') {
      // Extract roll number from email (assuming format like rollnumber@kiit.ac.in)
      const rollNumber = user.email.split('@')[0]
      
      if (!checkRollNumberAccess(rollNumber)) {
        showNotification('Project Ideas Hub is only accessible to 3rd and 4th year students (Roll numbers starting with 22 or 23)', 'error')
        return
      }
    }

    switch (featureId) {
      case 'faculty':
        showNotification('Opening Faculty Reviews...', 'info')
        window.open('/faculty-review', '_blank')
        break
      case 'cgpa':
        showNotification('Opening CGPA Calculator...', 'info')
        window.open('/cgpa', '_blank')
        break
      case 'todo':
        showNotification('Opening Todo List...', 'info')
        window.open('/to-do-list', '_blank')
        break
      case 'section':
        showNotification('Opening Section Swapping...', 'info')
        window.open('/swap', '_blank')
        break
      case 'support':
        showNotification('Opening Support Hub...', 'info')
        window.open('/support-hub', '_blank')
        break
      case 'roadmap':
        showNotification('Opening Career Roadmap...', 'info')
        window.open('/roadmap', '_blank')
        break
      case 'pdf-upload':
        showNotification('Opening PDF Upload Hub...', 'info')
        window.open('/pdf-upload', '_blank')
        break
      case 'project-ideas':
        showNotification('Opening Project Ideas Hub...', 'info')
        window.open('/project-ideas', '_blank')
        break
      case 'github-readme':
        showNotification('Opening GitHub README Generator...', 'info')
        window.open('/github-readme-generator', '_blank')
        break
      default:
        break
    }
  }

  return (
    <div className="feature-grid-section">
      <div className="feature-grid-header">
        <h2 className="feature-grid-title" style={{ color: theme.textPrimary }}>
          Essential Tools
        </h2>
        <p className="feature-grid-subtitle" style={{ color: theme.textMuted }}>
          Everything you need for academic success
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon
          
          return (
            <div
              key={feature.id}
              className="feature-card available"
              onClick={feature.action}
              style={{
                background: theme.glassBg,
                borderColor: theme.border,
                boxShadow: theme.shadow,
                cursor: 'pointer'
              }}
            >
              <div className="feature-card-inner">
                <div className="feature-header">
                  <div 
                    className="feature-icon"
                    style={{ background: feature.gradient }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  
                  <div className="feature-arrow" style={{ color: theme.textMuted }}>
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="feature-content">
                  <h3 className="feature-title" style={{ color: theme.textPrimary }}>
                    {feature.title}
                  </h3>
                  <p className="feature-description" style={{ color: theme.textMuted }}>
                    {feature.description}
                  </p>
                </div>

                <div className="feature-footer">
                  <span 
                    className="status-text" 
                    style={{ color: theme.success }}
                  >
                    
                  </span>
                </div>
              </div>

              <div className="feature-overlay" style={{ background: feature.gradient }}></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureGrid





// "use client"

// import { useState, useEffect } from "react"
// import {
//   Calculator,
//   CheckSquare,
//   Star,
//   Users,
//   HeadphonesIcon,
//   ArrowUpRight,
//   Map,
//   FileText,
//   Code2,
//   Github,
//   Lock,
//   Check,
// } from "lucide-react"
// import { getFirestore, collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore"
// import "./FeatureGrid.css"

// const FeatureGrid = ({ theme, user, setShowLoginPrompt, showNotification }) => {
//   const [unlockedFeatures, setUnlockedFeatures] = useState(new Set())
//   const [loadingPayment, setLoadingPayment] = useState(null)

//   const premiumFeatures = ["faculty", "section"]

//   const PREMIUM_BUNDLE_PRICE = 25

//   const features = [
//     {
//       id: "cgpa",
//       title: "CGPA Calculator",
//       description: "Calculate your CGPA instantly",
//       icon: Calculator,
//       gradient: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
//       action: () => handleFeatureClick("cgpa"),
//       available: true,
//       premium: false,
//     },
//     {
//       id: "todo",
//       title: "Todo List",
//       description: "Organize your tasks efficiently",
//       icon: CheckSquare,
//       gradient: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.accent} 100%)`,
//       action: () => handleFeatureClick("todo"),
//       available: true,
//       premium: false,
//     },
//     {
//       id: "faculty",
//       title: "Faculty Reviews",
//       description: "Read and write reviews about faculty members",
//       icon: Star,
//       gradient: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`,
//       action: () => handleFeatureClick("faculty"),
//       available: true,
//       premium: true,
//     },
//     {
//       id: "section",
//       title: "Section Swapping",
//       description: "Find students to swap sections",
//       icon: Users,
//       gradient: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.primary} 100%)`,
//       action: () => handleFeatureClick("section"),
//       available: true,
//       premium: true,
//     },
//     {
//       id: "support",
//       title: "Support Hub",
//       description: "Get help and support from our community",
//       icon: HeadphonesIcon,
//       gradient: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
//       action: () => handleFeatureClick("support"),
//       available: true,
//       premium: false,
//     },
//     {
//       id: "roadmap",
//       title: "Career Roadmap",
//       description: "Explore tech career paths and learning guides",
//       icon: Map,
//       gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
//       action: () => handleFeatureClick("roadmap"),
//       available: true,
//       premium: false,
//     },
//     {
//       id: "pdf-upload",
//       title: "PDF Upload Hub",
//       description: "Share unavailable PDFs and earn rewards",
//       icon: FileText,
//       gradient: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
//       action: () => handleFeatureClick("pdf-upload"),
//       available: true,
//       premium: false,
//     },
//     {
//       id: "project-ideas",
//       title: "Project Ideas Hub",
//       description: "Discover amazing project ideas with source code tutorials",
//       icon: Code2,
//       gradient: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`,
//       action: () => handleFeatureClick("project-ideas"),
//       available: true,
//       premium: false,
//     },
//     {
//       id: "github-readme",
//       title: "GitHub README Generator",
//       description: "Create stunning GitHub profile READMEs instantly",
//       icon: Github,
//       gradient: `linear-gradient(135deg, #24292e 0%, #6f42c1 100%)`,
//       action: () => handleFeatureClick("github-readme"),
//       available: true,
//       premium: false,
//     },
//   ]

//   // Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement("script")
//     script.src = "https://checkout.razorpay.com/v1/checkout.js"
//     script.async = true
//     document.body.appendChild(script)

//     return () => {
//       document.body.removeChild(script)
//     }
//   }, [])

//   useEffect(() => {
//     if (!user?.email) return

//     const db = getFirestore()
//     const paymentsRef = collection(db, "payments")
//     const q = query(paymentsRef, where("userEmail", "==", user.email), where("paymentStatus", "==", "success"))

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const unlocked = new Set()
//       snapshot.forEach((doc) => {
//         const data = doc.data()
//         // If premium_bundle is purchased, unlock both features
//         if (data.featureId === "premium_bundle") {
//           unlocked.add("faculty")
//           unlocked.add("section")
//         } else if (data.featureId) {
//           unlocked.add(data.featureId)
//         }
//       })
//       setUnlockedFeatures(unlocked)
//     })

//     return () => unsubscribe()
//   }, [user?.email])

//   const checkRollNumberAccess = (rollNumber) => {
//     const year = rollNumber.substring(0, 2)
//     return year === "22" || year === "23"
//   }

//   const unlockPremiumBundle = async (paymentId, paymentDetails) => {
//     if (!user?.email) return

//     try {
//       const db = getFirestore()
//       const paymentRef = doc(db, "payments", paymentId)

//       await setDoc(paymentRef, {
//         userEmail: user.email,
//         featureId: "premium_bundle",
//         paymentStatus: "success",
//         paymentId: paymentId,
//         amount: PREMIUM_BUNDLE_PRICE,
//         currency: "INR",
//         timestamp: new Date().toISOString(),
//         razorpayPaymentId: paymentDetails.razorpay_payment_id,
//         razorpayOrderId: paymentDetails.razorpay_order_id || null,
//         razorpaySignature: paymentDetails.razorpay_signature || null,
//       })

//       console.log("[v0] Premium bundle unlocked successfully in Firestore")
//       showNotification("Premium features unlocked successfully!", "success")
//     } catch (error) {
//       console.error("[v0] Error unlocking premium bundle:", error)
//       showNotification("Payment successful but unlock failed. Please contact support.", "error")
//     }
//   }

//   const initiatePayment = () => {
//     if (!user) {
//       setShowLoginPrompt(true)
//       return
//     }

//     setLoadingPayment("premium_bundle")

//     const amount = PREMIUM_BUNDLE_PRICE * 100 // Convert to paise

//     const options = {
//       key: "rzp_live_RKYVyU8WqW2Oyk",
//       amount: amount,
//       currency: "INR",
//       name: "Academic Platform",
//       description: "Unlock Premium Features Bundle (Faculty Reviews + Section Swapping)",
//       image: "/logo.png",
//       handler: async (response) => {
//         console.log("[v0] Payment successful, unlocking features...", response)

//         // Write to Firestore immediately
//         await unlockPremiumBundle(response.razorpay_payment_id, response)

//         setLoadingPayment(null)
//         // The onSnapshot listener will automatically detect the new payment record and unlock features
//       },
//       prefill: {
//         email: user.email,
//         name: user.displayName || user.email.split("@")[0],
//       },
//       notes: {
//         featureId: "premium_bundle", // Single bundle ID
//         userEmail: user.email,
//         features: "faculty,section", // Track which features are included
//       },
//       theme: {
//         color: theme.primary,
//       },
//       modal: {
//         ondismiss: () => {
//           setLoadingPayment(null)
//           showNotification("Payment cancelled", "info")
//         },
//       },
//     }

//     const razorpay = new window.Razorpay(options)
//     razorpay.open()
//   }

//   const handleFeatureClick = (featureId) => {
//     if (!user) {
//       setShowLoginPrompt(true)
//       return
//     }

//     if (premiumFeatures.includes(featureId) && !unlockedFeatures.has(featureId)) {
//       initiatePayment()
//       return
//     }

//     // Special access control for project-ideas
//     if (featureId === "project-ideas") {
//       const rollNumber = user.email.split("@")[0]

//       if (!checkRollNumberAccess(rollNumber)) {
//         showNotification(
//           "Project Ideas Hub is only accessible to 3rd and 4th year students (Roll numbers starting with 22 or 23)",
//           "error",
//         )
//         return
//       }
//     }

//     // Open the feature
//     switch (featureId) {
//       case "faculty":
//         showNotification("Opening Faculty Reviews...", "info")
//         window.open("/faculty-review", "_blank")
//         break
//       case "cgpa":
//         showNotification("Opening CGPA Calculator...", "info")
//         window.open("/cgpa", "_blank")
//         break
//       case "todo":
//         showNotification("Opening Todo List...", "info")
//         window.open("/to-do-list", "_blank")
//         break
//       case "section":
//         showNotification("Opening Section Swapping...", "info")
//         window.open("/swap", "_blank")
//         break
//       case "support":
//         showNotification("Opening Support Hub...", "info")
//         window.open("/support-hub", "_blank")
//         break
//       case "roadmap":
//         showNotification("Opening Career Roadmap...", "info")
//         window.open("/roadmap", "_blank")
//         break
//       case "pdf-upload":
//         showNotification("Opening PDF Upload Hub...", "info")
//         window.open("/pdf-upload", "_blank")
//         break
//       case "project-ideas":
//         showNotification("Opening Project Ideas Hub...", "info")
//         window.open("/project-ideas", "_blank")
//         break
//       case "github-readme":
//         showNotification("Opening GitHub README Generator...", "info")
//         window.open("/github-readme-generator", "_blank")
//         break
//       default:
//         break
//     }
//   }

//   const getFeatureButtonText = (feature) => {
//     if (!feature.premium) return null

//     if (loadingPayment === "premium_bundle") {
//       return "Processing..."
//     }

//     if (unlockedFeatures.has(feature.id)) {
//       return "Open Feature"
//     }

//     return `Unlock Both for ₹${PREMIUM_BUNDLE_PRICE}`
//   }

//   const getFeatureButtonIcon = (feature) => {
//     if (!feature.premium) return null

//     if (unlockedFeatures.has(feature.id)) {
//       return <Check size={16} />
//     }

//     return <Lock size={16} />
//   }

//   return (
//     <div className="feature-grid-section">
//       <div className="feature-grid-header">
//         <h2 className="feature-grid-title" style={{ color: theme.textPrimary }}>
//           Essential Tools
//         </h2>
//         <p className="feature-grid-subtitle" style={{ color: theme.textMuted }}>
//           Everything you need for academic success
//         </p>
//       </div>

//       <div className="feature-grid">
//         {features.map((feature) => {
//           const Icon = feature.icon
//           const isPremium = feature.premium
//           const isUnlocked = unlockedFeatures.has(feature.id)
//           const buttonText = getFeatureButtonText(feature)
//           const ButtonIcon = getFeatureButtonIcon(feature)

//           return (
//             <div
//               key={feature.id}
//               className={`feature-card ${isPremium && !isUnlocked ? "premium-locked" : "available"}`}
//               onClick={feature.action}
//               style={{
//                 background: theme.glassBg,
//                 borderColor: isPremium && !isUnlocked ? "#FFD700" : theme.border,
//                 boxShadow: theme.shadow,
//                 cursor: loadingPayment === "premium_bundle" ? "wait" : "pointer",
//                 opacity: loadingPayment === "premium_bundle" ? 0.7 : 1,
//               }}
//             >
//               <div className="feature-card-inner">
//                 <div className="feature-header">
//                   <div className="feature-icon" style={{ background: feature.gradient }}>
//                     <Icon size={20} color="white" />
//                   </div>

//                   {isPremium && !isUnlocked && (
//                     <div
//                       className="premium-badge"
//                       style={{
//                         background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
//                         color: "white",
//                         padding: "4px 8px",
//                         borderRadius: "12px",
//                         fontSize: "10px",
//                         fontWeight: "bold",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "4px",
//                       }}
//                     >
//                       <Lock size={10} />
//                       PREMIUM
//                     </div>
//                   )}

//                   {!isPremium && (
//                     <div className="feature-arrow" style={{ color: theme.textMuted }}>
//                       <ArrowUpRight size={16} />
//                     </div>
//                   )}
//                 </div>

//                 <div className="feature-content">
//                   <h3 className="feature-title" style={{ color: theme.textPrimary }}>
//                     {feature.title}
//                   </h3>
//                   <p className="feature-description" style={{ color: theme.textMuted }}>
//                     {feature.description}
//                   </p>
//                 </div>

//                 {isPremium && (
//                   <div className="feature-footer" style={{ marginTop: "12px" }}>
//                     <button
//                       className="feature-action-button"
//                       style={{
//                         width: "100%",
//                         padding: "10px 16px",
//                         borderRadius: "8px",
//                         border: "none",
//                         background: isUnlocked
//                           ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
//                           : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
//                         color: "white",
//                         fontWeight: "600",
//                         fontSize: "14px",
//                         cursor: loadingPayment === "premium_bundle" ? "wait" : "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                         transition: "transform 0.2s",
//                         pointerEvents: loadingPayment === "premium_bundle" ? "none" : "auto",
//                       }}
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         feature.action()
//                       }}
//                       onMouseEnter={(e) => {
//                         if (loadingPayment !== "premium_bundle") {
//                           e.currentTarget.style.transform = "scale(1.02)"
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = "scale(1)"
//                       }}
//                     >
//                       {ButtonIcon}
//                       {buttonText}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="feature-overlay" style={{ background: feature.gradient }}></div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default FeatureGrid
