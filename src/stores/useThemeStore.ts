import { defineStore } from 'pinia';

export const useThemeStore = defineStore('themeStore', {
    state: () => ({
        theme: localStorage.getItem('theme') || 'light',
    }),
    actions: {
        setTheme(theme: string) {
            this.theme = theme
            localStorage.setItem('theme', this.theme);
        },
    },
});
