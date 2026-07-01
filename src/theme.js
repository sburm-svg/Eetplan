/* ─────────────────────────────────────────────
   DESIGN TOKENS — single source of truth for
   colors, shadows and the injected global CSS.
───────────────────────────────────────────── */
export const T = {
  cream: "#F5F0E8",
  creamDark: "#EDE8DC",
  white: "#FFFFFF",
  forest: "#1E3A2F",
  forestMid: "#2D5A44",
  green: "#2D9B6F",
  greenPale: "#E1F5EE",
  greenDot: "#4DB87A",
  red: "#D84040",
  redPale: "#FDE8E8",
  sand: "#6B5B3E",
  muted: "#8A9A88",
  hint: "#B0BFB0",
  border: "rgba(30,58,47,0.08)",
  shadow: "0 8px 40px rgba(30,58,47,0.14), 0 2px 8px rgba(30,58,47,0.08)",
  shadowSm: "0 2px 12px rgba(30,58,47,0.10)",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  html, body, #root {
    height: 100%;
    background: ${T.cream};
    overscroll-behavior: none;
  }

  ::-webkit-scrollbar { width: 0; height: 0; }

  button { font-family: Inter, sans-serif; cursor: pointer; border: none; background: none; }

  @keyframes ep-fly-right {
    from { transform: translateX(0) rotate(0deg); opacity: 1; }
    to { transform: translateX(140vw) rotate(22deg); opacity: 0; }
  }
  @keyframes ep-fly-left {
    from { transform: translateX(0) rotate(0deg); opacity: 1; }
    to { transform: translateX(-140vw) rotate(-22deg); opacity: 0; }
  }
  @keyframes ep-rise {
    from { transform: scale(0.88) translateY(16px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes ep-btn-pop {
    0% { transform: scale(1); }
    40% { transform: scale(0.88); }
    100% { transform: scale(1); }
  }
  @keyframes ep-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes ep-sheet-down { from { transform: translateY(0); } to { transform: translateY(100%); } }
  @keyframes ep-scrim-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ep-scrim-out { from { opacity: 1; } to { opacity: 0; } }

  .ep-fly-right { animation: ep-fly-right 0.38s cubic-bezier(0.55,0,1,0.45) forwards; }
  .ep-fly-left { animation: ep-fly-left 0.38s cubic-bezier(0.55,0,1,0.45) forwards; }
  .ep-rise { animation: ep-rise 0.36s cubic-bezier(0.34,1.56,0.64,1) both; }
  .ep-btn-pop { animation: ep-btn-pop 0.28s ease both; }
  .ep-sheet-up { animation: ep-sheet-up 0.36s cubic-bezier(0.16,1,0.3,1) both; }
  .ep-sheet-down { animation: ep-sheet-down 0.28s cubic-bezier(0.4,0,1,1) both; }
  .ep-scrim-in { animation: ep-scrim-in 0.3s ease both; }
  .ep-scrim-out { animation: ep-scrim-out 0.25s ease both; }

  .ep-card-wrap {
    position: absolute;
    inset: 0;
    will-change: transform;
    transition: transform 0.22s ease;
  }
  .ep-card-inner {
    width: 100%;
    height: 100%;
    background: ${T.white};
    border-radius: 28px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ep-stamp {
    position: absolute;
    top: 26px;
    border: 3px solid;
    border-radius: 10px;
    padding: 5px 15px;
    font-size: clamp(18px, 5vw, 24px);
    font-weight: 800;
    letter-spacing: 3px;
    font-family: Inter, sans-serif;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(4px);
    pointer-events: none;
    transition: opacity 0.06s linear;
  }
  .ep-stamp-like { left: 20px; color: ${T.green}; border-color: ${T.green}; transform: rotate(-14deg); }
  .ep-stamp-nope { right: 20px; color: ${T.red}; border-color: ${T.red}; transform: rotate(14deg); }

  .ep-tag {
    display: inline-block;
    border-radius: 100px;
    padding: 4px 11px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    white-space: nowrap;
    border: 1px solid;
  }

  .ep-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .ep-action-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    border: 1.5px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s, background 0.12s;
    box-shadow: 0 4px 18px rgba(30,58,47,0.12);
  }
  .ep-action-btn:active { transform: scale(0.9); }

  .ep-detail-scroll::-webkit-scrollbar { display: none; }
  .ep-detail-scroll { scrollbar-width: none; }

  .ep-input {
    width: 100%;
    font-family: Inter, sans-serif;
    font-size: 15px;
    padding: 13px 16px;
    border-radius: 14px;
    border: 1.5px solid ${T.border};
    background: ${T.white};
    color: ${T.forest};
    outline: none;
  }
  .ep-input:focus { border-color: ${T.green}; }

  .ep-choice {
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 16px;
    border-radius: 14px;
    border: 1.5px solid ${T.border};
    background: ${T.white};
    color: ${T.forest};
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
  }
  .ep-choice[data-active="true"] {
    border-color: ${T.green};
    background: ${T.greenPale};
    color: ${T.forestMid};
  }
`;

/* Small utility for conditionally joining class names */
export const cx = (...args) => args.filter(Boolean).join(" ");
