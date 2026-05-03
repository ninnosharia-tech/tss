/* Animated circles background — drifts soft blobs across canvas */
const CirclesBackground = ({ density = 14, speed = 1, palette = "blue", reduced = false }) => {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const circlesRef = React.useRef([]);

  const palettes = {
    blue: [
      "rgba(207, 226, 255, 0.95)",   // very light blue
      "rgba(157, 192, 245, 0.80)",   // light blue
      "rgba(96, 145, 222, 0.70)",    // mid blue
      "rgba(40, 78, 158, 0.55)",     // deep blue
      "rgba(15, 36, 96, 0.45)",      // dark navy
    ],
    sky: [
      "rgba(225, 240, 255, 0.95)",
      "rgba(176, 210, 248, 0.85)",
      "rgba(120, 170, 230, 0.70)",
      "rgba(64, 110, 190, 0.55)",
    ],
    deep: [
      "rgba(207, 226, 255, 0.85)",
      "rgba(70, 110, 190, 0.65)",
      "rgba(20, 45, 110, 0.65)",
      "rgba(8, 20, 60, 0.55)",
    ],
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // seed circles
    const colors = palettes[palette] || palettes.blue;
    const circles = [];
    for (let i = 0; i < density; i++) {
      const r = 60 + Math.random() * 320;
      circles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r,
        // slow drift velocity
        vx: (Math.random() - 0.5) * 0.25 * speed,
        vy: (Math.random() - 0.5) * 0.25 * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        // gentle pulse
        phase: Math.random() * Math.PI * 2,
        pulseAmp: 0.06 + Math.random() * 0.08,
        pulseSpeed: 0.0006 + Math.random() * 0.0009,
      });
    }
    circlesRef.current = circles;

    let last = performance.now();
    const tick = (t) => {
      const dt = Math.min(48, t - last);
      last = t;

      // soft white background
      ctx.clearRect(0, 0, w, h);

      for (const c of circles) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.phase += c.pulseSpeed * dt;

        // wrap around edges with a margin
        const margin = c.r * 1.2;
        if (c.x < -margin) c.x = w + margin;
        if (c.x > w + margin) c.x = -margin;
        if (c.y < -margin) c.y = h + margin;
        if (c.y > h + margin) c.y = -margin;

        const pulse = 1 + Math.sin(c.phase) * c.pulseAmp;
        const r = c.r * pulse;

        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        grad.addColorStop(0, c.color);
        grad.addColorStop(0.55, c.color.replace(/[\d.]+\)$/, "0.22)"));
        grad.addColorStop(1, c.color.replace(/[\d.]+\)$/, "0)"));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) rafRef.current = requestAnimationFrame(tick);
    };

    if (reduced) {
      // single static frame
      tick(performance.now());
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [density, speed, palette, reduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};

window.CirclesBackground = CirclesBackground;
