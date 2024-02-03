import { writable } from "svelte/store";

export const selectedYear = writable(new Date().getFullYear());
