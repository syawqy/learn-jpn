<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();

// Apply dark/light mode based on user setting
function applyTheme() {
  if (userStore.settings.darkMode) {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
  }
}

onMounted(() => {
  applyTheme();
});

watch(() => userStore.settings.darkMode, () => {
  applyTheme();
});
</script>

<template>
  <div class="app-container">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
</style>
