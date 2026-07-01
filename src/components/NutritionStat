import { T } from "../theme.js";

export default function NutritionStat({ label, value, unit, color }) {
  return (
    <div style={{
      flex: 1, background: T.creamDark, borderRadius: 16, padding: "12px 8px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 800, color: color ?? T.forest }}>
        {value}{unit}
      </span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: 0.2 }}>
        {label}
      </span>
    </div>
  );
}
