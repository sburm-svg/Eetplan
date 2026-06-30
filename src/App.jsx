
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { RECIPES, TAG_STYLE, DIFF_COLOR } from "./data/recipes.js";

const [onboardingDone, setOnboardingDone] = useState(false);

const [preferences, setPreferences] = useState({
  goal: null,        // healthy | weight_loss | muscle | quick
  diet: null,        // vegan | vegetarian | none
  maxTime: null,     // 10 | 20 | 30
  servings: 2,
});

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const T = {
  cream:    "#F5F0E8",
  creamDark:"#EDE8DC",
  white:    "#FFFFFF",
  forest:   "#1E3A2F",
  forestMid:"#2D5A44",
  green:    "#2D9B6F",
  greenPale:"#E1F5EE",
  greenDot: "#4DB87A",
  red:      "#D84040",
  redPale:  "#FDE8E8",
  sand:     "#6B5B3E",
  muted:    "#8A9A88",
  hint:     "#B0BFB0",
  border:   "rgba(30,58,47,0.08)",
  shadow:   "0 8px 40px rgba(30,58,47,0.14), 0 2px 8px rgba(30,58,47,0.08)",
  shadowSm: "0 2px 12px rgba(30,58,47,0.10)",
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html, body, #root { height: 100%; background: ${T.cream}; overscroll-behavior: none; }
  ::-webkit-scrollbar { width: 0; height: 0; }
  button { font-family: Inter, sans-serif; cursor: pointer; border: none; background: none; }

  @keyframes ep-fly-right {
    from { transform: translateX(0) rotate(0deg); opacity: 1; }
    to   { transform: translateX(140vw) rotate(22deg); opacity: 0; }
  }
  @keyframes ep-fly-left {
    from { transform: translateX(0) rotate(0deg); opacity: 1; }
    to   { transform: translateX(-140vw) rotate(-22deg); opacity: 0; }
  }
  @keyframes ep-rise {
    from { transform: scale(0.88) translateY(16px); opacity: 0; }
    to   { transform: scale(1) translateY(0);      opacity: 1; }
  }
  @keyframes ep-btn-pop {
    0%   { transform: scale(1); }
    40%  { transform: scale(0.88); }
    100% { transform: scale(1); }
  }
  @keyframes ep-sheet-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes ep-sheet-down {
    from { transform: translateY(0); }
    to   { transform: translateY(100%); }
  }
  @keyframes ep-scrim-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ep-scrim-out {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  .ep-fly-right { animation: ep-fly-right 0.38s cubic-bezier(0.55,0,1,0.45) forwards; }
  .ep-fly-left  { animation: ep-fly-left  0.38s cubic-bezier(0.55,0,1,0.45) forwards; }
  .ep-rise      { animation: ep-rise      0.36s cubic-bezier(0.34,1.56,0.64,1) both; }
  .ep-btn-pop   { animation: ep-btn-pop   0.28s ease both; }
  .ep-sheet-up    { animation: ep-sheet-up   0.36s cubic-bezier(0.16,1,0.3,1) both; }
  .ep-sheet-down  { animation: ep-sheet-down 0.28s cubic-bezier(0.4,0,1,1) both; }
  .ep-scrim-in    { animation: ep-scrim-in   0.3s ease both; }
  .ep-scrim-out   { animation: ep-scrim-out  0.25s ease both; }

  .ep-card-wrap {
    position: absolute; inset: 0;
    will-change: transform;
    transition: transform 0.22s ease;
  }
  .ep-card-inner {
    width: 100%; height: 100%;
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
  .ep-stamp-like  { left: 20px;  color: ${T.green}; border-color: ${T.green}; transform: rotate(-14deg); }
  .ep-stamp-nope  { right: 20px; color: ${T.red};   border-color: ${T.red};   transform: rotate( 14deg); }

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
    width: 64px; height: 64px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    border: 1.5px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s, background 0.12s;
    box-shadow: 0 4px 18px rgba(30,58,47,0.12);
  }
  .ep-action-btn:active { transform: scale(0.9); }

  .ep-detail-scroll::-webkit-scrollbar { display: none; }
  .ep-detail-scroll { scrollbar-width: none; }
`;

/* ─────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────── */
const cx = (...args) => args.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────
   TAG CHIP
───────────────────────────────────────────── */
function TagChip({ label }) {
  const s = TAG_STYLE[label] ?? { bg: "#F0F0F0", tx: "#555", bd: "#CCC" };
  return (
    <span className="ep-tag" style={{ background: s.bg, color: s.tx, borderColor: s.bd }}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SWIPE CARD
   Distinguishes tap (-> open detail) from drag (-> swipe)
───────────────────────────────────────────── */
const SWIPE_THRESHOLD = 72;
const DRAG_ROT        = 0.11;
const TAP_MOVE_LIMIT  = 8; // px — below this, treat release as a tap

function SwipeCard({ recipe, onSwipe, onOpenDetail, isTop, stackIndex }) {
  const wrapRef  = useRef(null);
  const start    = useRef(null);
  const delta    = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved    = useRef(false);
  const [liveRot,    setLiveRot]    = useState(0);
  const [liveDx,     setLiveDx]     = useState(0);
  const [liveDy,     setLiveDy]     = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyClass,   setFlyClass]   = useState("");

  useEffect(() => {
    if (!wrapRef.current) return;
    wrapRef.current.__triggerSwipe = (dir) => triggerFly(dir);
  });

  const pos = (e) =>
    e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

  const handleStart = useCallback((e) => {
    if (!isTop || flyClass) return;
    start.current = pos(e);
    dragging.current = true;
    moved.current = false;
    setIsDragging(true);
  }, [isTop, flyClass]);

  const handleMove = useCallback((e) => {
    if (!dragging.current || !isTop) return;
    e.preventDefault();
    const p = pos(e);
    const dx = p.x - start.current.x;
    const dy = p.y - start.current.y;
    if (Math.abs(dx) > TAP_MOVE_LIMIT || Math.abs(dy) > TAP_MOVE_LIMIT) moved.current = true;
    delta.current = { x: dx, y: dy };
    setLiveDx(dx);
    setLiveDy(dy);
    setLiveRot(dx * DRAG_ROT);
  }, [isTop]);

  const triggerFly = useCallback((dir) => {
    setFlyClass(dir === "right" ? "ep-fly-right" : "ep-fly-left");
    setTimeout(() => onSwipe(recipe.id, dir), 360);
  }, [onSwipe, recipe.id]);

  const handleEnd = useCallback(() => {
    if (!dragging.current || !isTop) return;
    dragging.current = false;
    setIsDragging(false);
    const dx = delta.current.x;

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      triggerFly(dx > 0 ? "right" : "left");
    } else {
      setLiveDx(0); setLiveDy(0); setLiveRot(0);
      delta.current = { x: 0, y: 0 };
      if (!moved.current) {
        // it was a tap, not a drag
        onOpenDetail(recipe);
      }
    }
  }, [isTop, triggerFly, onOpenDetail, recipe]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleMove);
  }, [handleMove]);

  const scale   = isTop ? 1 : 1 - stackIndex * 0.045;
  const ty_back = isTop ? 0 : stackIndex * 15;

  const liveStyle = isTop && isDragging
    ? { transform: `translateX(${liveDx}px) translateY(${liveDy * 0.25}px) rotate(${liveRot}deg)` }
    : {};

  const stackStyle = !isTop
    ? { transform: `translateY(${ty_back}px) scale(${scale})`, transformOrigin: "bottom center" }
    : {};

  const likeAlpha = isTop ? Math.min(1, Math.max(0,  liveDx / SWIPE_THRESHOLD)) : 0;
  const nopeAlpha = isTop ? Math.min(1, Math.max(0, -liveDx / SWIPE_THRESHOLD)) : 0;

  const wrapShadow = isTop
    ? T.shadow
    : `0 ${4 - stackIndex}px ${18 - stackIndex * 4}px rgba(30,58,47,0.08)`;

  return (
    <div
      ref={wrapRef}
      className={cx("ep-card-wrap", flyClass)}
      style={{
        zIndex: 10 - stackIndex,
        cursor: isTop ? (isDragging ? "grabbing" : "pointer") : "default",
        userSelect: "none",
        touchAction: "none",
        ...stackStyle,
        ...liveStyle,
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <div className="ep-card-inner" style={{ boxShadow: wrapShadow }}>

        <div style={{ position: "relative", height: "58%", flexShrink: 0 }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
            pointerEvents: "none",
          }} />

          <div className="ep-pill" style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            color: T.forest,
          }}>
            <span>🔥</span>
            <span>{recipe.kcal} kcal</span>
          </div>

          <div className="ep-pill" style={{
            position: "absolute", top: 14, left: 14,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            color: T.forest,
            gap: 6,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: DIFF_COLOR[recipe.difficulty] ?? T.muted,
              flexShrink: 0,
              display: "inline-block",
            }} />
            <span>{recipe.difficulty}</span>
          </div>

          <div className="ep-stamp ep-stamp-like" style={{ opacity: likeAlpha }}>LEKKER!</div>
          <div className="ep-stamp ep-stamp-nope" style={{ opacity: nopeAlpha }}>NEE</div>
        </div>

        <div style={{
          flex: 1, padding: "16px 18px 14px",
          display: "flex", flexDirection: "column", gap: 9, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <h2 style={{
              flex: 1, fontFamily: "Inter, sans-serif",
              fontSize: "clamp(16px, 4.5vw, 20px)", fontWeight: 700,
              color: T.forest, lineHeight: 1.22, margin: 0,
            }}>
              {recipe.title}
            </h2>
            <div className="ep-pill" style={{ flexShrink: 0, background: T.creamDark, color: T.sand, fontSize: 11 }}>
              <span>⏱</span>
              <span>{recipe.cookTime}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
            {recipe.tags.map(t => <TagChip key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACTION BUTTON
───────────────────────────────────────────── */
function ActionBtn({ icon, label, color, onClick, disabled }) {
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

/* ─────────────────────────────────────────────
   SWIPE SCREEN
───────────────────────────────────────────── */
function SwipeScreen({ deck, onSwipe, onOpenDetail }) {
  const topCardRef = useRef(null);

  const triggerBtn = (dir) => {
    const el = topCardRef.current;
    if (el?.__triggerSwipe) el.__triggerSwipe(dir);
  };

  if (deck.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", background: T.creamDark,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42,
        }}>✨</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Alles gezien!</p>
        <p style={{ fontSize: 14, color: T.muted }}>Bekijk je bewaarde recepten</p>
      </div>
    );
  }

  const visible = deck.slice(0, 3);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, position: "relative", margin: "0 16px" }}>
        {[...visible].reverse().map((recipe, ri) => {
          const si = visible.length - 1 - ri;
          return (
            <SwipeCard
              key={recipe.id}
              recipe={recipe}
              onSwipe={onSwipe}
              onOpenDetail={onOpenDetail}
              isTop={si === 0}
              stackIndex={si}
              ref={si === 0 ? topCardRef : undefined}
            />
          );
        })}
        <div ref={topCardRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }} />
      </div>

      <p style={{
        textAlign: "center", fontSize: 12, color: T.hint,
        fontFamily: "Inter, sans-serif", fontWeight: 500, padding: "12px 0 8px",
      }}>
        Tik voor details · swipe of gebruik de knoppen
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingBottom: 24 }}>
        <ActionBtn icon="✕" label="Overslaan" color={T.red}   onClick={() => triggerBtn("left")}  disabled={deck.length === 0} />
        <ActionBtn icon="♥" label="Bewaren"   color={T.green} onClick={() => triggerBtn("right")} disabled={deck.length === 0} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FAVORITE CARD  (grid item)
───────────────────────────────────────────── */
function FavoriteCard({ recipe, onRemove, onOpenDetail }) {
  return (
    <div
      className="ep-rise"
      onClick={() => onOpenDetail(recipe)}
      style={{
        background: T.white, borderRadius: 20, overflow: "hidden",
        boxShadow: T.shadowSm, display: "flex", flexDirection: "column", cursor: "pointer",
      }}
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
          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: T.forest,
          lineHeight: 1.3, margin: 0,
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

/* ─────────────────────────────────────────────
   FAVORITES SCREEN
───────────────────────────────────────────── */
function FavoritesScreen({ favorites, onRemove, onOpenDetail }) {
  if (favorites.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", background: T.creamDark,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42,
        }}>🍽️</div>
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

/* ─────────────────────────────────────────────
   NAV BAR
───────────────────────────────────────────── */
function NavBar({ tab, onTab, favCount }) {
  const items = useMemo(() => [
    { id: "swipe",     icon: "🔍", label: "Ontdekken" },
    { id: "favorites", icon: "♥",  label: favCount > 0 ? `Bewaard (${favCount})` : "Bewaard" },
  ], [favCount]);

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
              alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", position: "relative",
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

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header({ tab, deckLen, favLen }) {
  const subtitle = tab === "swipe" ? `${deckLen} recepten te ontdekken` : `${favLen} bewaard`;
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
          Eetplan
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: T.greenDot, marginBottom: 10 }} />
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 4 }}>{subtitle}</p>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: "50%", background: T.forest,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: T.greenDot, fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 700, flexShrink: 0,
      }}>J</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NUTRITION CHIP (for the nutrition grid)
───────────────────────────────────────────── */
function NutritionStat({ label, value, unit, color }) {
  return (
    <div style={{
      flex: 1, background: T.creamDark, borderRadius: 16,
      padding: "12px 8px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 2,
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

/* ─────────────────────────────────────────────
   RECIPE DETAIL — full-screen modal, Apple-Maps
   style slide-up sheet.
───────────────────────────────────────────── */
function RecipeDetail({ recipe, isFavorite, onClose, onToggleFavorite, closing }) {
  const scrollRef = useRef(null);

  // reset scroll position whenever a new recipe opens
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [recipe?.id]);

  if (!recipe) return null;

  return (
    <div
      className={cx(closing ? "ep-scrim-out" : "ep-scrim-in")}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(15,25,20,0.45)",
        display: "flex", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx(closing ? "ep-sheet-down" : "ep-sheet-up")}
        style={{
          width: "100%", maxWidth: 430,
          height: "100%",
          background: T.cream,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -10px 50px rgba(0,0,0,0.3)",
        }}
      >
        {/* ── Scrollable content ── */}
        <div ref={scrollRef} className="ep-detail-scroll" style={{ flex: 1, overflowY: "auto" }}>

          {/* Hero image */}
          <div style={{ position: "relative", width: "100%", height: 300, flexShrink: 0 }}>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 110,
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.35))",
            }} />

            {/* Back button — floating, top-left */}
            <button
              aria-label="Terug"
              onClick={onClose}
              style={{
                position: "absolute", top: 18, left: 18,
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(10px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, color: T.forest,
                boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                cursor: "pointer",
              }}
            >←</button>

            {/* Favorite toggle — floating, top-right */}
            <button
              aria-label="Bewaren"
              onClick={onToggleFavorite}
              style={{
                position: "absolute", top: 18, right: 18,
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(10px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, color: isFavorite ? T.red : T.forest,
                boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                cursor: "pointer",
              }}
            >{isFavorite ? "♥" : "♡"}</button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 22px 130px", display: "flex", flexDirection: "column", gap: 22 }}>

            {/* Title */}
            <h1 style={{
              fontFamily: "Inter, sans-serif", fontSize: "clamp(22px, 6vw, 27px)",
              fontWeight: 800, color: T.forest, lineHeight: 1.2, margin: 0,
            }}>
              {recipe.title}
            </h1>

            {/* Quick facts row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="ep-pill" style={{ background: T.white, color: T.forest, boxShadow: T.shadowSm }}>
                <span>⏱</span><span>{recipe.cookTime}</span>
              </div>
              <div className="ep-pill" style={{ background: T.white, color: T.forest, boxShadow: T.shadowSm }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: DIFF_COLOR[recipe.difficulty] ?? T.muted, display: "inline-block",
                }} />
                <span>{recipe.difficulty}</span>
              </div>
              <div className="ep-pill" style={{ background: T.white, color: T.forest, boxShadow: T.shadowSm }}>
                <span>🍽</span><span>{recipe.servings} {recipe.servings === 1 ? "portie" : "porties"}</span>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {recipe.tags.map(t => <TagChip key={t} label={t} />)}
            </div>

            {/* Nutrition */}
            {recipe.nutrition && (
              <div>
                <SectionTitle>Voedingswaarden</SectionTitle>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <NutritionStat label="KCAL"    value={recipe.nutrition.calories} unit=""  color={T.forest} />
                  <NutritionStat label="EIWIT"   value={recipe.nutrition.protein}  unit="g" color={T.green} />
                  <NutritionStat label="KOOLH."  value={recipe.nutrition.carbs}    unit="g" color="#D89A2D" />
                  <NutritionStat label="VET"     value={recipe.nutrition.fat}      unit="g" color="#C45A5A" />
                </div>
              </div>
            )}

            {/* Ingredients */}
            {recipe.ingredients?.length > 0 && (
              <div>
                <SectionTitle>Ingrediënten</SectionTitle>
                <div style={{
                  marginTop: 10, background: T.white, borderRadius: 18,
                  boxShadow: T.shadowSm, overflow: "hidden",
                }}>
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 16px",
                        borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${T.border}` : "none",
                      }}
                    >
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: T.greenDot, flexShrink: 0,
                      }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: T.forest, lineHeight: 1.4 }}>
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {recipe.instructions?.length > 0 && (
              <div>
                <SectionTitle>Bereidingswijze</SectionTitle>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
                  {recipe.instructions.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <div style={{
                        flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
                        background: T.forest, color: T.greenDot,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700,
                      }}>{i + 1}</div>
                      <p style={{
                        fontFamily: "Inter, sans-serif", fontSize: 14, color: T.forest,
                        lineHeight: 1.55, margin: 0, paddingTop: 3,
                      }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky footer actions ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "14px 22px",
          paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
          background: "linear-gradient(to top, " + T.cream + " 60%, transparent)",
          display: "flex", gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "15px 0", borderRadius: 16,
              background: T.white, color: T.forest,
              fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700,
              boxShadow: T.shadowSm, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            ← Terug
          </button>
          <button
            onClick={onToggleFavorite}
            style={{
              flex: 2, padding: "15px 0", borderRadius: 16,
              background: isFavorite ? T.white : T.forest,
              color: isFavorite ? T.red : T.white,
              border: isFavorite ? `1.5px solid ${T.red}40` : "none",
              fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700,
              boxShadow: T.shadowSm, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
          >
            <span style={{ fontSize: 16 }}>{isFavorite ? "♥" : "♡"}</span>
            {isFavorite ? "Bewaard" : "Toevoegen aan favorieten"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 800,
      color: T.forest, letterSpacing: 0.2, margin: 0,
      textTransform: "uppercase",
    }}>
      {children}
    </h3>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [tab,           setTab]           = useState("swipe");
  const [deck,           setDeck]          = useState(RECIPES);
  const [favorites,      setFavorites]     = useState([]);
  const [activeRecipe,   setActiveRecipe]  = useState(null); // recipe object or null
  const [detailClosing,  setDetailClosing] = useState(false);

  const handleSwipe = useCallback((id, dir) => {
    setDeck(prev => prev.filter(r => r.id !== id));
    if (dir === "right") {
      const recipe = RECIPES.find(r => r.id === id);
      if (recipe) setFavorites(prev => prev.some(r => r.id === id) ? prev : [...prev, recipe]);
    }
  }, []);

  const handleRemove = useCallback((id) => {
    setFavorites(prev => prev.filter(r => r.id !== id));
  }, []);

  const openDetail = useCallback((recipe) => {
    setDetailClosing(false);
    setActiveRecipe(recipe);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailClosing(true);
    setTimeout(() => {
      setActiveRecipe(null);
      setDetailClosing(false);
    }, 280);
  }, []);

  const toggleFavoriteActive = useCallback(() => {
    if (!activeRecipe) return;
    setFavorites(prev => {
      const exists = prev.some(r => r.id === activeRecipe.id);
      if (exists) return prev.filter(r => r.id !== activeRecipe.id);
      return [...prev, activeRecipe];
    });
  }, [activeRecipe]);

  const isActiveFavorite = activeRecipe
    ? favorites.some(r => r.id === activeRecipe.id)
    : false;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{
        display: "flex", flexDirection: "column", height: "100dvh",
        maxWidth: 430, margin: "0 auto", background: T.cream,
        fontFamily: "Inter, sans-serif", overflow: "hidden", position: "relative",
      }}>
        <Header tab={tab} deckLen={deck.length} favLen={favorites.length} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {tab === "swipe"
            ? <SwipeScreen deck={deck} onSwipe={handleSwipe} onOpenDetail={openDetail} />
            : <FavoritesScreen favorites={favorites} onRemove={handleRemove} onOpenDetail={openDetail} />
          }
        </div>

        <NavBar tab={tab} onTab={setTab} favCount={favorites.length} />
      </div>

      {activeRecipe && (
        <RecipeDetail
          recipe={activeRecipe}
          isFavorite={isActiveFavorite}
          onClose={closeDetail}
          onToggleFavorite={toggleFavoriteActive}
          closing={detailClosing}
        />
      )}
    </>
  );
  const filteredRecipes = useMemo(() => {
  return RECIPES.filter(r => {
    if (preferences.maxTime) {
      const minutes = parseInt(r.cookTime);
      if (!isNaN(minutes) && minutes > preferences.maxTime) return false;
    }

    if (preferences.diet === "vegetarian" && !r.tags.includes("vegetarisch")) {
      return false;
    }

    if (preferences.diet === "vegan" && !r.tags.includes("vegan")) {
      return false;
    }

    return true;
  });
}, [preferences]);
  
}

