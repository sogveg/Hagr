import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-12 
              rounded-[var(--radius-md)] 
              border 
              ${error ? 'border-[var(--color-damaged)]' : 'border-[var(--color-border-strong)]'}
              ${icon ? 'pl-11 pr-4' : 'px-4'}
              text-[15px] 
              text-[var(--color-foreground)] 
              bg-white
              placeholder:text-[var(--color-muted-foreground)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
              transition-all duration-200
              ${className}
            `}
            {...props}
          />
        </div>
        
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">
            {hint}
          </p>
        )}
        
        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-damaged)]">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
