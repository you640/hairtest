import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/src/firebase';

export type BlockType = 'hero' | 'text' | 'button' | 'image' | 'grid' | 'card' | 'pricing' | 'contact' | 'contactForm' | 'features' | 'testimonials' | 'faq' | 'navbar' | 'footer';
export type AiAnimationType = 'zero-g' | 'singularity' | 'magnetic' | 'none';
export type ThemeType = 'light' | 'dark';

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
  style: {
    bgColor: string;
    textColor: string;
    padding: string;
    borderRadius?: string;
    shadow?: string;
    animation?: 'none' | 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
    animationDuration?: number;
    animationDelay?: number;
  };
}

interface BuilderState {
  blocks: Block[];
  selectedBlockId: string | null;
  aiAnimation: AiAnimationType;
  aiAnimationSpeed: number;
  theme: ThemeType;
  themePreset: 'modern' | 'brutalist' | 'minimal' | 'glass';
  pageTheme: string;
  wpConfig: {
    url: string;
    username: string;
    appPassword: string;
  };
  addBlock: (type: BlockType, props?: Record<string, any>, style?: Partial<Block['style']>) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, props?: Record<string, any>, style?: Partial<Block['style']>) => void;
  setSelectedBlock: (id: string | null) => void;
  moveBlock: (activeId: string, overId: string) => void;
  setBlocks: (blocks: Block[]) => void;
  setAiAnimation: (type: AiAnimationType) => void;
  setAiAnimationSpeed: (speed: number) => void;
  setTheme: (theme: ThemeType) => void;
  setThemePreset: (preset: 'modern' | 'brutalist' | 'minimal' | 'glass') => void;
  setPageTheme: (theme: string) => void;
  setWpConfig: (config: Partial<BuilderState['wpConfig']>) => void;
  duplicateBlock: (id: string) => void;
  saveProject: (name: string) => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  listProjects: () => Promise<{ id: string; name: string; createdAt: string }[]>;
}

export const DEFAULT_STYLE: Block['style'] = {
  bgColor: 'bg-background',
  textColor: 'text-foreground',
  padding: 'p-8',
  borderRadius: 'rounded-none',
  shadow: 'shadow-none',
  animation: 'fade',
  animationDuration: 0.5,
  animationDelay: 0,
};

const DEFAULT_PROPS: Record<BlockType, any> = {
  hero: { title: 'New Hero Section', subtitle: 'Describe your product here.', cta: 'Get Started' },
  text: { content: 'Enter your text here...' },
  button: { label: 'Click Me', variant: 'primary' },
  image: { src: 'https://picsum.photos/seed/builder/800/400', alt: 'Placeholder' },
  grid: { columns: 3, items: [] },
  card: { title: 'Card Title', content: 'Card content goes here.' },
  pricing: { title: 'Pricing Plan', price: '$29', features: 'Feature 1, Feature 2' },
  contact: { title: 'Contact Us', email: 'hello@example.com' },
  contactForm: { title: 'Get in Touch', email: 'hello@example.com', message: 'How can we help you?' },
  features: { 
    title: 'Our Features', 
    features: [
      { title: 'Fast', description: 'Blazing fast performance.' },
      { title: 'Secure', description: 'Your data is safe with us.' },
      { title: 'Scalable', description: 'Grows with your business.' }
    ] 
  },
  testimonials: {
    title: 'What Our Clients Say',
    testimonials: [
      { content: 'This builder is amazing!', author: 'John Doe', role: 'CEO' },
      { content: 'Saved us weeks of work.', author: 'Jane Smith', role: 'Designer' }
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      { question: 'Is it free?', answer: 'Yes, for personal use.' },
      { question: 'How do I export?', answer: 'Use the export button in settings.' }
    ]
  },
  navbar: {
    logo: 'AI Builder',
    links: [
      { label: 'Home', href: '#' },
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' }
    ]
  },
  footer: {
    text: '© 2026 AI PWA Builder. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' }
    ]
  }
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      blocks: [
        { id: nanoid(), type: 'hero', props: DEFAULT_PROPS.hero, style: DEFAULT_STYLE },
        { id: nanoid(), type: 'testimonials', props: DEFAULT_PROPS.testimonials, style: DEFAULT_STYLE },
        { id: nanoid(), type: 'text', props: DEFAULT_PROPS.text, style: DEFAULT_STYLE },
      ],
      selectedBlockId: null,
      aiAnimation: 'zero-g',
      aiAnimationSpeed: 1,
      theme: 'light',
      themePreset: 'modern',
      pageTheme: 'Professional Business',
      wpConfig: {
        url: '',
        username: '',
        appPassword: '',
      },
      addBlock: (type, props = {}, style = {}) => set((state) => ({
        blocks: [...state.blocks, { id: nanoid(), type, props: { ...DEFAULT_PROPS[type], ...props }, style: { ...DEFAULT_STYLE, ...style } }]
      })),
      removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
      })),
      updateBlock: (id, props = {}, style = {}) => set((state) => ({
        blocks: state.blocks.map((b) => b.id === id ? { 
          ...b, 
          props: { ...b.props, ...props },
          style: { ...(b.style || DEFAULT_STYLE), ...style }
        } : b)
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
      duplicateBlock: (id) => set((state) => {
        const index = state.blocks.findIndex((b) => b.id === id);
        if (index === -1) return state;
        const block = state.blocks[index];
        const newBlock = { ...block, id: nanoid() };
        const newBlocks = [...state.blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return { blocks: newBlocks };
      }),
      setBlocks: (blocks) => set({ blocks }),
      setAiAnimation: (type) => set({ aiAnimation: type }),
      setAiAnimationSpeed: (speed) => set({ aiAnimationSpeed: speed }),
      setTheme: (theme) => set({ theme }),
      setThemePreset: (preset) => set({ themePreset: preset }),
      setPageTheme: (theme) => set({ pageTheme: theme }),
      setWpConfig: (config) => set((state) => ({
        wpConfig: { ...state.wpConfig, ...config }
      })),
      saveProject: async (name: string) => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const projectId = nanoid();
        const project = {
          id: projectId,
          userId: user.uid,
          name,
          blocks: get().blocks,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', user.uid, 'projects', projectId), project);
      },
      loadProject: async (id: string) => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const docRef = doc(db, 'users', user.uid, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const project = docSnap.data();
          set({ blocks: project.blocks });
        }
      },
      listProjects: async () => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const projectsRef = collection(db, 'users', user.uid, 'projects');
        const querySnapshot = await getDocs(projectsRef);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt
        }));
      },
    }),
    {
      name: 'builder-storage',
    }
  )
);
