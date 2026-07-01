import { useRef, useEffect } from "react";
import { cx, T } from "../theme.js";
import { DIFF_COLOR } from "../data/recipes.js";
import TagChip from "./TagChip.jsx";
import NutritionStat from "./NutritionStat.jsx";

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 800, color: T.forest,
      letterSpacing: 0.2, margin: 0, textTransform: "uppercase",
    }}>
      {children}
    </h3>
  );
}

export default function RecipeDetail({ recipe, isFavorite, onClose, onToggleFavorite, closing }) {
  const scrollRef = useRef(null);

  // reset scroll position whenever a new recipe opens
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [recipe?.id]);

  if (!recipe) return null;

  return (
    <div
      className={cx(closing ? "ep-scrim-out" : "ep-scrim-in")}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,25,20,0.45)", display: "flex", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx(closing ? "ep-sheet-down" : "ep-sheet-up")}
        style={{
          width: "100%", maxWidth: 430, height: "100%", background: T.cream,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 -10px 50px rgba(0,0,0,0.3)",
        }}
      >
        {/* ── Scrollable content ── */}
        <div ref={scrollRef} className="ep-detail-scroll" style={{ flex: 1, overflowY: "auto" }}>
          {/* Hero image */}
          <div style={{ position: "relative", width: "100%", height: 300, flexShrink: 0 }}>
            <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 110,
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.35))",
            }} />

            <button
              aria-label="Terug"
              onClick={onClose}
              style={{
                position: "absolute", top: 18, left: 18, width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                color: T.forest, boxShadow: "0 2px 10px rgba(0,0,0,0.18)", cursor: "pointer",
              }}
            >←</button>

            <button
              aria-label="Bewaren"
              onClick={onToggleFavorite}
              style={{
                position: "absolute", top: 18, right: 18, width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                color: isFavorite ? T.red : T.forest, boxShadow: "0 2px 10px rgba(0,0,0,0.18)", cursor: "pointer",
              }}
            >{isFavorite ? "♥" : "♡"}</button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 22px 130px", display: "flex", flexDirection: "column", gap: 22 }}>
            <h1 style={{
              fontFamily: "Inter, sans-serif", fontSize: "clamp(22px, 6vw, 27px)", fontWeight: 800,
              color: T.forest, lineHeight: 1.2, margin: 0,
            }}>
              {recipe.title}
            </h1>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="ep-pill" style={{ background: T.white, color: T.forest, boxShadow: T.shadowSm }}>
                <span>⏱</span><span>{recipe.cookTime}</span>
              </div>
              <div className="ep-pill" style={{ background: T.white, color: T.forest, boxShadow: T.shadowSm }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: DIFF_COLOR[recipe.difficulty] ?? T.muted, display: "inline-block" }} />
                <span>{recipe.difficulty}</span>
              </div>
              <div className="ep-pill" style={{ background: T.white, color: T.forest, boxShadow: T.shadowSm }}>
                <span>🍽</span><span>{recipe.servings} {recipe.servings === 1 ? "portie" : "porties"}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {recipe.tags.map(t => <TagChip key={t} label={t} />)}
            </div>

            {recipe.nutrition && (
              <div>
                <SectionTitle>Voedingswaarden</SectionTitle>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <NutritionStat label="KCAL" value={recipe.nutrition.calories} unit="" color={T.forest} />
                  <NutritionStat label="EIWIT" value={recipe.nutrition.protein} unit="g" color={T.green} />
                  <NutritionStat label="KOOLH." value={recipe.nutrition.carbs} unit="g" color="#D89A2D" />
                  <NutritionStat label="VET" value={recipe.nutrition.fat} unit="g" color="#C45A5A" />
                </div>
              </div>
            )}

            {recipe.ingredients?.length > 0 && (
              <div>
                <SectionTitle>Ingrediënten</SectionTitle>
                <div style={{ marginTop: 10, background: T.white, borderRadius: 18, boxShadow: T.shadowSm, overflow: "hidden" }}>
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "11px 16px",
                        borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${T.border}` : "none",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.greenDot, flexShrink: 0 }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: T.forest, lineHeight: 1.4 }}>
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recipe.instructions?.length > 0 && (
              <div>
                <SectionTitle>Bereidingswijze</SectionTitle>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
                  {recipe.instructions.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <div style={{
                        flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: T.forest,
                        color: T.greenDot, display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700,
                      }}>{i + 1}</div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: T.forest, lineHeight: 1.55, margin: 0, paddingTop: 3 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky footer actions ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 22px",
          paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
          background: "linear-gradient(to top, " + T.cream + " 60%, transparent)",
          display: "flex", gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "15px 0", borderRadius: 16, background: T.white, color: T.forest,
              fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, boxShadow: T.shadowSm,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            ← Terug
          </button>
          <button
            onClick={onToggleFavorite}
            style={{
              flex: 2, padding: "15px 0", borderRadius: 16,
              background: isFavorite ? T.white : T.forest, color: isFavorite ? T.red : T.white,
              border: isFavorite ? `1.5px solid ${T.red}40` : "none",
              fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, boxShadow: T.shadowSm,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
          >
            <span style={{ fontSize: 16 }}>{isFavorite ? "♥" : "♡"}</span>
            {isFavorite ? "Bewaard" : "Toevoegen aan favorieten"}
          </button>
        </div>
      </div>
    </div>
  );
}
