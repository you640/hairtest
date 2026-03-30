import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, useBuilderStore } from '@/src/lib/builderStore';
import { HeroBlock, TextBlock, ButtonBlock, ImageBlock, CardBlock, PricingBlock, ContactBlock, FeaturesBlock } from './Blocks';
import { cn } from '@/src/lib/utils';
import { Trash2, GripVertical } from 'lucide-react';
import { motion } from 'motion/react';

export function SortableBlock({ block }: { block: Block }) {
  const { selectedBlockId, setSelectedBlock, removeBlock } = useBuilderStore();
  const isSelected = selectedBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    switch (block.type) {
      case 'hero': return <HeroBlock {...block.props} isEditing />;
      case 'text': return <TextBlock {...block.props} isEditing />;
      case 'button': return <ButtonBlock {...block.props} isEditing />;
      case 'image': return <ImageBlock {...block.props} isEditing />;
      case 'card': return <CardBlock {...block.props} isEditing />;
      case 'pricing': return <PricingBlock {...block.props} isEditing />;
      case 'contact': return <ContactBlock {...block.props} isEditing />;
      case 'features': return <FeaturesBlock {...block.props} isEditing />;
      default: return null;
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isSelected ? 1.02 : 1,
        borderColor: isSelected ? "var(--primary)" : "rgba(0,0,0,0)",
        boxShadow: isSelected 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
          : "0 0px 0px 0px rgba(0, 0, 0, 0)"
      }}
      whileHover={{ 
        scale: isSelected ? 1.03 : 1.01, 
        boxShadow: "0 30px 60px -15px rgba(0,0,0,0.12)",
        borderColor: isSelected ? "var(--primary)" : "rgba(100, 116, 139, 0.3)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 25,
        scale: { duration: 0.2 }
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlock(block.id);
      }}
      className={cn(
        "group relative mb-8 rounded-md border-2 bg-background transition-all cursor-pointer",
        isSelected ? "ring-8 ring-primary/5 z-10" : "hover:shadow-2xl"
      )}
    >
      {/* Controls */}
      <div className={cn(
        "absolute -left-14 top-0 flex flex-col gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1",
        isSelected && "opacity-100 -translate-x-1"
      )}>
        <motion.div 
          {...attributes} 
          {...listeners} 
          whileHover={{ scale: 1.1, backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          whileTap={{ scale: 0.9, cursor: "grabbing" }}
          className="cursor-grab rounded-md bg-background border-2 border-primary/20 p-3 shadow-xl text-primary transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
          className="rounded-md bg-destructive/10 p-3 text-destructive border-2 border-destructive/20 shadow-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="overflow-hidden rounded-md">
        {renderContent()}
      </div>
    </motion.div>
  );
}
