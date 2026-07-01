import { useMemo } from "react";
import { T } from "../theme.js";

const DEFAULT_TABS = [
  { id: "swipe", icon: "🔍", label: "Ontdekken" },
  { id: "favorites", icon: "♥", label: "Bewaard" },
  { id: "week", icon: "🗓", label: "Weekplan" },
  { id: "profile", icon: "🙂", label: "Profiel" },
];

export default function NavBar({ tab, onTab, favCount, tabs = DEFAULT_TABS }) {
  const items = useMemo(() => tabs.map(t =>
    t.id === "favorites" && favCount > 0
      ? { ...t, label: `Bewaard (${favCount})` }
      : t
  ), [tabs, favCount]);

  return (
    <div style={{
      display: "flex", background: T.white, borderRadius: "24px 24px 0 0",
      boxShadow: "0 -4px 24px rgba(30,58,47,0.09)", flexShrink: 0,
      paddingBottom: "env(safe-area-inset-bottom, 4px)",
    }}>
      {items.map(({ id, icon, label }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => onTab(id)}
            style={{
              flex: 1, padding: "14px 8px 12px", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, background: "none", border: "none",
              cursor: "pointer", position: "relative",
            }}
          >
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 36, height: 3, borderRadius: "0 0 4px 4px", background: T.forest,
              }} />
            )}
            <span style={{ fontSize: active ? 22 : 20, filter: active ? "none" : "grayscale(1) opacity(0.4)", transition: "font-size 0.15s" }}>{icon}</span>
            <span style={{
              fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: active ? 700 : 500,
              color: active ? T.forest : T.hint, transition: "color 0.15s",
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
