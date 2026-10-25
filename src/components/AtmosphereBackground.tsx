import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AtmosphereBackground: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black">
      {/* PURE BLACK FOUNDATION (#000000) WITH WHITE DOT AMBIENT LIGHTING */}
      <div className="absolute inset-0 bg-black">
        {/* Soft, ultra-subtle white dot ambient lighting pools in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-radial from-white/[0.04] via-white/[0.015] to-transparent rounded-full filter blur-[140px] pointer-events-none" />
        
        {/* Subtle warm gold rim light reflection for the championship trophy and cork ball */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-radial from-amber-500/[0.06] via-amber-500/[0.02] to-transparent rounded-full filter blur-[130px] pointer-events-none" />

        {/* Ambient side spotlights */}
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full filter blur-[120px] pointer-events-none" />
      </div>
    </div>
  );
};
