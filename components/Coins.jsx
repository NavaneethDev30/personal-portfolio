'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect, useMemo } from "react";
import CoinSlab from './CoinSlab';
import './CoinsGallery.css';

// ─── Coin Data (unchanged) ───────────────────────────────────────────────────
const coinsData = [
  { coinImage: "/coins/ambedkar.jpeg", year: "1990", title: "Dr. B.R. Ambedkar", denomination: "₹5", grade: "XF", country: "India" },
  { coinImage: "/coins/gandi.jpeg", year: "1969", title: "Mahatma Gandhi", denomination: "₹10", grade: "AU", country: "India" },
  { coinImage: "/coins/tagore.jpeg", year: "1961", title: "Rabindranath Tagore", denomination: "₹1", grade: "VF", country: "India" },
  { coinImage: "/coins/shastri.jpeg", year: "1966", title: "Lal Bahadur Shastri", denomination: "₹1", grade: "EF", country: "India" },
  { coinImage: "/coins/subramaniam.jpeg", year: "1993", title: "C. Subramaniam", denomination: "₹5", grade: "MS", country: "India" },
  { coinImage: "/coins/agriculture.jpeg", year: "1970", title: "Agriculture", denomination: "₹10", grade: "AU", country: "India" },
  { coinImage: "/coins/aviation.jpeg", year: "1986", title: "Civil Aviation", denomination: "₹50", grade: "MS", country: "India" },
  { coinImage: "/coins/bhel.jpeg", year: "1989", title: "BHEL", denomination: "₹100", grade: "MS", country: "India" },
  { coinImage: "/coins/bull.jpeg", year: "1985", title: "Bull", denomination: "₹2", grade: "XF", country: "India" },
  { coinImage: "/coins/devi.jpeg", year: "1988", title: "Devi", denomination: "₹5", grade: "AU", country: "India" },
  { coinImage: "/coins/ilo.jpeg", year: "1969", title: "ILO", denomination: "₹10", grade: "VF", country: "India" },
  { coinImage: "/coins/rbi.jpeg", year: "1985", title: "RBI", denomination: "₹100", grade: "MS", country: "India" },
  { coinImage: "/coins/saarc.jpeg", year: "1987", title: "SAARC Summit", denomination: "₹10", grade: "AU", country: "India" },
  { coinImage: "/coins/ship.jpeg", year: "1992", title: "Ship Building", denomination: "₹50", grade: "MS", country: "India" },
  { coinImage: "/coins/water.jpeg", year: "1974", title: "Water Conservation", denomination: "₹10", grade: "EF", country: "India" },
];

// ─── Math helpers ────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ─── Tuning constants (animation only — no visual design here) ───────────────
const BEND = 3;              // arc curvature, same meaning as CircularGallery `bend`
const EASE = 0.08;           // scroll lerp factor
const ITEM_GAP = 40;         // extra px between slabs (spacing only for animation)
const DRAG_FACTOR = 1.0;     // px of movement per px dragged
const WHEEL_FACTOR = 0.6;    // px of movement per wheel delta unit
const MAX_TILT = 0.35;       // max rotateZ (rad) so the arc feels 3D, not flipped
const MAX_DEPTH = 140;       // px of z-depth push at the edges

export default function Coins() {
  const galleryRef = useRef(null);
  const itemRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Slab dimensions are kept in a ref so the animation loop can stay stable
  const metricsRef = useRef({ itemWidth: 300, viewportWidth: 0 });

  const scroll = useRef({ current: 0, target: 0, position: 0 });
  const isDown = useRef(false);
  const startX = useRef(0);
  const moved = useRef(false);
  const rafId = useRef(null);
  const checkTimeout = useRef(null);
  const galleryRect = useRef({ left: 0 });

  // Duplicate the list so the loop is seamless
  const allCoins = useMemo(() => [...coinsData, ...coinsData], []);

  // Recalculate item width from the real rendered slab (responsive)
  const measure = useCallback(() => {
    const gallery = galleryRef.current;
    const firstItem = itemRefs.current[0];
    if (!gallery || !firstItem) return;

    const slab = firstItem.querySelector('.coin-slab') || firstItem;
    const width = slab.offsetWidth || 260;
    metricsRef.current.itemWidth = width + ITEM_GAP;
    metricsRef.current.viewportWidth = gallery.clientWidth;

    const rect = gallery.getBoundingClientRect();
    galleryRect.current.left = rect.left;
  }, []);

  // Snap the scroll target to the nearest item boundary (CircularGallery onCheck)
  const onCheck = useCallback(() => {
    const { itemWidth } = metricsRef.current;
    if (!itemWidth) return;
    const index = Math.round(scroll.current.target / itemWidth);
    scroll.current.target = index * itemWidth;
  }, []);

  const update = useCallback(() => {
    const { itemWidth, viewportWidth } = metricsRef.current;
    if (!itemWidth || !viewportWidth) {
      rafId.current = requestAnimationFrame(update);
      return;
    }

    // Smooth interpolation using lerp
    scroll.current.current = lerp(scroll.current.current, scroll.current.target, EASE);

    const totalWidth = allCoins.length * itemWidth;
    const halfWidth = totalWidth / 2;
    const H = viewportWidth / 2;

    // Arc radius from the bend amount (same maths as CircularGallery)
    const B_abs = Math.abs(BEND);
    const R = BEND === 0 ? 0 : (H * H + B_abs * B_abs) / (2 * B_abs);

    let closest = 0;
    let closestDist = Infinity;

    for (let i = 0; i < allCoins.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;

      // Infinite horizontal scrolling: wrap raw x into [-halfWidth, halfWidth)
      let x = i * itemWidth - scroll.current.current;
      x = ((x % totalWidth) + totalWidth) % totalWidth;
      if (x > halfWidth) x -= totalWidth;

      const dist = Math.abs(x);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }

      const centerDist = clamp(dist / H, 0, 1);

      // Curved 3D positioning of the coin cards
      let y = 0;
      let rot = 0;
      if (R) {
        const effectiveX = Math.min(dist, H);
        const arc = R - Math.sqrt(Math.max(0, R * R - effectiveX * effectiveX));
        y = -arc; // cards rise toward the viewer along the arc
        rot = -Math.sign(x) * Math.asin(clamp(effectiveX / R, -1, 1));
        rot = clamp(rot, -MAX_TILT, MAX_TILT);
      }

      // Perspective and depth movement
      const z = -centerDist * MAX_DEPTH;
      const opacity = 1 - centerDist * 0.65;

      el.style.transform =
        `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rot}rad)`;
      el.style.opacity = opacity;
      el.style.zIndex = String(1000 - Math.round(centerDist * 900));
    }

    const nextIndex = closest % coinsData.length;
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }

    rafId.current = requestAnimationFrame(update);
  }, [allCoins.length]);

  // ─── Interaction handlers (wheel / drag / touch) ───────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY ?? e.wheelDelta ?? e.detail ?? 0;
    scroll.current.target += delta * WHEEL_FACTOR;
    clearTimeout(checkTimeout.current);
    checkTimeout.current = setTimeout(onCheck, 200);
  }, [onCheck]);

  const onDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    const point = e.touches ? e.touches[0] : e;
    isDown.current = true;
    moved.current = false;
    scroll.current.position = scroll.current.current;
    startX.current = point.clientX;
    if (galleryRef.current) galleryRef.current.style.cursor = 'grabbing';
  }, []);

  const onMove = useCallback((e) => {
    if (!isDown.current) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = startX.current - point.clientX;
    if (Math.abs(dx) > 3) moved.current = true;
    scroll.current.target = scroll.current.position + dx * DRAG_FACTOR;
  }, []);

  const onUp = useCallback(() => {
    if (!isDown.current) return;
    isDown.current = false;
    onCheck();
    if (galleryRef.current) galleryRef.current.style.cursor = 'grab';
  }, [onCheck]);

  // ─── Mount / unmount ───────────────────────────────────────────────────────
  useLayoutEffect(() => {
    measure();
    // Start centred on coin 0
    scroll.current.current = 0;
    scroll.current.target = 0;
    rafId.current = requestAnimationFrame(update);

    const gallery = galleryRef.current;
    gallery?.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(checkTimeout.current);
      gallery?.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, [measure, update, onWheel, onDown, onMove, onUp]);

  const activeCoin = coinsData[activeIndex] || coinsData[0];

  return (
    <section id="coins" className="coins-gallery-section">
      {/* Heading — unchanged */}
      <div className="coins-gallery-header">
        <h2 className="coins-gallery-title">Coin Collection</h2>
        <p className="coins-gallery-subtitle">
          Drag or scroll to explore &bull; {coinsData.length} coins
        </p>
      </div>

      {/* 3D curved scrolling stage */}
      <div className="coins-gallery-stage" ref={galleryRef}>
        <div className="coins-gallery-track">
          {allCoins.map((coin, i) => (
            <div
              key={i}
              className="coins-gallery-item"
              ref={(el) => { itemRefs.current[i] = el; }}
            >
              <CoinSlab
                coinImage={coin.coinImage}
                year={coin.year}
                title={coin.title}
                denomination={coin.denomination}
                grade={coin.grade}
                width={260}
                height={400}
                coinSize={70}
              />
            </div>
          ))}
        </div>

        {/* Edge gradient fades — unchanged */}
        <div className="coins-gallery-fade coins-gallery-fade--left" />
        <div className="coins-gallery-fade coins-gallery-fade--right" />

        {/* Coin info card — unchanged */}
       
        </div>
     

      {/* Navigation dots — unchanged */}
      <div className="coins-gallery-dots">
        {coinsData.map((_, i) => (
          <button
            key={i}
            className={`coins-gallery-dot${i === activeIndex ? ' coins-gallery-dot--active' : ''}`}
            aria-label={`Go to coin ${i + 1}`}
            onClick={() => {
              const { itemWidth } = metricsRef.current;
              if (!itemWidth) return;
              // choose the shortest direction within the duplicated track
              const currentItems = Math.round(scroll.current.target / itemWidth);
              const base = Math.round(currentItems / coinsData.length) * coinsData.length;
              scroll.current.target = (base + i) * itemWidth;
            }}
          />
        ))}
      </div>
    </section>
  );
}
