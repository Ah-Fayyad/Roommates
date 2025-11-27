import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    'active:scale-95',
                    {
                        // Variants
                        'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/50 focus-visible:ring-indigo-500': variant === 'primary',
                        'bg-pink-600 text-white shadow-lg shadow-pink-500/50 hover:bg-pink-700 hover:shadow-xl hover:shadow-pink-500/50 focus-visible:ring-pink-500': variant === 'secondary',
                        'border-2 border-gray-300 bg-transparent hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-400 dark:hover:bg-indigo-950': variant === 'outline',
                        'hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
                        'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700': variant === 'gradient',
                        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500': variant === 'destructive',

                        // Sizes
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                        'h-10 w-10 p-0': size === 'icon',
                    },
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </>
                ) : children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
