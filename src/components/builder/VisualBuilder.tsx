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
import { HeroBlock, TextBlock, ButtonBlock, ImageBlock, CardBlock, PricingBlock, ContactBlock, FeaturesBlock } from './Blocks';
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
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { generateContent } from '@/src/services/gemini';
import { publishToWordPress } from '@/src/services/wordpress';

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
    setWpConfig
  } = useBuilderStore();
  const { theme, setTheme } = useAppStore();
  const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'ai' | 'settings'>('add');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

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
              {block.type === 'hero' && <HeroBlock {...block.props} />}
              {block.type === 'text' && <TextBlock {...block.props} />}
              {block.type === 'button' && <ButtonBlock {...block.props} />}
              {block.type === 'image' && <ImageBlock {...block.props} />}
              {block.type === 'card' && <CardBlock {...block.props} />}
              {block.type === 'pricing' && <PricingBlock {...block.props} />}
              {block.type === 'contact' && <ContactBlock {...block.props} />}
              {block.type === 'features' && <FeaturesBlock {...block.props} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await generateContent(`
        You are an expert React UI builder AI. Your task is to generate or modify a JSON structure representing a webpage based on the user's request.
        
        Current page structure (JSON):
        ${JSON.stringify(blocks)}
        
        User request: "${aiPrompt}"
        
        AVAILABLE BLOCK TYPES AND REQUIRED PROPS:
        - hero: { title: string, subtitle: string, cta: string }
        - text: { content: string }
        - button: { label: string, variant: 'primary' | 'secondary' }
        - image: { src: string, alt: string }
        - card: { title: string, content: string }
        - pricing: { title: string, price: string, features: string }
        - contact: { title: string, email: string }
        - features: { title: string, features: Array<{ title: string, description: string }> }

        INSTRUCTIONS:
        1. Analyze the user's request. Do they want to CREATE a completely new page, ADD new blocks to the existing page, or MODIFY existing blocks?
        2. If creating a NEW page or ADDING blocks, return a JSON array of new block objects. Example:
           [
             { "type": "hero", "props": { "title": "Welcome", "subtitle": "Best app", "cta": "Start" } },
             { "type": "text", "props": { "content": "Our story..." } }
           ]
        3. If MODIFYING existing blocks, return a JSON object with an "update" key containing an array of changes. You must use the exact "id" from the current page structure. Example:
           {
             "update": [
               { "id": "existing-block-id-1", "props": { "title": "New Title" } }
             ]
           }
        4. If the user asks for a full page (e.g., "Create a landing page for a bakery"), generate a complete, logical sequence of blocks (Hero -> Text -> Cards -> Contact).
        5. Use realistic, high-quality placeholder text and image URLs (e.g., https://picsum.photos/seed/bakery/800/400).
        
        CRITICAL: Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or any conversational text. Just the raw JSON array or object.
      `);
      
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr);
      
      if (result.update) {
        result.update.forEach((u: any) => updateBlock(u.id, u.props));
      } else {
        const newBlocks = result.map((b: any) => ({ ...b, id: Math.random().toString(36).substr(2, 9) }));
        // If the user asked for a "full page" or "landing page", we might want to clear existing blocks.
        // For now, we append. If you want to replace, use setBlocks(newBlocks) instead.
        setBlocks([...blocks, ...newBlocks]);
      }
      setAiPrompt('');
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
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Left Sidebar: Component Library & AI */}
      <aside className="w-80 border-r bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('add')}
            className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors", activeTab === 'add' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Add
          </button>
          <button 
            onClick={() => setActiveTab('edit')}
            className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors", activeTab === 'edit' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Edit
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors", activeTab === 'ai' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            AI
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors", activeTab === 'settings' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
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
                { type: 'contact', icon: Layout, label: 'Contact' },
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
              {!selectedBlock ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Select a block on the canvas to edit its properties.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg capitalize">{selectedBlock.type} Settings</h3>
                  {Object.entries(selectedBlock.props).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{key}</label>
                      {typeof value === 'string' && key !== 'variant' ? (
                        <textarea
                          value={value as string}
                          onChange={(e) => updateBlock(selectedBlock.id, { [key]: e.target.value })}
                          className="w-full rounded-md border bg-background p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          rows={key === 'content' || key === 'subtitle' ? 4 : 1}
                        />
                      ) : key === 'variant' ? (
                        <select 
                          value={value}
                          onChange={(e) => updateBlock(selectedBlock.id, { [key]: e.target.value })}
                          className="w-full rounded-md border bg-background p-3 text-sm"
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                        </select>
                      ) : null}
                    </div>
                  ))}
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
                  Describe what you want to build or how to modify existing blocks.
                </p>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Add a pricing section, or change the hero title to 'Welcome to our site'..."
                className="w-full rounded-md border bg-background p-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                rows={6}
              />
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? <Wand2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isGenerating ? 'Generating...' : 'Apply with AI'}
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Builder Settings</h3>
              </div>
              
              <div className="space-y-4">
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
      <main className="flex-1 overflow-y-auto p-12 scroll-smooth" onClick={() => setSelectedBlock(null)}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Visual Canvas</h1>
              <p className="text-sm text-muted-foreground">Drag to reorder, click to edit.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsPreview(true)}
                className="flex items-center gap-2 rounded-md bg-background border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
                Preview
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
                <div className="min-h-[80vh] rounded-md border-4 border-dashed border-muted-foreground/10 bg-background p-8 shadow-2xl transition-all">
                  {blocks.length === 0 ? (
                    <div className="flex h-[60vh] flex-col items-center justify-center text-center text-muted-foreground">
                      <Plus className="mb-4 h-16 w-16 opacity-10" />
                      <p className="text-xl font-medium">Your canvas is empty</p>
                      <p className="mt-2">Drag components from the sidebar or use AI to start building.</p>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <SortableBlock key={block.id} block={block} />
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
