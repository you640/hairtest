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

## 🔌 WordPress Integration (REST API)

Tento projekt je pripravený na integráciu s WordPress. Pomocou REST API môžete exportovať vygenerovaný JSON kód priamo do WordPressu ako novú stránku alebo príspevok.

### Exportný formát
Aplikácia pracuje s JSON poľom blokov, ktoré je možné namapovať na:
1. **Gutenberg Bloky:** Konverzia JSON na HTML komentáre/bloky WordPressu.
2. **Custom Meta:** Uloženie celého JSONu do meta poľa a renderovanie pomocou vlastného pluginu.

---
Vytvorené s ❤️ pomocou AI Visual Builder.
