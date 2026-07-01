import { useState, useEffect, useCallback } from "react";

const WEEK_KEY = "kanen:weekplan";
const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

export function useWeekPlan() {
  // We starten met een leeg weekplan (elke dag heeft null als recept)
  const [weekPlan, setWeekPlan] = useState(() => {
    try {
      const raw = localStorage.getItem(WEEK_KEY);
      return raw ? JSON.parse(raw) : { Maandag: null, Dinsdag: null, Woensdag: null, Donderdag: null, Vrijdag: null, Zaterdag: null, Zondag: null };
    } catch {
      return { Maandag: null, Dinsdag: null, Woensdag: null, Donderdag: null, Vrijdag: null, Zaterdag: null, Zondag: null };
    }
  });

  // Sla het weekplan op in localStorage zodra het verandert
  useEffect(() => {
    try {
      localStorage.setItem(WEEK_KEY, JSON.stringify(weekPlan));
    } catch { /* ignore */ }
  }, [weekPlan]);

  // Voeg een recept toe aan een specifieke dag
  const setRecipeForDay = useCallback((day, recipe) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: recipe
    }));
  }, []);

  // Haal een recept van een dag af
  const removeRecipeFromDay = useCallback((day) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: null
    }));
  }, []);

  return { weekPlan, setRecipeForDay, removeRecipeFromDay, DAYS };
}
