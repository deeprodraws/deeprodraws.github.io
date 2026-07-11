'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    if (!dot) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rafId: number

    const move = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const render = () => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      rafId = requestAnimationFrame(render)
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-cursor]')
      if (target) {
        setHoverLabel(target.getAttribute('data-cursor'))
        setIsPointer(false)
        return
      }
      const clickable = (e.target as HTMLElement)?.closest('a, button, input, select, textarea, label')
      setIsPointer(!!clickable)
      setHoverLabel(null)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    rafId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[200] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      aria-hidden
    >
      <div
        className={`flex items-center justify-center rounded-full bg-white transition-all duration-200 ease-out ${
          hoverLabel ? 'px-5 py-5 min-w-[68px] min-h-[68px]' : isPointer ? 'w-4 h-4' : 'w-2 h-2'
        }`}
      >
        {hoverLabel && (
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-black font-semibold whitespace-nowrap">
            {hoverLabel}
          </span>
        )}
      </div>
    </div>
  )
}
