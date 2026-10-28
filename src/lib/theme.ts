export const THEME_STORAGE_KEY = 'flowpilot-theme';
export const DEFAULT_THEME = 'light';

// Runs before the page paints; storage may be unavailable in private contexts.
export const THEME_INIT_SCRIPT = `(() => {
  try {
    const saved = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.dataset.theme = saved;
    }
  } catch {}
})();`;
