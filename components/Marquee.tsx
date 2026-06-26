export default function Marquee() {
  const text =
    'CHARCOAL ARTIST · DEEPRODRAWS · BELMONT, CA · COMMISSIONS OPEN · ORIGINAL WORK · '

  return (
    <div className="border-y border-white/15 py-4 bg-black overflow-hidden select-none">
      <div
        className="flex whitespace-nowrap will-change-transform animate-marquee"
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        aria-hidden
      >
        <span className="font-serif text-xl md:text-2xl text-white/70 tracking-wider">
          {text.repeat(4)}
        </span>
        <span className="font-serif text-xl md:text-2xl text-white/70 tracking-wider" aria-hidden>
          {text.repeat(4)}
        </span>
      </div>
    </div>
  )
}
