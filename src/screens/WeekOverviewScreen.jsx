import { useState } from "react";
import { T } from "../theme.js";

const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

export default function WeekOverviewScreen({ favorites = [], weekPlan = {}, onSetDay, onRemoveDay, onOpenDetail }) {
  // We houden bij voor welke dag de gebruiker NU een recept aan het kiezen is
  const [selectingDay, setSelectingDay] = useState(null);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ fontSize: 20, color: T.forest, marginBottom: 16, fontWeight: 700 }}>Mijn Weekmenu</h2>

      {DAYS.map((day) => {
        const assignedRecipe = weekPlan[day];

        return (
          <div key={day} style={{ 
            background: T.white ?? "#fff", 
            borderRadius: 12, 
            padding: 14, 
            marginBottom: 12, 
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            border: `1px solid ${T.creamDark ?? "#eee"}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: T.forest, fontSize: 14 }}>{day}</span>
              
              {assignedRecipe ? (
                <button 
                  onClick={() => onRemoveDay(day)}
                  style={{ background: "none", border: "none", color: T.red ?? "#ff4d4d", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                >
                  Wissen
                </button>
              ) : null}
            </div>

            <div style={{ marginTop: 8 }}>
              {assignedRecipe ? (
                // Er is een recept gekoppeld!
                <div 
                  onClick={() => onOpenDetail(assignedRecipe)}
                  style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                >
                  {assignedRecipe.image && (
                    <img src={assignedRecipe.image} alt={assignedRecipe.title} style={{ width: 45, height: 45, borderRadius: 8, objectFit: "cover" }} />
                  )}
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.charcoal ?? "#333" }}>{assignedRecipe.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: T.muted ?? "#888" }}>⏱️ {assignedRecipe.readyInMinutes ?? 30} min</p>
                  </div>
                </div>
              ) : selectingDay === day ? (
                // Gebruiker is nu een favoriet aan het kiezen voor deze dag
                <div style={{ marginTop: 8 }}>
                  {favorites.length === 0 ? (
                    <p style={{ fontSize: 13, color: T.muted, margin: "4px 0" }}>Je hebt nog geen bewaarde recepten! Swipe eerst wat recepten naar rechts. ♥</p>
                  ) : (
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const recipe = favorites.find(r => String(r.id) === String(selectedId));
                        if (recipe) {
                          onSetDay(day, recipe);
                          setSelectingDay(null); // Sluit de selectie
                        }
                      }}
                      style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${T.hint ?? "#ccc"}`, background: "#fff" }}
                    >
                      <option value="" disabled>-- Kies een bewaard recept --</option>
                      {favorites.map(fav => (
                        <option key={fav.id} value={fav.id}>{fav.title}</option>
                      ))}
                    </select>
                  )}
                  <button 
                    onClick={() => setSelectingDay(null)}
                    style={{ marginTop: 6, background: "none", border: "none", color: T.muted, fontSize: 12, cursor: "pointer" }}
                  >
                    Annuleren
                  </button>
                </div>
              ) : (
                // Dag is leeg, toon de "Kies" knop
                <button 
                  onClick={() => setSelectingDay(day)}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    borderRadius: 8, 
                    border: `1px dashed ${T.hint ?? "#ccc"}`, 
                    background: T.cream ?? "#faf9f6",
                    color: T.forest,
                    fontWeight: 500,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  ➕ Plan een maaltijd...
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
