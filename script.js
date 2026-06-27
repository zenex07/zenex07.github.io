/* ════════════════════════════════════════════════════════════
   ROHIT PISE — PORTFOLIO SCRIPTS v2
   3D Floating Orb · Scroll Parallax · Navbar · Interactions
   ════════════════════════════════════════════════════════════ */

/* ── Profile image fallback ── */
(function() {
  const img = document.getElementById('profile-image');
  const fb = document.getElementById('profile-fallback');
  if (img && fb) {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      fb.style.display = 'flex';
    });
    if (!img.complete || img.naturalWidth === 0) {
      img.onerror();
    }
  }
})();

/* ════════════════════════════════════════════════════════════
   HERO 3D CANVAS — Floating Geometric Orb
   ════════════════════════════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, mouse = { x: 0.5, y: 0.5 };
  let particles = [], geometries = [];
  let animFrame;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / W;
    mouse.y = e.clientY / H;
  }, { passive: true });

  /* Floating particles */
  function createParticles() {
    particles = [];
    const count = Math.min(50, Math.floor(W / 30));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }
  createParticles();
  window.addEventListener('resize', createParticles, { passive: true });

  /* 3D Icosahedron vertices */
  function makeIco(r) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],
      [0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],
      [phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]
    ].map(v => {
      const len = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
      return [v[0]/len*r, v[1]/len*r, v[2]/len*r];
    });
    const edges = [
      [0,1],[0,5],[0,7],[0,10],[0,11],
      [1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],
      [3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],
      [5,9],[5,11],
      [6,7],[6,8],[6,10],
      [7,8],[7,10],
      [8,9],[10,11]
    ];
    return { verts, edges };
  }

  /* 3D rotation helpers */
  function rotX(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c];
  }
  function rotY(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c];
  }
  function rotZ(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [v[0]*c - v[1]*s, v[0]*s + v[1]*c, v[2]];
  }
  function project(v, cx, cy, fov) {
    const z = v[2] + fov;
    const scale = fov / z;
    return [cx + v[0]*scale, cy + v[1]*scale, scale];
  }

  /* Build geo objects */
  function buildGeos() {
    const cx = W * 0.72, cy = H * 0.5;
    const r = Math.min(W, H) * 0.18;
    const ico = makeIco(r);
    geometries = [{ type:'ico', ico, cx, cy, rx:0, ry:0, rz:0 }];

    /* Orbiting rings */
    geometries.push({ type:'ring', cx, cy, r:r*1.6, rx:Math.PI/3, ry:0, phase:0 });
    geometries.push({ type:'ring', cx, cy, r:r*1.9, rx:Math.PI/5, ry:Math.PI/4, phase:0.7 });
  }
  buildGeos();
  window.addEventListener('resize', buildGeos, { passive: true });

  let t = 0;

  function drawRing(g) {
    const pts = 64;
    const projected = [];
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      let v = [Math.cos(a)*g.r, Math.sin(a)*g.r, 0];
      v = rotX(v, g.rx + g.phase);
      v = rotY(v, t * 0.3 + g.phase);
      const p = project(v, g.cx, g.cy, 800);
      projected.push(p);
    }
    const tiltFactor = (mouse.x - 0.5) * 0.3;
    ctx.beginPath();
    projected.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.strokeStyle = `rgba(255,77,0,${0.08 + tiltFactor * 0.04})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function drawIco(g) {
    const { ico } = g;
    const tiltX = (mouse.y - 0.5) * 0.6;
    const tiltY = (mouse.x - 0.5) * 0.6;

    const rotated = ico.verts.map(v => {
      let r = rotX(v, t * 0.4 + tiltX);
      r = rotY(r, t * 0.5 + tiltY);
      r = rotZ(r, t * 0.2);
      return r;
    });

    const proj = rotated.map(v => project(v, g.cx, g.cy, 700));

    /* Glow behind */
    const grd = ctx.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, Math.min(W,H)*0.22);
    grd.addColorStop(0, 'rgba(255,77,0,0.05)');
    grd.addColorStop(1, 'rgba(255,77,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, Math.min(W,H)*0.22, 0, Math.PI*2);
    ctx.fill();

    /* Draw edges */
    ico.edges.forEach(([a, b]) => {
      const pa = proj[a], pb = proj[b];
      const depthA = rotated[a][2], depthB = rotated[b][2];
      const avgDepth = (depthA + depthB) / 2;
      const maxD = Math.min(W,H)*0.18;
      const alpha = ((avgDepth + maxD) / (2*maxD)) * 0.6 + 0.08;

      ctx.beginPath();
      ctx.moveTo(pa[0], pa[1]);
      ctx.lineTo(pb[0], pb[1]);
      ctx.strokeStyle = `rgba(255,77,0,${alpha})`;
      ctx.lineWidth = 0.8 * pa[2];
      ctx.stroke();
    });

    /* Draw vertices */
    proj.forEach((p, i) => {
      const depth = rotated[i][2];
      const maxD = Math.min(W,H)*0.18;
      const alpha = ((depth + maxD) / (2*maxD)) * 0.8 + 0.1;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2 * p[2], 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,120,0,${alpha})`;
      ctx.fill();
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,77,0,${p.alpha})`;
      ctx.fill();
    });
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,200,200,${(1 - dist/120) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;
    drawConnections();
    drawParticles();
    geometries.forEach(g => {
      if (g.type === 'ring') drawRing(g);
      else if (g.type === 'ico') drawIco(g);
    });
    animFrame = requestAnimationFrame(animate);
  }
  animate();
})();

/* ════════════════════════════════════════════════════════════
   ABOUT CANVAS — Floating dot matrix animation
   ════════════════════════════════════════════════════════════ */
(function initAboutCanvas() {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    const parent = canvas.parentElement;
    W = canvas.width = parent.offsetWidth;
    H = canvas.height = parent.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cols = Math.floor(W / 28);
    const rows = Math.floor(H / 28);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * 28 + 14, y = j * 28 + 14;
        const wave = Math.sin(i * 0.4 + t) * Math.cos(j * 0.4 + t * 0.7);
        const alpha = (wave + 1) / 2 * 0.4 + 0.05;
        const r = wave > 0.3 ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,77,0,${alpha})`;
        ctx.fill();
      }
    }
    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════════ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('open');
      }
    });
    links.querySelectorAll('.navbar__link').forEach(l => {
      l.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  /* Active link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        document.querySelectorAll('.navbar__link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(s => observer.observe(s));
})();

/* ════════════════════════════════════════════════════════════
   SMOOTH SCROLL
   ════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
  });
});

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL — 3D Parallax style
   ════════════════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* ════════════════════════════════════════════════════════════
   CARD TILT — subtle 3D on hover
   ════════════════════════════════════════════════════════════ */
document.querySelectorAll('.project-card, .whatido__card, .ach-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ════════════════════════════════════════════════════════════
   CV DOWNLOAD
   ════════════════════════════════════════════════════════════ */
function downloadCV() {
  const a = document.createElement('a');
  a.href = 'Rohit_Pise_Resume.pdf';
  a.download = 'Rohit_Pise_Resume.pdf';
  a.click();
}

/* ── Open Certificate PDF ── */
function openCert(filename) {
  window.open(filename, '_blank');
}
