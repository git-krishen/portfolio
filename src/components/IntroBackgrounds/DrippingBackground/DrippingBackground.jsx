import { useEffect, useRef } from 'react';
import './DrippingBackground.css';

const waveColors = (count) => {
  const hues = Array.from({ length: count }, (_, index) => 185 + (index + 0.5) * 85 / count);
  for (let index = hues.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [hues[index], hues[other]] = [hues[other], hues[index]];
  }
  return hues.map((hue) => `hsl(${hue.toFixed(2)} 48% ${36 + Math.round(Math.random() * 7)}%)`);
};

const DrippingBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const driedCanvas = document.createElement('canvas');
    const driedContext = driedCanvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let boundaries = [];
    let baseColors = [];
    let paint = [];
    let frameId = null;
    let previousFrame = 0;
    let previousPointer = null;
    let inView = false;

    const columnWidth = () => width / paint.length;

    const boundaryX = (index, y, time) => {
      if (index === 0) return 0;
      if (index === paint.length) return width;
      const boundary = boundaries[index];
      const spread = Math.max(95, height * 0.16);
      const distance = (y - boundary.centerY) / spread;
      const smear = boundary.offset * Math.exp(-distance * distance);
      const drift = Math.sin(y / 150 + time * 0.00024 + index * 0.75)
        * Math.min(9, columnWidth() * 0.07);
      return index * columnWidth() + smear + drift;
    };

    const fillShape = (target, color) => {
      const fill = target.createLinearGradient(0, height * 0.7, 0, height);
      fill.addColorStop(0, color);
      fill.addColorStop(1, color.replace(/\)$/, ' / 0)'));
      target.closePath();
      target.save();
      target.globalCompositeOperation = 'destination-out';
      target.fillStyle = '#000';
      target.strokeStyle = '#000';
      target.lineWidth = 1;
      target.fill();
      target.stroke();
      target.restore();
      target.fillStyle = fill;
      target.fill();
      target.strokeStyle = fill;
      target.lineWidth = 1;
      target.stroke();
    };

    const drawFullColumn = (index, time, rows, target, color) => {
      target.beginPath();
      rows.forEach((y, row) => {
        const x = boundaryX(index, y, time);
        if (row === 0) target.moveTo(x, y);
        else target.lineTo(x, y);
      });
      for (let row = rows.length - 1; row >= 0; row -= 1) {
        const y = rows[row];
        target.lineTo(boundaryX(index + 1, y, time), y);
      }
      fillShape(target, color);
    };

    const drawDrip = (index, time) => {
      const tipSize = Math.min(60, Math.max(25, columnWidth() * 0.35));
      const front = paint[index].progress * height;
      const edgeY = Math.max(0, front - tipSize * 0.55);
      const left = boundaryX(index, edgeY, time);
      const right = boundaryX(index + 1, edgeY, time);
      const center = (boundaryX(index, front, time) + boundaryX(index + 1, front, time)) / 2;
      const rows = [0];
      for (let y = 24; y < edgeY; y += 24) rows.push(y);
      rows.push(edgeY);

      context.beginPath();
      context.moveTo(boundaryX(index, 0, time), 0);
      context.lineTo(boundaryX(index + 1, 0, time), 0);
      rows.slice(1).forEach((y) => context.lineTo(boundaryX(index + 1, y, time), y));
      context.bezierCurveTo(right, front, center + columnWidth() * 0.2, front + tipSize * 0.2, center, front + tipSize * 0.2);
      context.bezierCurveTo(center - columnWidth() * 0.2, front + tipSize * 0.2, left, front, left, edgeY);
      for (let row = rows.length - 2; row >= 0; row -= 1) {
        const y = rows[row];
        context.lineTo(boundaryX(index, y, time), y);
      }
      fillShape(context, paint[index].color);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      context.drawImage(driedCanvas, 0, 0, width, height);
      paint.forEach((_, index) => drawDrip(index, time));
    };

    const newWave = () => {
      const colors = waveColors(baseColors.length);
      paint = colors.map((color) => ({
          color,
          progress: 0,
          speed: 0.11 + Math.random() * 0.13,
      }));
    };

    const resize = () => {
      const previousPaint = document.createElement('canvas');
      previousPaint.width = driedCanvas.width;
      previousPaint.height = driedCanvas.height;
      if (driedCanvas.width && driedCanvas.height) {
        previousPaint.getContext('2d').drawImage(driedCanvas, 0, 0);
      }
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      driedCanvas.width = canvas.width;
      driedCanvas.height = canvas.height;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      driedContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(4, Math.round(width / 120));
      boundaries = Array.from({ length: count + 1 }, () => ({ offset: 0, centerY: height / 2 }));
      baseColors = waveColors(count);
      newWave();
      if (previousPaint.width && previousPaint.height) {
        driedContext.drawImage(previousPaint, 0, 0, width, height);
      } else {
        const rows = [0];
        for (let y = 24; y < height; y += 24) rows.push(y);
        rows.push(height);
        baseColors.forEach((color, index) => drawFullColumn(index, 0, rows, driedContext, color));
      }
      draw(0);
    };

    const animate = (time) => {
      if (time - previousFrame >= 40) {
        const seconds = Math.min(0.1, (time - previousFrame) / 1000 || 0);
        paint.forEach((column) => {
          column.progress = Math.min(1.1, column.progress + column.speed * seconds);
        });
        boundaries.forEach((boundary) => { boundary.offset *= 0.965; });
        if (paint.every((column) => column.progress >= 1.1)) {
          const rows = [0];
          for (let y = 24; y < height; y += 24) rows.push(y);
          rows.push(height);
          driedContext.clearRect(0, 0, width, height);
          paint.forEach((column, index) => {
            drawFullColumn(index, time, rows, driedContext, column.color);
          });
          baseColors = paint.map((column) => column.color);
          newWave();
        }
        draw(time);
        previousFrame = time;
      }
      frameId = requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      const shouldRun = inView && !document.hidden && !reducedMotion;
      if (shouldRun && frameId === null) {
        previousFrame = performance.now();
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
      if (previousPointer) {
        const sideways = Math.max(-45, Math.min(45, x - previousPointer.x));
        for (let index = 1; index < boundaries.length - 1; index += 1) {
          const distance = Math.abs(index * columnWidth() - x);
          const influence = Math.max(0, 1 - distance / (columnWidth() * 1.5));
          const boundary = boundaries[index];
          boundary.offset = Math.max(-columnWidth() * 0.38,
            Math.min(columnWidth() * 0.38, boundary.offset + sideways * influence * 0.7));
          if (influence > 0) boundary.centerY = y;
        }
      }
      previousPointer = { x, y };
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

  return <canvas ref={canvasRef} className="drippingBackground" aria-hidden="true" />;
};

export default DrippingBackground;
