import { T } from "../theme.js";

export default function Header({ title = "Kanen", subtitle, avatarLetter = "J" }) {
  return (
    <div style={{
      padding: "52px 22px 14px", background: T.cream, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 800,
          color: T.forest, letterSpacing: -0.8, lineHeight: 1, display: "flex", alignItems: "center", gap: 6,
        }}>
          {title}
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: T.greenDot, marginBottom: 10 }} />
        </div>
        {subtitle && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: "50%", background: T.forest,
        display: "flex", alignItems: "center", justifyContent: "center", color: T.greenDot,
        fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 700, flexShrink: 0,
      }}>{avatarLetter}</div>
    </div>
  );
}
