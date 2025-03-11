import { z } from "zod";

export const settingsSchema = z.object({
  theme: z.object({
    primary: z.string(),
    variant: z.enum(["professional", "tint", "vibrant"]),
    appearance: z.enum(["light", "dark", "system"]),
    radius: z.number().min(0).max(2),
  }),
  mode: z.enum(["notes", "todos"]).default("notes"),
});

export type Settings = z.infer<typeof settingsSchema>;

const STORAGE_KEY = "app_settings";

const defaultSettings: Settings = {
  theme: {
    primary: "hsl(222.2 47.4% 11.2%)",
    variant: "tint",
    appearance: "system",
    radius: 1,
  },
  mode: "notes",
};

// Custom event for settings changes
const SETTINGS_CHANGE_EVENT = 'app_settings_change';

export const settings = {
  get: (): Settings => {
    if (typeof window === 'undefined') return defaultSettings;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;
    try {
      return settingsSchema.parse(JSON.parse(stored));
    } catch {
      return defaultSettings;
    }
  },

  save: (newSettings: Settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

    // Update theme.json dynamically
    fetch("/theme.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        primary: newSettings.theme.primary,
        variant: newSettings.theme.variant,
        appearance: newSettings.theme.appearance,
        radius: newSettings.theme.radius,
      }),
    }).catch(console.error);

    // Dispatch custom event for settings change
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT));

    // Apply theme changes immediately
    document.documentElement.style.setProperty("--radius", `${newSettings.theme.radius}rem`);
    // Refresh page to apply new theme
    window.location.reload();
  },

  onChange: (callback: () => void) => {
    window.addEventListener(SETTINGS_CHANGE_EVENT, callback);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, callback);
  },
};