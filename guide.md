# User Flow, Gap Analysis, and Technical Implementation (Client‑Side Static App)

This document is based **strictly on the provided project plan** and expands it into:

1. **Complete user flow (end‑to‑end)**
2. **Gap / missing steps analysis** (functional + technical)
3. **Completed technical implementation doc**, adjusted for **Netlify static export + 100% client‑side execution**

---

## 1. User Flow (End‑to‑End)

### 1.1 First‑Time User Flow

**Entry**

* User opens app URL
* App shell loads instantly (static assets)

**Initialization**

1. App bootstraps (`main.ts`)
2. Pinia store initializes
3. `initDataset()` is called

   * Fetch `/data/version.json`
   * Compare with `localStorage.data_version`
   * If mismatch or missing:

     * Fetch `/data/lessons.lz.json`
     * Decompress in browser
     * Store full dataset in IndexedDB

**Result**

* Dataset available offline
* User state initialized (empty SRS, settings default)

**Home Screen**

* Shows:

  * Welcome message
  * Total lessons
  * Review due count (0 initially)
  * CTA: “Start Learning”

---

### 1.2 Lesson Discovery Flow

1. User navigates to **Lessons List** (`/lessons`)
2. App:

   * Loads lesson metadata only (id, title, tags)
   * Does NOT load lesson content yet
3. User selects a lesson

---

### 1.3 Lesson Study Flow

1. User opens `/lesson/:id`
2. App:

   * Pulls lesson data from IndexedDB
   * Renders vocabulary / grammar / examples
3. User:

   * Reads content
   * Optionally marks items as favorite
   * Optionally adds notes
4. User taps **Add to Review** (implicit or automatic)

**Result**

* Lesson cards are added to SRS queue
* Initial SRS state created per card

---

### 1.4 Review (SRS) Flow

1. User opens `/review`
2. App queries SRS store:

   * Filters cards where `due <= now`
3. Review loop:

   * Show prompt (JP → EN or EN → JP)
   * User answers
   * User self‑grades (0–5)
   * `scheduleCard()` updates interval, ease, due
4. Card saved to IndexedDB
5. Loop continues until queue empty

**Exit State**

* Review complete
* Home screen updates review count

---

### 1.5 Returning User Flow

1. App loads
2. Dataset version matches
3. No network fetch needed
4. Home screen shows:

   * Due reviews
   * Continue lesson CTA

---

### 1.6 Import / Export Flow

**Export**

1. User opens `/settings`
2. Clicks Export
3. App:

   * Serializes user data
   * Downloads JSON or Base64 file

**Import**

1. User uploads file
2. App validates schema + version
3. Merge or overwrite confirmation
4. Save to IndexedDB

---

## 2. Missing / Underspecified Steps (Gap Analysis)

### 2.1 Critical Functional Gaps

#### ❌ No Explicit App Bootstrap Sequence

Missing:

* Where `initDataset()` is called
* App‑level loading / blocking UI

**Required**:

* Global `AppInitializer` logic
* Loading + error fallback states

---

#### ❌ No Dataset Schema Definition

Missing:

* Lesson JSON schema
* Card schema
* SRS state schema

**Risk**:

* Import/export breakage
* Version migration impossible

---

#### ❌ No SRS Queue Builder

You have:

* `scheduleCard()`

Missing:

* Function to build due queue
* Sorting logic (due asc, priority)

---

#### ❌ No Lesson → Card Mapping

Missing:

* How lesson content becomes flashcards
* Card ID strategy (stable IDs)

---

#### ❌ No Migration Strategy

Dataset versioning exists, but:

* User progress migration not defined
* Breaking dataset changes will corrupt state

---

### 2.2 UX / Product Gaps

* No empty state handling
* No error recovery UI (fetch fail, corrupt DB)
* No first‑time onboarding hints
* No progress indicators per lesson

---

### 2.3 Static Hosting / Netlify‑Specific Gaps

* No Netlify config
* No SPA fallback (`_redirects`)
* No build output config

---

## 3. Completed Technical Implementation (Client‑Side Only)

### 3.1 App Bootstrap Flow (REQUIRED)

**`main.ts`**

```ts
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

await useLessonStore().load();
await useUserStore().load();

app.use(router);
app.mount('#app');
```

Add global loading state before mount.

---

### 3.2 Dataset & Card Schema (REQUIRED)

```ts
Lesson {
  id: string
  title: string
  vocab: Card[]
  grammar: Card[]
}

Card {
  id: string          // stable hash
  front: string
  back: string
  type: 'vocab' | 'grammar'
}

SRSCard extends Card {
  interval: number
  ease: number
  due: number
}
```

---

### 3.3 SRS Queue Builder

```ts
function getDueCards(cards) {
  return cards
    .filter(c => c.due <= Date.now())
    .sort((a, b) => a.due - b.due);
}
```

---

### 3.4 Lesson → Card Initialization

```ts
function initCard(card) {
  return {
    ...card,
    interval: 1,
    ease: 2.5,
    due: Date.now()
  };
}
```

Call when first encountered.

---

### 3.5 IndexedDB Stores (Expanded)

```ts
db.createObjectStore('dataset');
db.createObjectStore('srs');
db.createObjectStore('notes');
db.createObjectStore('settings');
```

---

### 3.6 Import / Export Validation

```ts
function validateImport(data) {
  return data.version && data.srs && data.settings;
}
```

Add version compatibility checks.

---

### 3.7 Netlify Deployment (Static SPA)

**`vite.config.ts`**

```ts
export default defineConfig({
  base: '/',
  build: { outDir: 'dist' }
});
```

**`public/_redirects`**

```
/*    /index.html   200
```

---

### 3.8 Offline‑First Guarantees

* Dataset stored in IndexedDB
* App shell cached via PWA
* No server calls after first load
* All logic runs in browser

---

## 4. Final Status Summary

### What You Already Have

* Solid local‑first architecture
* Correct dataset versioning approach
* Netlify‑compatible static design

### What Must Be Added Before Build

* App bootstrap orchestration
* Schema definitions
* Lesson → card mapping logic
* SRS queue builder
* Migration + import validation

---