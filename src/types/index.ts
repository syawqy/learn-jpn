// Core Data Types for the Japanese Learning App

/**
 * A single vocabulary item extracted from a sentence.
 */
export interface VocabItem {
    word: string;
    reading: string;
    meaning: string;
    type: string;
}

/**
 * A sentence entry from the source data.
 */
export interface SentenceEntry {
    id: string; // Generated stable ID
    japanese: string;
    romaji: string;
    english: string;
    grammar: {
        summary: string;
    };
    vocabulary: VocabItem[];
    jlpt_level: string;
}

/**
 * A Lesson groups multiple sentences together.
 */
export interface Lesson {
    id: string;
    title: string;
    jlpt_level: string;
    sentences: SentenceEntry[];
}

/**
 * A Card is used in the SRS system.
 * It can represent a sentence or a vocabulary item.
 */
export interface Card {
    id: string; // Stable hash
    lessonId: string;
    front: string; // Japanese text
    back: string; // Reading + Meaning
    type: 'sentence' | 'vocab';
}

/**
 * SRS state for a card.
 */
export interface SRSCard extends Card {
    interval: number; // Days until next review
    ease: number; // Ease factor (default 2.5)
    due: number; // Timestamp (ms) when the card is next due
    repetitions: number; // Number of times reviewed
}

/**
 * User settings and progress.
 */
export interface UserSettings {
    dailyGoal: number;
    darkMode: boolean;
}

/**
 * The dataset stored in IndexedDB after processing.
 */
export interface AppDataset {
    version: string;
    lessons: Lesson[];
}
