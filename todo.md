# 🚀 Living Roadmap: AI PWA Builder (Antigravity Edition)

Tento dokument slúži ako dynamický plán vývoja nášho AI buildera. Naším cieľom je prekonať `lovable.dev` v kvalite, rýchlosti a flexibilite.

## 📍 Aktuálny Stav (Current Status)
- [x] **Core Builder:** Drag-and-drop systém s blokmi.
- [x] **AI Engine:** Generovanie obsahu cez Gemini 3.1.
- [x] **Vizuálny Polish:** Glass mirror efekt, hexagónové pozadie, 6px border-radius.
- [x] **Animácie:** 8+ typov AI animácií, plynulé vstupy blokov.
- [x] **WP Integrácia:** Publikovanie priamo do WordPress cez REST API.
- [x] **Theme Engine:** Light/Dark mode s perzistenciou.

---

## 🛠️ Fáza 1: Produkčná Pripravenosť (Q2 2026)
- [x] **PWA Support:**
    - [x] Generovanie `manifest.json`.
    - [x] Service Worker pre offline režim.
    - [ ] Ikony pre inštaláciu na plochu.
- [x] **Export Systém:**
    - [ ] Export do čistého HTML/Tailwind súboru.
    - [x] Export projektu ako JSON (pre neskorší import).
    - [x] "Copy to Clipboard" pre celý kód stránky.
- [x] **Nové Bloky:**
    - [x] `TestimonialsBlock` (Recenzie).
    - [x] `FAQBlock` (Často kladené otázky).
    - [x] `NavbarBlock` (Navigačné menu).
    - [x] `FooterBlock` (Pätička).

## 🧠 Fáza 2: AI & UX "Maximum" (Q3 2026)
- [x] **Iteratívne AI Úpravy:**
    - [x] "Uprav len tento blok" – selektívne generovanie.
    - [ ] AI návrhy na vylepšenie copywritingu.
- [x] **Figma-like UI:**
    - [ ] Floating panely pre nastavenia.
    - [x] Layer list (zoznam vrstiev/blokov).
    - [ ] Multi-select a hromadné úpravy.
- [ ] **Asset Management:**
    - [ ] AI generovanie SVG ikon na mieru.
    - [ ] Integrácia s Unsplash/Pexels API.

## 🌐 Fáza 3: Ekosystém & Škálovanie (Q4 2026)
- [ ] **Advanced Integrations:**
    - [ ] Supabase Auth & Database integrácia.
    - [ ] Stripe Checkout bloky.
- [ ] **Deployment:**
    - [ ] 1-click nasadenie na Vercel/Netlify.
    - [ ] Custom domain management.

---

## 📈 Strategické Metriky Úspechu
1. **Rýchlosť:** Generovanie stránky pod 10 sekúnd.
2. **Kvalita:** 100/100 Lighthouse score pre vygenerované PWA.
3. **Flexibilita:** Nulový "vendor lock-in" (čistý kód na export).

---

## 📝 Poznámky k implementácii
- Prioritizovať **shadcn/ui** štýl pre všetky nové komponenty.
- Udržiavať **glassmorphism** estetiku ako unikátny vizuálny podpis.
- Každý nový feature musí byť "AI-aware" (schopný byť ovládaný promptom).
