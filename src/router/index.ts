import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/lessons',
        name: 'Lessons',
        component: () => import('@/views/LessonListView.vue'),
    },
    {
        path: '/lesson/:id',
        name: 'Lesson',
        component: () => import('@/views/LessonView.vue'),
        props: true,
    },
    {
        path: '/review',
        name: 'Review',
        component: () => import('@/views/ReviewView.vue'),
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
