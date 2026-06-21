import { useState, useRef, useEffect, useCallback } from "react";

const RECIPES = [
  { id: 1, title: "Avocado Toast met Gepocheerd Ei", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&q=85", cookTime: "10 min", kcal: 320, tags: ["vegetarisch", "snel", "gezond"], description: "Romige avocado op zuurdesem met een perfect zacht gepocheerd ei." },
  { id: 2, title: "Thaise Groene Curry", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=700&q=85", cookTime: "30 min", kcal: 480, tags: ["pittig", "vegan"], description: "Geurige kokos groene curry met verse groenten en jasmijnrijst." },
  { id: 3, title: "Margherita Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=85", cookTime: "25 min", kcal: 560, tags: ["vegetarisch", "klassiek"], description: "Knapperige dunne bodem met San Marzano tomaat, mozzarella en basilicum." },
  { id: 4, title: "Zalm Poké Bowl", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=85", cookTime: "15 min", kcal: 420, tags: ["gezond", "snel", "vis"], description: "Verse zalm op sushirijst met komkommer, edamame en sesamdressing." },
  { id: 5, title: "Franse Omelette", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=700&q=85", cookTime: "8 min", kcal: 280, tags: ["vegetarisch", "snel", "ontbijt"], description: "Zijdezachte, boterige omelette gevouwen op de Franse manier." },
  { id: 6, title: "Taco's al Pastor", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=85", cookTime: "40 min", kcal: 510, tags: ["pittig", "vlees"], description: "Gemarineerd varkensvlees met ananas, koriander en ui in maïstortilla." },
  { id: 7, title: "Paddenstoelen Risotto", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=700&q=85", cookTime: "45 min", kcal: 490, tags: ["vegetarisch", "comfort"], description: "Romige arborio rijst met wilde paddenstoelen, parmezaan en verse tijm." },
  { id: 8, title: "Acai Ontbijtbowl", image: "https://images.unsplash.com/photo-1490323914169-4b5bc9cc4f9b?w=700&q=85", cookTime: "5 min", kcal: 310, tags: ["vegan", "gezond", "snel"], description: "Dikke acai smoothie met granola, verse bessen en een scheutje honing." },
  { id: 9, title: "Spaghetti Carbonara", image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&q=85", cookTime: "20 min", kcal: 620, tags: ["klassiek", "snel"], description: "Romeinse pasta met guanciale, pecorino en een zijdezachte eisaus." },
  { id: 10, title: "Shakshuka", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=700&q=85", cookTime: "25 min", kcal: 340, tags: ["vegetarisch", "pittig", "ontbijt"], description: "Eieren gepocheerd in gekruide tomaten-paprikasaus met knapperig brood." },
  { id: 11, title: "Chicken Tikka Masala", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&q=85", cookTime: "50 min", kcal: 530, tags: ["pittig", "vlees"], description: "Malse kip in rijke, aromatische tomaten-roomsaus met warme kruiden." },
  { id: 12, title: "Griekse Salade", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=85", cookTime: "10 min", kcal: 240, tags: ["vegetarisch", "gezond", "snel"], description: "Knapperige komkommer, tomaat, olijven en feta met citroen-oreganodressing." },
  { id: 13, title: "Miso Ramen", image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=85", cookTime: "35 min", kcal: 570, tags: ["comfort", "warm"], description: "Rijke misobouillon met chashu varkensvlees, zacht ei, maïs en noodles." },
  { id: 14, title: "Bananenpannenkoeken", image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&q=85", cookTime: "20 min", kcal: 380, tags: ["vegetarisch", "ontbijt", "zoet"], description: "Luchtige gouden pannenkoeken met gekarameliseerde banaan en ahornsiroop." },
  { id: 15, title: "Caprese Salade", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=700&q=85", cookTime: "5 min", kcal: 290, tags: ["vegetarisch", "snel", "gezond"], description: "Heirloom tomaten, buffelmozzarella, verse basilicum en oude balsamico." },
  { id: 16, title: "Pulled Pork Sliders", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=85", cookTime: "4 uur", kcal: 680, tags: ["vlees", "comfort"], description: "Langzaam gegaard gerookt pulled pork op briochebroodjes met pickles en koolsla." },
  { id: 17, title: "Groenten Roerbak", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&q=85", cookTime: "15 min", kcal: 280, tags: ["vegan", "snel", "gezond"], description: "Seizoensgroenten gebakken in gember-knoflooksaus over gestoomde rijst." },
  { id: 18, title: "Citroen Taarttje", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=700&q=85", cookTime: "1 uur", kcal: 420, tags: ["vegetarisch", "zoet", "dessert"], description: "Boterige deegbodem gevuld met scherpe, zijdezachte citroencrème en meringue." },
  { id: 19, title: "Pesto Pasta", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700&q=85", cookTime: "15 min", kcal: 540, tags: ["vegetarisch", "snel", "klassiek"], description: "Verse basilicumpesto met pijnboompitten en parmezaan door al dente linguine." },
  { id: 20, title: "Blauwe Bessen Bowl", image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=700&q=85", cookTime: "5 min", kcal: 290, tags: ["vegan", "gezond", "snel", "ontbijt"], description: "Dikke bosbessen-banaan smoothie met zaden, noten en vers fruit." },
];

const TAG_COLORS = {
  vegetarisch: { bg: "#E8F5E1", text: "#2D6A1F", border: "#A8D68A" },
  vegan: { bg: "#E1F5EE", text: "#0F6E56", border: "#5DCAA5" },
  gezond: { bg: "#E3F4FB", text: "#155D7A", border: "#7BCCE8" },
  snel: { bg: "#FEF3E2", text: "#7A4A0A", border: "#F5C060" },
  pittig: { bg: "#FDE8E8", text: "#8B1F1F", border: "#F09595" },
  vlees: { bg: "#F5EBE0", text: "#6B3A1F", border: "#D4A57A" },
  vis: { bg: "#E3EEF8", text: "#1A4A6B", border: "#7AADD4" },
  ontbijt: { bg: "#FFF3E0", text: "#7A4A00", border: "#FFCC80" },
  zoet: { bg: "#FCE4EC", text: "#7B1F3A", border: "#F48FB1" },
  dessert: { bg: "#EDE7F6", text: "#4A1580", border: "#B39DDB" },
  comfort: { bg: "#EDE7F6", text: "#4A1580", border: "#B39DDB" },
  klassiek: { bg: "#E8EAF6", text: "#283593", border: "#9FA8DA" },
  warm: { bg: "#FBE9E7", text: "#7A2A12", border: "#FFAB91" },
};

const SWIPE_THRESHOLD = 75;

function Tag({ label }) {
  const c = TAG_COLORS[label] || { bg: "#F0F0F0", text: "#555", border: "#CCC" };
  return (
    <span style={{
      display: "inline-block",
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 100,
      padding: "4px 12px",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function SwipeCard({ recipe, onSwipe, isTop, stackIndex }) {
  const cardRef = useRef(null);
  const startPos = useRef(null);
  const currentDelta = useRef({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const flying = useRef(false);

  const pos = (e) => e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

  const onStart = useCallback((e) => {
    if (!isTop || flying.current) return;
    startPos.current = pos(e);
    setDrag(d => ({ ...d, active: true }));
  }, [isTop]);

  const onMove = useCallback((e) => {
    if (!startPos.current || !isTop) return;
    e.preventDefault();
    const p = pos(e);
    const dx = p.x - startPos.current.x;
    const dy = p.y - startPos.current.y;
    currentDelta.current = { x: dx, y: dy };
    setDrag({ x: dx, y: dy, active: true });
  }, [isTop]);

  const onEnd = useCallback(() => {
    if (!startPos.current || !isTop) return;
    const { x, y } = currentDelta.current;
    startPos.current = null;
    if (Math.abs(x) >= SWIPE_THRESHOLD) {
      flying.current = true;
      const flyX = x > 0 ? window.innerWidth * 1.6 : -window.innerWidth * 1.6;
      setDrag({ x: flyX, y: y * 1.5, active: false });
      setTimeout(() => { onSwipe(recipe.id, x > 0 ? "right" : "left"); flying.current = false; }, 320);
    } else {
      currentDelta.current = { x: 0, y: 0 };
      setDrag({ x: 0, y: 0, active: false });
    }
  }, [isTop, onSwipe, recipe.id]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => el.removeEventListener("touchmove", onMove);
  }, [onMove]);

  const rot = drag.x * 0.10;
  const likeAlpha = Math.min(1, Math.max(0, drag.x / SWIPE_THRESHOLD));
  const nopeAlpha = Math.min(1, Math.max(0, -drag.x / SWIPE_THRESHOLD));
  const scale = isTop ? 1 : 1 - stackIndex * 0.045;
  const ty = isTop ? drag.y * 0.25 : stackIndex * 14;
  const transition = drag.active ? "none" : "transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  return (
    <div
      ref={cardRef}
      onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
      onTouchStart={onStart} onTouchEnd={onEnd}
      style={{
        position: "absolute", inset: 0,
        zIndex: 10 - stackIndex,
        transform: `translateX(${drag.x}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`,
        transition,
        cursor: isTop ? (drag.active ? "grabbing" : "grab") : "default",
        userSelect: "none", touchAction: "none",
      }}
    >
      <div style={{
        height: "100%",
        borderRadius: 28,
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: isTop
          ? "0 8px 40px rgba(30,58,47,0.18), 0 2px 10px rgba(30,58,47,0.10)"
          : `0 ${4 - stackIndex}px ${20 - stackIndex * 4}px rgba(30,58,47,0.10)`,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Photo */}
        <div style={{ position: "relative", flexShrink: 0, height: "58%" }}>
          <img
            src={recipe.image} alt={recipe.title} draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
          />
          {/* Subtle bottom fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 72,
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.18))",
            pointerEvents: "none",
          }} />

          {/* Kcal pill top-right */}
          <div style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderRadius: 100,
            padding: "5px 12px",
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1E3A2F" }}>{recipe.kcal} kcal</span>
          </div>

          {/* LEKKER stamp */}
          {isTop && (
            <div style={{
              position: "absolute", top: 24, left: 20,
              border: "3px solid #2D9B6F",
              borderRadius: 10, padding: "5px 14px",
              color: "#2D9B6F", fontSize: 22, fontWeight: 800,
              letterSpacing: 3, opacity: likeAlpha,
              transform: "rotate(-14deg)",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(4px)",
              fontFamily: "Inter, sans-serif",
            }}>LEKKER!</div>
          )}
          {/* NEE stamp */}
          {isTop && (
            <div style={{
              position: "absolute", top: 24, right: 20,
              border: "3px solid #D84040",
              borderRadius: 10, padding: "5px 14px",
              color: "#D84040", fontSize: 22, fontWeight: 800,
              letterSpacing: 3, opacity: nopeAlpha,
              transform: "rotate(14deg)",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(4px)",
              fontFamily: "Inter, sans-serif",
            }}>NEE</div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: "18px 20px 16px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
          {/* Title + time row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <h2 style={{
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: 19,
              fontWeight: 700,
              color: "#1E3A2F",
              lineHeight: 1.25,
              flex: 1,
            }}>{recipe.title}</h2>
            <div style={{
              flexShrink: 0,
              background: "#F5F0E8",
              borderRadius: 100,
              padding: "5px 12px",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ fontSize: 13 }}>⏱</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B5B3E" }}>{recipe.cookTime}</span>
            </div>
          </div>

          {/* Description */}
          <p style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "#6B7C6A",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>{recipe.description}</p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
            {recipe.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, icon, color, bg, label }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      aria-label={label}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onClick}
      style={{
        width: 60, height: 60, borderRadius: "50%",
        background: pressed ? bg : "#FFFFFF",
        border: `1.5px solid ${color}30`,
        color, fontSize: 24,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: pressed
          ? `0 2px 10px ${color}30`
          : `0 4px 16px rgba(30,58,47,0.10)`,
        transform: pressed ? "scale(0.93)" : "scale(1)",
        transition: "transform 0.12s, box-shadow 0.12s, background 0.12s",
      }}
    >{icon}</button>
  );
}

function SwipeScreen({ recipes, onSwipe }) {
  if (recipes.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14,
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "#F5F0E8",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40,
        }}>✨</div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E3A2F" }}>Alles gezien!</p>
        <p style={{ margin: 0, fontSize: 14, color: "#8A9A88" }}>Bekijk je opgeslagen recepten</p>
      </div>
    );
  }

  const visible = recipes.slice(0, 3);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Card stack */}
      <div style={{ flex: 1, position: "relative", margin: "0 16px" }}>
        {[...visible].reverse().map((recipe, ri) => {
          const si = visible.length - 1 - ri;
          return (
            <SwipeCard key={recipe.id} recipe={recipe} onSwipe={onSwipe} isTop={si === 0} stackIndex={si} />
          );
        })}
      </div>

      {/* Hint text */}
      <div style={{
        textAlign: "center",
        fontSize: 12,
        color: "#B0BFB0",
        fontFamily: "Inter, sans-serif",
        paddingBottom: 10,
        paddingTop: 14,
      }}>
        Swipe of gebruik de knoppen
      </div>

      {/* Action buttons */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        paddingBottom: 20,
      }}>
        <ActionBtn onClick={() => onSwipe(recipes[0].id, "left")} icon="✕" color="#D84040" bg="#FDE8E8" label="Overslaan" />
        <ActionBtn onClick={() => onSwipe(recipes[0].id, "right")} icon="♥" color="#2D9B6F" bg="#E1F5EE" label="Bewaren" />
      </div>
    </div>
  );
}

function FavoritesScreen({ favorites, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14,
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "#F5F0E8",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40,
        }}>🍽️</div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E3A2F" }}>Nog niets bewaard</p>
        <p style={{ margin: 0, fontSize: 14, color: "#8A9A88" }}>Swipe rechts op recepten die je lekker vindt</p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, overflowY: "auto",
      padding: "8px 16px 100px",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      }}>
        {favorites.map(recipe => (
          <div key={recipe.id} style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(30,58,47,0.10)",
            position: "relative",
          }}>
            <img
              src={recipe.image} alt={recipe.title}
              style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
            />
            {/* Remove btn */}
            <button
              onClick={() => onRemove(recipe.id)}
              aria-label="Verwijder"
              style={{
                position: "absolute", top: 8, right: 8,
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "none", color: "#D84040",
                fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            >✕</button>
            <div style={{ padding: "10px 12px 12px" }}>
              <p style={{
                margin: "0 0 4px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13, fontWeight: 700, color: "#1E3A2F",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>{recipe.title}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 11 }}>⏱</span>
                <span style={{ fontSize: 11, color: "#8A9A88", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{recipe.cookTime}</span>
                <span style={{ fontSize: 11, color: "#C8CCC8", marginLeft: 2 }}>·</span>
                <span style={{ fontSize: 11, color: "#8A9A88", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{recipe.kcal} kcal</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {recipe.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("swipe");
  const [deck, setDeck] = useState(RECIPES);
  const [favorites, setFavorites] = useState([]);

  const handleSwipe = useCallback((id, dir) => {
    setDeck(prev => prev.filter(r => r.id !== id));
    if (dir === "right") {
      const r = RECIPES.find(r => r.id === id);
      setFavorites(prev => prev.find(x => x.id === id) ? prev : [...prev, r]);
    }
  }, []);

  const handleRemove = useCallback((id) => {
    setFavorites(prev => prev.filter(r => r.id !== id));
  }, []);

  const tabs = [
    { id: "swipe", label: "Ontdekken", icon: "🔍" },
    { id: "favorites", label: `Bewaard${favorites.length ? ` (${favorites.length})` : ""}`, icon: "♥" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body { height: 100%; background: #F5F0E8; overscroll-behavior: none; }
        #root { height: 100%; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <div style={{
        display: "flex", flexDirection: "column",
        height: "100dvh",
        maxWidth: 430, margin: "0 auto",
        background: "#F5F0E8",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "52px 24px 16px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontSize: 26, fontWeight: 800, color: "#1E3A2F",
                letterSpacing: -0.8, lineHeight: 1,
              }}>
                Eetplan
                <span style={{
                  display: "inline-block",
                  width: 7, height: 7,
                  borderRadius: "50%",
                  background: "#4DB87A",
                  marginLeft: 4,
                  verticalAlign: "super",
                  marginBottom: 2,
                }} />
              </div>
              {tab === "swipe" ? (
                <div style={{ fontSize: 13, color: "#8A9A88", marginTop: 3, fontWeight: 500 }}>
                  {deck.length} recepten te ontdekken
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#8A9A88", marginTop: 3, fontWeight: 500 }}>
                  {favorites.length} bewaard
                </div>
              )}
            </div>
            {/* Avatar placeholder */}
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "#1E3A2F",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "#4DB87A", fontWeight: 700,
            }}>J</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {tab === "swipe"
            ? <SwipeScreen recipes={deck} onSwipe={handleSwipe} />
            : <FavoritesScreen favorites={favorites} onRemove={handleRemove} />
          }
        </div>

        {/* Bottom nav */}
        <div style={{
          display: "flex",
          background: "#FFFFFF",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -4px 24px rgba(30,58,47,0.10)",
          flexShrink: 0,
          paddingBottom: "env(safe-area-inset-bottom, 4px)",
          overflow: "hidden",
        }}>
          {tabs.map(({ id, label, icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1,
                  padding: "14px 8px 12px",
                  background: "none", border: "none",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 4,
                  position: "relative",
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute",
                    top: 0, left: "50%",
                    transform: "translateX(-50%)",
                    width: 40, height: 3,
                    background: "#1E3A2F",
                    borderRadius: "0 0 4px 4px",
                  }} />
                )}
                <span style={{
                  fontSize: active ? 22 : 20,
                  filter: active ? "none" : "grayscale(1) opacity(0.5)",
                  transition: "font-size 0.15s",
                }}>{icon}</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#1E3A2F" : "#A0B0A0",
                  transition: "color 0.15s",
                  fontFamily: "Inter, sans-serif",
                }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
