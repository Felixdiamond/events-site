import React from 'react';
import { Sparkles } from 'lucide-react';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div className={`relative inline-flex items-center gap-2 ${className}`}>
            <div className="relative">
                {/* Base text layer */}
                <span className="text-secondary-400 whitespace-nowrap">{text}</span>
                {/* Shimmer overlay */}
                <span
                    className={`absolute inset-0 bg-clip-text text-transparent ${disabled ? '' : 'animate-shine'} whitespace-nowrap`}
                    style={{
                        backgroundImage: 'linear-gradient(120deg, rgba(198, 90, 45, 0) 40%, rgba(198, 90, 45, 1) 50%, rgba(198, 90, 45, 0) 60%)',
                        backgroundSize: '200% 100%',
                        animationDuration: animationDuration,
                    }}
                    aria-hidden="true"
                >
                    {text}
                </span>
            </div>
        </div>
    );
};

export default ShinyText; 