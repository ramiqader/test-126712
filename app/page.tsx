'use client'

import React, { useState, useEffect } from 'react'

import Card from "../components/blocks/Card"
import ThemeToggleButton from "../components/ThemeToggleButton"
import { AnimatedLogo } from "../components/ui/AnimatedLogo"
import { CanvasBackground } from "../components/CanvasBackground"
import { CursorMultifollow } from "../components/CursorMultifollow"
import { FormBuilder } from "../components/FormBuilder"
import { HoldToConfirm } from "../components/HoldToConfirm"
import { Navbar } from "../components/Navbar"
import { RadixTabs } from "../components/RadixTabs"
import { TypewriterText } from "../components/TypewriterText"
import { TypewriterText } from "../components/ui/TypewriterText"
import { eventSystem } from "../lib/eventSystem"

import { ResponsiveCard } from '../components/ResponsiveCard'
import { ResponsiveHoldToConfirm } from '../components/ResponsiveHoldToConfirm'
import { ResponsiveButton } from '../components/ResponsiveButton'

export default function HomePage() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width <= 375) {
        setCurrentBreakpoint('mobile')
      } else if (width <= 768) {
        setCurrentBreakpoint('tablet')
      } else {
        setCurrentBreakpoint('desktop')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return (
    <>
      
      <div
        className="canvas-container min-h-screen relative"
        style={{
          width: currentBreakpoint === 'desktop' ? '100vw' : (currentBreakpoint === 'tablet' ? '768px' : '375px'),
          height: '800px',
          backgroundColor: '#0d0808', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          margin: 0,
          padding: 0,
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxWidth: '100vw'
        }}
        data-breakpoint={currentBreakpoint}
      >
        <div
      id="responsive-comp-1"
      data-component-id="comp-1"
      className="absolute responsive-component"
      style={{
        // Desktop positioning (default) - using percentages with edge safety
        left: '23.17%',
        top: '150px',
        width: 'auto',
        height: 'auto',
        // CSS custom properties for responsive positioning - desktop uses hybrid (X percentage, Y pixels), mobile/tablet use pixels
        '--desktop-x': '23.17%',
        '--desktop-y': '150px',
        '--desktop-width': 'auto',
        '--desktop-height': 'auto',
        '--tablet-x': '278px',
        '--tablet-y': '150px',
        '--tablet-width': 'auto',
        '--tablet-height': 'auto',
        '--mobile-x': '278px',
        '--mobile-y': '150px',
        '--mobile-width': 'auto',
        '--mobile-height': 'auto',
      }}
    >
      <TypewriterText text="Hello, I am a typewriter text!" speed={50} delay={0} loop={false} cursor cursorChar="|" fontSize="16px" fontFamily="Inter" fontWeight="normal" fontStyle="normal" textDecoration="none" letterSpacing="normal" lineHeight="normal" color="#d50b0b" textAlign="left" textShadow="none" style={{color: '#d50b0b', fontSize: '16px', fontWeight: 'normal', fontFamily: 'Inter'}} />
    </div>
        <div
      id="responsive-comp-2"
      data-component-id="comp-2"
      className="absolute responsive-component"
      style={{
        // Desktop positioning (default) - using percentages with edge safety
        left: '26.92%',
        top: '400px',
        width: 'auto',
        height: 'auto',
        // CSS custom properties for responsive positioning - desktop uses hybrid (X percentage, Y pixels), mobile/tablet use pixels
        '--desktop-x': '26.92%',
        '--desktop-y': '400px',
        '--desktop-width': 'auto',
        '--desktop-height': 'auto',
        '--tablet-x': '323px',
        '--tablet-y': '400px',
        '--tablet-width': 'auto',
        '--tablet-height': 'auto',
        '--mobile-x': '323px',
        '--mobile-y': '400px',
        '--mobile-width': 'auto',
        '--mobile-height': 'auto',
      }}
    >
      <AnimatedLogo text="Your Brand" fontSize="24px" fontFamily="Inter" fontWeight="600" color1="#14b8a6" color2="#a855f7" color3="#f59e0b" color4="#3b82f6" />
    </div>
      </div>
      
    </>
  )
}