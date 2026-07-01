import { T } from "../theme.js";

const DIETS = [
  { id: "none", label: "Geen voorkeur" },
  { id: "vegetarian", label: "Vegetarisch" },
  { id: "vegan", label: "Vegan" },
];

const TIMES = [
  { id: 10, label: "10 min" },
  { id: 20, label: "20 min" },
  { id: 30, label: "30 min" },
];

function Choice({ active, label, onClick }) {
  return (
    <button className="ep-choice" data-active={active} onClick={onClick} style={{ flex: 1 }}>
      {label}
    </button>
  );
}

export default function SettingsScreen({ preferences, onChange, onBack, onRestartOnboarding }) {
  const update = (patch) => onChange({ ...preferences, ...patch });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 110px", fontFamily: "Inter, sans-serif" }}>
      <button onClick={onBack} style={{ marginBottom: 20, color: T.forest, fontWeight: 700, fontSize: 14 }}>
        ← Terug
      </button>

      <p style={{ fontSize: 13, fontWeight: 700, color: T.forest, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.2 }}>
        Dieet
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {DIETS.map(d => (
          <Choice key={d.id} label={d.label} active={preferences?.diet === d.id} onClick={() => update({ diet: d.id })} />
        ))}
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: T.forest, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.2 }}>
        Max. bereidingstijd
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {TIMES.map(t => (
          <Choice key={t.id} label={t.label} active={preferences?.maxTime === t.id} onClick={() => update({ maxTime: t.id })} />
        ))}
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: T.forest, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.2 }}>
        Aantal personen
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
        <button
          onClick={() => update({ servings: Math.max(1, (preferences?.servings ?? 2) - 1) })}
          style={{ width: 40, height: 40, borderRadius: "50%", background: T.creamDark, color: T.forest, fontSize: 18, fontWeight: 700 }}
        >−</button>
        <span style={{ fontSize: 20, fontWeight: 800, color: T.forest, minWidth: 30, textAlign: "center" }}>
          {preferences?.servings ?? 2}
        </span>
        <button
          onClick={() => update({ servings: Math.min(8, (preferences?.servings ?? 2) + 1) })}
          style={{ width: 40, height: 40, borderRadius: "50%", background: T.forest, color: T.greenDot, fontSize: 18, fontWeight: 700 }}
        >+</button>
      </div>

      <button
        onClick={onRestartOnboarding}
        style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: T.redPale, color: T.red, fontWeight: 700, fontSize: 14 }}
      >
        Doel &amp; voorkeuren opnieuw instellen
      </button>
    </div>
  );
}
