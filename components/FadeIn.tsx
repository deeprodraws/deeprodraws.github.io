'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  scale?: boolean
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  scale = false,
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const offsets = {
    up:    { y: 60, x: 0 },
    down:  { y: -60, x: 0 },
    left:  { y: 0, x: 60 },
    right: { y: 0, x: -60 },
    none:  { y: 0, x: 0 },
  }

  const { x, y } = offsets[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y, scale: scale ? 0.95 : 1 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, x, y, scale: scale ? 0.95 : 1 }
      }
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
