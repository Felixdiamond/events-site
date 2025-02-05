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
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="relative">
                {/* Base text layer */}
                <span className="text-secondary-400">{text}</span>
                {/* Shimmer overlay */}
                <span
                    className={`absolute inset-0 bg-clip-text text-transparent ${disabled ? '' : 'animate-shine'}`}
                    style={{
                        backgroundImage: 'linear-gradient(120deg, rgba(212, 175, 55, 0) 40%, rgba(212, 175, 55, 1) 50%, rgba(212, 175, 55, 0) 60%)',
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