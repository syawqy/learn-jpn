<script setup lang="ts">
import { useUserStore, useSRSStore, useLessonStore } from '@/stores';

const userStore = useUserStore();
const srsStore = useSRSStore();
const lessonStore = useLessonStore();

async function toggleDarkMode() {
  await userStore.updateSettings({ darkMode: !userStore.settings.darkMode });
}

function exportData() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    srsCards: srsStore.cards,
    settings: userStore.settings,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learnjpn-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (data.version && data.srsCards) {
        // Valid backup, import
        for (const card of data.srsCards) {
          await srsStore.cards.push(card);
        }
        if (data.settings) {
          await userStore.updateSettings(data.settings);
        }
        alert('Import successful!');
      } else {
        alert('Invalid backup file');
      }
    } catch (err) {
      alert('Failed to parse backup file');
    }
  };
  input.click();
}
</script>

<template>
  <div class="settings-view">
    <header class="page-header">
      <h1>Settings</h1>
    </header>

    <section class="settings-section">
      <h2>Appearance</h2>
      <div class="setting-item">
        <span class="setting-label">Dark Mode</span>
        <button class="toggle-btn" :class="{ active: userStore.settings.darkMode }" @click="toggleDarkMode">
          {{ userStore.settings.darkMode ? 'On' : 'Off' }}
        </button>
      </div>
    </section>

    <section class="settings-section">
      <h2>Statistics</h2>
      <div class="stats-list">
        <div class="stat-row">
          <span>Total Lessons</span>
          <span class="stat-value">{{ lessonStore.totalLessons }}</span>
        </div>
        <div class="stat-row">
          <span>Cards in SRS</span>
          <span class="stat-value">{{ srsStore.cards.length }}</span>
        </div>
        <div class="stat-row">
          <span>Reviews Due</span>
          <span class="stat-value">{{ srsStore.dueCount }}</span>
        </div>
        <div class="stat-row">
          <span>Data Version</span>
          <span class="stat-value">{{ lessonStore.dataVersion || 'N/A' }}</span>
        </div>
      </div>
    </section>

    <section class="settings-section">
      <h2>Data Management</h2>
      <div class="button-group">
        <button class="action-btn" @click="exportData">
          📤 Export Progress
        </button>
        <button class="action-btn" @click="importData">
          📥 Import Progress
        </button>
      </div>
    </section>

    <section class="settings-section about">
      <h2>About</h2>
      <p>LearnJPN - A Japanese learning app with spaced repetition.</p>
      <p class="version">Version 0.1.0</p>
    </section>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 1rem 0;
}

.page-header h1 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
}

.settings-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-section h2 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label {
  color: #fff;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: #28a745;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.8);
}

.stat-value {
  color: #fff;
  font-weight: 600;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.about p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.version {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}
</style>
