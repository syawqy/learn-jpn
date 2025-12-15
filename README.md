# 🗻 LearnJPN

A client-side, offline-first Japanese learning app built with Vue 3 + TypeScript. Learn Japanese through sentences with integrated vocabulary, grammar explanations, and a spaced repetition system (SRS) for effective memorization.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)

## ✨ Features

- **231 Lessons** - Grouped by JLPT level (N5 → N1), 20 sentences per lesson
- **Sentence-Based Learning** - Learn vocabulary and grammar in context
- **Spaced Repetition (SRS)** - SM-2 algorithm for optimal review timing
- **Offline-First** - All data stored in IndexedDB, works without internet
- **Dark/Light Mode** - Toggle between themes
- **Import/Export** - Backup and restore your progress
- **Static Deployment** - No backend required, deploy to Netlify/Vercel

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   └── NavBar.vue
├── views/            # Page components
│   ├── HomeView.vue
│   ├── LessonListView.vue
│   ├── LessonView.vue
│   ├── ReviewView.vue
│   └── SettingsView.vue
├── stores/           # Pinia state management
│   ├── lessonStore.ts
│   ├── srsStore.ts
│   └── userStore.ts
├── services/
│   └── db.ts         # IndexedDB wrapper
├── utils/
│   └── srs.ts        # SM-2 algorithm
├── types/
│   └── index.ts      # TypeScript interfaces
└── router/
    └── index.ts      # Vue Router

scripts/
└── process_data.ts   # Data processing script

public/
├── data/
│   ├── lessons.json  # Processed lesson data
│   └── version.json  # Dataset version
└── _redirects        # Netlify SPA config
```

## 🔧 How It Works

### Data Flow

1. **Source Data**: `public/japanese_sentences.json` contains 4567 sentences with vocabulary and grammar
2. **Processing**: `scripts/process_data.ts` groups sentences into lessons by JLPT level
3. **Storage**: On first load, lessons are fetched and stored in IndexedDB
4. **Offline**: All subsequent loads use IndexedDB (no network needed)

### SRS Algorithm

Uses a modified SM-2 algorithm:
- **Grade 0-2**: Card failed, reset to 1-day interval
- **Grade 3-5**: Card passed, interval increases based on ease factor
- Ease factor adjusts based on performance (min 1.3)

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Vue 3 + Composition API | UI framework |
| TypeScript | Type safety |
| Pinia | State management |
| Vue Router | Client-side routing |
| idb | IndexedDB wrapper |
| Vite | Build tool |

## 📦 Data Processing

To regenerate lesson data from the source JSON:

```bash
npx tsx scripts/process_data.ts
```

This creates:
- `public/data/lessons.json` - Structured lessons
- `public/data/version.json` - Dataset version for cache invalidation

## 🌐 Deployment

### Netlify (Recommended)

1. Push to GitHub
2. Connect repo in Netlify
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

The `public/_redirects` file handles SPA routing.

### Manual Deploy

```bash
npm run build
# Upload dist/ folder to any static host
```

## 📱 User Flow

1. **Home** → View stats, start reviews or browse lessons
2. **Lessons** → Select a JLPT level and lesson
3. **Study** → Navigate through sentences, view vocab/grammar
4. **Add to Review** → Cards are added to SRS queue
5. **Review** → Flashcard interface with self-grading
6. **Settings** → Toggle dark mode, import/export progress

## 📄 License

MIT
