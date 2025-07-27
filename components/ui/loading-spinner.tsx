// components/ui/LoadingSpinner.tsx
import React from 'react';
import clsx from 'clsx'; // Optional: for cleaner class merging

interface LoadingSpinnerProps {
    /**
     * Size of the spinner.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Optional text to display below the spinner.
     */
    text?: string;
    /**
     * If true, centers the spinner vertically and horizontally within a full-height container.
     * Set to false if you want to position it manually within its parent.
     * @default false
     */
    fullscreen?: boolean;
    /**
     * Additional CSS classes to apply to the container div.
     */
    className?: string;
    /**
     * Tailwind CSS color class for the spinning part (e.g., 'border-t-blue-500').
     * @default 'border-t-primary' (uses theme's primary color if defined, otherwise falls back)
     */
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
        size = 'md',
        text,
        fullscreen = false,
        className,
        color = 'border-t-primary', // Default to primary theme color
    }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    const spinnerElement = (
        <div
            className={clsx(
                'animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]', // Base spinner styles using current text color
                'border-gray-200/50', // Base border color (light gray, semi-transparent)
                color, // Apply the color to the top border for the spinning effect
                sizeClasses[size], // Apply size-specific classes
            )}
            role="status"
        >
            {/* Screen reader text */}
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
        </div>
    );

    const content = (
        <div className={clsx('flex flex-col items-center justify-center gap-2', className)}>
            {spinnerElement}
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
    );

    if (fullscreen) {
        return (
            <div className="flex justify-center items-center min-h-screen"> {/* Use min-h-screen for flexibility */}
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;