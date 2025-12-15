import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserSettings } from '@/types';
import { getSettings, saveSettings } from '@/services/db';

const DEFAULT_SETTINGS: UserSettings = {
    dailyGoal: 20,
    darkMode: false,
};

export const useUserStore = defineStore('user', () => {
    const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS });
    const isLoading = ref(false);

    /**
     * Load user settings from IndexedDB.
     */
    async function load(): Promise<void> {
        isLoading.value = true;
        try {
            const stored = await getSettings();
            if (stored) {
                settings.value = stored;
            } else {
                // Initialize with defaults
                await saveSettings(DEFAULT_SETTINGS);
                settings.value = { ...DEFAULT_SETTINGS };
            }
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Update and persist settings.
     */
    async function updateSettings(newSettings: Partial<UserSettings>): Promise<void> {
        settings.value = { ...settings.value, ...newSettings };
        await saveSettings(settings.value);
    }

    return {
        settings,
        isLoading,
        load,
        updateSettings,
    };
});
