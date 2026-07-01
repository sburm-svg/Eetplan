import { T } from "../theme.js";
import TagChip from "./TagChip.jsx";

export default function FavoriteCard({ recipe, onRemove, onOpenDetail }) {
  return (
    <div
      className="ep-rise"
      onClick={() => onOpenDetail(recipe)}
      style={{ background: T.white, borderRadius: 20, overflow: "hidden", boxShadow: T.shadowSm, display: "flex", flexDirection: "column", cursor: "pointer" }}
    >
      <div style={{ position: "relative" }}>
        <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
        <button
          aria-label="Verwijder"
          onClick={(e) => { e.stopPropagation(); onRemove(recipe.id); }}
          style={{
            position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%",
            background: "rgba(255,255,255,0.92)", color: T.red, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.14)", cursor: "pointer", border: "none",
          }}
        >✕</button>
      </div>
      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: T.forest, lineHeight: 1.3, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {recipe.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: T.muted, fontWeight: 500 }}>
          <span>⏱ {recipe.cookTime}</span>
          <span style={{ color: T.hint }}>·</span>
          <span>🔥 {recipe.kcal} kcal</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "auto" }}>
          {recipe.tags.slice(0, 2).map(t => <TagChip key={t} label={t} />)}
        </div>
      </div>
    </div>
  );
}
