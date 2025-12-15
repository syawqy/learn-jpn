<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useSRSStore } from '@/stores';

const srsStore = useSRSStore();
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-brand">
      <span class="brand-icon">🇯🇵</span>
      <span class="brand-text">LearnJPN</span>
    </RouterLink>
    <div class="nav-links">
      <RouterLink to="/lessons" class="nav-link">Lessons</RouterLink>
      <RouterLink to="/review" class="nav-link review-link">
        Review
        <span v-if="srsStore.dueCount > 0" class="due-badge">{{ srsStore.dueCount }}</span>
      </RouterLink>
      <RouterLink to="/settings" class="nav-link">⚙️</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--card-bg);
  border-bottom: 1px solid var(--card-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-text {
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link.router-link-active {
  color: var(--accent);
}

.review-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.due-badge {
  background: var(--accent);
  color: white;
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
}
</style>
