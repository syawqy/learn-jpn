<script setup lang="ts">
import { useLessonStore } from '@/stores';

const lessonStore = useLessonStore();
</script>

<template>
  <div class="lesson-list">
    <header class="page-header">
      <h1>Lessons</h1>
      <p class="subtitle">Choose a level to start learning</p>
    </header>

    <div v-if="lessonStore.isLoading" class="loading">
      Loading lessons...
    </div>

    <div v-else-if="lessonStore.totalLessons === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No lessons available yet.</p>
      <p class="hint">Make sure the data has been processed.</p>
    </div>

    <div v-else class="levels-container">
      <section
        v-for="(lessons, level) in lessonStore.lessonsByLevel"
        :key="level"
        class="level-section"
      >
        <h2 class="level-title">
          <span class="level-badge">{{ level }}</span>
          <span class="lesson-count">{{ lessons.length }} lessons</span>
        </h2>

        <div class="lessons-grid">
          <RouterLink
            v-for="lesson in lessons"
            :key="lesson.id"
            :to="`/lesson/${lesson.id}`"
            class="lesson-card"
          >
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <div class="lesson-meta">
              <span>{{ lesson.sentences.length }} sentences</span>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.lesson-list {
  padding: 1rem 0;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--text-secondary);
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hint {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.levels-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.level-section {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
}

.level-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.level-badge {
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
}

.lesson-count {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 400;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.lesson-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.lesson-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.lesson-title {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.lesson-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
