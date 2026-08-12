import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('rounded-2xl border border-ink-200/80 bg-white shadow-sm shadow-ink-900/5', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: PropsWithChildren<{ tone?: 'neutral' | 'brand' | 'success' | 'warn' | 'danger' }>) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700',
    brand: 'bg-brand-100 text-brand-800',
    success: 'bg-emerald-100 text-emerald-800',
    warn: 'bg-amber-100 text-amber-900',
    danger: 'bg-rose-100 text-rose-800',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide', tones[tone])}>
      {children}
    </span>
  )
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}) {
  const variants = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm shadow-brand-900/10',
    secondary: 'bg-ink-900 text-white hover:bg-ink-800',
    ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'border border-ink-200 bg-white text-ink-800 hover:bg-ink-50',
  }
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none ring-brand-500/30 placeholder:text-ink-400 focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none ring-brand-500/30 placeholder:text-ink-400 focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none ring-brand-500/30 focus:ring-2',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function Label({ children }: PropsWithChildren) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">{children}</label>
}

export function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string | number
  hint?: string
  icon?: ReactNode
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
        </div>
        {icon ? <div className="rounded-xl bg-brand-50 p-2 text-brand-700">{icon}</div> : null}
      </div>
    </Card>
  )
}

export function Empty({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
      <p className="font-medium text-ink-700">{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-900 md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
