import { useMemo, useState } from "react";
import { T } from "../theme.js";
import { buildFlatShoppingList } from "../utils/shoppingList.js";
import { sumNutrition } from "../services/nutritionService.js";

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

/** Spreads favorited recipes round-robin across the 7 days. */
function buildWeekPlan(favorites) {
  const plan = DAYS.map(() => []);
  favorites.forEach((recipe, i) => plan[i % 7].push(recipe));
  return plan;
}

export default function WeekOverviewScreen({ favorites }) {
  const [showList, setShowList] = useState(false);
  const plan = useMemo(() => buildWeekPlan(favorites), [favorites]);
  const shoppingList = useMemo(() => buildFlatShoppingList(favorites), [favorites]);

  if (favorites.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: T.creamDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>🗓</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Nog geen weekplan</p>
        <p style={{ fontSize: 14, color: T.muted, textAlign: "center", maxWidth: 240 }}>Bewaar een paar recepten en we verdelen ze automatisch over de week</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 110px", fontFamily: "Inter, sans-serif" }}>
      <button
        onClick={() => setShowList(s => !s)}
        style={{
          width: "100%", padding: "13px 16px", borderRadius: 16, background: T.forest, color: T.white,
          fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 16,
        }}
      >
        🛒 {showList ? "Verberg boodschappenlijst" : "Bekijk boodschappenlijst"}
      </button>

      {showList ? (
        <div style={{ background: T.white, borderRadius: 18, boxShadow: T.shadowSm, overflow: "hidden" }}>
          {shoppingList.map((item, i) => (
            <div key={i} style={{
              padding: "11px 16px", fontSize: 14, color: T.forest,
              borderBottom: i < shoppingList.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {DAYS.map((day, i) => {
            const recipes = plan[i];
            const totals = sumNutrition(recipes);
            return (
              <div key={day} style={{ background: T.white, borderRadius: 18, boxShadow: T.shadowSm, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: recipes.length ? 10 : 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: T.forest }}>{day}</span>
                  {recipes.length > 0 && (
                    <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>🔥 {totals.calories} kcal</span>
                  )}
                </div>
                {recipes.length === 0 ? (
                  <p style={{ fontSize: 13, color: T.hint }}>Geen recept gepland</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {recipes.map(r => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.forestMid, fontWeight: 500 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.greenDot, flexShrink: 0 }} />
                        {r.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
