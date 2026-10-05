import { useEffect, useRef } from 'react';
import './LavaBackground.css';

const colors = ['#2e5da8', '#644aa8', '#1f8196', '#415ab4', '#21749e', '#6353aa'];

// Clip a region to the half-plane nearer to its site than another site.
const clipToSite = (polygon, site, other) => {
  const dx = other.x - site.x;
  const dy = other.y - site.y;
  const middle = (other.x ** 2 + other.y ** 2 - site.x ** 2 - site.y ** 2) / 2;
  const side = (point) => point.x * dx + point.y * dy - middle;
  const clipped = [];

  for (let index = 0; index < polygon.length; index += 1) {
    const first = polygon[index];
    const second = polygon[(index + 1) % polygon.length];
    const firstSide = side(first);
    const secondSide = side(second);
    const firstInside = firstSide <= 0;
    const secondInside = secondSide <= 0;

    if (firstInside !== secondInside) {
      const fraction = firstSide / (firstSide - secondSide);
      clipped.push({
        x: first.x + (second.x - first.x) * fraction,
        y: first.y + (second.y - first.y) * fraction,
      });
    }
    if (secondInside) clipped.push(second);
  }

  return clipped;
};

const bend = (x, y, time) => ({
  x: x + 34 * Math.sin(y / 160 + time * 0.00024)
    + 15 * Math.sin((x + y) / 265 - time * 0.00031),
  y: y + 28 * Math.sin(x / 185 - time * 0.00022)
    + 13 * Math.cos((x - y) / 290 + time * 0.00027),
});

/** Packed, gently moving color regions. No collision simulation is needed. */
const LavaBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sites = colors.map((color, index) => ({
      color,
      x: 0,
      y: 0,
      homeX: 0,
      homeY: 0,
      vx: 0,
      vy: 0,
      phase: index * 1.6,
    }));
    let width = 0;
    let height = 0;
    let columns = 0;
    let frameId = null;
    let previousFrame = 0;
    let previousPointer = null;
    let inView = false;

    const drawRegion = (site, time) => {
      const margin = 100;
      let polygon = [
        { x: -margin, y: -margin },
        { x: width + margin, y: -margin },
        { x: width + margin, y: height + margin },
        { x: -margin, y: height + margin },
      ];
      for (const other of sites) {
        if (other !== site) polygon = clipToSite(polygon, site, other);
        if (polygon.length === 0) return;
      }

      context.beginPath();
      let started = false;
      for (let index = 0; index < polygon.length; index += 1) {
        const first = polygon[index];
        const second = polygon[(index + 1) % polygon.length];
        const segments = Math.max(1, Math.ceil(Math.hypot(second.x - first.x, second.y - first.y) / 28));
        for (let segment = 0; segment < segments; segment += 1) {
          const fraction = segment / segments;
          const point = bend(
            first.x + (second.x - first.x) * fraction,
            first.y + (second.y - first.y) * fraction,
            time,
          );
          if (!started) {
            context.moveTo(point.x, point.y);
            started = true;
          } else {
            context.lineTo(point.x, point.y);
          }
        }
      }
      context.closePath();
      context.fillStyle = site.color;
      context.fill();
      context.strokeStyle = 'rgba(16, 13, 46, 0.25)';
      context.lineWidth = 1.5;
      context.stroke();
    };

    const draw = (time) => {
      context.fillStyle = '#100d2e';
      context.fillRect(0, 0, width, height);
      sites.forEach((site) => drawRegion(site, time));
    };

    const resize = () => {
      const oldWidth = width;
      const oldHeight = height;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const nextColumns = width / height < 0.85 ? 2 : 3;
      const rows = sites.length / nextColumns;
      sites.forEach((site, index) => {
        site.homeX = width * ((index % nextColumns + 0.5) / nextColumns + Math.sin(index * 2.5) * 0.025);
        site.homeY = height * ((Math.floor(index / nextColumns) + 0.5) / rows + Math.cos(index * 2.8) * 0.025);
        site.x = oldWidth && columns === nextColumns ? site.x / oldWidth * width : site.homeX;
        site.y = oldHeight && columns === nextColumns ? site.y / oldHeight * height : site.homeY;
      });
      columns = nextColumns;
      draw(0);
    };

    const animate = (time) => {
      if (time - previousFrame >= 42) {
        sites.forEach((site) => {
          site.vx = (site.vx + (site.homeX - site.x) * 0.00035
            + Math.sin(time * 0.00045 + site.phase) * 0.02) * 0.97;
          site.vy = (site.vy + (site.homeY - site.y) * 0.00035
            + Math.cos(time * 0.0004 + site.phase) * 0.02) * 0.97;
          site.x += site.vx;
          site.y += site.vy;
        });
        draw(time);
        previousFrame = time;
      }
      frameId = requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      const shouldRun = inView && !document.hidden && !reducedMotion;
      if (shouldRun && frameId === null) {
        previousFrame = 0;
        frameId = requestAnimationFrame(animate);
      } else if (!shouldRun && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const onPointerMove = (event) => {
      if (reducedMotion || event.pointerType === 'touch' || !inView) return;
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (x < 0 || x > width || y < 0 || y > height) {
        previousPointer = null;
        return;
      }
      const now = performance.now();
      const speed = previousPointer
        ? Math.hypot(x - previousPointer.x, y - previousPointer.y) / Math.max(16, now - previousPointer.time)
        : 0;
      previousPointer = { x, y, time: now };
      sites.forEach((site) => {
        const dx = site.x - x;
        const dy = site.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.max(200, Math.min(width, height) * 0.5);
        const force = Math.max(0, 1 - distance / reach) * Math.min(4, 0.3 + speed * 2.6);
        site.vx += dx / distance * force;
        site.vy += dy / distance * force;
      });
    };
    const clearPointer = () => { previousPointer = null; };

    const resizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateAnimation();
    });
    resizeObserver.observe(canvas);
    viewObserver.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', clearPointer);
    document.addEventListener('visibilitychange', updateAnimation);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', clearPointer);
      document.removeEventListener('visibilitychange', updateAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} className="lavaBackground" aria-hidden="true" />;
};

export default LavaBackground;
