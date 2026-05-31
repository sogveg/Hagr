import { ButtonHTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'white'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-foreground)] text-white hover:opacity-90',
  secondary: 'bg-transparent border border-[var(--color-border-strong)] text-[var(--color-foreground)] hover:bg-[var(--color-sand)]',
  outline: 'bg-transparent border border-[var(--color-border-strong)] text-[var(--color-foreground)] hover:bg-[var(--color-sand)]',
  destructive: 'bg-[var(--color-damaged)] text-white hover:opacity-90',
  ghost: 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-sand)]',
  white: 'bg-white text-[var(--color-foreground)] hover:bg-[var(--color-sand)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm rounded-[var(--radius-lg)]',
  md: 'h-12 px-6 text-[15px] rounded-[var(--radius-full)]',
  lg: 'h-14 px-8 text-base rounded-[var(--radius-full)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', href, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`
    
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      )
    }
    
    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
