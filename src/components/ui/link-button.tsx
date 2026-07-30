import Link from 'next/link'
import type { ComponentProps } from 'react'
import { buttonClassName, type ButtonVariant } from './button'

export type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant
}

export function LinkButton({
  className,
  variant = 'primary',
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />
}
