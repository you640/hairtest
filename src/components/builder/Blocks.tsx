import { ReactNode, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { DEFAULT_STYLE, useBuilderStore } from '@/src/lib/builderStore';

const getPresetClasses = (preset: string) => {
  switch (preset) {
    case 'brutalist':
      return {
        card: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none",
        button: "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none font-black uppercase tracking-tighter",
        heading: "font-black uppercase tracking-tighter italic",
      };
    case 'minimal':
      return {
        card: "border-none shadow-none bg-muted/20 rounded-xl",
        button: "rounded-full font-medium tracking-tight",
        heading: "font-light tracking-tight",
      };
    case 'glass':
      return {
        card: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl",
        button: "bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-semibold",
        heading: "font-bold tracking-tight",
      };
    default: // modern
      return {
        card: "bg-card border rounded-xl p-8 shadow-lg",
        button: "rounded-lg font-bold shadow-md",
        heading: "font-extrabold tracking-tight",
      };
  }
};

const getAnimationProps = (style: any): any => {
  const { animation = 'fade', animationDuration = 0.5, animationDelay = 0 } = style || {};
  
  if (animation === 'none') return {};

  const variants: Record<string, any> = {
    fade: { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
    slideUp: { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 } },
    slideDown: { initial: { opacity: 0, y: -50 }, whileInView: { opacity: 1, y: 0 } },
    slideLeft: { initial: { opacity: 0, x: 50 }, whileInView: { opacity: 1, x: 0 } },
    slideRight: { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 } },
    rotate: { initial: { opacity: 0, rotate: -10, scale: 0.9 }, whileInView: { opacity: 1, rotate: 0, scale: 1 } },
  };

  const selected = variants[animation] || variants.fade;

  return {
    initial: selected.initial,
    whileInView: selected.whileInView,
    viewport: { once: true, margin: "-100px" },
    transition: { 
      duration: animationDuration, 
      delay: animationDelay,
      ease: "easeOut"
    }
  };
};

export const HeroBlock = ({ title, subtitle, cta, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.section 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (s.animationDelay || 0) + 0.1 }}
        className={cn("text-4xl md:text-7xl mb-6 leading-tight", preset.heading)}
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (s.animationDelay || 0) + 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 px-4"
      >
        {subtitle}
      </motion.p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn("bg-primary text-primary-foreground px-10 py-4 transition-all", preset.button)}
      >
        {cta}
      </motion.button>
    </motion.section>
  );
};

export const TextBlock = ({ content, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const anim = getAnimationProps(s);
  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-3xl mx-auto prose prose-base md:prose-lg dark:prose-invert px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <p>{content}</p>
    </motion.div>
  );
};

export const ButtonBlock = ({ label, variant, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "flex justify-center", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "px-8 py-3 transition-all",
          preset.button,
          variant === 'primary' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border"
        )}
      >
        {label}
      </motion.button>
    </motion.div>
  );
};

export const ImageBlock = ({ src, alt, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-4xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <img src={src} alt={alt} className={cn("w-full h-auto shadow-2xl object-cover", themePreset === 'brutalist' ? "border-4 border-black" : "rounded-2xl")} referrerPolicy="no-referrer" />
    </motion.div>
  );
};

export const CardBlock = ({ title, content, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn("p-8", preset.card)}
      >
        <h3 className={cn("text-2xl mb-4", preset.heading)}>{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </motion.div>
    </motion.div>
  );
};

export const PricingBlock = ({ title, price, features, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-sm mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <motion.div 
        whileHover={{ y: -10, scale: 1.02 }}
        className={cn("p-8 text-center", preset.card, themePreset === 'modern' && "border-2 border-primary/20")}
      >
        <h3 className={cn("text-xl mb-2", preset.heading)}>{title}</h3>
        <div className="text-5xl font-black mb-4 text-primary">{price}</div>
        <p className="text-muted-foreground text-sm mb-8">{features}</p>
        <button className={cn("w-full py-3 bg-primary text-primary-foreground", preset.button)}>Choose Plan</button>
      </motion.div>
    </motion.div>
  );
};

export const ContactBlock = ({ title, email, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn("p-8", preset.card)}
      >
        <h3 className={cn("text-2xl mb-4", preset.heading)}>{title}</h3>
        <p className="text-muted-foreground">Email: <span className="text-primary font-bold">{email}</span></p>
      </motion.div>
    </motion.div>
  );
};

export const ContactFormBlock = ({ title, email, message, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn("p-8 space-y-4", preset.card)}
      >
        <h3 className={cn("text-2xl mb-4", preset.heading)}>{title}</h3>
        <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
        <input type="email" placeholder={email} className="w-full p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
        <textarea placeholder={message} className="w-full p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none transition-all" rows={4} />
        <button className={cn("w-full bg-primary text-primary-foreground p-3 transition-all", preset.button)}>Send Message</button>
      </motion.div>
    </motion.div>
  );
};

export const FeaturesBlock = ({ title, features, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-6xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <h2 className={cn("text-4xl text-center mb-16", preset.heading)}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {(features || []).map((feature: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className={cn("p-8 transition-all", preset.card)}
          >
            <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <div className="h-6 w-6 bg-primary rounded-full opacity-30 animate-pulse" />
            </div>
            <h3 className={cn("text-xl mb-3", preset.heading)}>{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const TestimonialsBlock = ({ title, testimonials, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-6xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <h2 className={cn("text-4xl text-center mb-16", preset.heading)}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {(testimonials || []).map((t: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className={cn("p-10 italic relative overflow-hidden", preset.card)}
          >
            <div className="text-6xl text-primary/10 absolute -top-2 -left-2 font-serif">"</div>
            <p className="mb-8 relative z-10 text-lg leading-relaxed">{t.content}</p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary border-2 border-primary/10">
                {t.author?.[0]}
              </div>
              <div>
                <div className={cn("text-sm", preset.heading)}>{t.author}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const FAQBlock = ({ title, items, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.div 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "max-w-3xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <h2 className={cn("text-4xl text-center mb-16", preset.heading)}>{title}</h2>
      <div className="space-y-6">
        {(items || []).map((item: any, i: number) => (
          <motion.div 
            key={i}
            className={cn("p-8", preset.card)}
          >
            <h3 className={cn("text-xl mb-4 flex items-center gap-3", preset.heading)}>
              <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">Q</span> 
              {item.question}
            </h3>
            <div className="flex gap-3">
              <span className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-black shrink-0">A</span>
              <p className="text-muted-foreground leading-relaxed pt-1">
                {item.answer}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const NavbarBlock = ({ logo, links, isEditing, style }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.nav 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "bg-background/80 backdrop-blur-md border-b sticky top-0 z-40 px-4 md:px-12", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <div className="flex items-center justify-between h-20">
        <div className={cn("text-2xl", preset.heading, "text-primary italic")}>{logo}</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {(links || []).map((link: any, i: number) => (
            <a key={i} href={link.href} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest">
              {link.label}
            </a>
          ))}
          <button className={cn("px-6 py-2 bg-primary text-primary-foreground text-xs", preset.button)}>
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden bg-background"
          >
            <div className="flex flex-col gap-6 py-8">
              {(links || []).map((link: any, i: number) => (
                <a 
                  key={i} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest px-2"
                >
                  {link.label}
                </a>
              ))}
              <button className={cn("w-full bg-primary text-primary-foreground py-4 text-xs mt-2", preset.button)}>
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export const FooterBlock = ({ text, links, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  const { themePreset } = useBuilderStore();
  const preset = getPresetClasses(themePreset);
  const anim = getAnimationProps(s);

  return (
    <motion.footer 
      {...anim}
      className={cn(s.padding, s.bgColor, s.textColor, s.borderRadius, s.shadow, "border-t bg-muted/30", isEditing && "cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-sm text-muted-foreground font-medium">{text}</div>
        <div className="flex items-center gap-10">
          {(links || []).map((link: any, i: number) => (
            <a key={i} href={link.href} className="text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};
