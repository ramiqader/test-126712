'use client'

import * as React from "react"

interface AnimatedLogoProps {
  text?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: string
  color1?: string
  color2?: string
  color3?: string
  color4?: string
  className?: string
}

// Helper function to get proper font family values
const getFontFamilyValue = (fontFamily: string) => {
  const fontMap: Record<string, string> = {
    'Inter': '"Inter", sans-serif',
    'Roboto': '"Roboto", sans-serif',
    'Open Sans': '"Open Sans", sans-serif',
    'Playfair Display': '"Playfair Display", serif',
    'Source Code Pro': '"Source Code Pro", monospace',
    'Times New Roman': '"Times New Roman", serif',
    'Arial': 'Arial, sans-serif',
    'Helvetica': 'Helvetica, sans-serif',
    'Georgia': 'Georgia, serif',
    'Verdana': 'Verdana, sans-serif',
  }

  return fontMap[fontFamily] || fontFamily
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  text = 'Your Brand',
  fontSize = '24px',
  fontFamily = 'Inter',
  fontWeight = '600',
  color1 = '#14b8a6',
  color2 = '#a855f7',
  color3 = '#f59e0b',
  color4 = '#3b82f6',
  className = ''
}) => {
  const style: React.CSSProperties = {
    fontSize,
    fontFamily: getFontFamilyValue(fontFamily),
    fontWeight,
    backgroundSize: '200% 200%',
    backgroundImage: `linear-gradient(to right, ${color1}, ${color2}, ${color3}, ${color4})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: `drop-shadow(0 0 8px ${color1}40) drop-shadow(0 0 16px ${color2}30) drop-shadow(0 0 24px ${color4}20)`,
  }

  return (
    <span
      className={`animate-gradient-x ${className}`}
      style={style}
    >
      {text}
    </span>
  )
}

export default AnimatedLogo