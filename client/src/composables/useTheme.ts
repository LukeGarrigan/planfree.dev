import {computed, ref} from "vue";

type Theme = "light" | "dark";

// Module-level so every component shares one source of truth (same pattern as
// the other composables). `null` means "no explicit choice — follow the OS".
const stored = localStorage.getItem("theme");
const theme = ref<Theme | null>(stored === "light" || stored === "dark" ? stored : null);

function systemPrefersDark(): boolean {
    return typeof window !== "undefined"
        && !!window.matchMedia
        && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Reflect the choice onto <html data-theme>. Removing the attribute lets the
// `prefers-color-scheme` media query in App.vue take over again.
function applyTheme(value: Theme | null) {
    const root = document.documentElement;
    if (value) {
        root.setAttribute("data-theme", value);
    } else {
        root.removeAttribute("data-theme");
    }
}

applyTheme(theme.value);

export function useTheme() {
    const isDark = computed(() => theme.value ? theme.value === "dark" : systemPrefersDark());

    function toggleTheme() {
        const next: Theme = isDark.value ? "light" : "dark";
        theme.value = next;
        localStorage.setItem("theme", next);
        applyTheme(next);
    }

    return {theme, isDark, toggleTheme};
}
