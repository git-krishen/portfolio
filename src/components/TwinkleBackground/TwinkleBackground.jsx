import { useEffect, useRef } from 'react';
import './TwinkleBackground.css';

/** Configurable, lightly twinkling stars behind the page. */
const TwinkleBackground = ({
  density = 0.65,
  brightness = 0.72,
  frequency = 0.55,
  cursorRadius = 170,
  cursorBrighten = 0.4,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -1000, y: -1000 };
    const colors = [0, 35, 60, 135, 190, 220, 275, 325];
    let stars = [];
    let width = 0;
    let height = 0;
    let frameId;
    let lastFrame = 0;
    let animationStart = performance.now();

    const moveStar = (star) => {
      const minimumDistance = Math.min(width, height) * 0.2;
      let x;
      let y;
      do {
        x = Math.random() * width;
        y = Math.random() * height;
      } while (Math.hypot(x - star.x, y - star.y) < minimumDistance);
      star.x = x;
      star.y = y;
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const cycle = time * 0.001 * frequency * star.speed + star.phase;
        const cycleNumber = Math.floor(cycle);
        if (!reducedMotion && cycleNumber !== star.cycleNumber) {
          moveStar(star);
          star.cycleNumber = cycleNumber;
        }
        const pulse = reducedMotion ? 0.42 : Math.sin(Math.PI * (cycle - cycleNumber)) ** 2;
        const distance = Math.hypot(star.x - pointer.x, star.y - pointer.y);
        const nearby = cursorRadius > 0 ? Math.max(0, 1 - distance / cursorRadius) : 0;
        const alpha = Math.min(1, brightness * pulse * (1 + cursorBrighten * nearby));
        context.fillStyle = `hsla(${star.hue}, 100%, 76%, ${alpha})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(0, Math.round(width * height / 10000 * density));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.7 + Math.random() * 1.1,
        phase: Math.random(),
        cycleNumber: 0,
        speed: 0.65 + Math.random() * 0.8,
        hue: colors[Math.floor(Math.random() * colors.length)],
      }));
      animationStart = performance.now();
      draw(0);
    };

    const animate = (time) => {
      if (time - lastFrame >= 32) {
        draw(time - animationStart);
        lastFrame = time;
      }
      frameId = requestAnimationFrame(animate);
    };
    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onPointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    if (!reducedMotion) frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [density, brightness, frequency, cursorRadius, cursorBrighten]);

  return <canvas ref={canvasRef} className="twinkleBackground" aria-hidden="true" />;
};

export default TwinkleBackground;
