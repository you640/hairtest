import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export const HeroBlock = ({ title, subtitle, cta, isEditing }: any) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-20 text-center px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <motion.h1 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl font-extrabold tracking-tight mb-6"
    >
      {title}
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
    >
      {subtitle}
    </motion.p>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold shadow-lg transition-transform"
    >
      {cta}
    </motion.button>
  </motion.section>
);

export const TextBlock = ({ content, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-8 max-w-3xl mx-auto px-4 prose prose-lg dark:prose-invert", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <p>{content}</p>
  </motion.div>
);

export const ButtonBlock = ({ label, variant, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-4 flex justify-center", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-6 py-2 rounded-md font-medium transition-all",
        variant === 'primary' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border"
      )}
    >
      {label}
    </motion.button>
  </motion.div>
);

export const ImageBlock = ({ src, alt, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6 }}
    className={cn("py-8 max-w-4xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <img src={src} alt={alt} className="w-full h-auto rounded-md shadow-2xl object-cover" referrerPolicy="no-referrer" />
  </motion.div>
);

export const CardBlock = ({ title, content, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-8 max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card border rounded-md p-8 shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground">{content}</p>
    </motion.div>
  </motion.div>
);

export const PricingBlock = ({ title, price, features, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-8 max-w-sm mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-card border-2 border-primary/20 rounded-md p-8 shadow-lg text-center"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-extrabold mb-4 text-primary">{price}</div>
      <p className="text-muted-foreground text-sm">{features}</p>
    </motion.div>
  </motion.div>
);

export const ContactBlock = ({ title, email, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-8 max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card border rounded-md p-8 shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground">Email: {email}</p>
    </motion.div>
  </motion.div>
);

export const FeaturesBlock = ({ title, features, isEditing }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn("py-16 max-w-6xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
  >
    <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {(features || []).map((feature: any, i: number) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="bg-card border rounded-md p-6 shadow-sm"
        >
          <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center mb-4 text-primary">
            <div className="h-5 w-5 bg-primary rounded-full opacity-20" />
          </div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
