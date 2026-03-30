import { Block } from '../lib/builderStore';

export interface WordPressConfig {
  url: string;
  username: string;
  appPassword: string;
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
        return `<div class="prose max-w-none mb-8">${props.content}</div>`;
      case 'button':
        const variantClass = props.variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800';
        return `<button class="${variantClass} px-6 py-2 rounded-md font-medium mb-8">${props.label}</button>`;
      case 'image':
        return `<img src="${props.src}" alt="${props.alt}" class="w-full rounded-lg mb-8" />`;
      case 'card':
        return `
          <div class="p-6 border rounded-lg shadow-sm mb-8">
            <h3 class="text-xl font-bold mb-2">${props.title}</h3>
            <p class="text-slate-600">${props.content}</p>
          </div>
        `;
      case 'pricing':
        return `
          <div class="p-8 border-2 border-blue-600 rounded-xl text-center mb-8">
            <h3 class="text-2xl font-bold mb-2">${props.title}</h3>
            <div class="text-4xl font-bold mb-4">${props.price}</div>
            <p class="text-slate-500 mb-6">${props.features}</p>
            <button class="w-full bg-blue-600 text-white py-3 rounded-md font-bold">Choose Plan</button>
          </div>
        `;
      case 'contact':
        return `
          <div class="p-10 bg-slate-900 text-white rounded-xl text-center mb-8">
            <h2 class="text-3xl font-bold mb-4">${props.title}</h2>
            <p class="mb-6">Reach out to us at <a href="mailto:${props.email}" class="text-blue-400 underline">${props.email}</a></p>
          </div>
        `;
      case 'features':
        const featuresHtml = props.features.map((f: any) => `
          <div class="p-6 bg-white border rounded-lg">
            <h4 class="font-bold mb-2">${f.title}</h4>
            <p class="text-sm text-slate-600">${f.description}</p>
          </div>
        `).join('');
        return `
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-center mb-8">${props.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${featuresHtml}
            </div>
          </div>
        `;
      default:
        return '';
    }
  }).join('\n');
}

/**
 * Publishes the current page to WordPress via REST API.
 */
export async function publishToWordPress(blocks: Block[], config: WordPressConfig) {
  const { url, username, appPassword } = config;
  
  if (!url || !username || !appPassword) {
    throw new Error('Missing WordPress configuration. Please check your settings.');
  }

  // Clean URL (ensure no trailing slash)
  const baseUrl = url.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/wp-json/wp/v2/pages`;
  
  const content = blocksToHtml(blocks);
  
  // Basic Auth header (Base64 encoded username:appPassword)
  const authHeader = btoa(`${username}:${appPassword}`);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authHeader}`
    },
    body: JSON.stringify({
      title: 'AI Generated Page',
      content: content,
      status: 'publish' // Create as published page
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `WordPress API error: ${response.statusText}`);
  }

  return await response.json();
}
