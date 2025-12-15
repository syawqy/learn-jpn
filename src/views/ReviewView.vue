<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSRSStore } from '@/stores';

const router = useRouter();
const srsStore = useSRSStore();

const showAnswer = ref(false);
const sessionStarted = ref(false);

onMounted(async () => {
  if (srsStore.dueCount === 0) {
    // No reviews due, redirect
    return;
  }
  await srsStore.startReviewSession();
  sessionStarted.value = true;
});

function reveal() {
  showAnswer.value = true;
}

async function grade(score: number) {
  await srsStore.gradeCurrentCard(score);
  showAnswer.value = false;

  if (srsStore.remainingInSession === 0) {
    // Session complete
    router.push('/');
  }
}
</script>

<template>
  <div class="review-view">
    <div v-if="srsStore.dueCount === 0 && !sessionStarted" class="empty-state">
      <div class="empty-icon">🎉</div>
      <h2>All caught up!</h2>
      <p>No reviews due right now. Come back later!</p>
      <RouterLink to="/" class="home-link">Back to Home</RouterLink>
    </div>

    <template v-else-if="srsStore.currentCard">
      <header class="review-header">
        <span class="counter">{{ srsStore.remainingInSession }} remaining</span>
        <span class="card-type">{{ srsStore.currentCard.type }}</span>
      </header>

      <div class="flashcard" @click="reveal">
        <div class="card-front">
          <span class="japanese">{{ srsStore.currentCard.front }}</span>
        </div>

        <div v-if="showAnswer" class="card-back">
          <span class="answer">{{ srsStore.currentCard.back }}</span>
        </div>

        <div v-else class="reveal-hint">
          Tap to reveal answer
        </div>
      </div>

      <div v-if="showAnswer" class="grade-buttons">
        <button class="grade-btn again" @click="grade(0)">
          Again
          <span class="grade-hint">&lt; 1 min</span>
        </button>
        <button class="grade-btn hard" @click="grade(3)">
          Hard
          <span class="grade-hint">≈ 1 day</span>
        </button>
        <button class="grade-btn good" @click="grade(4)">
          Good
          <span class="grade-hint">≈ {{ srsStore.currentCard.interval || 1 }} days</span>
        </button>
        <button class="grade-btn easy" @click="grade(5)">
          Easy
          <span class="grade-hint">≈ {{ Math.round((srsStore.currentCard.interval || 1) * 1.5) }} days</span>
        </button>
      </div>
    </template>

    <div v-else-if="sessionStarted" class="complete-state">
      <div class="complete-icon">✅</div>
      <h2>Session Complete!</h2>
      <RouterLink to="/" class="home-link">Back to Home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.review-view {
  padding: 1rem 0;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.empty-state,
.complete-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.empty-icon,
.complete-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2,
.complete-state h2 {
  color: #fff;
  margin-bottom: 0.5rem;
}

.home-link {
  margin-top: 1.5rem;
  color: #e94560;
  text-decoration: none;
  font-weight: 600;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.counter {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.card-type {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: capitalize;
}

.flashcard {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
}

.flashcard:hover {
  border-color: rgba(233, 69, 96, 0.3);
}

.card-front .japanese {
  font-size: 2rem;
  color: #fff;
  line-height: 1.5;
}

.card-back .answer {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: pre-line;
  line-height: 1.6;
}

.reveal-hint {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
}

.grade-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.grade-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 0.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.grade-hint {
  font-size: 0.7rem;
  font-weight: 400;
  opacity: 0.7;
}

.grade-btn.again {
  background: #dc3545;
  color: #fff;
}

.grade-btn.hard {
  background: #fd7e14;
  color: #fff;
}

.grade-btn.good {
  background: #28a745;
  color: #fff;
}

.grade-btn.easy {
  background: #17a2b8;
  color: #fff;
}

.grade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 500px) {
  .grade-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
