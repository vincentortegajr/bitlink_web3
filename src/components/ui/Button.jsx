import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation hover:scale-[1.02] active:scale-[0.98] transform-gpu will-change-transform backface-visibility-hidden backdrop-blur-sm border shadow-lg hover:shadow-2xl",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 shadow-blue-500/25 hover:shadow-blue-500/40 border-white/20 backdrop-blur-lg relative overflow-hidden group",
                destructive: "bg-gradient-to-br from-red-600 via-red-500 to-pink-600 text-white hover:from-red-700 hover:via-red-600 hover:to-pink-700 shadow-red-500/25 hover:shadow-red-500/40 border-white/20 backdrop-blur-lg relative overflow-hidden group",
                outline: "border-2 border-slate-300/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white hover:bg-white/90 dark:hover:bg-slate-800/90 hover:border-blue-400/80 dark:hover:border-blue-500/80 shadow-slate-500/10 hover:shadow-blue-500/20 backdrop-blur-lg relative overflow-hidden group",
                secondary: "bg-gradient-to-br from-slate-600 via-slate-500 to-gray-600 text-white hover:from-slate-700 hover:via-slate-600 hover:to-gray-700 shadow-slate-500/25 hover:shadow-slate-500/40 border-white/20 backdrop-blur-lg relative overflow-hidden group",
                ghost: "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:shadow-slate-500/10 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 backdrop-blur-sm relative overflow-hidden group",
                link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200",
                success: "bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 text-white hover:from-green-700 hover:via-emerald-600 hover:to-teal-700 shadow-green-500/25 hover:shadow-green-500/40 border-white/20 backdrop-blur-lg relative overflow-hidden group",
                warning: "bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-600 text-white hover:from-amber-700 hover:via-yellow-600 hover:to-orange-700 shadow-amber-500/25 hover:shadow-amber-500/40 border-white/20 backdrop-blur-lg relative overflow-hidden group",
                danger: "bg-gradient-to-br from-red-600 via-red-500 to-pink-600 text-white hover:from-red-700 hover:via-red-600 hover:to-pink-700 shadow-red-500/25 hover:shadow-red-500/40 border-white/20 backdrop-blur-lg relative overflow-hidden group",
            },
            size: {
                default: "h-11 px-6 py-2.5 min-h-[44px]",
                sm: "h-10 rounded-xl px-4 py-2 min-h-[44px]",
                lg: "h-12 rounded-xl px-8 py-3 text-base min-h-[48px]",
                icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
                xs: "h-8 rounded-lg px-3 py-1 text-xs min-h-[40px]",
                xl: "h-14 rounded-xl px-12 py-4 text-lg font-bold min-h-[56px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Enhanced icon size mapping based on button size
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
    };

    const calculatedIconSize = iconSize || iconSizeMap[size] || 16;

    // CRITICAL FIX: Enhanced loading spinner with better performance
    const LoadingSpinner = () => (
        <div className="flex items-center" role="status" aria-label="Loading">
            <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                />
                <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );

    // Enhanced icon rendering with better positioning
    const renderIcon = () => {
        if (!iconName || loading) return null;

        return (
            <Icon
                name={iconName}
                size={calculatedIconSize}
                className={cn(
                    "transition-transform duration-200 shrink-0 drop-shadow-sm",
                    children && iconPosition === 'left' && "mr-2.5",
                    children && iconPosition === 'right' && "ml-2.5"
                )}
                aria-hidden="true"
            />
        );
    };

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full",
                "group relative overflow-hidden",
                // Enhanced mobile optimization with better touch targets
                "lg:min-h-auto", 
                // Enhanced focus states for accessibility
                "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                // CRITICAL FIX: Performance optimization to prevent scroll disconnection
                "will-change-transform backface-visibility-hidden transform-gpu",
                // Better disabled state
                (disabled || loading) && "cursor-not-allowed opacity-50 hover:scale-100 active:scale-100 pointer-events-none"
            )}
            ref={ref}
            disabled={disabled || loading}
            aria-busy={loading}
            aria-disabled={disabled || loading}
            {...props}
        >
            {/* CRITICAL FIX: Enhanced Apple-style liquid glass shimmer effect */}
            <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none opacity-0 group-hover:opacity-100"
                aria-hidden="true"
            />
            
            {/* CRITICAL FIX: Enhanced inner glow for liquid glass effect */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-white/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
            />
            
            {/* CRITICAL FIX: Enhanced glass reflection effect */}
            <div 
                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
            />
            
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            <span className={cn(
                "truncate drop-shadow-sm transition-all duration-200", 
                loading && "opacity-75",
                "relative z-10"
            )}>
                {children}
            </span>
            {iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

Button.displayName = "Button";

export default Button;