import { useRef, useState, useCallback, useEffect } from "react";

const SWIPE_THRESHOLD = 72;
const DRAG_ROT = 0.11;
const TAP_MOVE_LIMIT = 8; // px — below this, treat release as a tap

/**
 * Handles drag-to-swipe + tap-to-open gesture detection for a single card.
 * Returns everything a card component needs to wire up its DOM node,
 * without knowing anything about React refs forwarded from a parent.
 */
export function useSwipe({ isTop, onSwipeEnd, onTap }) {
  const nodeRef = useRef(null);
  const start = useRef(null);
  const delta = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(false);

  const [liveRot, setLiveRot] = useState(0);
  const [liveDx, setLiveDx] = useState(0);
  const [liveDy, setLiveDy] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyClass, setFlyClass] = useState("");

  const pos = (e) => (e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY });

  const triggerFly = useCallback((dir) => {
    setFlyClass(dir === "right" ? "ep-fly-right" : "ep-fly-left");
    setTimeout(() => onSwipeEnd(dir), 360);
  }, [onSwipeEnd]);

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

  const handleEnd = useCallback(() => {
    if (!dragging.current || !isTop) return;
    dragging.current = false;
    setIsDragging(false);
    const dx = delta.current.x;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      triggerFly(dx > 0 ? "right" : "left");
    } else {
      setLiveDx(0);
      setLiveDy(0);
      setLiveRot(0);
      delta.current = { x: 0, y: 0 };
      if (!moved.current) onTap?.();
    }
  }, [isTop, triggerFly, onTap]);

  // Non-passive touchmove listener so we can preventDefault (React's
  // onTouchMove is passive by default and can't stop page scroll).
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleMove);
  }, [handleMove]);

  // Expose an imperative trigger so parent buttons (✕ / ♥) can drive the swipe.
  useEffect(() => {
    if (!nodeRef.current) return;
    nodeRef.current.__triggerSwipe = (dir) => triggerFly(dir);
  });

  const likeAlpha = isTop ? Math.min(1, Math.max(0, liveDx / SWIPE_THRESHOLD)) : 0;
  const nopeAlpha = isTop ? Math.min(1, Math.max(0, -liveDx / SWIPE_THRESHOLD)) : 0;

  const liveStyle = isTop && isDragging
    ? { transform: `translateX(${liveDx}px) translateY(${liveDy * 0.25}px) rotate(${liveRot}deg)` }
    : {};

  return {
    nodeRef,
    flyClass,
    isDragging,
    likeAlpha,
    nopeAlpha,
    liveStyle,
    handlers: {
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: handleStart,
      onTouchEnd: handleEnd,
    },
  };
}
