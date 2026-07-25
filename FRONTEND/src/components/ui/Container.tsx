import type { HTMLAttributes } from 'react'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'screen'
}

const maxWidthClasses: Record<NonNullable<ContainerProps['maxWidth']>, string> = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[96rem]',
  screen: 'max-w-none',
}

function Container({ maxWidth = 'xl', className = '', children, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={[
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        maxWidth !== 'screen' ? maxWidthClasses[maxWidth] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export type { ContainerProps }
export { Container }