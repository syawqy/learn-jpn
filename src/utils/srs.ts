import type { SRSCard, Card } from '@/types';

/**
 * SM-2 Algorithm Implementation.
 * Calculates the next review date based on the user's grade.
 *
 * @param card - The SRS card to schedule.
 * @param grade - User's self-assessment (0-5).
 *   - 0: Complete blackout
 *   - 1: Incorrect, but remembered upon seeing answer
 *   - 2: Incorrect, but easy recall
 *   - 3: Correct with serious difficulty
 *   - 4: Correct with hesitation
 *   - 5: Perfect response
 * @returns Updated SRSCard with new interval, ease, and due date.
 */
export function scheduleCard(card: SRSCard, grade: number): SRSCard {
    // Clamp grade between 0-5
    grade = Math.max(0, Math.min(5, grade));

    let { interval, ease, repetitions } = card;

    if (grade < 3) {
        // Failed: reset repetitions
        repetitions = 0;
        interval = 1;
    } else {
        // Passed
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * ease);
        }
        repetitions += 1;
    }

    // Update ease factor
    ease = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    ease = Math.max(1.3, ease); // Minimum ease

    // Calculate due date
    const due = Date.now() + interval * 24 * 60 * 60 * 1000;

    return {
        ...card,
        interval,
        ease,
        due,
        repetitions,
    };
}

/**
 * Initialize a new card for SRS.
 * Sets default SRS values.
 */
export function initSRSCard(card: Card): SRSCard {
    return {
        ...card,
        interval: 0,
        ease: 2.5,
        due: Date.now(), // Due immediately for first review
        repetitions: 0,
    };
}

/**
 * Generate a stable ID for a card based on its content.
 */
export function generateCardId(lessonId: string, front: string, type: string): string {
    // Simple hash function for stable IDs
    const str = `${lessonId}:${type}:${front}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `card_${Math.abs(hash).toString(16)}`;
}
