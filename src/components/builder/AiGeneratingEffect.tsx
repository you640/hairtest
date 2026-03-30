import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { AiAnimationType } from '@/src/lib/builderStore';

export function AiGeneratingEffect({ 
  isGenerating, 
  type, 
  speed = 1,
  children 
}: { 
  isGenerating: boolean; 
  type: AiAnimationType; 
  speed?: number;
  children: ReactNode;
}) {
  if (!isGenerating || type === 'none') {
    return <>{children}</>;
  }

  if (type === 'zero-g') {
    return (
      <div className="relative w-full h-full perspective-[2000px]">
        {/* Glowing Grid Background */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
        <motion.div 
          animate={{ 
            y: [0, -30, 10, -20, 0], 
            rotateX: [0, 5, -5, 2, 0], 
            rotateY: [0, -5, 5, -2, 0],
            scale: [1, 0.95, 1.02, 1]
          }}
          transition={{ duration: 6 / speed, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 origin-center"
        >
          {/* Neon Wireframe Overlay */}
          <div className="absolute inset-0 z-50 pointer-events-none border-2 border-primary/50 rounded-3xl shadow-[0_0_50px_rgba(var(--primary),0.5)] animate-pulse" />
          {children}
        </motion.div>
      </div>
    );
  }

  if (type === 'singularity') {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl">
        {/* The Black Hole */}
        <motion.div
          className="absolute z-50 w-48 h-48 rounded-full bg-black shadow-[0_0_150px_80px_rgba(138,43,226,0.9)] border-4 border-purple-500/50"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 0.8, 1.5], rotate: [0, -720] }}
          transition={{ duration: 4 / speed, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {/* Event Horizon Particles */}
        <motion.div 
          className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]"
          animate={{ opacity: [0, 1, 0.5] }}
          transition={{ duration: 2 / speed, repeat: Infinity }}
        />
        {/* Sucking the content in */}
        <motion.div 
          animate={{ 
            scale: [1, 0.05], 
            rotateZ: [0, 1080], 
            opacity: [1, 0],
            filter: ["blur(0px)", "blur(20px)"]
          }}
          transition={{ duration: 3 / speed, ease: "circIn", repeat: Infinity }}
          className="relative z-10 origin-center w-full"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  if (type === 'magnetic') {
    return (
      <div className="relative w-full h-full">
        {/* Electric arcs background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-fuchsia-500/20 animate-pulse mix-blend-overlay" />
        
        <motion.div 
          animate={{ 
            x: [-15, 15, -10, 20, -15, 0], 
            y: [15, -15, 20, -10, 15, 0],
            filter: [
              "drop-shadow(15px 0 0 rgba(255,0,255,0.7)) drop-shadow(-15px 0 0 rgba(0,255,255,0.7))",
              "drop-shadow(-15px 0 0 rgba(255,0,255,0.7)) drop-shadow(15px 0 0 rgba(0,255,255,0.7))",
              "drop-shadow(10px 10px 0 rgba(255,255,0,0.7)) drop-shadow(-10px -10px 0 rgba(0,255,255,0.7))",
              "drop-shadow(0 0 0 rgba(0,0,0,0))"
            ],
            skewX: [0, 5, -5, 2, 0]
          }}
          transition={{ duration: 0.4 / speed, repeat: Infinity, repeatType: "mirror" }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
