import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useLessonStore, useSRSStore, useUserStore } from './stores';
import './style.css';

async function bootstrap() {
    const app = createApp(App);
    const pinia = createPinia();

    app.use(pinia);

    // Initialize stores before mounting
    const lessonStore = useLessonStore();
    const srsStore = useSRSStore();
    const userStore = useUserStore();

    // Load data in parallel
    await Promise.all([
        lessonStore.initDataset(),
        srsStore.load(),
        userStore.load(),
    ]);

    app.use(router);
    app.mount('#app');
}

bootstrap().catch(console.error);
