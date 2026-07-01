import { RECIPES } from "../data/recipes.js";

/**
 * Everything that touches "which recipes exist / match" lives here.
 * Today it reads from the local RECIPES array; if Kanen ever gets
 * a backend, only this file needs to change (e.g. swap in api.get(...)).
 */

export function getAllRecipes() {
  return RECIPES;
}

export function getRecipeById(id) {
  return RECIPES.find(r => r.id === id) ?? null;
}

/**
 * Filters recipes against onboarding/settings preferences.
 * @param {{ diet?: 'vegan'|'vegetarian'|null, maxTime?: number|null }} preferences
 */
export function filterRecipes(preferences = {}) {
  const { diet, maxTime } = preferences;

  return RECIPES.filter((recipe) => {
    if (maxTime) {
      const minutes = parseInt(recipe.cookTime, 10);
      if (!isNaN(minutes) && minutes > maxTime) return false;
    }
    if (diet === "vegetarian" && !recipe.tags.includes("vegetarisch")) return false;
    if (diet === "vegan" && !recipe.tags.includes("vegan")) return false;
    return true;
  });
}

export function searchRecipes(query) {
  const q = query.trim().toLowerCase();
  if (!q) return RECIPES;
  return RECIPES.filter(r =>
    r.title.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))
  );
}
