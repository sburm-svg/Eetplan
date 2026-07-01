/**
 * Builds a shopping list from a set of recipes (e.g. this week's favorites).
 * Recipe ingredients are free-text strings (e.g. "200g kipfilet"), so we
 * can't sum quantities reliably — instead we group by recipe and also
 * offer a deduplicated flat list for a quick "do I already have this" scan.
 */

/** Grouped by recipe: [{ recipeId, title, ingredients: [...] }] */
export function buildGroupedShoppingList(recipes = []) {
  return recipes
    .filter(r => r.ingredients?.length > 0)
    .map(r => ({ recipeId: r.id, title: r.title, ingredients: r.ingredients }));
}

/** Flat, deduplicated (case-insensitive) list of every ingredient line. */
export function buildFlatShoppingList(recipes = []) {
  const seen = new Set();
  const flat = [];

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients ?? []) {
      const key = ingredient.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      flat.push(ingredient);
    }
  }

  return flat.sort((a, b) => a.localeCompare(b, "nl"));
}
