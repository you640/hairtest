import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ 
  title, 
  description, 
  header, 
  icon, 
  className 
}: { 
  title: string; 
  description: string; 
  header?: ReactNode; 
  icon?: ReactNode; 
  className?: string 
}) {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-xl",
      className
    )}>
      {header && <div className="mb-4">{header}</div>}
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-2 transition-all duration-300 group-hover:-translate-y-2">
        {icon && <div className="h-12 w-12 origin-left transform-gpu text-primary transition-all duration-300 group-hover:scale-75">{icon}</div>}
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="max-w-lg text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
