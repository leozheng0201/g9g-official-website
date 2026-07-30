import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-brand-dark bg-brand text-ink shadow-control hover:bg-brand-dark hover:text-paper',
  secondary: 'border-ink bg-paper text-ink hover:bg-surface',
  ghost: 'border-transparent bg-transparent text-ink hover:bg-surface',
}

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  className?: string,
): string {
  return cn(
    'inline-flex min-h-11 items-center justify-center rounded-control border px-5 py-2.5 font-bold transition-[background-color,color,transform,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 motion-safe:hover:-translate-y-0.5',
    variants[variant],
    className,
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={buttonClassName(variant, className)}
      {...props}
    />
  )
}
