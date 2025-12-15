import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SRSCard, Card, Lesson } from '@/types';
import { getAllSRSCards, saveSRSCard, getDueCards as getDueCardsFromDB } from '@/services/db';
import { scheduleCard, initSRSCard, generateCardId } from '@/utils/srs';

export const useSRSStore = defineStore('srs', () => {
    const cards = ref<SRSCard[]>([]);
    const reviewQueue = ref<SRSCard[]>([]);
    const currentIndex = ref(0);
    const isLoading = ref(false);

    const dueCount = computed(() => {
        const now = Date.now();
        return cards.value.filter((c) => c.due <= now).length;
    });

    const currentCard = computed(() => reviewQueue.value[currentIndex.value] || null);
    const remainingInSession = computed(() => reviewQueue.value.length - currentIndex.value);

    /**
     * Load all SRS cards from IndexedDB.
     */
    async function load(): Promise<void> {
        isLoading.value = true;
        try {
            cards.value = await getAllSRSCards();
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Start a review session with due cards.
     */
    async function startReviewSession(): Promise<void> {
        const dueCards = await getDueCardsFromDB();
        reviewQueue.value = dueCards.sort((a, b) => a.due - b.due);
        currentIndex.value = 0;
    }

    /**
     * Grade the current card and move to next.
     */
    async function gradeCurrentCard(grade: number): Promise<void> {
        const card = currentCard.value;
        if (!card) return;

        const updated = scheduleCard(card, grade);
        await saveSRSCard(updated);

        // Update local state
        const idx = cards.value.findIndex((c) => c.id === updated.id);
        if (idx !== -1) {
            cards.value[idx] = updated;
        }

        currentIndex.value++;
    }

    /**
     * Add cards from a lesson to the SRS system.
     */
    async function addLessonToSRS(lesson: Lesson): Promise<void> {
        const newCards: SRSCard[] = [];

        for (const sentence of lesson.sentences) {
            // Create sentence card
            const sentenceCardId = generateCardId(lesson.id, sentence.japanese, 'sentence');
            const existingSentence = cards.value.find((c) => c.id === sentenceCardId);

            if (!existingSentence) {
                const sentenceCard: Card = {
                    id: sentenceCardId,
                    lessonId: lesson.id,
                    front: sentence.japanese,
                    back: `${sentence.romaji}\n${sentence.english}`,
                    type: 'sentence',
                };
                const srsCard = initSRSCard(sentenceCard);
                newCards.push(srsCard);
            }

            // Create vocab cards
            for (const vocab of sentence.vocabulary) {
                const vocabCardId = generateCardId(lesson.id, vocab.word, 'vocab');
                const existingVocab = cards.value.find((c) => c.id === vocabCardId);

                if (!existingVocab) {
                    const vocabCard: Card = {
                        id: vocabCardId,
                        lessonId: lesson.id,
                        front: vocab.word,
                        back: `${vocab.reading}\n${vocab.meaning}`,
                        type: 'vocab',
                    };
                    const srsCard = initSRSCard(vocabCard);
                    newCards.push(srsCard);
                }
            }
        }

        // Save all new cards
        for (const card of newCards) {
            await saveSRSCard(card);
            cards.value.push(card);
        }
    }

    return {
        cards,
        reviewQueue,
        currentIndex,
        currentCard,
        remainingInSession,
        dueCount,
        isLoading,
        load,
        startReviewSession,
        gradeCurrentCard,
        addLessonToSRS,
    };
});
