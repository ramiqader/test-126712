'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface FloatingCardsSceneProps {
  sceneType?: 'basic' | 'portfolio' | 'creative'
  autoRotate?: boolean
  perspective?: number
  backgroundColor?: string
  cardWidth?: number
  cardHeight?: number
  cardSpacing?: number
  numCustomImages?: number
  customImage1?: string
  customImage2?: string
  customImage3?: string
  customImage4?: string
  customImage5?: string
  customImage6?: string
  customImage7?: string
  customImage8?: string
  customImage9?: string
  customImage10?: string
  customTitle1?: string
  customTitle2?: string
  customTitle3?: string
  customTitle4?: string
  customTitle5?: string
  customTitle6?: string
  customTitle7?: string
  customTitle8?: string
  customTitle9?: string
  customTitle10?: string
  className?: string
}

// Floating card component with dynamic spawning and movement
function FloatingCard({
  index = 0,
  image = '',
  title = '',
  autoRotate = false,
  cards = [],
  spawnTime = 0,
  globalTime = 0,
  row = 'top',
  cardWidth = 192,
  cardHeight = 128,
  cardSpacing = 150
}: {
  index?: number
  image?: string
  title?: string
  autoRotate?: boolean
  cards?: Array<{ image?: string; title?: string }>
  spawnTime?: number
  globalTime?: number
  row?: 'top' | 'bottom'
  cardWidth?: number
  cardHeight?: number
  cardSpacing?: number
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate position based on time and row
  const timeAlive = globalTime - spawnTime
  const speed = 50 // pixels per second
  const direction = row === 'top' ? -1 : 1 // top row moves left, bottom row moves right
  const baseX = direction * speed * (timeAlive / 1000)

  // Start position (off-screen)
  const startX = direction === -1 ? window.innerWidth + cardWidth : -cardWidth
  const currentX = startX + baseX

  // Y position based on row
  const yPosition = row === 'top' ? '25%' : '75%'

  // Auto-rotation
  const rotationY = autoRotate ? (globalTime / 50) % 360 : 0

  // Check if card is off-screen (for cleanup)
  const isOffScreen = direction === -1 ? currentX < -cardWidth : currentX > window.innerWidth + cardWidth

  const handleClick = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${currentX}px`,
        top: yPosition,
        transform: 'translateY(-50%)',
        width: cardWidth,
        height: cardHeight,
        zIndex: isZoomed ? 50 : 10
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isOffScreen ? 0 : 1,
        scale: isZoomed ? 1.5 : (isHovered ? 1.05 : 1),
        rotateY: rotationY
      }}
      transition={{
        duration: 0.3,
        rotateY: { duration: 0.1, ease: 'linear' }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className="w-full h-full rounded-xl shadow-lg overflow-hidden bg-white border-2 border-gray-200"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      >
        {image && (
          <img
            src={image}
            alt={title || 'Card image'}
            className="w-full h-3/4 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop'
            }}
          />
        )}
        {title && (
          <div className="p-2 h-1/4 flex items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-800 text-center truncate">
              {title}
            </h3>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Scene content component with dynamic card spawning
function SceneContent({
  sceneType = 'basic',
  autoRotate = false,
  cardWidth = 192,
  cardHeight = 128,
  cardSpacing = 150,
  customImages = []
}: {
  sceneType?: string
  autoRotate?: boolean
  cardWidth?: number
  cardHeight?: number
  cardSpacing?: number
  customImages?: Array<{ image: string; title: string }>
}) {
  const [activeCards, setActiveCards] = useState<Array<{id: number, spawnTime: number, row: 'top' | 'bottom'}>>([])
  const [globalTime, setGlobalTime] = useState(0)
  const [cardCounter, setCardCounter] = useState(0)

  // Sample images and titles for the floating cards
  const portfolioCards = [
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      title: 'Digital Design'
    },
    {
      image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop',
      title: 'Web Development'
    },
    {
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
      title: 'Mobile Apps'
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      title: 'Data Analytics'
    },
    {
      image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
      title: 'UI/UX Design'
    }
  ]

  const creativeCards = [
    {
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      title: 'Art & Design'
    },
    {
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      title: 'Photography'
    },
    {
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      title: 'Music Production'
    },
    {
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      title: 'Video Editing'
    }
  ]

  // Choose card set based on scene type
  const getCardSet = () => {
    if (customImages && customImages.length > 0) {
      return customImages
    }

    switch (sceneType) {
      case 'portfolio':
        return portfolioCards
      case 'creative':
        return creativeCards
      default:
        return portfolioCards
    }
  }

  const cardSet = getCardSet()

  // Global timer
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalTime(prev => prev + 16) // ~60fps
    }, 16)

    return () => clearInterval(interval)
  }, [])

  // Card spawning logic
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const newCard = {
        id: cardCounter,
        spawnTime: globalTime,
        row: Math.random() > 0.5 ? 'top' : 'bottom' as 'top' | 'bottom'
      }

      setActiveCards(prev => [...prev, newCard])
      setCardCounter(prev => prev + 1)
    }, cardSpacing * 10) // Spawn every cardSpacing * 10ms

    return () => clearInterval(spawnInterval)
  }, [globalTime, cardSpacing, cardCounter])

  // Cleanup off-screen cards
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setActiveCards(prev => prev.filter(card => {
        const timeAlive = globalTime - card.spawnTime
        const speed = 50
        const direction = card.row === 'top' ? -1 : 1
        const baseX = direction * speed * (timeAlive / 1000)
        const startX = direction === -1 ? window.innerWidth + cardWidth : -cardWidth
        const currentX = startX + baseX

        // Keep card if it's still on screen
        return direction === -1 ? currentX > -cardWidth : currentX < window.innerWidth + cardWidth
      }))
    }, 1000) // Cleanup every second

    return () => clearInterval(cleanupInterval)
  }, [globalTime, cardWidth])

  return (
    <>
      {activeCards.map((card) => {
        const cardData = cardSet[card.id % cardSet.length]
        return (
          <FloatingCard
            key={card.id}
            index={card.id}
            image={cardData.image}
            title={cardData.title}
            autoRotate={autoRotate}
            cards={cardSet}
            spawnTime={card.spawnTime}
            globalTime={globalTime}
            row={card.row}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            cardSpacing={cardSpacing}
          />
        )
      })}
    </>
  )
}

export default function FloatingCardsScene({
  sceneType = 'portfolio',
  autoRotate = true,
  perspective = 1200,
  backgroundColor = '',
  cardWidth = 192,
  cardHeight = 128,
  cardSpacing = 150,
  numCustomImages = 5,
  customImage1 = '',
  customImage2 = '',
  customImage3 = '',
  customImage4 = '',
  customImage5 = '',
  customImage6 = '',
  customImage7 = '',
  customImage8 = '',
  customImage9 = '',
  customImage10 = '',
  customTitle1 = '',
  customTitle2 = '',
  customTitle3 = '',
  customTitle4 = '',
  customTitle5 = '',
  customTitle6 = '',
  customTitle7 = '',
  customTitle8 = '',
  customTitle9 = '',
  customTitle10 = '',
  className = ''
}: FloatingCardsSceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Process custom images
  const customImages = []
  const images = [customImage1, customImage2, customImage3, customImage4, customImage5, customImage6, customImage7, customImage8, customImage9, customImage10]
  const titles = [customTitle1, customTitle2, customTitle3, customTitle4, customTitle5, customTitle6, customTitle7, customTitle8, customTitle9, customTitle10]

  for (let i = 0; i < Math.min(numCustomImages, 10); i++) {
    if (images[i]) {
      customImages.push({
        image: images[i],
        title: titles[i] || `Item ${i + 1}`
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const containerStyle = {
    perspective: `${perspective}px`,
    backgroundColor: backgroundColor || 'transparent'
  }

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden', className)}
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SceneContent
        sceneType={sceneType}
        autoRotate={autoRotate}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardSpacing={cardSpacing}
        customImages={customImages}
      />
    </div>
  )
}