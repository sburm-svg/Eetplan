import { useState } from "react";
import { T, cx } from "../theme.js";

const GOALS = [
  { id: "healthy", label: "Gezonder eten" },
  { id: "weight_loss", label: "Afvallen" },
  { id: "muscle", label: "Spieren opbouwen" },
  { id: "quick", label: "Snel & makkelijk" },
];

const DIETS = [
  { id: "none", label: "Geen voorkeur" },
  { id: "vegetarian", label: "Vegetarisch" },
  { id: "vegan", label: "Vegan" },
];

const TIMES = [
  { id: 10, label: "Max. 10 min" },
  { id: 20, label: "Max. 20 min" },
  { id: 30, label: "Max. 30 min" },
];

function Choice({ active, label, onClick }) {
  return (
    <button className="ep-choice" data-active={active} onClick={onClick}>
      {label}
    </button>
  );
}

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({ goal: null, diet: null, maxTime: null, servings: 2 });

  const steps = [
    {
      title: "Wat is je doel?",
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GOALS.map(g => (
            <Choice key={g.id} label={g.label} active={prefs.goal === g.id} onClick={() => setPrefs(p => ({ ...p, goal: g.id }))} />
          ))}
        </div>
      ),
      canNext: !!prefs.goal,
    },
    {
      title: "Volg je een dieet?",
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DIETS.map(d => (
            <Choice key={d.id} label={d.label} active={prefs.diet === d.id} onClick={() => setPrefs(p => ({ ...p, diet: d.id }))} />
          ))}
        </div>
      ),
      canNext: !!prefs.diet,
    },
    {
      title: "Hoeveel tijd heb je meestal?",
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TIMES.map(t => (
            <Choice key={t.id} label={t.label} active={prefs.maxTime === t.id} onClick={() => setPrefs(p => ({ ...p, maxTime: t.id }))} />
          ))}
        </div>
      ),
      canNext: !!prefs.maxTime,
    },
    {
      title: "Voor hoeveel personen kook je?",
      body: (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "12px 0" }}>
          <button
            onClick={() => setPrefs(p => ({ ...p, servings: Math.max(1, p.servings - 1) }))}
            style={{ width: 48, height: 48, borderRadius: "50%", background: T.creamDark, color: T.forest, fontSize: 20, fontWeight: 700 }}
          >−</button>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 28, fontWeight: 800, color: T.forest, minWidth: 40, textAlign: "center" }}>
            {prefs.servings}
          </span>
          <button
            onClick={() => setPrefs(p => ({ ...p, servings: Math.min(8, p.servings + 1) }))}
            style={{ width: 48, height: 48, borderRadius: "50%", background: T.forest, color: T.greenDot, fontSize: 20, fontWeight: 700 }}
          >+</button>
        </div>
      ),
      canNext: true,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const next = () => {
    if (!current.canNext) return;
    if (isLast) onComplete(prefs);
    else setStep(s => s + 1);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100dvh", maxWidth: 430, margin: "0 auto",
      background: T.cream, fontFamily: "Inter, sans-serif", padding: "60px 24px 24px",
    }}>
      {/* progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? T.forest : T.creamDark,
          }} />
        ))}
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 800, color: T.forest, marginBottom: 22, lineHeight: 1.25 }}>
        {current.title}
      </h1>

      <div style={{ flex: 1 }}>{current.body}</div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{ flex: 1, padding: "15px 0", borderRadius: 16, background: T.white, color: T.forest, fontWeight: 700, fontSize: 14, boxShadow: T.shadowSm }}
          >
            Terug
          </button>
        )}
        <button
          onClick={next}
          disabled={!current.canNext}
          className={cx(!current.canNext && "ep-disabled")}
          style={{
            flex: 2, padding: "15px 0", borderRadius: 16, background: T.forest, color: T.white,
            fontWeight: 700, fontSize: 14, opacity: current.canNext ? 1 : 0.4,
          }}
        >
          {isLast ? "Start met swipen" : "Volgende"}
        </button>
      </div>
    </div>
  );
}
