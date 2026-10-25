import React, { useState } from 'react';
import { getCricketerPhoto } from '../data/cricketerImages';

interface CricketerAvatarProps {
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBorder?: boolean;
  borderColor?: string;
}

const SIZE_MAP = {
  xs: 'w-7 h-7 text-[9px]',
  sm: 'w-9 h-9 text-[10px]',
  md: 'w-12 h-12 text-xs',
  lg: 'w-16 h-16 text-sm',
  xl: 'w-24 h-24 text-base',
  hero: 'w-36 h-36 text-lg sm:w-44 sm:h-44',
};

export const CricketerAvatar: React.FC<CricketerAvatarProps> = ({
  name,
  className = '',
  size = 'md',
  showBorder = true,
  borderColor = 'border-amber-400/40',
}) => {
  const [hasError, setHasError] = useState(false);
  const photoUrl = getCricketerPhoto(name);
  const sizeClasses = SIZE_MAP[size];

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CR';

  if (hasError) {
    return (
      <div
        className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-slate-900 to-black flex items-center justify-center font-mono font-black text-amber-400 shrink-0 ${
          showBorder ? `border ${borderColor}` : ''
        } ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shrink-0 ${sizeClasses} ${
        showBorder ? `border ${borderColor}` : ''
      } ${className}`}
    >
      <img
        src={photoUrl}
        alt={name}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};
