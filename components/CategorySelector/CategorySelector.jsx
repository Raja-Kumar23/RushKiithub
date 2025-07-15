import React from 'react'
import { FileText, BookOpen, PenTool, GraduationCap } from 'lucide-react'
import './CategorySelector.css'

const CategorySelector = ({ 
  selectedCategory, 
  setSelectedCategory, 
  theme, 
  user, 
  setShowLoginPrompt 
}) => {
  const categories = [
    { 
      id: 'syllabus', 
      label: 'Syllabus', 
      icon: FileText
    },
    { 
      id: 'notes', 
      label: 'Notes', 
      icon: BookOpen
    },
    { 
      id: 'midsem', 
      label: 'Mid Sem', 
      icon: PenTool
    },
    { 
      id: 'endsem', 
      label: 'End Sem', 
      icon: GraduationCap
    }
  ]

  const handleCategoryClick = (categoryId) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
    }
  }

  return (
    <div className="category-section">
      <div className="category-header">
        <h2 className="category-title" style={{ color: theme.textPrimary }}>
          Select and Search
        </h2>
      </div>
      
      <div className="category-pills">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              className={`category-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                  : theme.glassBg,
                borderColor: isSelected ? theme.primary : theme.border,
                color: isSelected ? 'white' : theme.textPrimary
              }}
            >
              <Icon 
                size={16} 
                color={isSelected ? 'white' : theme.primary}
              />
              <span className="category-pill-label">
                {category.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySelector