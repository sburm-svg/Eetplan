import { forwardRef, useCallback } from "react";
import { cx, T } from "../theme.js";
import { DIFF_COLOR } from "../data/recipes.js";
import { useSwipe } from "../hooks/useSwipe.js";
import TagChip from "./TagChip.jsx";

const SwipeCard = forwardRef(function SwipeCard(
  { recipe, onSwipe, onOpenDetail, isTop, stackIndex },
  forwardedRef
) {
  const { nodeRef, flyClass, isDragging, likeAlpha, nopeAlpha, liveStyle, handlers } = useSwipe({
    isTop,
    onSwipeEnd: (dir) => onSwipe(recipe.id, dir),
    onTap: () => onOpenDetail(recipe),
  });

  // merge the hook's internal node ref with any ref forwarded from the parent
  const setRefs = useCallback((node) => {
    nodeRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef, nodeRef]);

  const scale = isTop ? 1 : 1 - stackIndex * 0.045;
  const tyBack = isTop ? 0 : stackIndex * 15;

  const stackStyle = !isTop
    ? { transform: `translateY(${tyBack}px) scale(${scale})`, transformOrigin: "bottom center" }
    : {};

  const wrapShadow = isTop ? T.shadow : `0 ${4 - stackIndex}px ${18 - stackIndex * 4}px rgba(30,58,47,0.08)`;

  return (
    <div
      ref={setRefs}
      className={cx("ep-card-wrap", flyClass)}
      style={{
        zIndex: 10 - stackIndex,
        cursor: isTop ? (isDragging ? "grabbing" : "pointer") : "default",
        userSelect: "none",
        touchAction: "none",
        ...stackStyle,
        ...liveStyle,
      }}
      {...handlers}
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
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)", color: T.forest,
          }}>
            <span>🔥</span>
            <span>{recipe.kcal} kcal</span>
          </div>

          <div className="ep-pill" style={{
            position: "absolute", top: 14, left: 14,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)", color: T.forest, gap: 6,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: DIFF_COLOR[recipe.difficulty] ?? T.muted,
              flexShrink: 0, display: "inline-block",
            }} />
            <span>{recipe.difficulty}</span>
          </div>

          <div className="ep-stamp ep-stamp-like" style={{ opacity: likeAlpha }}>LEKKER!</div>
          <div className="ep-stamp ep-stamp-nope" style={{ opacity: nopeAlpha }}>NEE</div>
        </div>

        <div style={{ flex: 1, padding: "16px 18px 14px", display: "flex", flexDirection: "column", gap: 9, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <h2 style={{
              flex: 1, fontFamily: "Inter, sans-serif", fontSize: "clamp(16px, 4.5vw, 20px)",
              fontWeight: 700, color: T.forest, lineHeight: 1.22, margin: 0,
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
});

export default SwipeCard;
