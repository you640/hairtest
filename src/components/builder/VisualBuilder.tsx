import { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useBuilderStore, BlockType } from '@/src/lib/builderStore';
import { useAppStore } from '@/src/lib/store';
import { SortableBlock } from './SortableBlock';
import { AiGeneratingEffect } from './AiGeneratingEffect';
import { 
  HeroBlock, 
  TextBlock, 
  ButtonBlock, 
  ImageBlock, 
  CardBlock, 
  PricingBlock, 
  ContactBlock, 
  FeaturesBlock,
  TestimonialsBlock,
  FAQBlock,
  NavbarBlock,
  FooterBlock
} from './Blocks';
import { AuthButton } from '@/src/components/auth/AuthButton';
import { ProjectArchive } from '@/src/components/builder/ProjectArchive';
import { generateContent, generateSvg } from '@/src/services/gemini';
import { publishToWordPress } from '@/src/services/wordpress';
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Layout, 
  CreditCard, 
  Settings2,
  Sparkles,
  ChevronRight,
  Eye,
  Save,
  Wand2,
  Settings,
  Moon,
  Sun,
  Globe,
  Loader2,
  MessageSquare,
  HelpCircle,
  Download,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const PREDEFINED_ICONS = [
  { name: 'Rocket', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>' },
  { name: 'Star', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { name: 'Heart', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' },
  { name: 'Check', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' },
];

export function VisualBuilder() {
  const { 
    blocks, 
    setBlocks, 
    addBlock, 
    selectedBlockId, 
    updateBlock, 
    setSelectedBlock, 
    aiAnimation, 
    setAiAnimation, 
    aiAnimationSpeed, 
    setAiAnimationSpeed,
    wpConfig,
    setWpConfig,
    saveProject,
    pageTheme,
    setPageTheme
  } = useBuilderStore();
  const { theme, setTheme } = useAppStore();
  const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'ai' | 'settings' | 'icons'>('add');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [iconPrompt, setIconPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIconGenerating, setIsIconGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-flash-preview');

  const models = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro' },
    { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash Lite' },
  ];

  const handleAiGenerate = async (blockId: string, key: string, currentContent: string) => {
    setIsAiGenerating(true);
    try {
      const prompt = `Generate relevant placeholder content for a ${selectedBlock?.type} block with field '${key}'. The overall page theme is: "${pageTheme}". Current content: "${currentContent}". Return ONLY the generated text, no markdown.`;
      const generated = await generateContent(prompt, selectedModel);
      updateBlock(blockId, { [key]: generated });
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      setBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        <button 
          onClick={() => setIsPreview(false)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-2xl hover:scale-105 transition-transform"
        >
          <Settings2 className="h-5 w-5" />
          Back to Editor
        </button>
        <div className="mx-auto max-w-5xl py-20">
          {blocks.map((block) => (
            <div key={block.id}>
              {block.type === 'hero' && <HeroBlock {...block.props} style={block.style} />}
              {block.type === 'text' && <TextBlock {...block.props} style={block.style} />}
              {block.type === 'button' && <ButtonBlock {...block.props} style={block.style} />}
              {block.type === 'image' && <ImageBlock {...block.props} style={block.style} />}
              {block.type === 'card' && <CardBlock {...block.props} style={block.style} />}
              {block.type === 'pricing' && <PricingBlock {...block.props} style={block.style} />}
              {block.type === 'contact' && <ContactBlock {...block.props} style={block.style} />}
              {block.type === 'features' && <FeaturesBlock {...block.props} style={block.style} />}
              {block.type === 'testimonials' && <TestimonialsBlock {...block.props} style={block.style} />}
              {block.type === 'faq' && <FAQBlock {...block.props} style={block.style} />}
              {block.type === 'navbar' && <NavbarBlock {...block.props} style={block.style} />}
              {block.type === 'footer' && <FooterBlock {...block.props} style={block.style} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAiGeneratePage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    const targetBlock = editingBlockId ? blocks.find(b => b.id === editingBlockId) : null;

    try {
      const response = await generateContent(`
        You are an expert React UI builder AI. Your task is to generate or modify a JSON structure representing a high-quality, professional webpage based on the user's request.
        
        ${targetBlock ? `TARGET BLOCK TO MODIFY:
        ID: ${targetBlock.id}
        Type: ${targetBlock.type}
        Current Props: ${JSON.stringify(targetBlock.props)}` : `Current page structure (JSON):
        ${JSON.stringify(blocks)}`}
        
        User request: "${aiPrompt}"
        
        AVAILABLE BLOCK TYPES AND REQUIRED PROPS:
        - hero: { title: string, subtitle: string, cta: string } - The main attention-grabbing section.
        - features: { title: string, features: Array<{ title: string, description: string }> } - Showcase key benefits.
        - text: { content: string } - General text content.
        - button: { label: string, variant: 'primary' | 'secondary' } - Call to action.
        - image: { src: string, alt: string } - Visual elements.
        - card: { title: string, content: string } - Information cards.
        - pricing: { title: string, price: string, features: string } - Pricing plans.
        - contact: { title: string, email: string } - Contact information.
        - testimonials: { title: string, testimonials: Array<{ content: string, author: string, role: string }> } - Client feedback.
        - faq: { title: string, items: Array<{ question: string, answer: string }> } - Frequently asked questions.
        - navbar: { logo: string, links: Array<{ label: string, href: string }> } - Navigation.
        - footer: { text: string, links: Array<{ label: string, href: string }> } - Page footer.

        DESIGN PRINCIPLES:
        1. MOBILE-FIRST: Ensure all content is concise and readable on small screens.
        2. CONSISTENCY: Maintain a consistent tone and style across all blocks.
        3. ENGAGEMENT: Use persuasive and professional copy.
        4. ACCESSIBILITY: Provide descriptive alt text for images.
        5. LOGICAL FLOW: Arrange blocks in a way that tells a story (e.g., Hero -> Features -> Testimonials -> Pricing -> Contact).

        INSTRUCTIONS:
        1. Analyze the user's request carefully. 
        ${targetBlock ? `2. You MUST return a JSON object with an "update" key containing exactly one change for the target block ID ${targetBlock.id}. Example:
           {
             "update": [
               { "id": "${targetBlock.id}", "props": { "title": "New Title" } }
             ]
           }` : `2. If creating a NEW page or ADDING blocks, return a JSON array of new block objects. Example:
           [
             { "type": "hero", "props": { "title": "Welcome", "subtitle": "Best app", "cta": "Start" } },
             { "type": "text", "props": { "content": "Our story..." } }
           ]
        3. If MODIFYING existing blocks, return a JSON object with an "update" key containing an array of changes. You must use the exact "id" from the current page structure. Example:
           {
             "update": [
               { "id": "existing-block-id-1", "props": { "title": "New Title" } }
             ]
           }`}
        4. If the user asks for a full page (e.g., "Create a landing page for a bakery"), generate a complete, logical sequence of blocks.
        5. Use realistic, high-quality placeholder text and image URLs (e.g., https://picsum.photos/seed/bakery/800/400).
        6. For array-based props (features, testimonials, faq, links), generate at least 3-4 high-quality items.
        
        CRITICAL: Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or any conversational text. Just the raw JSON array or object.
      `, selectedModel);
      
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr);
      
      if (result.update) {
        result.update.forEach((u: any) => updateBlock(u.id, u.props));
      } else {
        const newBlocks = result.map((b: any) => ({ ...b, id: Math.random().toString(36).substr(2, 9) }));
        setBlocks([...blocks, ...newBlocks]);
      }
      setAiPrompt('');
      setEditingBlockId(null);
    } catch (error) {
      console.error('AI Builder Error:', error);
      alert('Failed to generate content. Please try a different prompt or check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToWp = async () => {
    if (!wpConfig.url || !wpConfig.username || !wpConfig.appPassword) {
      alert("Please fill in all WordPress settings first.");
      setActiveTab('settings');
      return;
    }

    setIsPublishing(true);
    try {
      await publishToWordPress(blocks, wpConfig);
      alert("Successfully published to WordPress!");
    } catch (error: any) {
      alert(`Publishing failed: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-transparent overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-center p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex bg-muted rounded-full p-1 w-full max-w-[300px]">
          <button
            onClick={() => setMobileTab('chat')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-full transition-all",
              mobileTab === 'chat' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
            )}
          >
            Chat
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-full transition-all",
              mobileTab === 'preview' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
            )}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Left Sidebar: Component Library & AI */}
      <aside className={cn(
        "w-full md:w-80 border-r bg-card/50 backdrop-blur-xl flex flex-col transition-all duration-300",
        mobileTab === 'preview' ? "hidden md:flex" : "flex"
      )}>
        <div className="flex border-b overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('add')}
            className={cn("flex-1 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap", activeTab === 'add' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Add
          </button>
          <button 
            onClick={() => setActiveTab('edit')}
            className={cn("flex-1 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap", activeTab === 'edit' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Edit
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={cn("flex-1 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap", activeTab === 'ai' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            AI
          </button>
          <button 
            onClick={() => setActiveTab('icons')}
            className={cn("flex-1 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap", activeTab === 'icons' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Icons
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn("flex-1 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap", activeTab === 'settings' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            <Settings className="h-4 w-4 mx-auto" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'add' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'hero', icon: Layout, label: 'Hero' },
                { type: 'features', icon: Layout, label: 'Features' },
                { type: 'text', icon: Type, label: 'Text' },
                { type: 'button', icon: Square, label: 'Button' },
                { type: 'image', icon: ImageIcon, label: 'Image' },
                { type: 'card', icon: CreditCard, label: 'Card' },
                { type: 'pricing', icon: CreditCard, label: 'Pricing' },
                { type: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
                { type: 'faq', icon: HelpCircle, label: 'FAQ' },
                { type: 'navbar', icon: Layout, label: 'Navbar' },
                { type: 'footer', icon: Layout, label: 'Footer' },
                { type: 'contact', icon: Layout, label: 'Contact' },
                { type: 'contactForm', icon: Layout, label: 'Contact Form' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item.type as BlockType)}
                  className="flex flex-col items-center gap-3 rounded-md border bg-background p-4 transition-all hover:border-primary hover:shadow-lg active:scale-95"
                >
                  <item.icon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-6">
              {/* Layer List */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Layers</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {blocks.map((block, index) => (
                    <button
                      key={block.id}
                      onClick={() => setSelectedBlock(block.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-all",
                        selectedBlockId === block.id 
                          ? "bg-primary text-primary-foreground font-bold shadow-md" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="opacity-50 font-mono">{index + 1}</span>
                      <span className="capitalize">{block.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              {!selectedBlock ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Select a block on the canvas to edit its properties.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg capitalize">{selectedBlock.type} Settings</h3>
                    <button
                      onClick={async () => {
                        const prompt = window.prompt('Describe the content you want for this block:');
                        if (!prompt) return;
                        setIsAiGenerating(true);
                        try {
                          const fieldNames = Object.keys(selectedBlock.props).join(', ');
                          const aiPrompt = `Generate content for a ${selectedBlock.type} block. The fields are: ${fieldNames}. User request: "${prompt}". Return ONLY a JSON object with the new values for these fields. Do not include any markdown.`;
                          const generated = await generateContent(aiPrompt, selectedModel);
                          const newProps = JSON.parse(generated.replace(/```json|```/g, '').trim());
                          updateBlock(selectedBlock.id, newProps);
                        } catch (error) {
                          console.error('AI block generation error:', error);
                          alert('Failed to generate block content.');
                        } finally {
                          setIsAiGenerating(false);
                        }
                      }}
                      disabled={isAiGenerating}
                      className="text-[10px] font-bold uppercase text-primary hover:underline"
                    >
                      {isAiGenerating ? 'Generating...' : '✨ Generate Block'}
                    </button>
                  </div>
                  {Object.entries(selectedBlock.props).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{key}</label>
                      {typeof value === 'string' && key !== 'variant' ? (
                        <div className="space-y-2">
                          <button
                            onClick={async () => {
                              if (key === 'alt' && selectedBlock.type === 'image') {
                                setIsAiGenerating(true);
                                try {
                                  const prompt = `Generate a descriptive alt text for an image that is currently a placeholder. The alt text should focus on the fact that it is a placeholder image and suggest what kind of content should be placed here. Return ONLY the alt text, no markdown.`;
                                  const generated = await generateContent(prompt, selectedModel);
                                  updateBlock(selectedBlock.id, { [key]: generated.trim() });
                                } catch (error) {
                                  console.error('AI alt text generation error:', error);
                                  alert('Failed to generate alt text.');
                                } finally {
                                  setIsAiGenerating(false);
                                }
                              } else {
                                handleAiGenerate(selectedBlock.id, key, value as string);
                              }
                            }}
                            disabled={isAiGenerating}
                            className="text-[10px] font-bold uppercase text-primary hover:underline"
                          >
                            {isAiGenerating ? 'Generating...' : '✨ Generate with AI'}
                          </button>
                          <textarea
                            value={value as string}
                            onChange={(e) => updateBlock(selectedBlock.id, { [key]: e.target.value })}
                            className="w-full rounded-md border bg-background p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            rows={key === 'content' || key === 'subtitle' ? 4 : 1}
                          />
                        </div>
                      ) : key === 'variant' ? (
                        <select 
                          value={value}
                          onChange={(e) => updateBlock(selectedBlock.id, { [key]: e.target.value })}
                          className="w-full rounded-md border bg-background p-3 text-sm"
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                        </select>
                      ) : Array.isArray(value) ? (
                        <div className="space-y-4 border-l-2 border-primary/20 pl-4 py-2">
                          {value.map((item, index) => (
                            <div key={index} className="space-y-2 p-3 rounded-md bg-muted/30 border">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Item {index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const newArray = [...value];
                                    newArray.splice(index, 1);
                                    updateBlock(selectedBlock.id, { [key]: newArray });
                                  }}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                              {Object.entries(item).map(([itemKey, itemValue]) => (
                                <div key={itemKey} className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">{itemKey}</label>
                                  <textarea
                                    value={itemValue as string}
                                    onChange={(e) => {
                                      const newArray = [...value];
                                      newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                                      updateBlock(selectedBlock.id, { [key]: newArray });
                                    }}
                                    className="w-full rounded-md border bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                    rows={1}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newItem = { ...value[0] };
                              Object.keys(newItem).forEach(k => newItem[k] = `New ${k}`);
                              updateBlock(selectedBlock.id, { [key]: [...value, newItem] });
                            }}
                            className="w-full py-2 border-2 border-dashed rounded-md text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                          >
                            + Add Item
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                  
                  <div className="h-px bg-border my-4" />
                  <h4 className="font-bold text-sm">Style</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Background Color (Tailwind class)</label>
                    <input type="text" value={selectedBlock.style.bgColor} onChange={(e) => updateBlock(selectedBlock.id, {}, { bgColor: e.target.value })} className="w-full rounded-md border bg-background p-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text Color (Tailwind class)</label>
                    <input type="text" value={selectedBlock.style.textColor} onChange={(e) => updateBlock(selectedBlock.id, {}, { textColor: e.target.value })} className="w-full rounded-md border bg-background p-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Padding (Tailwind class)</label>
                    <input type="text" value={selectedBlock.style.padding} onChange={(e) => updateBlock(selectedBlock.id, {}, { padding: e.target.value })} className="w-full rounded-md border bg-background p-2 text-sm" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="rounded-md bg-primary/5 p-4 border border-primary/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-bold">AI Page Builder</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {editingBlockId 
                    ? `You are currently editing a specific block. Describe the changes you want to make to it.`
                    : `Describe the entire page structure and content you want to build, or request modifications to existing blocks.`}
                </p>
                {editingBlockId && (
                  <button 
                    onClick={() => setEditingBlockId(null)}
                    className="mt-2 text-[10px] font-bold uppercase text-primary hover:underline"
                  >
                    Cancel selective edit
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-md border bg-background p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={editingBlockId 
                  ? "e.g., Change the title to 'Our Mission' and make the text more professional..."
                  : "e.g., Build a landing page for a new coffee shop with a hero section, features, and a contact form..."}
                className="w-full rounded-md border bg-background p-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                rows={6}
              />
              <button
                onClick={handleAiGeneratePage}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? <Wand2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isGenerating ? 'Generating...' : editingBlockId ? 'Update Block' : 'Apply with AI'}
              </button>
            </div>
          )}

          {activeTab === 'icons' && (
            <div className="space-y-6">
              <div className="rounded-md bg-primary/5 p-4 border border-primary/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-bold">SVG Icon Generator</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Describe the icon you want to generate.
                </p>
              </div>
              <textarea
                value={iconPrompt}
                onChange={(e) => setIconPrompt(e.target.value)}
                placeholder="e.g., A minimalist rocket ship icon..."
                className="w-full rounded-md border bg-background p-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                rows={4}
              />
              <button
                onClick={async () => {
                  setIsIconGenerating(true);
                  try {
                    const svg = await generateSvg(iconPrompt);
                    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
                    addBlock('image', { src: dataUrl, alt: iconPrompt });
                    setIconPrompt('');
                  } catch (error) {
                    console.error('Icon Generation Error:', error);
                    alert('Failed to generate icon.');
                  } finally {
                    setIsIconGenerating(false);
                  }
                }}
                disabled={isIconGenerating || !iconPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isIconGenerating ? <Wand2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isIconGenerating ? 'Generating...' : 'Generate Icon'}
              </button>

              <div className="h-px bg-border" />
              
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Icon Library</label>
              <div className="grid grid-cols-2 gap-4">
                {PREDEFINED_ICONS.map((icon) => (
                  <div
                    key={icon.name}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('icon-svg', icon.svg);
                      e.dataTransfer.setData('icon-name', icon.name);
                    }}
                    onClick={() => {
                      const dataUrl = `data:image/svg+xml;base64,${btoa(icon.svg)}`;
                      addBlock('image', { src: dataUrl, alt: icon.name });
                    }}
                    className="p-4 border rounded-md hover:border-primary cursor-grab flex flex-col items-center gap-2"
                  >
                    <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
                    <span className="text-[10px] text-muted-foreground">{icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Builder Settings</h3>
              </div>
              
              <div className="space-y-4">
                <ProjectArchive />
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Page Theme
                  </label>
                  <input 
                    type="text" 
                    value={pageTheme}
                    onChange={(e) => setPageTheme(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="e.g., Professional Business, Modern Portfolio"
                  />
                </div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Appearance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all",
                      theme === 'light' 
                        ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    <span className="font-bold text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all",
                      theme === 'dark' 
                        ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    <span className="font-bold text-sm">Dark</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  AI Generation Animation
                </label>
                <div className="grid gap-3">
                  {[
                    { id: 'zero-g', name: 'Zero-G Blueprint', desc: 'Floating blocks with neon wireframes' },
                    { id: 'singularity', name: 'Quantum Singularity', desc: 'Sucked into a black hole' },
                    { id: 'magnetic', name: 'Magnetic Levitation', desc: 'Chaotic electric assembly' },
                    { id: 'none', name: 'None', desc: 'Instant generation without effects' }
                  ].map(anim => (
                    <button
                      key={anim.id}
                      onClick={() => setAiAnimation(anim.id as any)}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-md border-2 transition-all text-left",
                        aiAnimation === anim.id 
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <span className="font-bold text-sm">{anim.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{anim.desc}</span>
                    </button>
                  ))}
                </div>

                {aiAnimation !== 'none' && (
                  <div className="mt-6 space-y-3 p-4 rounded-md bg-muted/30 border">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Animation Speed
                      </label>
                      <span className="text-xs font-bold bg-background px-2 py-1 rounded-md border">{aiAnimationSpeed}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.1" 
                      value={aiAnimationSpeed}
                      onChange={(e) => setAiAnimationSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-muted rounded-md appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    WordPress Integration
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Site URL</span>
                    <input 
                      type="text" 
                      placeholder="https://your-site.com"
                      value={wpConfig.url}
                      onChange={(e) => setWpConfig({ url: e.target.value })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Username</span>
                    <input 
                      type="text" 
                      placeholder="admin"
                      value={wpConfig.username}
                      onChange={(e) => setWpConfig({ username: e.target.value })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">App Password</span>
                    <input 
                      type="password" 
                      placeholder="xxxx xxxx xxxx xxxx"
                      value={wpConfig.appPassword}
                      onChange={(e) => setWpConfig({ appPassword: e.target.value })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handlePublishToWp}
                    disabled={isPublishing}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                  >
                    {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                    {isPublishing ? 'Publishing...' : 'Publish to WordPress'}
                  </button>

                  <button 
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blocks, null, 2));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href",     dataStr);
                      downloadAnchorNode.setAttribute("download", "page-structure.json");
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-md border bg-background py-3 text-sm font-bold hover:bg-muted transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Export JSON
                  </button>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(blocks, null, 2));
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-md border bg-background py-3 text-sm font-bold hover:bg-muted transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-muted/30">
          <button className="w-full flex items-center justify-center gap-2 rounded-md border bg-background py-3 text-sm font-bold hover:bg-muted transition-colors">
            <Save className="h-4 w-4" />
            Save Project
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className={cn(
        "flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth",
        mobileTab === 'chat' ? "hidden md:block" : "block"
      )} onClick={() => setSelectedBlock(null)}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Visual Canvas</h1>
              <p className="text-sm text-muted-foreground">Drag to reorder, click to edit.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AuthButton />
              <button 
                onClick={async () => {
                  const name = prompt('Enter project name:');
                  if (name) await saveProject(name);
                }}
                className="flex items-center gap-2 rounded-md bg-background border px-3 py-2 text-xs font-medium hover:bg-muted"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="flex items-center gap-2 rounded-md bg-background border px-3 py-2 text-xs font-medium hover:bg-muted"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>
              <button 
                onClick={() => setBlocks([])}
                className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-[10px] font-bold text-destructive hover:bg-destructive hover:text-white transition-all"
              >
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
              <button 
                onClick={() => setIsPreview(true)}
                className="flex items-center gap-2 rounded-md bg-background border px-3 py-2 text-xs font-medium hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90">
                Publish
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <AiGeneratingEffect isGenerating={isGenerating} type={aiAnimation} speed={aiAnimationSpeed}>
                <div 
                  className="min-h-[80vh] rounded-md border-4 border-dashed border-muted-foreground/10 bg-background p-8 shadow-2xl transition-all"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const svg = e.dataTransfer.getData('icon-svg');
                    const name = e.dataTransfer.getData('icon-name');
                    if (svg && name) {
                      const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
                      addBlock('image', { src: dataUrl, alt: name });
                    }
                  }}
                >
                  {blocks.length === 0 ? (
                    <div className="flex h-[60vh] flex-col items-center justify-center text-center text-muted-foreground">
                      <Plus className="mb-4 h-16 w-16 opacity-10" />
                      <p className="text-xl font-medium">Your canvas is empty</p>
                      <p className="mt-2">Drag components from the sidebar or use AI to start building.</p>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <SortableBlock 
                        key={block.id} 
                        block={block} 
                        onAiEdit={(id) => {
                          setEditingBlockId(id);
                          setActiveTab('ai');
                        }}
                      />
                    ))
                  )}
                </div>
              </AiGeneratingEffect>
            </SortableContext>
          </DndContext>
        </div>
      </main>
    </div>
  );
}
