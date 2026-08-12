import { cn } from '../lib/cn'
import type { AvatarConfig } from '../types'

export function AvatarFace({ avatar, size = 'md', speaking }: { avatar: AvatarConfig; size?: 'sm' | 'md' | 'lg' | 'xl'; speaking?: boolean }) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-lg',
    lg: 'h-24 w-24 text-3xl',
    xl: 'h-36 w-36 text-5xl',
  }
  const initials = avatar.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-lg shadow-ink-900/15 ring-4 ring-white',
          avatar.photoGradient,
          sizes[size],
          speaking && 'animate-pulse-soft',
        )}
      >
        {initials}
      </div>
      {speaking ? (
        <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-white px-1.5 py-1 shadow">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500" />
        </span>
      ) : null}
    </div>
  )
}
