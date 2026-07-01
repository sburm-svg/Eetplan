import { useState, useEffect, useCallback } from "react";
import { GLOBAL_CSS, T } from "./theme.js";
import { getAllRecipes } from "./services/recipeService.js";
import { useRecipes } from "./hooks/useRecipes.js";
import { useFavorites } from "./hooks/useFavorites.js";

import Header from "./components/Header.jsx";
import NavBar from "./components/NavBar.jsx";
import RecipeDetail from "./components/RecipeDetail.jsx";

import OnboardingScreen from "./screens/OnboardingScreen.jsx";
import SwipeScreen from "./screens/SwipeScreen.jsx";
import FavoritesScreen from "./screens/FavoritesScreen.jsx";
import WeekOverviewScreen from "./screens/WeekOverviewScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";

const PREFS_KEY = "kanen:preferences";

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const TITLES = {
  swipe: null, // Header shows a dynamic "X recepten" subtitle instead
  favorites: "Bewaard",
  week: "Weekplan",
  profile: "Profiel",
};

export default function App() {
  const allRecipes = getAllRecipes();

  const [preferences, setPreferences] = useState(loadPreferences);
  const [tab, setTab] = useState("swipe");
  const [showSettings, setShowSettings] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [detailClosing, setDetailClosing] = useState(false);
  const [lastSwiped, setLastSwiped] = useState(null);

  const { deck, popRecipe } = useRecipes(preferences ?? {});
  const { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite } = useFavorites(allRecipes);

  useEffect(() => {
    if (!preferences) return;
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(preferences)); } catch { /* ignore */ }
  }, [preferences]);

 const handleSwipe = useCallback((id, dir) => {
  const swiped = deck.find(r => r.id === id);
  if (swiped) setLastSwiped(swiped);

  popRecipe(id);

  if (dir === "right") {
    const recipe = allRecipes.find(r => r.id === id);
    if (recipe) {
      toggleFavorite(recipe.id);
    }
  }
}, [deck, popRecipe, allRecipes, toggleFavorite]);
  });

  if (dir === "right") {
    const recipe = RECIPES.find(r => r.id === id);
    if (recipe) {
      setFavorites(prev =>
        prev.some(r => r.id === id) ? prev : [...prev, recipe]
      );

  const openDetail = useCallback((recipe) => {
    setDetailClosing(false);
    setActiveRecipe(recipe);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailClosing(true);
    setTimeout(() => {
      setActiveRecipe(null);
      setDetailClosing(false);
    }, 280);
  }, []);

  const toggleFavoriteActive = useCallback(() => {
    if (!activeRecipe) return;
    toggleFavorite(activeRecipe.id);
  }, [activeRecipe, toggleFavorite]);

  const isActiveFavorite = activeRecipe ? isFavorite(activeRecipe.id) : false;

  // ── Onboarding gate ──
  if (!preferences) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <OnboardingScreen onComplete={setPreferences} />
      </>
    );
  }

  const headerSubtitle = tab === "swipe"
    ? `${deck.length} recepten te ontdekken`
    : tab === "favorites"
      ? `${favorites.length} bewaard`
      : undefined;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{
        display: "flex", flexDirection: "column", height: "100dvh", maxWidth: 430, margin: "0 auto",
        background: T.cream, fontFamily: "Inter, sans-serif", overflow: "hidden", position: "relative",
      }}>
        <Header title={TITLES[tab] ?? "Kanen"} subtitle={headerSubtitle} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {tab === "swipe" && (
            <SwipeScreen deck={deck} onSwipe={handleSwipe} onOpenDetail={openDetail} />
          )}
          {tab === "favorites" && (
            <FavoritesScreen favorites={favorites} onRemove={removeFavorite} onOpenDetail={openDetail} />
          )}
          {tab === "week" && (
            <WeekOverviewScreen favorites={favorites} />
          )}
          {tab === "profile" && (
            showSettings ? (
              <SettingsScreen
                preferences={preferences}
                onChange={setPreferences}
                onBack={() => setShowSettings(false)}
                onRestartOnboarding={() => { setPreferences(null); setShowSettings(false); }}
              />
            ) : (
              <ProfileScreen preferences={preferences} favorites={favorites} onOpenSettings={() => setShowSettings(true)} />
            )
          )}
        </div>

        <NavBar tab={tab} onTab={(t) => { setTab(t); setShowSettings(false); }} favCount={favorites.length} />
      </div>

      {activeRecipe && (
        <RecipeDetail
          recipe={activeRecipe}
          isFavorite={isActiveFavorite}
          onClose={closeDetail}
          onToggleFavorite={toggleFavoriteActive}
          closing={detailClosing}
        />
      )}
    </>
  );
}
