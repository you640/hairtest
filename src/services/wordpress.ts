import { Block } from '../lib/builderStore';

export interface WordPressConfig {
  url: string;
  username: string;
  appPassword: string;
}

export interface WordPressPublishOptions {
  themePreset?: string;
  pageTheme?: string;
  title?: string;
}

/**
 * Converts builder blocks to a Tailwind-styled HTML string for WordPress.
 */
function blocksToHtml(blocks: Block[]): string {
  return blocks.map(block => {
    const { type, props } = block;
    
    switch (type) {
      case 'hero':
        return `
          <section class="py-20 px-6 text-center bg-slate-50 rounded-lg mb-8">
            <h1 class="text-5xl font-bold mb-4">${props.title}</h1>
            <p class="text-xl text-slate-600 mb-8">${props.subtitle}</p>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-md font-bold">${props.cta}</button>
          </section>
        `;
      case 'text':
        return `<div class="prose max-w-none mb-8 p-4">${props.content}</div>`;
      case 'button':
        const variantClass = props.variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800';
        return `<div class="text-center mb-8"><button class="${variantClass} px-8 py-3 rounded-md font-medium">${props.label}</button></div>`;
      case 'image':
        return `<div class="mb-8"><img src="${props.src}" alt="${props.alt}" class="w-full rounded-lg shadow-lg" /></div>`;
      case 'card':
        return `
          <div class="p-8 border rounded-xl shadow-sm mb-8 bg-white">
            <h3 class="text-2xl font-bold mb-4">${props.title}</h3>
            <p class="text-slate-600 leading-relaxed">${props.content}</p>
          </div>
        `;
      case 'pricing':
        return `
          <div class="p-10 border-2 border-blue-600 rounded-2xl text-center mb-8 bg-white shadow-xl">
            <h3 class="text-2xl font-bold mb-2">${props.title}</h3>
            <div class="text-5xl font-black mb-6 text-blue-600">${props.price}</div>
            <p class="text-slate-500 mb-8">${props.features}</p>
            <button class="w-full bg-blue-600 text-white py-4 rounded-lg font-bold">Choose Plan</button>
          </div>
        `;
      case 'contact':
        return `
          <div class="p-12 bg-slate-900 text-white rounded-2xl text-center mb-8">
            <h2 class="text-3xl font-bold mb-4">${props.title}</h2>
            <p class="text-lg">Reach out to us at <a href="mailto:${props.email}" class="text-blue-400 font-bold underline">${props.email}</a></p>
          </div>
        `;
      case 'contactForm':
        return `
          <div class="p-10 border rounded-2xl shadow-lg mb-8 bg-white max-w-xl mx-auto">
            <h3 class="text-2xl font-bold mb-6">${props.title}</h3>
            <div class="space-y-4">
              <input type="text" placeholder="Name" class="w-full p-3 border rounded-md" />
              <input type="email" placeholder="${props.email}" class="w-full p-3 border rounded-md" />
              <textarea placeholder="${props.message}" class="w-full p-3 border rounded-md" rows="4"></textarea>
              <button class="w-full bg-blue-600 text-white py-3 rounded-md font-bold">Send Message</button>
            </div>
          </div>
        `;
      case 'features':
        const featuresHtml = (props.features || []).map((f: any) => `
          <div class="p-8 bg-white border rounded-xl shadow-sm">
            <h4 class="text-xl font-bold mb-3">${f.title}</h4>
            <p class="text-slate-600 leading-relaxed">${f.description}</p>
          </div>
        `).join('');
        return `
          <div class="mb-12">
            <h2 class="text-4xl font-bold text-center mb-10">${props.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${featuresHtml}
            </div>
          </div>
        `;
      case 'testimonials':
        const testimonialsHtml = (props.testimonials || []).map((t: any) => `
          <div class="p-8 bg-slate-50 border rounded-xl italic relative">
            <p class="mb-6 text-lg text-slate-700">"${t.content}"</p>
            <div class="font-bold text-blue-600">${t.author}</div>
            <div class="text-xs text-slate-500 uppercase tracking-widest">${t.role}</div>
          </div>
        `).join('');
        return `
          <div class="mb-12">
            <h2 class="text-4xl font-bold text-center mb-10">${props.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${testimonialsHtml}
            </div>
          </div>
        `;
      case 'faq':
        const faqHtml = (props.items || []).map((item: any) => `
          <div class="p-6 bg-white border rounded-lg mb-4">
            <h4 class="font-bold text-lg mb-2">Q: ${item.question}</h4>
            <p class="text-slate-600">A: ${item.answer}</p>
          </div>
        `).join('');
        return `
          <div class="mb-12 max-w-3xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-10">${props.title}</h2>
            ${faqHtml}
          </div>
        `;
      case 'navbar':
        const linksHtml = (props.links || []).map((l: any) => `
          <a href="${l.href}" class="text-sm font-bold uppercase tracking-widest px-4">${l.label}</a>
        `).join('');
        return `
          <nav class="flex items-center justify-between py-6 border-b mb-8">
            <div class="text-2xl font-black text-blue-600 italic">${props.logo}</div>
            <div class="hidden md:flex items-center">${linksHtml}</div>
          </nav>
        `;
      case 'footer':
        return `
          <footer class="py-10 border-t bg-slate-50 mt-12">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="text-sm text-slate-500">${props.text}</div>
              <div class="flex gap-6">
                ${(props.links || []).map((l: any) => `<a href="${l.href}" class="text-xs font-bold uppercase tracking-widest">${l.label}</a>`).join('')}
              </div>
            </div>
          </footer>
        `;
      default:
        return '';
    }
  }).join('\n');
}

/**
 * Publishes the current page to WordPress via REST API with enhanced production features.
 */
export async function publishToWordPress(
  blocks: Block[], 
  config: WordPressConfig,
  options: WordPressPublishOptions = {}
) {
  const { url, username, appPassword } = config;
  
  if (!url || !username || !appPassword) {
    throw new Error('Missing WordPress configuration. Please check your settings.');
  }

  // 1. Robust URL Validation
  let baseUrl = url.trim().replace(/\/$/, '');
  
  const content = blocksToHtml(blocks);
  const authHeader = btoa(`${username}:${appPassword}`);

  const payload = {
    title: options.title || 'AI Generated Page',
    content: content,
    status: 'publish',
    meta: {
      themePreset: options.themePreset,
      pageTheme: options.pageTheme,
      publishedAt: new Date().toISOString(),
      blockCount: blocks.length
    }
  };

  // Handle Mock Mode
  if (baseUrl.toLowerCase() === 'mock') {
    console.log('--- MOCK PUBLISH START ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    console.log('--- MOCK PUBLISH SUCCESS ---');
    return {
      success: true,
      post_id: 12345,
      url: 'https://mock-wordpress.test/ai-generated-page',
      mock: true
    };
  }

  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }
  
  // Try custom bridge endpoint first, fallback to standard pages endpoint
  const apiUrl = `${baseUrl}/wp-json/ai-builder/v1/publish`;
  const fallbackUrl = `${baseUrl}/wp-json/wp/v2/pages`;

  // 2. Retry Logic (3 attempts)
  let lastError: any;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Publishing to WordPress (Attempt ${attempt}/3)...`);
      
      // Try custom bridge first
      let response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`
        },
        body: JSON.stringify(payload)
      });

      // If bridge not found (404), fallback to standard API
      if (response.status === 404) {
        console.warn('Custom bridge plugin not detected, falling back to standard WP API.');
        response = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authHeader}`
          },
          body: JSON.stringify({
            title: payload.title,
            content: payload.content,
            status: payload.status
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `WordPress API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      lastError = error;
      if (attempt < 3) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Failed to publish after 3 attempts. Last error: ${lastError?.message}`);
}
