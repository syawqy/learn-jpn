import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppDataset, SRSCard, UserSettings } from '@/types';

interface LearnJpnDB extends DBSchema {
    dataset: {
        key: string;
        value: AppDataset;
    };
    srs: {
        key: string; // card id
        value: SRSCard;
        indexes: { 'by-due': number };
    };
    settings: {
        key: string;
        value: UserSettings;
    };
}

const DB_NAME = 'learn-jpn-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<LearnJpnDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<LearnJpnDB>> {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await openDB<LearnJpnDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Dataset store (static content)
            if (!db.objectStoreNames.contains('dataset')) {
                db.createObjectStore('dataset');
            }

            // SRS store (user progress)
            if (!db.objectStoreNames.contains('srs')) {
                const srsStore = db.createObjectStore('srs', { keyPath: 'id' });
                srsStore.createIndex('by-due', 'due');
            }

            // Settings store
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings');
            }
        },
    });

    return dbInstance;
}

// --- Dataset Operations ---

export async function getDatasetVersion(): Promise<string | undefined> {
    const db = await getDB();
    const dataset = await db.get('dataset', 'main');
    return dataset?.version;
}

export async function saveDataset(dataset: AppDataset): Promise<void> {
    const db = await getDB();
    await db.put('dataset', dataset, 'main');
}

export async function getDataset(): Promise<AppDataset | undefined> {
    const db = await getDB();
    return db.get('dataset', 'main');
}

// --- SRS Operations ---

export async function getSRSCard(id: string): Promise<SRSCard | undefined> {
    const db = await getDB();
    return db.get('srs', id);
}

export async function saveSRSCard(card: SRSCard): Promise<void> {
    const db = await getDB();
    await db.put('srs', card);
}

export async function getAllSRSCards(): Promise<SRSCard[]> {
    const db = await getDB();
    return db.getAll('srs');
}

export async function getDueCards(now: number = Date.now()): Promise<SRSCard[]> {
    const db = await getDB();
    const tx = db.transaction('srs', 'readonly');
    const index = tx.store.index('by-due');
    const range = IDBKeyRange.upperBound(now);
    return index.getAll(range);
}

// --- Settings Operations ---

export async function getSettings(): Promise<UserSettings | undefined> {
    const db = await getDB();
    return db.get('settings', 'user');
}

export async function saveSettings(settings: UserSettings): Promise<void> {
    const db = await getDB();
    await db.put('settings', settings, 'user');
}
