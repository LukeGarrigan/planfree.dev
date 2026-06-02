import {computed, ref} from "vue";
import GameFormat from "@/view-models/gameFormat";

// Mirrors the server's hardcoded gameTypes. Used only as a fallback for a
// first-time visitor who hasn't connected yet (so the server's list, which the
// client caches in localStorage on connect, isn't available).
export const DEFAULT_GAME_TYPES: GameFormat[] = [
    {name: 'Fibonacci', values: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?']},
    {name: 'T-Shirt', values: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '?']},
    {name: 'Powers of 2', values: ['0', '1', '2', '4', '8', '16', '32', '64', '?']},
];

const CUSTOM_KEY = "customGameTypes";

function loadCustom(): GameFormat[] {
    try {
        const raw = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]");
        return Array.isArray(raw) ? raw : [];
    } catch {
        return [];
    }
}

// Held at module scope so every component that opens a deck picker shares the
// same list of user-defined decks without prop-drilling — the same pattern the
// other composables in this app use.
const customDecks = ref<GameFormat[]>(loadCustom());

function persist() {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customDecks.value));
}

// The built-in decks the server last pushed (cached in localStorage), falling
// back to the defaults when we haven't heard from the server yet.
function builtInDecks(): GameFormat[] {
    const cached = JSON.parse(localStorage.getItem("gameTypes") || "[]") as GameFormat[];
    return cached.length ? cached : DEFAULT_GAME_TYPES;
}

export function useDecks() {
    // Server/built-in decks first, then the user's own custom decks.
    const decks = computed<GameFormat[]>(() => [...builtInDecks(), ...customDecks.value]);
    const customDeckNames = computed(() => customDecks.value.map(d => d.name));

    // Split a comma- or newline-separated string into a trimmed, de-duped,
    // order-preserving list of card values.
    function parseValues(raw: string): string[] {
        const seen = new Set<string>();
        const values: string[] = [];
        for (const part of raw.split(/[,\n]/)) {
            const value = part.trim();
            if (value && !seen.has(value)) {
                seen.add(value);
                values.push(value);
            }
        }
        return values;
    }

    // Give a custom deck a name that doesn't clash with an existing one — the
    // picker keys its options by name, so duplicates would collide.
    function uniqueName(desired: string): string {
        const taken = new Set(decks.value.map(d => d.name));
        let name = desired;
        let n = 2;
        while (taken.has(name)) {
            name = `${desired} ${n++}`;
        }
        return name;
    }

    // Save a new custom deck and return it (with its final, unique name).
    function addCustomDeck(name: string, values: string[]): GameFormat {
        const deck: GameFormat = {name: uniqueName(name.trim() || "Custom"), values};
        customDecks.value = [...customDecks.value, deck];
        persist();
        return deck;
    }

    function removeCustomDeck(name: string): void {
        customDecks.value = customDecks.value.filter(d => d.name !== name);
        persist();
    }

    return {decks, customDeckNames, parseValues, addCustomDeck, removeCustomDeck};
}
