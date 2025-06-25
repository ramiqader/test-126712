'use client'
import * as React from "react"

interface HoldToConfirmProps {
  text?: string
  holdDuration?: number
  onConfirm?: () => void
  variant?: 'default' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  // Button customization
  buttonColor?: string
  buttonTextColor?: string
  buttonWidth?: string
  buttonHeight?: string
  buttonBorderRadius?: string
  // Circle customization
  circleColor?: string
  circleMinWidth?: number
  circleMaxWidth?: number
  circleSize?: number
  className?: string
  [key: string]: any
}

export function HoldToConfirm({
  text = 'Hold to confirm',
  holdDuration = 2000,
  onConfirm = () => console.log('Confirmed!'),
  variant = 'default',
  size = 'md',
  disabled = false,
  // Button customization with defaults
  buttonColor = '#ffffff',
  buttonTextColor = '#000000',
  buttonWidth = '100%',
  buttonHeight = 'auto',
  buttonBorderRadius = '24px',
  // Circle customization with defaults
  circleColor = '',
  circleMinWidth = 50,
  circleMaxWidth = 100,
  circleSize = 1100,
  className = '',
  ...props
}: HoldToConfirmProps) {
  const [isHolding, setIsHolding] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  }

  // Variant classes for default colors
  const variantClasses = {
    default: { defaultColor: '#3b82f6' },
    danger: { defaultColor: '#ef4444' },
    success: { defaultColor: '#10b981' },
    warning: { defaultColor: '#f59e0b' }
  }

  const currentSize = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md
  const currentVariant = variantClasses[variant as keyof typeof variantClasses] || variantClasses.default

  // Use custom circle color or fall back to variant default
  const activeCircleColor = (circleColor && circleColor.trim() !== '') ? circleColor : currentVariant.defaultColor

  // Calculate dynamic circle stroke width based on progress
  const dynamicStrokeWidth = circleMinWidth + (progress / 100) * (circleMaxWidth - circleMinWidth)

  // Calculate circle size (21.5% larger than before)
  const finalCircleSize = circleSize * 1.215 // 21.5% larger (20% + 1.5%)
  const circleRadius = (finalCircleSize - 20) / 2 // Account for stroke width

  // Calculate dynamic circle color that starts white and gradually becomes the selected color
  const getDynamicCircleColor = () => {
    if (progress === 0) return '#ffffff' // Start with white

    // Parse the target color (hex to RGB)
    const targetColor = activeCircleColor
    const r = parseInt(targetColor.slice(1, 3), 16)
    const g = parseInt(targetColor.slice(3, 5), 16)
    const b = parseInt(targetColor.slice(5, 7), 16)

    // Calculate interpolation from white (255,255,255) to target color
    const progressRatio = progress / 100
    const currentR = Math.round(255 + (r - 255) * progressRatio)
    const currentG = Math.round(255 + (g - 255) * progressRatio)
    const currentB = Math.round(255 + (b - 255) * progressRatio)

    return `rgb(${currentR}, ${currentG}, ${currentB})`
  }

  const startHold = React.useCallback(() => {
    if (disabled || isComplete) return

    setIsHolding(true)
    setProgress(0)

    const startTime = Date.now()
    const updateInterval = 16 // ~60fps - SAME AS CANVAS VERSION

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / holdDuration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }, updateInterval)

    timeoutRef.current = setTimeout(() => {
      setIsComplete(true)
      setIsHolding(false)
      onConfirm()

      // Reset after a short delay
      setTimeout(() => {
        setIsComplete(false)
        setProgress(0)
      }, 1000)
    }, holdDuration)
  }, [disabled, isComplete, holdDuration, onConfirm])

  const stopHold = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsHolding(false)

    // Only reset if not complete
    if (!isComplete) {
      // Animate progress back to 0
      const startProgress = progress
      const startTime = Date.now()
      const resetDuration = 300

      const resetInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const resetProgress = Math.max(startProgress - (elapsed / resetDuration) * startProgress, 0)
        setProgress(resetProgress)

        if (resetProgress <= 0) {
          clearInterval(resetInterval)
        }
      }, 16)
    } else {
      // If complete, reset after a delay
      setTimeout(() => {
        setIsComplete(false)
        setProgress(0)
      }, 1000)
    }
  }, [progress, isComplete])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Static display text - no longer changes
  const displayText = text

  // Calculate dynamic button scale based on progress
  const buttonScale = (isHolding || isComplete)
    ? 1 - (progress / 100) * 0.3  // Shrinks from 1.0 to 0.7 as progress increases, stays small when complete
    : 1    // Normal size only when idle (not holding and not complete)

  return (
    <div className={`relative ${className}`} data-no-drag="true" {...props}>
      {/* Container with precise padding to show full circle close to button */}
      <div className="relative" style={{ padding: `${circleMaxWidth + 10}px` }}>
        <button
          className={`
            relative overflow-hidden font-medium transition-all duration-75 ease-out
            ${currentSize}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${!isHolding && !isComplete ? 'hover:scale-105' : ''}
            focus:outline-none
            select-none touch-none
          `}
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={startHold}
          onTouchEnd={stopHold}
          disabled={disabled}
          style={{
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: buttonBorderRadius,
            backgroundColor: buttonColor,
            color: buttonTextColor,
            transform: `scale(${buttonScale})`,
            transition: 'transform 75ms ease-out',
            background: isHolding || isComplete
              ? `linear-gradient(to right, ${activeCircleColor} ${progress}%, ${buttonColor} ${progress}%)`
              : buttonColor
          }}
        >
          {/* Button text */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="transition-all duration-75 ease-out">
              {displayText}
            </span>
          </span>

          {/* Ripple effect on complete */}
          {isComplete && (
            <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-3xl" />
          )}
        </button>

        {/* Circular progress indicator */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox={`0 0 ${finalCircleSize + circleMaxWidth * 2} ${finalCircleSize + circleMaxWidth * 2}`}
          style={{
            opacity: (isHolding || isComplete || progress > 0) ? 1 : 0.3
          }}
        >
          {/* Progress circle with dynamic width and color */}
          <circle
            cx={(finalCircleSize + circleMaxWidth * 2) / 2}
            cy={(finalCircleSize + circleMaxWidth * 2) / 2}
            r={circleRadius}
            fill="none"
            stroke={getDynamicCircleColor()}
            strokeWidth={Math.max(dynamicStrokeWidth, 2)}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * circleRadius}`}
            strokeDashoffset={`${2 * Math.PI * circleRadius * (1 - progress / 100)}`}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.4))'
            }}
          />
        </svg>
      </div>
    </div>
  )
}