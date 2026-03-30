import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export type BlockType = 'hero' | 'text' | 'button' | 'image' | 'grid' | 'card' | 'pricing' | 'contact' | 'features';
export type AiAnimationType = 'zero-g' | 'singularity' | 'magnetic' | 'none';
export type ThemeType = 'light' | 'dark';

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
}

interface BuilderState {
  blocks: Block[];
  selectedBlockId: string | null;
  aiAnimation: AiAnimationType;
  aiAnimationSpeed: number;
  theme: ThemeType;
  wpConfig: {
    url: string;
    username: string;
    appPassword: string;
  };
  addBlock: (type: BlockType, props?: Record<string, any>) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, props: Record<string, any>) => void;
  setSelectedBlock: (id: string | null) => void;
  moveBlock: (activeId: string, overId: string) => void;
  setBlocks: (blocks: Block[]) => void;
  setAiAnimation: (type: AiAnimationType) => void;
  setAiAnimationSpeed: (speed: number) => void;
  setTheme: (theme: ThemeType) => void;
  setWpConfig: (config: Partial<BuilderState['wpConfig']>) => void;
}

const DEFAULT_PROPS: Record<BlockType, any> = {
  hero: { title: 'New Hero Section', subtitle: 'Describe your product here.', cta: 'Get Started' },
  text: { content: 'Enter your text here...' },
  button: { label: 'Click Me', variant: 'primary' },
  image: { src: 'https://picsum.photos/seed/builder/800/400', alt: 'Placeholder' },
  grid: { columns: 3, items: [] },
  card: { title: 'Card Title', content: 'Card content goes here.' },
  pricing: { title: 'Pricing Plan', price: '$29', features: 'Feature 1, Feature 2' },
  contact: { title: 'Contact Us', email: 'hello@example.com' },
  features: { 
    title: 'Our Features', 
    features: [
      { title: 'Fast', description: 'Blazing fast performance.' },
      { title: 'Secure', description: 'Your data is safe with us.' },
      { title: 'Scalable', description: 'Grows with your business.' }
    ] 
  },
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      blocks: [
        { id: nanoid(), type: 'hero', props: DEFAULT_PROPS.hero },
        { id: nanoid(), type: 'text', props: DEFAULT_PROPS.text },
      ],
      selectedBlockId: null,
      aiAnimation: 'zero-g',
      aiAnimationSpeed: 1,
      theme: 'light',
      wpConfig: {
        url: '',
        username: '',
        appPassword: '',
      },
      addBlock: (type, props = {}) => set((state) => ({
        blocks: [...state.blocks, { id: nanoid(), type, props: { ...DEFAULT_PROPS[type], ...props } }]
      })),
      removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
      })),
      updateBlock: (id, props) => set((state) => ({
        blocks: state.blocks.map((b) => b.id === id ? { ...b, props: { ...b.props, ...props } } : b)
      })),
      setSelectedBlock: (id) => set({ selectedBlockId: id }),
      moveBlock: (activeId, overId) => set((state) => {
        const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
        const newIndex = state.blocks.findIndex((b) => b.id === overId);
        const newBlocks = [...state.blocks];
        const [removed] = newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, removed);
        return { blocks: newBlocks };
      }),
      setBlocks: (blocks) => set({ blocks }),
      setAiAnimation: (type) => set({ aiAnimation: type }),
      setAiAnimationSpeed: (speed) => set({ aiAnimationSpeed: speed }),
      setTheme: (theme) => set({ theme }),
      setWpConfig: (config) => set((state) => ({
        wpConfig: { ...state.wpConfig, ...config }
      })),
    }),
    {
      name: 'builder-storage',
    }
  )
);
