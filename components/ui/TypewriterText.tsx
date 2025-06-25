'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  loop?: boolean
  cursor?: boolean
  cursorChar?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  letterSpacing?: string
  lineHeight?: string
  color?: string
  textAlign?: string
  textShadow?: string
  className?: string
  onComplete?: () => void
}

export const TypewriterText = ({
  text,
  speed = 50,
  delay = 0,
  loop = false,
  cursor = true,
  cursorChar = '|',
  fontSize = '16px',
  fontFamily = 'Inter',
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecoration = 'none',
  letterSpacing = 'normal',
  lineHeight = 'normal',
  color = '#000000',
  textAlign = 'left',
  textShadow = 'none',
  className = '',
  onComplete
}: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [showCursor, setShowCursor] = useState<boolean>(true)

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setIsTyping(true)
      }, delay)
      return () => clearTimeout(delayTimer)
    } else {
      setIsTyping(true)
    }
  }, [delay])

  useEffect(() => {
    if (!isTyping) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      // Typing complete
      if (onComplete) onComplete()

      if (loop) {
        // Reset for loop
        setTimeout(() => {
          setDisplayText('')
          setCurrentIndex(0)
        }, 2000) // Wait 2 seconds before restarting
      }
    }
  }, [currentIndex, text, speed, isTyping, loop, onComplete])

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [cursor])

  // Helper function to get proper font family values
  const getFontFamilyValue = (fontFamily: string) => {
    const fontMap: Record<string, string> = {
      // Google Fonts
      'Inter': '"Inter", sans-serif',
      'Roboto': '"Roboto", sans-serif',
      'Open Sans': '"Open Sans", sans-serif',
      'Playfair Display': '"Playfair Display", serif',
      'Source Code Pro': '"Source Code Pro", monospace',

      // System Fonts
      'Arial': 'Arial, sans-serif',
      'Helvetica': '"Helvetica Neue", Helvetica, sans-serif',
      'Times New Roman': '"Times New Roman", Times, serif',
      'Georgia': 'Georgia, serif',
      'Courier New': '"Courier New", Courier, monospace',
      'Verdana': 'Verdana, sans-serif',
      'Trebuchet MS': '"Trebuchet MS", sans-serif',
      'Comic Sans MS': '"Comic Sans MS", cursive',
      'Impact': 'Impact, sans-serif',
      'Lucida Console': '"Lucida Console", monospace',
      'Palatino': '"Palatino Linotype", Palatino, serif',
      'Garamond': 'Garamond, serif',
      'Bookman': '"Bookman Old Style", serif',
      'Avant Garde': '"Avant Garde", sans-serif',

      // Generic Families
      'system-ui': 'system-ui, -apple-system, sans-serif',
      'monospace': 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace'
    }

    return fontMap[fontFamily] || fontFamily
  }

  // Build comprehensive font styles
  const style: React.CSSProperties = {
    fontSize,
    fontFamily: getFontFamilyValue(fontFamily),
    fontWeight,
    fontStyle,
    textDecoration,
    letterSpacing,
    lineHeight,
    color,
    textAlign: textAlign as any,
    textShadow: textShadow !== 'none' ? textShadow : undefined,
  }

  return (
    <span style={style} className={className}>
      {displayText}
      {cursor && (
        <span
          className={`inline-block ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}
          style={{ color: 'currentColor' }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}

export default TypewriterText