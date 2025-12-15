/**
 * Data Processing Script
 *
 * This script processes japanese_sentences.json into a lesson structure.
 * Run with: npx tsx scripts/process_data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawSentence {
    japanese: string;
    romaji: string;
    english: string;
    grammar: { summary: string };
    vocabulary: {
        word: string;
        reading: string;
        meaning: string;
        type: string;
    }[];
    jlpt_level: string;
}

interface SentenceEntry {
    id: string;
    japanese: string;
    romaji: string;
    english: string;
    grammar: { summary: string };
    vocabulary: {
        word: string;
        reading: string;
        meaning: string;
        type: string;
    }[];
    jlpt_level: string;
}

interface Lesson {
    id: string;
    title: string;
    jlpt_level: string;
    sentences: SentenceEntry[];
}

interface AppDataset {
    version: string;
    lessons: Lesson[];
}

function generateId(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

async function main() {
    const inputPath = path.join(__dirname, '../public/japanese_sentences.json');
    const outputDir = path.join(__dirname, '../public/data');
    const outputPath = path.join(outputDir, 'lessons.json');
    const versionPath = path.join(outputDir, 'version.json');

    console.log('Reading input file...');
    const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    const entries: RawSentence[] = rawData.entries;

    console.log(`Found ${entries.length} sentences`);

    // Group by JLPT level
    const byLevel: Record<string, RawSentence[]> = {};
    for (const entry of entries) {
        const level = entry.jlpt_level || 'Other';
        if (!byLevel[level]) {
            byLevel[level] = [];
        }
        byLevel[level].push(entry);
    }

    // Create lessons (20 sentences per lesson)
    const lessons: Lesson[] = [];
    const SENTENCES_PER_LESSON = 20;

    for (const [level, sentences] of Object.entries(byLevel)) {
        const chunks = chunkArray(sentences, SENTENCES_PER_LESSON);
        chunks.forEach((chunk, idx) => {
            const lessonId = `${level.toLowerCase()}_${idx + 1}`;
            const lesson: Lesson = {
                id: lessonId,
                title: `${level} - Lesson ${idx + 1}`,
                jlpt_level: level,
                sentences: chunk.map((s) => ({
                    ...s,
                    id: generateId(s.japanese),
                })),
            };
            lessons.push(lesson);
        });
    }

    console.log(`Created ${lessons.length} lessons`);

    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write dataset
    const dataset: AppDataset = {
        version: new Date().toISOString(),
        lessons,
    };

    fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
    console.log(`Written to ${outputPath}`);

    // Write version
    fs.writeFileSync(versionPath, JSON.stringify({ version: dataset.version }));
    console.log(`Version written to ${versionPath}`);

    console.log('Done!');
}

main().catch(console.error);
