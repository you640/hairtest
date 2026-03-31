import { ReactNode, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { DEFAULT_STYLE } from '@/src/lib/builderStore';

export const HeroBlock = ({ title, subtitle, cta, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 px-4"
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
};

export const TextBlock = ({ content, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-3xl mx-auto prose prose-base md:prose-lg dark:prose-invert px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <p>{content}</p>
    </motion.div>
  );
};

export const ButtonBlock = ({ label, variant, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "flex justify-center", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
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
};

export const ImageBlock = ({ src, alt, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-4xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <img src={src} alt={alt} className="w-full h-auto rounded-md shadow-2xl object-cover" referrerPolicy="no-referrer" />
    </motion.div>
  );
};

export const CardBlock = ({ title, content, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
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
};

export const PricingBlock = ({ title, price, features, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-sm mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
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
};

export const ContactBlock = ({ title, email, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
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
};

export const ContactFormBlock = ({ title, email, message, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-md mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-card border rounded-md p-8 shadow-lg space-y-4"
      >
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded-md" />
        <input type="email" placeholder={email} className="w-full p-2 border rounded-md" />
        <textarea placeholder={message} className="w-full p-2 border rounded-md" rows={4} />
        <button className="w-full bg-primary text-primary-foreground p-2 rounded-md font-bold">Send Message</button>
      </motion.div>
    </motion.div>
  );
};

export const FeaturesBlock = ({ title, features, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-6xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
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
};

export const TestimonialsBlock = ({ title, testimonials, isEditing, style }: any) => {
  const s = style || DEFAULT_STYLE;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-6xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(testimonials || []).map((t: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-card border rounded-md p-8 shadow-lg italic relative"
          >
            <div className="text-4xl text-primary/20 absolute top-4 left-4 font-serif">"</div>
            <p className="mb-6 relative z-10">{t.content}</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                {t.author?.[0]}
              </div>
              <div>
                <div className="font-bold text-sm">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "max-w-3xl mx-auto px-4", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className="space-y-4">
        {(items || []).map((item: any, i: number) => (
          <motion.div 
            key={i}
            className="bg-card border rounded-md p-6"
          >
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span className="text-primary">Q:</span> {item.question}
            </h3>
            <p className="text-muted-foreground">
              <span className="text-muted-foreground/50">A:</span> {item.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const NavbarBlock = ({ logo, links, isEditing, style }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const s = style || DEFAULT_STYLE;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "bg-background/80 backdrop-blur-md border-b sticky top-0 z-40 px-4 md:px-8", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <div className="flex items-center justify-between h-16">
        <div className="text-xl font-black tracking-tighter text-primary uppercase italic">{logo}</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {(links || []).map((link: any, i: number) => (
            <a key={i} href={link.href} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest">
              {link.label}
            </a>
          ))}
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest shadow-lg">
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
            <div className="flex flex-col gap-4 py-6">
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
              <button className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest shadow-lg mt-2">
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
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(s.padding, s.bgColor, s.textColor, "border-t bg-muted/30", isEditing && "cursor-pointer hover:bg-muted/50 rounded-md transition-colors")}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-sm text-muted-foreground font-medium">{text}</div>
        <div className="flex items-center gap-8">
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
