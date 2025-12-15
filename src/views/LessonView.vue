<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonStore, useSRSStore } from '@/stores';
import type { Lesson } from '@/types';

const route = useRoute();
const router = useRouter();
const lessonStore = useLessonStore();
const srsStore = useSRSStore();

const lesson = ref<Lesson | null>(null);
const currentIndex = ref(0);
const isAdding = ref(false);

const currentSentence = computed(() => {
  if (!lesson.value) return null;
  return lesson.value.sentences[currentIndex.value];
});

const progress = computed(() => {
  if (!lesson.value) return 0;
  return ((currentIndex.value + 1) / lesson.value.sentences.length) * 100;
});

const isLastSentence = computed(() => {
  if (!lesson.value) return true;
  return currentIndex.value >= lesson.value.sentences.length - 1;
});

onMounted(() => {
  const id = route.params.id as string;
  lesson.value = lessonStore.getLessonById(id) || null;
});

function nextSentence() {
  if (!isLastSentence.value) {
    currentIndex.value++;
  }
}

function prevSentence() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

async function addToReview() {
  if (!lesson.value) return;
  isAdding.value = true;
  await srsStore.addLessonToSRS(lesson.value);
  isAdding.value = false;
  router.push('/');
}
</script>

<template>
  <div class="lesson-view">
    <div v-if="!lesson" class="not-found">
      <p>Lesson not found.</p>
      <RouterLink to="/lessons">Back to Lessons</RouterLink>
    </div>

    <template v-else>
      <header class="lesson-header">
        <RouterLink to="/lessons" class="back-link">← Back</RouterLink>
        <h1>{{ lesson.title }}</h1>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ lesson.sentences.length }}</span>
      </header>

      <div v-if="currentSentence" class="sentence-card">
        <div class="japanese-text">{{ currentSentence.japanese }}</div>
        <div class="romaji-text">{{ currentSentence.romaji }}</div>
        <div class="english-text">{{ currentSentence.english }}</div>

        <div class="grammar-section">
          <h4>📖 Grammar</h4>
          <p>{{ currentSentence.grammar.summary }}</p>
        </div>

        <div class="vocab-section">
          <h4>📝 Vocabulary</h4>
          <div class="vocab-grid">
            <div v-for="(vocab, idx) in currentSentence.vocabulary" :key="idx" class="vocab-item">
              <span class="vocab-word">{{ vocab.word }}</span>
              <span class="vocab-reading">{{ vocab.reading }}</span>
              <span class="vocab-meaning">{{ vocab.meaning }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button
          class="nav-btn"
          :disabled="currentIndex === 0"
          @click="prevSentence"
        >
          ← Previous
        </button>

        <button
          v-if="!isLastSentence"
          class="nav-btn primary"
          @click="nextSentence"
        >
          Next →
        </button>

        <button
          v-else
          class="nav-btn primary"
          :disabled="isAdding"
          @click="addToReview"
        >
          {{ isAdding ? 'Adding...' : '✓ Add to Review' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.lesson-view {
  padding: 1rem 0;
}

.not-found {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
}

.lesson-header {
  margin-bottom: 1.5rem;
}

.back-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.back-link:hover {
  color: #e94560;
}

.lesson-header h1 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #e94560, #ff6b6b);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.sentence-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.japanese-text {
  font-size: 1.75rem;
  color: #fff;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.romaji-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
  font-style: italic;
}

.english-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
}

.grammar-section,
.vocab-section {
  margin-bottom: 1.5rem;
}

.grammar-section h4,
.vocab-section h4 {
  font-size: 1rem;
  color: #e94560;
  margin-bottom: 0.5rem;
}

.grammar-section p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
}

.vocab-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.vocab-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  min-width: 100px;
}

.vocab-word {
  font-size: 1rem;
  color: #fff;
  font-weight: 600;
}

.vocab-reading {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.vocab-meaning {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.navigation {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn.primary {
  background: linear-gradient(135deg, #e94560, #ff6b6b);
}

.nav-btn.primary:hover:not(:disabled) {
  box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
}
</style>
