import { T } from "../theme.js";
import FavoriteCard from "../components/FavoriteCard.jsx";

export default function FavoritesScreen({ favorites, onRemove, onOpenDetail }) {
  if (favorites.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: T.creamDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>🍽️</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Nog niets bewaard</p>
        <p style={{ fontSize: 14, color: T.muted }}>Swipe rechts op recepten die je lekker vindt</p>
      </div>
    );
  }
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 110px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {favorites.map(r => (
          <FavoriteCard key={r.id} recipe={r} onRemove={onRemove} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  );
}
