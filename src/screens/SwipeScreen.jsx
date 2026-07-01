import { useRef } from "react";
import { T } from "../theme.js";
import SwipeCard from "../components/SwipeCard.jsx";
import ActionButton from "../components/ActionButton.jsx";

export default function SwipeScreen({ deck, onSwipe, onOpenDetail, swipedHistory = [], setSwipedHistory, pushRecipe }) {
  const topCardRef = useRef(null);

  const triggerBtn = (dir) => {
    const el = topCardRef.current;
    if (el?.__triggerSwipe) el.__triggerSwipe(dir);
  };

  if (deck.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: T.creamDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>✨</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Alles gezien!</p>
        <p style={{ fontSize: 14, color: T.muted }}>Bekijk je bewaarde recepten</p>
        {/* Extra terugknop als het deck leeg is om terug te kunnen gaan */}
        <ActionButton
          icon="↩️"
          label="Geschiedenis herstellen"
          color={T.sand}
          onClick={() => {
            if (swipedHistory.length === 0) return;
            const lastRecipe = swipedHistory[swipedHistory.length - 1];
            pushRecipe(lastRecipe);
            setSwipedHistory(prev => prev.slice(0, -1));
          }}
          disabled={swipedHistory.length === 0}
        />
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
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: T.hint, fontFamily: "Inter, sans-serif", fontWeight: 500, padding: "12px 0 8px" }}>
        Tik voor details · swipe of gebruik de knoppen
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingBottom: 24 }}>
        <ActionButton icon="✕" label="Overslaan" color={T.red} onClick={() => triggerBtn("left")} disabled={deck.length === 0} />
        <ActionButton icon="♥" label="Bewaren" color={T.green} onClick={() => triggerBtn("right")} disabled={deck.length === 0} />
        <ActionButton
          icon="↩️"
          label="Terug"
          color={T.sand}
          onClick={() => {
            if (swipedHistory.length === 0) return;

            const lastRecipe = swipedHistory[swipedHistory.length - 1];
            pushRecipe(lastRecipe);
            setSwipedHistory(prev => prev.slice(0, -1));
          }}
          disabled={swipedHistory.length === 0}
        />
      </div>
    </div>
  );
}
