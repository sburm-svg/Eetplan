import { useState, useRef, useEffect, useCallback, useMemo } from "react";

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
   MOCK DATA  (20 recipes, Dutch labels)
───────────────────────────────────────────── */
const RECIPES = [
  { id:  1, title: "Avocado Toast met Gepocheerd Ei",    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&q=85", cookTime: "10 min", difficulty: "Makkelijk", kcal: 320, tags: ["vegetarisch","snel","gezond"] },
  { id:  2, title: "Thaise Groene Curry",                image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=700&q=85", cookTime: "30 min", difficulty: "Gemiddeld", kcal: 480, tags: ["pittig","vegan"] },
  { id:  3, title: "Margherita Pizza",                   image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=85", cookTime: "25 min", difficulty: "Gemiddeld", kcal: 560, tags: ["vegetarisch","oven","klassiek"] },
  { id:  4, title: "Zalm Poké Bowl",                     image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=85", cookTime: "15 min", difficulty: "Makkelijk", kcal: 420, tags: ["gezond","snel","vis"] },
  { id:  5, title: "Franse Omelette",                    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=700&q=85", cookTime:  "8 min", difficulty: "Makkelijk", kcal: 280, tags: ["vegetarisch","snel","ontbijt"] },
  { id:  6, title: "Taco's al Pastor",                   image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=85", cookTime: "40 min", difficulty: "Gemiddeld", kcal: 510, tags: ["pittig","vlees"] },
  { id:  7, title: "Paddenstoelen Risotto",               image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=700&q=85", cookTime: "45 min", difficulty: "Moeilijk",  kcal: 490, tags: ["vegetarisch","comfort","oven"] },
  { id:  8, title: "Acai Ontbijtbowl",                   image: "https://images.unsplash.com/photo-1490323914169-4b5bc9cc4f9b?w=700&q=85", cookTime:  "5 min", difficulty: "Makkelijk", kcal: 310, tags: ["vegan","gezond","snel"] },
  { id:  9, title: "Spaghetti Carbonara",                image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&q=85", cookTime: "20 min", difficulty: "Gemiddeld", kcal: 620, tags: ["klassiek","snel"] },
  { id: 10, title: "Shakshuka",                          image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=700&q=85", cookTime: "25 min", difficulty: "Makkelijk", kcal: 340, tags: ["vegetarisch","pittig","ontbijt"] },
  { id: 11, title: "Chicken Tikka Masala",               image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&q=85", cookTime: "50 min", difficulty: "Moeilijk",  kcal: 530, tags: ["pittig","vlees"] },
  { id: 12, title: "Griekse Salade",                     image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=85", cookTime: "10 min", difficulty: "Makkelijk", kcal: 240, tags: ["vegetarisch","gezond","snel"] },
  { id: 13, title: "Miso Ramen",                         image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=85", cookTime: "35 min", difficulty: "Gemiddeld", kcal: 570, tags: ["comfort","warm"] },
  { id: 14, title: "Bananenpannenkoeken",                image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&q=85", cookTime: "20 min", difficulty: "Makkelijk", kcal: 380, tags: ["vegetarisch","ontbijt","zoet"] },
  { id: 15, title: "Caprese Salade",                     image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=700&q=85", cookTime:  "5 min", difficulty: "Makkelijk", kcal: 290, tags: ["vegetarisch","snel","gezond"] },
  { id: 16, title: "Pulled Pork Sliders",                image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=85", cookTime:  "4 uur", difficulty: "Moeilijk",  kcal: 680, tags: ["vlees","comfort","oven"] },
  { id: 17, title: "Groenten Roerbak",                   image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&q=85", cookTime: "15 min", difficulty: "Makkelijk", kcal: 280, tags: ["vegan","snel","gezond"] },
  { id: 18, title: "Citroen Taarttje",                   image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=700&q=85", cookTime:  "1 uur", difficulty: "Moeilijk",  kcal: 420, tags: ["vegetarisch","zoet","dessert","oven"] },
  { id: 19, title: "Pesto Pasta",                        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700&q=85", cookTime: "15 min", difficulty: "Makkelijk", kcal: 540, tags: ["vegetarisch","snel","klassiek"] },
  { id: 20, title: "Bosbessen Smoothie Bowl",            image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=700&q=85", cookTime:  "5 min", difficulty: "Makkelijk", kcal: 290, tags: ["vegan","gezond","snel","ontbijt"] },
];

/* ─────────────────────────────────────────────
   TAG COLOUR MAP
───────────────────────────────────────────── */
const TAG_STYLE = {
  vegetarisch: { bg:"#E8F5E1", tx:"#2D6A1F", bd:"#A8D68A" },
  vegan:       { bg:"#E1F5EE", tx:"#0F6E56", bd:"#5DCAA5" },
  gezond:      { bg:"#E3F4FB", tx:"#155D7A", bd:"#7BCCE8" },
  snel:        { bg:"#FEF3E2", tx:"#7A4A0A", bd:"#F5C060" },
  pittig:      { bg:"#FDE8E8", tx:"#8B1F1F", bd:"#F09595" },
  vlees:       { bg:"#F5EBE0", tx:"#6B3A1F", bd:"#D4A57A" },
  vis:         { bg:"#E3EEF8", tx:"#1A4A6B", bd:"#7AADD4" },
  ontbijt:     { bg:"#FFF3E0", tx:"#7A4A00", bd:"#FFCC80" },
  zoet:        { bg:"#FCE4EC", tx:"#7B1F3A", bd:"#F48FB1" },
  dessert:     { bg:"#EDE7F6", tx:"#4A1580", bd:"#B39DDB" },
  comfort:     { bg:"#EDE7F6", tx:"#4A1580", bd:"#B39DDB" },
  klassiek:    { bg:"#E8EAF6", tx:"#283593", bd:"#9FA8DA" },
  warm:        { bg:"#FBE9E7", tx:"#7A2A12", bd:"#FFAB91" },
  oven:        { bg:"#FFF8E1", tx:"#6D4C00", bd:"#FFD54F" },
};

/* ─────────────────────────────────────────────
   DIFFICULTY DOT
───────────────────────────────────────────── */
const DIFF_COLOR = {
  Makkelijk: "#2D9B6F",
  Gemiddeld: "#F5A623",
  Moeilijk:  "#D84040",
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
  .ep-fly-right { animation: ep-fly-right 0.38s cubic-bezier(0.55,0,1,0.45) forwards; }
  .ep-fly-left  { animation: ep-fly-left  0.38s cubic-bezier(0.55,0,1,0.45) forwards; }
  .ep-rise      { animation: ep-rise      0.36s cubic-bezier(0.34,1.56,0.64,1) both; }
  .ep-btn-pop   { animation: ep-btn-pop   0.28s ease both; }

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
`;

/* ─────────────────────────────────────────────
   UTILITY: css merge
───────────────────────────────────────────── */
const cx = (...args) => args.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────
   TAG CHIP
───────────────────────────────────────────── */
function TagChip({ label }) {
  const s = TAG_STYLE[label] ?? { bg:"#F0F0F0", tx:"#555", bd:"#CCC" };
  return (
    <span
      className="ep-tag"
      style={{ background: s.bg, color: s.tx, borderColor: s.bd }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SWIPE CARD
   Handles touch + mouse drag entirely in JS,
   flies off via CSS animation class on release.
───────────────────────────────────────────── */
const SWIPE_THRESHOLD = 72;   // px before it counts as a swipe
const DRAG_ROT        = 0.11; // degrees per px of drag

function SwipeCard({ recipe, onSwipe, isTop, stackIndex }) {
  const wrapRef  = useRef(null);
  const start    = useRef(null);      // { x, y }
  const delta    = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const [liveRot,   setLiveRot]   = useState(0);
  const [liveDx,    setLiveDx]    = useState(0);
  const [liveDy,    setLiveDy]    = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyClass,  setFlyClass]  = useState("");

  /* expose programmatic swipe (used by buttons) */
  useEffect(() => {
    if (!wrapRef.current) return;
    wrapRef.current.__triggerSwipe = (dir) => triggerFly(dir);
  });

  const pos = (e) =>
    e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

  const handleStart = useCallback((e) => {
    if (!isTop || flyClass) return;
    start.current = pos(e);
    dragging.current = true;
    setIsDragging(true);
  }, [isTop, flyClass]);

  const handleMove = useCallback((e) => {
    if (!dragging.current || !isTop) return;
    e.preventDefault();
    const p = pos(e);
    const dx = p.x - start.current.x;
    const dy = p.y - start.current.y;
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
    }
  }, [isTop, triggerFly]);

  /* bind passive:false touchmove so preventDefault works */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleMove);
  }, [handleMove]);

  /* stack geometry for back-cards */
  const scale   = isTop ? 1 : 1 - stackIndex * 0.045;
  const ty_back = isTop ? 0 : stackIndex * 15;

  /* live drag transform (top card only) */
  const liveStyle = isTop && isDragging
    ? { transform: `translateX(${liveDx}px) translateY(${liveDy * 0.25}px) rotate(${liveRot}deg)` }
    : {};

  /* back-card static transform */
  const stackStyle = !isTop
    ? { transform: `translateY(${ty_back}px) scale(${scale})`, transformOrigin: "bottom center" }
    : {};

  const likeAlpha = isTop
    ? Math.min(1, Math.max(0,  liveDx / SWIPE_THRESHOLD))
    : 0;
  const nopeAlpha = isTop
    ? Math.min(1, Math.max(0, -liveDx / SWIPE_THRESHOLD))
    : 0;

  const wrapShadow = isTop
    ? T.shadow
    : `0 ${4 - stackIndex}px ${18 - stackIndex * 4}px rgba(30,58,47,0.08)`;

  return (
    <div
      ref={wrapRef}
      className={cx("ep-card-wrap", flyClass)}
      style={{
        zIndex: 10 - stackIndex,
        cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
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

        {/* ── Photo ── */}
        <div style={{ position: "relative", height: "58%", flexShrink: 0 }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
          />

          {/* bottom fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
            pointerEvents: "none",
          }} />

          {/* kcal pill */}
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

          {/* difficulty */}
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

          {/* LEKKER stamp */}
          <div
            className="ep-stamp ep-stamp-like"
            style={{ opacity: likeAlpha }}
          >LEKKER!</div>

          {/* NEE stamp */}
          <div
            className="ep-stamp ep-stamp-nope"
            style={{ opacity: nopeAlpha }}
          >NEE</div>
        </div>

        {/* ── Info ── */}
        <div style={{
          flex: 1,
          padding: "16px 18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 9,
          overflow: "hidden",
        }}>
          {/* title + time */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <h2 style={{
              flex: 1,
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(16px, 4.5vw, 20px)",
              fontWeight: 700,
              color: T.forest,
              lineHeight: 1.22,
              margin: 0,
            }}>
              {recipe.title}
            </h2>

            <div className="ep-pill" style={{
              flexShrink: 0,
              background: T.creamDark,
              color: T.sand,
              fontSize: 11,
            }}>
              <span>⏱</span>
              <span>{recipe.cookTime}</span>
            </div>
          </div>

          {/* tags */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: "auto",
          }}>
            {recipe.tags.map(t => <TagChip key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACTION BUTTON  (like / dislike)
───────────────────────────────────────────── */
function ActionBtn({ icon, label, color, paleBg, onClick, disabled }) {
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
      style={{
        background: T.white,
        borderColor: `${color}30`,
        color,
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {icon}
    </button>
  );
}

/* ─────────────────────────────────────────────
   SWIPE SCREEN
───────────────────────────────────────────── */
function SwipeScreen({ deck, onSwipe }) {
  const topCardRef = useRef(null);

  const triggerBtn = (dir) => {
    const el = topCardRef.current;
    if (el?.__triggerSwipe) el.__triggerSwipe(dir);
  };

  if (deck.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: T.creamDark,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42,
        }}>✨</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Alles gezien!</p>
        <p style={{ fontSize: 14, color: T.muted }}>Bekijk je bewaarde recepten</p>
      </div>
    );
  }

  const visible = deck.slice(0, 3);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Card stack ── */}
      <div style={{ flex: 1, position: "relative", margin: "0 16px" }}>
        {[...visible].reverse().map((recipe, ri) => {
          const si = visible.length - 1 - ri; // 0 = top
          return (
            <SwipeCard
              key={recipe.id}
              recipe={recipe}
              onSwipe={onSwipe}
              isTop={si === 0}
              stackIndex={si}
              ref={si === 0 ? topCardRef : undefined}
            />
          );
        })}

        {/* invisible ref shim on top card */}
        <div
          ref={topCardRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }}
        />
      </div>

      {/* ── Hint ── */}
      <p style={{
        textAlign: "center",
        fontSize: 12,
        color: T.hint,
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        padding: "12px 0 8px",
      }}>
        Swipe of gebruik de knoppen
      </p>

      {/* ── Action buttons ── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        paddingBottom: 24,
      }}>
        <ActionBtn
          icon="✕"
          label="Overslaan"
          color={T.red}
          paleBg={T.redPale}
          onClick={() => triggerBtn("left")}
          disabled={deck.length === 0}
        />
        <ActionBtn
          icon="♥"
          label="Bewaren"
          color={T.green}
          paleBg={T.greenPale}
          onClick={() => triggerBtn("right")}
          disabled={deck.length === 0}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FAVORITE CARD  (grid item)
───────────────────────────────────────────── */
function FavoriteCard({ recipe, onRemove }) {
  return (
    <div
      className="ep-rise"
      style={{
        background: T.white,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: T.shadowSm,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
        />
        <button
          aria-label="Verwijder"
          onClick={() => onRemove(recipe.id)}
          style={{
            position: "absolute", top: 8, right: 8,
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            color: T.red, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.14)",
            cursor: "pointer", border: "none",
          }}
        >✕</button>
      </div>

      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 13, fontWeight: 700, color: T.forest,
          lineHeight: 1.3, margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {recipe.title}
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "Inter, sans-serif", fontSize: 11, color: T.muted, fontWeight: 500,
        }}>
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
function FavoritesScreen({ favorites, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: T.creamDark,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42,
        }}>🍽️</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Nog niets bewaard</p>
        <p style={{ fontSize: 14, color: T.muted }}>Swipe rechts op recepten die je lekker vindt</p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "8px 16px 110px",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      }}>
        {favorites.map(r => (
          <FavoriteCard key={r.id} recipe={r} onRemove={onRemove} />
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
      display: "flex",
      background: T.white,
      borderRadius: "24px 24px 0 0",
      boxShadow: "0 -4px 24px rgba(30,58,47,0.09)",
      flexShrink: 0,
      paddingBottom: "env(safe-area-inset-bottom, 4px)",
    }}>
      {items.map(({ id, icon, label }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => onTab(id)}
            style={{
              flex: 1,
              padding: "14px 8px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* top active bar */}
            {active && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 36,
                height: 3,
                borderRadius: "0 0 4px 4px",
                background: T.forest,
              }} />
            )}
            <span style={{
              fontSize: active ? 22 : 20,
              filter: active ? "none" : "grayscale(1) opacity(0.4)",
              transition: "font-size 0.15s",
            }}>{icon}</span>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              fontWeight: active ? 700 : 500,
              color: active ? T.forest : T.hint,
              transition: "color 0.15s",
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
  const subtitle = tab === "swipe"
    ? `${deckLen} recepten te ontdekken`
    : `${favLen} bewaard`;

  return (
    <div style={{
      padding: "52px 22px 14px",
      background: T.cream,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(22px, 6vw, 28px)",
          fontWeight: 800,
          color: T.forest,
          letterSpacing: -0.8,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          Eetplan
          <span style={{
            display: "inline-block",
            width: 8, height: 8,
            borderRadius: "50%",
            background: T.greenDot,
            marginBottom: 10,
          }} />
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: T.muted,
          fontWeight: 500,
          marginTop: 4,
        }}>{subtitle}</p>
      </div>

      {/* avatar */}
      <div style={{
        width: 42, height: 42,
        borderRadius: "50%",
        background: T.forest,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: T.greenDot,
        fontFamily: "Inter, sans-serif",
        fontSize: 17, fontWeight: 700,
        flexShrink: 0,
      }}>J</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [tab,       setTab]       = useState("swipe");
  const [deck,      setDeck]      = useState(RECIPES);
  const [favorites, setFavorites] = useState([]);

  const handleSwipe = useCallback((id, dir) => {
    setDeck(prev => prev.filter(r => r.id !== id));
    if (dir === "right") {
      const recipe = RECIPES.find(r => r.id === id);
      if (recipe) setFavorites(prev =>
        prev.some(r => r.id === id) ? prev : [...prev, recipe]
      );
    }
  }, []);

  const handleRemove = useCallback((id) => {
    setFavorites(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        maxWidth: 430,
        margin: "0 auto",
        background: T.cream,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}>
        <Header tab={tab} deckLen={deck.length} favLen={favorites.length} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {tab === "swipe"
            ? <SwipeScreen deck={deck}           onSwipe={handleSwipe} />
            : <FavoritesScreen favorites={favorites} onRemove={handleRemove} />
          }
        </div>

        <NavBar tab={tab} onTab={setTab} favCount={favorites.length} />
      </div>
    </>
  );
}
