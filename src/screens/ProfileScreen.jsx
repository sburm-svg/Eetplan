import { T } from "../theme.js";
import { averageNutrition } from "../services/nutritionService.js";
import NutritionStat from "../components/NutritionStat.jsx";

const GOAL_LABEL = { healthy: "Gezonder eten", weight_loss: "Afvallen", muscle: "Spieren opbouwen", quick: "Snel & makkelijk" };
const DIET_LABEL = { none: "Geen voorkeur", vegetarian: "Vegetarisch", vegan: "Vegan" };

export default function ProfileScreen({ preferences, favorites, onOpenSettings }) {
  const avg = averageNutrition(favorites);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 110px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 0 24px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: T.forest, color: T.greenDot,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800,
        }}>J</div>
        <p style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>
          {preferences?.goal ? GOAL_LABEL[preferences.goal] : "Nog geen doel ingesteld"}
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, background: T.white, borderRadius: 16, boxShadow: T.shadowSm, padding: "14px 10px", textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: T.forest }}>{favorites.length}</p>
          <p style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>BEWAARD</p>
        </div>
        <div style={{ flex: 1, background: T.white, borderRadius: 16, boxShadow: T.shadowSm, padding: "14px 10px", textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: T.forest }}>{preferences?.diet ? DIET_LABEL[preferences.diet] : "—"}</p>
          <p style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>DIEET</p>
        </div>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: T.forest, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.2 }}>
        Gemiddeld per bewaard recept
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <NutritionStat label="KCAL" value={avg.calories} unit="" color={T.forest} />
        <NutritionStat label="EIWIT" value={avg.protein} unit="g" color={T.green} />
        <NutritionStat label="KOOLH." value={avg.carbs} unit="g" color="#D89A2D" />
        <NutritionStat label="VET" value={avg.fat} unit="g" color="#C45A5A" />
      </div>

      <button
        onClick={onOpenSettings}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 16, background: T.white, color: T.forest,
          fontWeight: 700, fontSize: 14, boxShadow: T.shadowSm, display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span>⚙️ Instellingen</span>
        <span style={{ color: T.hint }}>›</span>
      </button>
    </div>
  );
}
