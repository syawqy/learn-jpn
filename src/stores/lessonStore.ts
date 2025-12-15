import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Lesson, AppDataset } from '@/types';
import { getDataset, saveDataset, getDatasetVersion } from '@/services/db';

export const useLessonStore = defineStore('lessons', () => {
    const lessons = ref<Lesson[]>([]);
    const dataVersion = ref<string | null>(null);
    const isLoading = ref(false);
    const isReady = ref(false);

    // JLPT level order (easiest to hardest)
    const JLPT_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1', 'Other'];

    // Grouped by JLPT level, sorted correctly
    const lessonsByLevel = computed(() => {
        const grouped: Record<string, Lesson[]> = {};
        for (const lesson of lessons.value) {
            const level = lesson.jlpt_level || 'Other';
            if (!grouped[level]) {
                grouped[level] = [];
            }
            grouped[level].push(lesson);
        }

        // Return as sorted entries
        const sorted: Record<string, Lesson[]> = {};
        for (const level of JLPT_ORDER) {
            if (grouped[level]) {
                sorted[level] = grouped[level];
            }
        }
        // Add any levels not in the predefined order
        for (const level of Object.keys(grouped)) {
            if (!sorted[level]) {
                sorted[level] = grouped[level]!;
            }
        }
        return sorted;
    });


    const totalLessons = computed(() => lessons.value.length);

    /**
     * Load lessons from IndexedDB.
     */
    async function load(): Promise<void> {
        isLoading.value = true;
        try {
            const dataset = await getDataset();
            if (dataset) {
                lessons.value = dataset.lessons;
                dataVersion.value = dataset.version;
                isReady.value = true;
            }
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Initialize dataset from remote if needed.
     */
    async function initDataset(): Promise<void> {
        isLoading.value = true;
        try {
            // Check remote version
            const versionRes = await fetch('/data/version.json');
            const remoteVersion = await versionRes.json();

            const localVersion = await getDatasetVersion();

            if (localVersion !== remoteVersion.version) {
                // Fetch and store new dataset
                const dataRes = await fetch('/data/lessons.json');
                const data: AppDataset = await dataRes.json();

                await saveDataset(data);
                lessons.value = data.lessons;
                dataVersion.value = data.version;
            } else {
                // Load from local
                await load();
            }
            isReady.value = true;
        } catch (error) {
            console.error('Failed to initialize dataset:', error);
            // Try to load from local as fallback
            await load();
        } finally {
            isLoading.value = false;
        }
    }

    function getLessonById(id: string): Lesson | undefined {
        return lessons.value.find((l) => l.id === id);
    }

    return {
        lessons,
        lessonsByLevel,
        totalLessons,
        dataVersion,
        isLoading,
        isReady,
        load,
        initDataset,
        getLessonById,
    };
});
