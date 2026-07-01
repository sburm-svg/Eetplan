/**
 * Pure macro-nutrient math. No React, no state — easy to unit test.
 */

const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 };

/** Calories contributed by protein/carbs/fat, given grams of each. */
export function macrosToCalories({ protein = 0, carbs = 0, fat = 0 }) {
  return protein * KCAL_PER_GRAM.protein + carbs * KCAL_PER_GRAM.carbs + fat * KCAL_PER_GRAM.fat;
}

/** Percentage breakdown of total calories that come from each macro. */
export function macroPercentages({ protein = 0, carbs = 0, fat = 0 }) {
  const totalKcal = macrosToCalories({ protein, carbs, fat });
  if (totalKcal === 0) return { protein: 0, carbs: 0, fat: 0 };
  return {
    protein: Math.round((protein * KCAL_PER_GRAM.protein / totalKcal) * 100),
    carbs: Math.round((carbs * KCAL_PER_GRAM.carbs / totalKcal) * 100),
    fat: Math.round((fat * KCAL_PER_GRAM.fat / totalKcal) * 100),
  };
}

/** Scales an ingredient/nutrition amount from one serving count to another. */
export function scaleServings(amount, fromServings, toServings) {
  if (!fromServings) return amount;
  return Math.round((amount / fromServings) * toServings * 10) / 10;
}

export function formatGrams(value) {
  return `${Math.round(value)}g`;
}
