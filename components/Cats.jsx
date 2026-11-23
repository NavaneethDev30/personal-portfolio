'use client'

import CardSwap from './CardSwap'
import './CardSwap.css'
import { catManifest } from './cats-manifest'

/**
 * Cats - Using CardSwap component from @react-bits
 * Displays cat photographs from the local public/cats/ folder
 */

// Transform manifest data into CardSwap items format
const cardSwapItems = catManifest.map((cat, index) => ({
  title: cat.title,
  image: cat.src,
  alt: cat.caption,
  _index: index
}))

// Story steps for the narrative
const storySteps = [
  {
    number: '01',
    title: 'A New Visitor',
    text: 'A stray cat came into my home.'
  },
  {
    number: '02',
    title: 'A New Family',
    text: 'She gave birth to a few little kittens.'
  },
  {
    number: '03',
    title: 'Growing Up',
    text: 'The little kittens slowly grew into adults.'
  },
  {
    number: '04',
    title: 'Another Generation',
    text: 'Those grown-up cats had kittens of their own.'
  },
  {
    number: '05',
    title: 'The Cycle Continues',
    text: 'This continued for several generations.'
  },
  {
    number: '06',
    title: 'The Last Goodbye',
    text: 'One day, every cat had disappeared. The house was quiet again.'
  }
]

export default function Cats() {
  return (
    <section id="cats" className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-black relative overflow-hidden" aria-labelledby="cats-heading">
      {/* Background atmospheric glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-black to-zinc-900/30" aria-hidden="true" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-16 px-6">

        {/* Left Side - CardSwap Carousel */}
        <div className="w-full lg:w-1/2 flex flex-col items-center shrink-0">
          <header className="text-center mb-8 lg:mb-10 w-full">
            <h2 id="cats-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider lowercase mb-3 font-sans leading-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
              cuitepies
            </h2>
            <p className="text-base md:text-lg tracking-widest uppercase font-light bg-gradient-to-r from-zinc-300 via-amber-300/60 to-amber-500/40 bg-clip-text text-transparent">
              A Visual Journey
            </p>
          </header>

          <div className="w-full flex justify-center items-center min-h-[580px] md:min-h-[650px]">
            <CardSwap
              items={cardSwapItems}
              width={440}
              height={560}
              cardDistance={40}
              verticalDistance={50}
              depth={75}
              skewAmount={3}
              visibleCards={3}
              delay={6000}
              autoplay={true}
              pauseOnHover={true}
              draggable={true}
              speed={1}
              bounce={0.3}
              parallax={0.35}
              hoverSpread={0.06}
              dim={0.35}
              cardRadius={14}
              intro={true}
              theme="dark"
              className="cats-cardswap"
            />
          </div>

          <footer className="mt-8 text-center">
            <p className="text-sm text-zinc-600 font-normal max-w-md mx-auto">
              Drag or use arrow keys to navigate. Hover to pause auto-play.
            </p>
          </footer>
        </div>

        {/* Right Side - Narrative Story */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pt-8">
          <div className="relative max-w-lg mx-auto lg:mx-0">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-amber-900/30 via-amber-800/50 to-amber-900/30" aria-hidden="true" />

            <div className="space-y-12 pl-16 relative">
              {storySteps.map((step, index) => (
                <div key={step.number} className="group relative mt-20">
                  {/* Step number and title on same line */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs md:text-sm font-mono font-medium text-amber-600/80 tracking-wider min-w-[2.5rem] text-right shrink-0">
                      {step.number}
                    </span>
                    <span className="text-sm md:text-base font-serif font-medium text-amber-100/90 tracking-tight leading-snug">
                      — {step.title}
                    </span>
                  </div>

                  {/* Description below */}
                  <p className="text-zinc-400/70 leading-relaxed text-sm md:text-base font-light pl-0">
                    {step.text}
                  </p>

                  {/* Down arrow connector (except last) */}
                  {index < storySteps.length - 1 && (
                    <div className="absolute left-[3px] top-[1.8rem] h-10 w-4 flex items-start justify-center pointer-events-none">
                      <svg
                        className="w-2 h-2 text-amber-800/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final reflection text */}
            <div className="mt-16 pt-8 border-t border-amber-900/30 text-center relative">
              <div className="absolute left-6 top-0 -translate-y-1/2 w-2 h-2 rounded-full bg-black border border-amber-800/50" aria-hidden="true" />
              <p className="text-blue-400 text-sm md:text-base leading-relaxed max-w-md mx-auto font-light italic">
                <br className="hidden sm:block" />
                Banthu Thinthu Hoythu, Asthe..
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}