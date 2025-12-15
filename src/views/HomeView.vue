<script setup lang="ts">
import { useLessonStore, useSRSStore } from '@/stores';

const lessonStore = useLessonStore();
const srsStore = useSRSStore();
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title">
        Learn <span class="highlight">Japanese</span>
      </h1>
      <p class="hero-subtitle">
        Master Japanese through sentences and spaced repetition
      </p>
    </section>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <span class="stat-value">{{ lessonStore.totalLessons }}</span>
          <span class="stat-label">Total Lessons</span>
        </div>
      </div>

      <div class="stat-card accent">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <span class="stat-value">{{ srsStore.dueCount }}</span>
          <span class="stat-label">Reviews Due</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <span class="stat-value">{{ srsStore.cards.length }}</span>
          <span class="stat-label">Cards Learned</span>
        </div>
      </div>
    </section>

    <section class="actions">
      <RouterLink v-if="srsStore.dueCount > 0" to="/review" class="action-btn primary">
        Start Review ({{ srsStore.dueCount }})
      </RouterLink>
      <RouterLink to="/lessons" class="action-btn secondary">
        Browse Lessons
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.highlight {
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-card.accent {
  background: linear-gradient(135deg, rgba(233, 69, 96, 0.2), rgba(255, 107, 107, 0.1));
  border-color: rgba(233, 69, 96, 0.3);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.action-btn {
  display: block;
  text-align: center;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: #fff;
  box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 69, 96, 0.5);
}

.action-btn.secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.action-btn.secondary:hover {
  border-color: var(--accent);
}
</style>
