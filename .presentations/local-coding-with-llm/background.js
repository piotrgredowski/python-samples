const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");

let animationFrameId = null;
let lastWidth = 0;
let lastHeight = 0;
let stars = [];
let dust = [];
let constellations = [];
let planets = [];
let shootingStars = [];
let nextShootingStarAt = 0;

function scheduleNextShootingStar(time) {
  nextShootingStarAt = time + (5000 + Math.random() * 10000);
}

function resizeCanvas(width, height) {
  const dpr = window.devicePixelRatio || 1;
  bgCanvas.width = Math.floor(width * dpr);
  bgCanvas.height = Math.floor(height * dpr);
  bgCanvas.style.width = `${width}px`;
  bgCanvas.style.height = `${height}px`;
  bgCtx.setTransform(1, 0, 0, 1, 0, 0);
  bgCtx.scale(dpr, dpr);
}

function populateParticles(width, height) {
  const starCount = Math.max(90, Math.floor((width * height) / 12000));
  const dustCount = Math.max(1400, Math.floor((width * height) / 900));

  stars = Array.from({ length: starCount }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() > 0.9 ? 2 : 1,
    alpha: 0.35 + Math.random() * 0.45,
    twinkleOffset: Math.random() * Math.PI * 2,
    speed: 0.45 + Math.random() * 1.25,
    pulseDepth: 0.2 + Math.random() * 0.45,
    cluster: index % 7 === 0,
  }));

  dust = Array.from({ length: dustCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    alpha: 0.025 + Math.random() * 0.06,
  }));

  constellations = [
    {
      stars: [
        [0.18, 0.22, 2.2],
        [0.22, 0.26, 1.9],
        [0.27, 0.24, 1.8],
        [0.31, 0.29, 2.3],
        [0.36, 0.27, 1.7],
      ],
    },
    {
      stars: [
        [0.68, 0.18, 1.9],
        [0.72, 0.15, 2.4],
        [0.76, 0.2, 1.7],
        [0.81, 0.18, 2.1],
        [0.85, 0.23, 1.8],
      ],
    },
    {
      stars: [
        [0.62, 0.58, 2.1],
        [0.66, 0.63, 1.8],
        [0.7, 0.6, 2.5],
        [0.74, 0.66, 1.7],
        [0.79, 0.62, 2.2],
      ],
    },
  ].map((formation, formationIndex) => ({
    stars: formation.stars.map(([x, y, size], starIndex) => ({
      x: x * width,
      y: y * height,
      size,
      alpha: 0.58 + Math.random() * 0.22,
      twinkleOffset: Math.random() * Math.PI * 2 + formationIndex + starIndex,
      speed: 0.55 + Math.random() * 0.9,
      pulseDepth: 0.18 + Math.random() * 0.18,
    })),
  }));

  planets = [
    {
      x: width * 0.24,
      y: height * 0.16,
      size: 2.4,
      glow: 14,
      color: [255, 120, 102],
      alpha: 0.22,
      speed: 0.38,
      offset: Math.random() * Math.PI * 2,
    },
    {
      x: width * 0.78,
      y: height * 0.3,
      size: 2.2,
      glow: 16,
      color: [120, 156, 255],
      alpha: 0.18,
      speed: 0.32,
      offset: Math.random() * Math.PI * 2,
    },
  ];
}

function drawBackground(time = 0) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const seconds = time * 0.001;

  if (width !== lastWidth || height !== lastHeight) {
    resizeCanvas(width, height);
    lastWidth = width;
    lastHeight = height;
    populateParticles(width, height);
    if (nextShootingStarAt === 0) {
      scheduleNextShootingStar(time);
    }
  }

  if (time >= nextShootingStarAt) {
    const startX = width * (0.15 + Math.random() * 0.7);
    const startY = height * (0.08 + Math.random() * 0.35);
    const length = 45 + Math.random() * 45;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const angle = direction * (Math.PI * (0.14 + Math.random() * 0.12));
    const speed = 320 + Math.random() * 160;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length,
      life: 0,
      duration: 0.55 + Math.random() * 0.35,
    });
    scheduleNextShootingStar(time);
  }

  bgCtx.fillStyle = "#222223";
  bgCtx.fillRect(0, 0, width, height);

  const glowA = bgCtx.createRadialGradient(
    width * 0.5,
    height * 0.12,
    0,
    width * 0.5,
    height * 0.12,
    width * 0.5,
  );
  glowA.addColorStop(0, "rgba(255, 255, 255, 0.025)");
  glowA.addColorStop(1, "rgba(255, 255, 255, 0)");
  bgCtx.fillStyle = glowA;
  bgCtx.fillRect(0, 0, width, height);

  const vignette = bgCtx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.12,
    width * 0.5,
    height * 0.45,
    width * 0.85,
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.26)");
  bgCtx.fillStyle = vignette;
  bgCtx.fillRect(0, 0, width, height);

  bgCtx.save();
  for (const mote of dust) {
    bgCtx.fillStyle = `rgba(255, 255, 255, ${mote.alpha})`;
    bgCtx.fillRect(mote.x, mote.y, 1, 1);
  }
  bgCtx.restore();

  bgCtx.save();
  for (const star of stars) {
    const twinkle =
      0.62 +
      Math.sin(seconds * star.speed + star.twinkleOffset) * star.pulseDepth +
      Math.sin(seconds * (star.speed * 0.37) + star.twinkleOffset * 1.9) * 0.08;
    const alpha = Math.max(0.08, star.alpha * twinkle);

    if (star.cluster) {
      bgCtx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.22})`;
      bgCtx.fillRect(star.x - 1, star.y - 1, star.size + 2, star.size + 2);
    }

    bgCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    bgCtx.fillRect(star.x, star.y, star.size, star.size);
  }
  bgCtx.restore();

  bgCtx.save();
  for (const constellation of constellations) {
    for (const star of constellation.stars) {
      const twinkle =
        0.72 +
        Math.sin(seconds * star.speed + star.twinkleOffset) * star.pulseDepth +
        Math.sin(seconds * (star.speed * 0.42) + star.twinkleOffset * 1.6) *
          0.06;
      const alpha = Math.max(0.22, star.alpha * twinkle);

      bgCtx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.16})`;
      bgCtx.fillRect(star.x - 2, star.y - 2, star.size + 4, star.size + 4);

      bgCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      bgCtx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
  bgCtx.restore();

  bgCtx.save();
  for (const planet of planets) {
    const pulse =
      0.82 +
      Math.sin(seconds * planet.speed + planet.offset) * 0.08 +
      Math.sin(seconds * (planet.speed * 0.45) + planet.offset * 1.7) * 0.04;
    const alpha = planet.alpha * pulse;
    const [r, g, b] = planet.color;

    const halo = bgCtx.createRadialGradient(
      planet.x,
      planet.y,
      0,
      planet.x,
      planet.y,
      planet.glow,
    );
    halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`);
    halo.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`);
    halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    bgCtx.fillStyle = halo;
    bgCtx.beginPath();
    bgCtx.arc(planet.x, planet.y, planet.glow, 0, Math.PI * 2);
    bgCtx.fill();

    bgCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.95})`;
    bgCtx.fillRect(planet.x, planet.y, planet.size, planet.size);
  }
  bgCtx.restore();

  bgCtx.save();
  shootingStars = shootingStars.filter((star) => {
    star.life += 1 / 60;
    if (star.life > star.duration) {
      return false;
    }

    const progress = star.life / star.duration;
    const headX = star.x + star.vx * star.life;
    const headY = star.y + star.vy * star.life;
    const tailX =
      headX - (star.vx / Math.hypot(star.vx, star.vy)) * star.length;
    const tailY =
      headY - (star.vy / Math.hypot(star.vx, star.vy)) * star.length;
    const alpha = Math.sin(progress * Math.PI) * 0.42;

    const trail = bgCtx.createLinearGradient(headX, headY, tailX, tailY);
    trail.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.32})`);
    trail.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.12})`);
    trail.addColorStop(1, "rgba(255, 255, 255, 0)");

    bgCtx.strokeStyle = trail;
    bgCtx.lineWidth = 1;
    bgCtx.beginPath();
    bgCtx.moveTo(headX, headY);
    bgCtx.lineTo(tailX, tailY);
    bgCtx.stroke();

    bgCtx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
    bgCtx.fillRect(headX, headY, 1, 1);
    return true;
  });
  bgCtx.restore();

  bgCtx.fillStyle = "rgba(0, 0, 0, 0.045)";
  bgCtx.fillRect(0, 0, width, height);

  animationFrameId = window.requestAnimationFrame(drawBackground);
}

animationFrameId = window.requestAnimationFrame(drawBackground);
window.addEventListener("resize", () => {
  lastWidth = 0;
  lastHeight = 0;
  if (animationFrameId === null) {
    animationFrameId = window.requestAnimationFrame(drawBackground);
  }
});
