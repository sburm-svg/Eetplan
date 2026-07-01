import { TAG_STYLE } from "../data/recipes.js";

export default function TagChip({ label }) {
  const s = TAG_STYLE[label] ?? { bg: "#F0F0F0", tx: "#555", bd: "#CCC" };
  return (
    <span className="ep-tag" style={{ background: s.bg, color: s.tx, borderColor: s.bd }}>
      {label}
    </span>
  );
}
