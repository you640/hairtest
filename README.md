# AI Visual Page Builder 🚀

Moderný, vysoko výkonný vizuálny editor webových stránok poháňaný umelou inteligenciou (Gemini API). Tento nástroj umožňuje používateľom vytvárať, upravovať a reusporadúvať bloky obsahu pomocou intuitívneho drag-and-drop rozhrania a inteligentných AI príkazov.

## ✨ Kľúčové vlastnosti

- **AI Page Generation:** Generovanie celých sekcií alebo úprava existujúcich pomocou prirodzeného jazyka.
- **Antigravity AI Animácie:** Tri unikátne vizuálne efekty pri generovaní obsahu (`Zero-G`, `Quantum Singularity`, `Magnetic Levitation`).
- **Drag-and-Drop:** Plynulé reusporadúvanie blokov pomocou knižnice `@dnd-kit`.
- **Moderný UI Design:** 
  - **Glass Mirror Dark Mode:** Špeciálne vyladený tmavý režim s efektom "zapečateného skla" a jemnými gradientmi.
  - **6px Border Radius:** Konzistentné zaoblenie okrajov pre technický a precízny vzhľad.
- **Responzívne Bloky:** Hero sekcie, Textové bloky, Tlačidlá, Obrázky, Karty, Cenníky, Kontakty a Vlastnosti (Features).
- **Preview Mode:** Možnosť okamžitého náhľadu výslednej stránky bez editačných prvkov.

## 🛠 Technologický zásobník

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animácie:** Framer Motion (`motion/react`)
- **State Management:** Zustand (s perzistenciou do LocalStorage)
- **AI Engine:** Google Gemini SDK (`@google/genai`)
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`

## 📂 Štruktúra projektu

- `src/components/builder/`: Hlavné komponenty editora.
  - `VisualBuilder.tsx`: Jadro aplikácie, sidebar a plátno.
  - `Blocks.tsx`: Definície vizuálnych blokov.
  - `SortableBlock.tsx`: Obal pre bloky s podporou drag-and-drop.
  - `AiGeneratingEffect.tsx`: Vizuálne efekty pre AI generovanie.
- `src/lib/`: Logika a úložiská.
  - `builderStore.ts`: Stav editora (bloky, animácie, nastavenia).
  - `store.ts`: Globálne nastavenia aplikácie (téma).
- `src/services/`: Integrácia s externými API.
  - `gemini.ts`: Komunikácia s Google Gemini.

## 🚀 Inštalácia a spustenie

1. **Klonovanie repozitára:**
   ```bash
   git clone <url-repozitara>
   ```

2. **Inštalácia závislostí:**
   ```bash
   npm install
   ```

3. **Nastavenie environmentálnych premenných:**
   Vytvorte súbor `.env` a pridajte svoj API kľúč:
   ```env
   GEMINI_API_KEY=vas_api_kluc
   ```

4. **Spustenie vývojového servera:**
   ```bash
   npm run dev
   ```

## 📖 Dokumentácia blokov

Každý blok v editore má svoje špecifické vlastnosti (props):

| Typ bloku | Vlastnosti (Props) |
| :--- | :--- |
| **Hero** | `title`, `subtitle`, `cta` |
| **Features** | `title`, `features` (pole objektov s `title` a `description`) |
| **Text** | `content` |
| **Image** | `src`, `alt` |
| **Pricing** | `title`, `price`, `features` |
| **Card** | `title`, `content` |
| **Contact** | `title`, `email` |
| **Button** | `label`, `variant` ('primary' \| 'secondary') |

---

## 🚀 Nasadenie na Vercel

Tento projekt je optimalizovaný pre **Vercel**. Pre úspešné nasadenie postupujte takto:

1.  **Pripojte GitHub repozitár** k vášmu Vercel účtu.
2.  **Nastavte Environment Variables:** V nastaveniach projektu na Verceli pridajte:
    *   `GEMINI_API_KEY`: Váš Google Gemini API kľúč.
3.  **Build Settings:** Vercel automaticky deteguje Vite, ale uistite sa, že:
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
4.  **SPA Routing:** Súbor `vercel.json` je už v projekte a zabezpečuje správne smerovanie (rewrites) pre React router.

---

## 🔌 WordPress Production Bridge (REST API)

Pre bezpečné a robustné prepojenie buildera s vaším WordPress webom na ostrej doméne postupujte podľa tohto návodu.

### 1. Inštalácia Bridge Pluginu
Vytvorte súbor `ai-builder-bridge.php` v adresári `/wp-content/plugins/` vášho WordPressu a vložte doň nasledujúci kód. Potom plugin aktivujte v administrácii.

```php
<?php
/**
 * Plugin Name: AI Builder Production Bridge
 * Description: Robustné REST API prepojenie pre AI Visual Builder.
 * Version: 1.0
 */

add_action('rest_api_init', function () {
    register_rest_route('ai-builder/v1', '/publish', [
        'methods' => 'POST',
        'callback' => 'handle_builder_publish',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ]);
});

function handle_builder_publish($request) {
    $params = $request->get_json_params();
    $title = $params['title'] ?? 'AI Generated Page';
    $content = $params['content'] ?? '';
    $meta = $params['meta'] ?? [];

    // Vytvorenie stránky
    $post_id = wp_insert_post([
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_type'    => 'page',
    ]);

    if (is_wp_error($post_id)) {
        return new WP_Error('save_failed', 'Nepodarilo sa uložiť stránku', ['status' => 500]);
    }

    // Uloženie meta dát (napr. pre SEO alebo tému)
    update_post_meta($post_id, '_ai_builder_data', json_encode($meta));

    return [
        'success' => true,
        'post_id' => $post_id,
        'url' => get_permalink($post_id)
    ];
}

// Povolenie Tailwind CSS cez CDN pre publikované stránky (voliteľné)
add_action('wp_head', function() {
    if (get_post_meta(get_the_ID(), '_ai_builder_data', true)) {
        echo '<script src="https://cdn.tailwindcss.com"></script>';
    }
});
```

### 2. Nastavenie na ostrej doméne
Aby prepojenie fungovalo bezpečne:

1.  **Application Passwords:** Vo WordPress (Používatelia -> Profil) vygenerujte "Application Password". Toto heslo použite v nastaveniach buildera namiesto vášho hlavného hesla.
2.  **SSL (HTTPS):** Váš WordPress musí bežať na HTTPS, inak REST API odmietne autentifikáciu.
3.  **CORS povolenie:** Ak builder hlási chybu CORS, pridajte do `functions.php` vašej témy:
    ```php
    header("Access-Control-Allow-Origin: https://vas-builder.vercel.app");
    ```

---
Vytvorené s ❤️ pomocou AI Visual Builder.
