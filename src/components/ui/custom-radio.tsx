'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RadioOption {
  id: string;
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomRadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  layout?: 'grid' | 'flex';
  columns?: number;
}

export function CustomRadioGroup({
  options,
  value,
  onChange,
  name,
  className,
  layout = 'grid',
  columns = 3,
}: CustomRadioGroupProps) {
  return (
    <div 
      className={cn(
        layout === 'grid' 
          ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-3` 
          : "flex flex-wrap gap-3",
        className
      )}
    >
      {options.map((option) => (
        <CustomRadio
          key={option.id}
          id={option.id}
          name={name}
          value={option.value}
          label={option.label}
          icon={option.icon}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

interface CustomRadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}

export function CustomRadio({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  icon,
}: CustomRadioProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
        "hover:bg-white/5",
        checked 
          ? "border-primary bg-primary/10" 
          : "border-white/10 bg-secondary/50"
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      
      <div className="relative w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center">
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-primary"
          />
        )}
      </div>
      
      {icon && (
        <div className={cn(
          "text-white/50",
          checked && "text-primary"
        )}>
          {icon}
        </div>
      )}
      
      <span className={cn(
        "text-sm font-medium",
        checked ? "text-white" : "text-white/70"
      )}>
        {label}
      </span>
    </label>
  );
} 