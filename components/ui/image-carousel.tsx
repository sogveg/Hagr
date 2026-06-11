'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="relative rounded-[var(--radius-xl)] aspect-square overflow-hidden bg-[var(--color-sand)]">
        <Image src={images[0]} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    )
  }

  function prev() { setCurrent(i => (i - 1 + images.length) % images.length) }
  function next() { setCurrent(i => (i + 1) % images.length) }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative rounded-[var(--radius-xl)] aspect-square overflow-hidden bg-[var(--color-sand)] group">
        <Image
          src={images[current]}
          alt={`${alt}, bilde ${current + 1} av ${images.length}`}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-[#2B2B2B] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Forrige bilde"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-[#2B2B2B] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Neste bilde"
        >
          ›
        </button>

        {/* Dot indicator */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`Bilde ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
              i === current
                ? 'border-[#8FA68B] opacity-100'
                : 'border-transparent opacity-60 hover:opacity-90'
            }`}
          >
            <Image src={url} alt={`${alt}, miniatyrbilde ${i + 1}`} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  )
}
