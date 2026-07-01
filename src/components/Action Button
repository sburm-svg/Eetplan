import { useState } from "react";
import { cx, T } from "../theme.js";

export default function ActionButton({ icon, label, color, onClick, disabled }) {
  const [anim, setAnim] = useState(false);

  const handle = () => {
    if (disabled) return;
    setAnim(true);
    onClick();
  };

  return (
    <button
      aria-label={label}
      className={cx("ep-action-btn", anim && "ep-btn-pop")}
      onAnimationEnd={() => setAnim(false)}
      onClick={handle}
      disabled={disabled}
      style={{ background: T.white, borderColor: `${color}30`, color, opacity: disabled ? 0.35 : 1 }}
    >
      {icon}
    </button>
  );
}
