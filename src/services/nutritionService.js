/**
 * Aggregates nutrition data across one or more recipes.
 * Used by WeekOverviewScreen and ProfileScreen.
 */

const EMPTY_TOTALS = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export function sumNutrition(recipes = []) {
  return recipes.reduce((totals, recipe) => {
    const n = recipe.nutrition;
    if (!n) return totals;
    return {
      calories: totals.calories + (n.calories ?? 0),
      protein: totals.protein + (n.protein ?? 0),
      carbs: totals.carbs + (n.carbs ?? 0),
      fat: totals.fat + (n.fat ?? 0),
    };
  }, { ...EMPTY_TOTALS });
}

export function averageNutrition(recipes = []) {
  if (recipes.length === 0) return { ...EMPTY_TOTALS };
  const totals = sumNutrition(recipes);
  return {
    calories: Math.round(totals.calories / recipes.length),
    protein: Math.round(totals.protein / recipes.length),
    carbs: Math.round(totals.carbs / recipes.length),
    fat: Math.round(totals.fat / recipes.length),
  };
}
