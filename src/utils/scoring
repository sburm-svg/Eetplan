/**
 * Scores a recipe's relevance against the user's preferences.
 * Higher score = show it sooner in the swipe deck. Pure function,
 * easy to tweak/tune without touching any component.
 */
export function scoreRecipe(recipe, preferences = {}) {
  let score = 0;

  if (preferences.diet === "vegetarian" && recipe.tags.includes("vegetarisch")) score += 2;
  if (preferences.diet === "vegan" && recipe.tags.includes("vegan")) score += 2;

  if (preferences.maxTime) {
    const minutes = parseInt(recipe.cookTime, 10);
    if (!isNaN(minutes)) {
      if (minutes <= preferences.maxTime) score += 1;
      if (minutes <= preferences.maxTime / 2) score += 1; // extra bump for "quick"
    }
  }

  if (preferences.goal === "weight_loss" && recipe.kcal && recipe.kcal < 500) score += 1;
  if (preferences.goal === "muscle" && recipe.nutrition?.protein >= 25) score += 1;
  if (preferences.goal === "healthy" && recipe.tags.includes("gezond")) score += 1;

  return score;
}

/** Returns a new array, highest-scoring recipes first. */
export function rankRecipes(recipes, preferences = {}) {
  return [...recipes].sort((a, b) => scoreRecipe(b, preferences) - scoreRecipe(a, preferences));
}
