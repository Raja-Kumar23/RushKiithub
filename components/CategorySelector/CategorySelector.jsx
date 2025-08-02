// "use client"
// import { FileText, BookOpen, PenTool, GraduationCap } from "lucide-react"
// import "./CategorySelector.css"

// const CategorySelector = ({ selectedCategory, setSelectedCategory, theme, user, setShowLoginPrompt }) => {
//   const categories = [
//     {
//       id: "syllabus",
//       label: "Syllabus",
//       icon: FileText,
//     },
//     {
//       id: "notes",
//       label: "Notes",
//       icon: BookOpen,
//     },
//     {
//       id: "midsem",
//       label: "Mid Sem",
//       icon: PenTool,
//     },
//     {
//       id: "endsem",
//       label: "End Sem",
//       icon: GraduationCap,
//     },
//   ]

//   const handleCategoryClick = (categoryId) => {
//     if (!user) {
//       setShowLoginPrompt(true)
//       return
//     }

//     if (selectedCategory === categoryId) {
//       setSelectedCategory(null)
//     } else {
//       setSelectedCategory(categoryId)
//     }
//   }

//   return (
//     <div className="category-section">
//       <div className="category-header">
//         <h2 className="category-title" style={{ color: theme.textPrimary }}>
//           Select and Search
//         </h2>
//       </div>

//       <div className="category-pills">
//         {categories.map((category) => {
//           const Icon = category.icon
//           const isSelected = selectedCategory === category.id

//           return (
//             <button
//               key={category.id}
//               className={`category-pill ${isSelected ? "selected" : ""}`}
//               onClick={() => handleCategoryClick(category.id)}
//               style={{
//                 background: isSelected
//                   ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
//                   : theme.glassBg,
//                 borderColor: isSelected ? theme.primary : theme.border,
//                 color: isSelected ? "white" : theme.textPrimary,
//               }}
//             >
//               <Icon size={16} color={isSelected ? "white" : theme.primary} />
//               <span className="category-pill-label">{category.label}</span>
//             </button>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default CategorySelector











"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Filter, X } from "lucide-react"

const CategorySelector = ({
  selectedCategory,
  setSelectedCategory,
  theme,
  user,
  setShowLoginPrompt,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Updated categories to match your requirements
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Syllabus", label: "Syllabus" },
    { value: "Notes", label: "Notes" },
    { value: "Mid Semester", label: "Mid Semester" },
    { value: "End Semester", label: "End Semester" },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategorySelect = (categoryValue) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setSelectedCategory(categoryValue)
    setIsOpen(false)
  }

  const clearCategory = (e) => {
    e.stopPropagation()
    setSelectedCategory("")
  }

  const selectedCategoryLabel = categories.find((cat) => cat.value === selectedCategory)?.label || "All Categories"

  return (
    <div className={`category-selector ${compact ? "compact" : ""}`} ref={dropdownRef}>
      <button
        className="category-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: theme.glassBg,
          borderColor: theme.border,
          color: theme.textPrimary,
        }}
      >
        <Filter size={compact ? 16 : 18} />
        <span className="category-label">{selectedCategoryLabel}</span>
        {selectedCategory && (
          <button className="clear-category" onClick={clearCategory} style={{ color: theme.textMuted }}>
            <X size={14} />
          </button>
        )}
        <ChevronDown size={16} className={`chevron ${isOpen ? "open" : ""}`} style={{ color: theme.textMuted }} />
      </button>

      {isOpen && (
        <div
          className="category-dropdown"
          style={{
            background: theme.cardBg,
            borderColor: theme.border,
            boxShadow: theme.shadow,
          }}
        >
          {categories.map((category) => (
            <button
              key={category.value}
              className={`category-option ${selectedCategory === category.value ? "selected" : ""}`}
              onClick={() => handleCategorySelect(category.value)}
              style={{
                color: selectedCategory === category.value ? theme.primary : theme.textPrimary,
                background: selectedCategory === category.value ? `${theme.primary}15` : "transparent",
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .category-selector {
          position: relative;
          width: 100%;
          max-width: ${compact ? "200px" : "250px"};
        }

        .category-selector.compact {
          max-width: 180px;
        }

        .category-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: ${compact ? "8px" : "10px"};
          padding: ${compact ? "8px 12px" : "12px 16px"};
          border: 1px solid;
          border-radius: ${compact ? "8px" : "12px"};
          cursor: pointer;
          font-size: ${compact ? "13px" : "14px"};
          font-weight: 500;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .category-button:hover {
          border-color: ${theme.primary};
          box-shadow: 0 0 0 2px ${theme.primary}20;
        }

        .category-label {
          flex: 1;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .clear-category {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-category:hover {
          background: ${theme.primary}20;
        }

        .chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .category-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          border: 1px solid;
          border-radius: ${compact ? "8px" : "12px"};
          backdrop-filter: blur(20px);
          z-index: 10000;
          overflow: hidden;
        }

        .category-option {
          width: 100%;
          padding: ${compact ? "8px 12px" : "10px 16px"};
          border: none;
          cursor: pointer;
          font-size: ${compact ? "13px" : "14px"};
          font-weight: 500;
          text-align: left;
          transition: all 0.2s ease;
          border-bottom: 1px solid ${theme.border};
        }

        .category-option:last-child {
          border-bottom: none;
        }

        .category-option:hover {
          background: ${theme.primary}10 !important;
        }

        .category-option.selected {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .category-selector {
            max-width: ${compact ? "150px" : "200px"};
          }

          .category-button {
            padding: ${compact ? "6px 10px" : "10px 12px"};
            font-size: ${compact ? "12px" : "13px"};
          }

          .category-option {
            padding: ${compact ? "6px 10px" : "8px 12px"};
            font-size: ${compact ? "12px" : "13px"};
          }
        }
      `}</style>
    </div>
  )
}

export default CategorySelector
