// ─────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (dot && ring && hasFinePointer) {
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  function animCursor() {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    rx += (mx - rx) * .18;
    ry += (my - ry) * .18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button, .pill, .proj-card, .about-card, .tl-card, .cc, .social-link, .proj-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ─────────────────────────────────────────────
// SPLASH — PARTICLE CANVAS
// ─────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('splash-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + .3,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      o: Math.random() * .5 + .1,
    });
  }

  function drawSplash() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,140,255,${p.o})`;
      ctx.fill();
    });
    if (!document.getElementById('splash').classList.contains('hide')) {
      requestAnimationFrame(drawSplash);
    }
  }
  drawSplash();
})();

// ─────────────────────────────────────────────
// HERO CANVAS — GRID + GLOW
// ─────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mouseX = 0, mouseY = 0;
  const GRID = 60;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  document.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(79,140,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += GRID) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += GRID) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // glow dots at intersections near mouse
    for (let x = 0; x < W; x += GRID) {
      for (let y = 0; y < H; y += GRID) {
        const dist = Math.hypot(x - mouseX, y - mouseY);
        if (dist < 200) {
          const a = (1 - dist / 200) * .8;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79,140,255,${a})`;
          ctx.fill();
        }
      }
    }

    // radial glow under mouse
    const g = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
    g.addColorStop(0, 'rgba(79,140,255,.08)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ─────────────────────────────────────────────
// SPLASH DISMISS
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 900);
  }, 2600);
});

// ─────────────────────────────────────────────
// TYPING EFFECT
// ─────────────────────────────────────────────
const roles = ['Full Stack Developer', 'Flutter Developer', 'Angular Developer', 'Android Developer', 'Software Engineer'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  if (!typedEl) return;
  const word = roles[ri];
  typedEl.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
  if (!deleting && ci === word.length) { setTimeout(() => deleting = true, 2000); }
  else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, deleting ? 50 : 95);
}
setTimeout(type, 2800);

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);

  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', onScroll, { passive: true });

// ─────────────────────────────────────────────
// HAMBURGER
// ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navLinks.forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
}));

// close on outside click
document.addEventListener('click', e => {
  if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});

// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const isLight = localStorage.getItem('theme') === 'light' || 
                  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches);
  
  function setTheme(light) {
    document.documentElement.classList.toggle('light', light);
    document.body.classList.toggle('light', light);
    themeToggle.setAttribute('aria-pressed', String(light));
    themeToggle.setAttribute('title', light ? 'Switch to dark mode' : 'Switch to light mode');
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('.theme-toggle-text');
    if (icon) {
      icon.className = `fas ${light ? 'fa-sun' : 'fa-moon'}`;
    }
    if (text) {
      text.textContent = light ? 'Light' : 'Dark';
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f7efe3' : '#08111f');
    localStorage.setItem('theme', light ? 'light' : 'dark');
  }
  
  // init
  setTheme(isLight);
  
  themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('light'));
  });
}

// ─────────────────────────────────────────────
// GAMES SYSTEM
// ─────────────────────────────────────────────
let currentGame = null;

function createModal(title) {
  let modal = document.querySelector('.game-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <h2 class="game-title">${title}</h2>
          <button class="game-close" id="gameClose">&times;</button>
        </div>
        <canvas class="game-canvas" id="gameCanvas" width="560" height="380"></canvas>
        <div class="game-controls" id="gameControls"></div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('gameClose').addEventListener('click', closeGame);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeGame();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeGame();
    });
  }

  modal.querySelector('.game-title').textContent = title;
  modal.querySelector('#gameControls').innerHTML = '';
  return modal.querySelector('#gameCanvas');
}

function closeGame() {
  document.querySelector('.game-modal')?.classList.remove('show');
  currentGame?.stop?.();
  currentGame = null;
}

function setGameControls(controls, message, state = 'info', restartLabel = '', onRestart = null) {
  controls.innerHTML = '';
  const status = document.createElement('div');
  status.className = `game-status${state === 'win' ? ' win' : state === 'lose' ? ' lose' : ''}`;
  status.textContent = message;
  controls.appendChild(status);

  if (restartLabel && onRestart) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-action-btn';
    button.textContent = restartLabel;
    button.addEventListener('click', onRestart);
    controls.appendChild(button);
  }
}

function drawPreview(canvasId, drawFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let time = 0;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFn(ctx, time);
    time += 0.05;
    requestAnimationFrame(loop);
  }
  loop();
}

drawPreview('ttt-preview', (ctx, t) => {
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 40, 20);
    ctx.lineTo(20 + i * 40, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 20 + i * 40);
    ctx.lineTo(100, 20 + i * 40);
    ctx.stroke();
  }
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(25 + Math.sin(t * 5) * 5, 25 + Math.cos(t * 5) * 5);
  ctx.lineTo(55, 55);
  ctx.moveTo(55, 25);
  ctx.lineTo(25, 55);
  ctx.stroke();
});

drawPreview('snake-preview', (ctx, t) => {
  ctx.fillStyle = '#7dd3fc';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(35 + i * 12 + Math.sin(t + i) * 3, 60 + Math.cos(t + i) * 3, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(95 + Math.sin(t * 8) * 4, 45 + Math.cos(t * 8) * 4, 10, 0, Math.PI * 2);
  ctx.fill();
});

drawPreview('memory-preview', (ctx, t) => {
  ctx.fillStyle = '#38bdf8';
  for (let i = 0; i < 12; i++) {
    const flip = Math.sin(t * 3 + i * 0.5) > 0 ? 1 : 0.3;
    ctx.globalAlpha = flip;
    ctx.fillRect(15 + (i % 4) * 25, 20 + Math.floor(i / 4) * 25, 20, 20);
    ctx.fillRect(17 + (i % 4) * 25, 22 + Math.floor(i / 4) * 25, 16, 16);
    ctx.globalAlpha = 1;
  }
});

drawPreview('2048-preview', (ctx) => {
  const tiles = [2, 4, 8, 16, 32, 64];
  tiles.forEach((val, i) => {
    ctx.fillStyle = `hsl(${205 - i * 10}, 72%, ${78 - i * 6}%)`;
    ctx.fillRect(20 + i * 15, 30, 12, 12);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(val, 26 + i * 15, 36);
  });
});

drawPreview('clock-preview', (ctx, t) => {
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(60, 60, 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.save();
  ctx.translate(60, 60);
  ctx.rotate(t);
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(25, 0);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('5:00', 60, 90);
});

const gameFactories = {
  tictactoe: { title: 'Tic-Tac-Toe - Beat the AI', create: game_tictactoe },
  snake: { title: 'Snake', create: game_snake },
  memory: { title: 'Memory Match', create: game_memory },
  '2048': { title: '2048 Puzzle', create: game_2048 },
  chessclock: { title: 'Chess Clock', create: game_chessclock },
};

function initGame(name, canvas) {
  const game = gameFactories[name];
  if (!game) return null;
  const ctx = canvas.getContext('2d');
  canvas.width = 560;
  canvas.height = 380;
  const controls = document.getElementById('gameControls');
  return game.create(ctx, canvas, controls);
}

document.querySelectorAll('.game-play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentGame?.stop?.();

    const card = btn.closest('.game-card');
    const gameName = card.dataset.game;
    const canvas = createModal(gameFactories[gameName]?.title || 'Game');
    document.querySelector('.game-modal').classList.add('show');

    const preview = card.querySelector('canvas');
    preview.style.transform = 'scale(1.08)';
    setTimeout(() => preview.style.transform = '', 200);

    currentGame = initGame(gameName, canvas);
  });
});

function game_tictactoe(ctx, canvas, controls) {
  const size = 100;
  const boardLeft = 130;
  const boardTop = 40;
  let board = Array(9).fill(null);
  let active = true;
  let aiTimer = null;

  function winner(state) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (state[a] && state[a] === state[b] && state[a] === state[c]) return state[a];
    }
    return state.includes(null) ? null : 'Tie';
  }

  function minimax(state, isMax) {
    const result = winner(state);
    if (result === 'O') return 10;
    if (result === 'X') return -10;
    if (result === 'Tie') return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < state.length; i++) {
        if (!state[i]) {
          state[i] = 'O';
          best = Math.max(best, minimax(state, false));
          state[i] = null;
        }
      }
      return best;
    }

    let best = Infinity;
    for (let i = 0; i < state.length; i++) {
      if (!state[i]) {
        state[i] = 'X';
        best = Math.min(best, minimax(state, true));
        state[i] = null;
      }
    }
    return best;
  }

  function findBestMove() {
    let choice = -1;
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, false);
        board[i] = null;
        if (score > best) {
          best = score;
          choice = i;
        }
      }
    }
    return choice;
  }

  function render() {
    ctx.fillStyle = '#172554';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 20px JetBrains Mono';
    ctx.fillText('You: X', 28, 36);
    ctx.fillText('AI: O', 450, 36);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;

    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(boardLeft + i * size, boardTop);
      ctx.lineTo(boardLeft + i * size, boardTop + size * 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(boardLeft, boardTop + i * size);
      ctx.lineTo(boardLeft + size * 3, boardTop + i * size);
      ctx.stroke();
    }

    board.forEach((cell, index) => {
      const x = boardLeft + (index % 3) * size + size / 2;
      const y = boardTop + Math.floor(index / 3) * size + size / 2;
      if (cell === 'X') {
        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x - 25, y - 25);
        ctx.lineTo(x + 25, y + 25);
        ctx.moveTo(x + 25, y - 25);
        ctx.lineTo(x - 25, y + 25);
        ctx.stroke();
      }
      if (cell === 'O') {
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function restart() {
    cleanup();
    currentGame = game_tictactoe(ctx, canvas, controls);
  }

  function finish(result) {
    active = false;
    const message = result === 'Tie' ? 'It is a draw.' : result === 'X' ? 'You beat the AI.' : 'The AI wins this round.';
    const state = result === 'X' ? 'win' : result === 'O' ? 'lose' : 'info';
    setGameControls(controls, message, state, 'Play Again', restart);
  }

  function maybeFinish() {
    const result = winner(board);
    if (!result) return false;
    render();
    finish(result);
    return true;
  }

  function onClick(event) {
    if (!active || aiTimer) return;
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left - boardLeft) / size);
    const row = Math.floor((event.clientY - rect.top - boardTop) / size);
    if (col < 0 || col > 2 || row < 0 || row > 2) return;
    const index = row * 3 + col;
    if (board[index]) return;

    board[index] = 'X';
    render();
    if (maybeFinish()) return;

    setGameControls(controls, 'AI is thinking...', 'info');
    aiTimer = setTimeout(() => {
      aiTimer = null;
      const move = findBestMove();
      if (move >= 0) board[move] = 'O';
      render();
      if (!maybeFinish()) {
        setGameControls(controls, 'Your turn. Pick a square.', 'info');
      }
    }, 280);
  }

  function cleanup() {
    active = false;
    canvas.removeEventListener('click', onClick);
    if (aiTimer) clearTimeout(aiTimer);
  }

  canvas.addEventListener('click', onClick);
  render();
  setGameControls(controls, 'Your turn. Pick a square.', 'info');
  return { stop: cleanup };
}

function game_snake(ctx, canvas, controls) {
  const grid = 20;
  const cols = 28;
  const rows = 19;
  let snake = [{ x: 8, y: 9 }];
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let food = { x: 18, y: 9 };
  let score = 0;
  let running = true;
  let rafId = 0;
  let lastStep = 0;
  const speed = 120;

  function placeFood() {
    const open = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!snake.some(seg => seg.x === x && seg.y === y)) open.push({ x, y });
      }
    }
    food = open[Math.floor(Math.random() * open.length)];
  }

  function render() {
    ctx.fillStyle = '#10213b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(148,163,184,.12)';
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * grid, 0);
      ctx.lineTo(x * grid, rows * grid);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * grid);
      ctx.lineTo(cols * grid, y * grid);
      ctx.stroke();
    }
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * grid, (food.y + 0.5) * grid, 8, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#f8fafc' : '#7dd3fc';
      ctx.fillRect(segment.x * grid + 2, segment.y * grid + 2, grid - 4, grid - 4);
    });
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 22px JetBrains Mono';
    ctx.fillText(`Score ${score}`, 18, 30);
  }

  function restart() {
    cleanup();
    currentGame = game_snake(ctx, canvas, controls);
  }

  function lose() {
    running = false;
    cancelAnimationFrame(rafId);
    setGameControls(controls, `Game over. Score ${score}.`, 'lose', 'Play Again', restart);
  }

  function step() {
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (
      head.x < 0 || head.x >= cols ||
      head.y < 0 || head.y >= rows ||
      snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      lose();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      placeFood();
    } else {
      snake.pop();
    }

    render();
    setGameControls(controls, 'Use the arrow keys to move.', 'info');
  }

  function loop(ts) {
    if (!running) return;
    if (!lastStep) lastStep = ts;
    if (ts - lastStep >= speed) {
      lastStep = ts;
      step();
    }
    rafId = requestAnimationFrame(loop);
  }

  function onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (!['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) return;
    event.preventDefault();
    if (key === 'arrowleft' && direction.x !== 1) nextDirection = { x: -1, y: 0 };
    if (key === 'arrowright' && direction.x !== -1) nextDirection = { x: 1, y: 0 };
    if (key === 'arrowup' && direction.y !== 1) nextDirection = { x: 0, y: -1 };
    if (key === 'arrowdown' && direction.y !== -1) nextDirection = { x: 0, y: 1 };
  }

  function cleanup() {
    running = false;
    cancelAnimationFrame(rafId);
    document.removeEventListener('keydown', onKeyDown);
  }

  document.addEventListener('keydown', onKeyDown);
  render();
  setGameControls(controls, 'Use the arrow keys to move.', 'info');
  rafId = requestAnimationFrame(loop);
  return { stop: cleanup };
}

function game_memory(ctx, canvas, controls) {
  const tileSize = 78;
  const gap = 12;
  const startX = 102;
  const startY = 18;
  const values = [1, 2, 3, 4, 5, 6, 7, 8];
  let tiles = [...values, ...values].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = [];
  let busy = false;
  let resetTimer = null;

  function render() {
    ctx.fillStyle = '#10213b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 16; i++) {
      const x = startX + (i % 4) * (tileSize + gap);
      const y = startY + Math.floor(i / 4) * (tileSize + gap);
      const open = flipped.includes(i) || matched.includes(i);
      ctx.fillStyle = matched.includes(i) ? '#0f766e' : open ? '#7dd3fc' : '#334155';
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.fillStyle = '#fff';
      ctx.font = '700 28px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(open ? String(tiles[i]) : '?', x + tileSize / 2, y + tileSize / 2);
    }
  }

  function restart() {
    cleanup();
    currentGame = game_memory(ctx, canvas, controls);
  }

  function updateStatus() {
    if (matched.length === 16) {
      setGameControls(controls, 'You matched every pair.', 'win', 'Play Again', restart);
    } else {
      setGameControls(controls, `Matches found ${matched.length / 2}/8.`, 'info');
    }
  }

  function onClick(event) {
    if (busy) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor((x - startX) / (tileSize + gap));
    const row = Math.floor((y - startY) / (tileSize + gap));
    if (col < 0 || col > 3 || row < 0 || row > 3) return;

    const tileX = startX + col * (tileSize + gap);
    const tileY = startY + row * (tileSize + gap);
    if (x > tileX + tileSize || y > tileY + tileSize) return;

    const index = row * 4 + col;
    if (flipped.includes(index) || matched.includes(index)) return;

    flipped.push(index);
    render();
    if (flipped.length === 2) {
      busy = true;
      if (tiles[flipped[0]] === tiles[flipped[1]]) {
        matched.push(...flipped);
        flipped = [];
        busy = false;
        render();
        updateStatus();
      } else {
        resetTimer = setTimeout(() => {
          flipped = [];
          busy = false;
          render();
          updateStatus();
        }, 700);
      }
    }
  }

  function cleanup() {
    canvas.removeEventListener('click', onClick);
    if (resetTimer) clearTimeout(resetTimer);
  }

  canvas.addEventListener('click', onClick);
  render();
  setGameControls(controls, 'Find all 8 matching pairs.', 'info');
  return { stop: cleanup };
}

function game_2048(ctx, canvas, controls) {
  const size = 4;
  const tile = 84;
  const gap = 12;
  const startX = 94;
  const startY = 12;
  let board = Array.from({ length: size }, () => Array(size).fill(0));
  let score = 0;
  let active = true;

  const colors = { 0:'#334155', 2:'#f8fafc', 4:'#fef3c7', 8:'#fde68a', 16:'#fcd34d', 32:'#f59e0b', 64:'#ea580c', 128:'#38bdf8', 256:'#0ea5e9', 512:'#0284c7', 1024:'#0f766e', 2048:'#22c55e' };

  function addRandomTile() {
    const empty = [];
    board.forEach((row, r) => row.forEach((value, c) => { if (!value) empty.push([r, c]); }));
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function compress(line) {
    const values = line.filter(Boolean);
    const merged = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const doubled = values[i] * 2;
        score += doubled;
        merged.push(doubled);
        i++;
      } else {
        merged.push(values[i]);
      }
    }
    while (merged.length < size) merged.push(0);
    return merged;
  }

  function move(direction) {
    if (!active) return;
    const snapshot = JSON.stringify(board);
    if (direction === 'left') board = board.map(row => compress(row));
    if (direction === 'right') board = board.map(row => compress([...row].reverse()).reverse());
    if (direction === 'up') {
      for (let c = 0; c < size; c++) {
        const column = compress(board.map(row => row[c]));
        column.forEach((value, r) => { board[r][c] = value; });
      }
    }
    if (direction === 'down') {
      for (let c = 0; c < size; c++) {
        const column = compress(board.map(row => row[c]).reverse()).reverse();
        column.forEach((value, r) => { board[r][c] = value; });
      }
    }
    if (JSON.stringify(board) !== snapshot) {
      addRandomTile();
      render();
      updateStatus();
    }
  }

  function hasMoves() {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!board[r][c]) return true;
        if (c < size - 1 && board[r][c] === board[r][c + 1]) return true;
        if (r < size - 1 && board[r][c] === board[r + 1][c]) return true;
      }
    }
    return false;
  }

  function updateStatus() {
    const best = Math.max(...board.flat());
    if (best >= 2048) {
      active = false;
      setGameControls(controls, `You hit 2048 with score ${score}.`, 'win', 'Play Again', restart);
      return;
    }
    if (!hasMoves()) {
      active = false;
      setGameControls(controls, `No moves left. Score ${score}.`, 'lose', 'Play Again', restart);
      return;
    }
    setGameControls(controls, `Use arrow keys. Score ${score}.`, 'info');
  }

  function render() {
    ctx.fillStyle = '#10213b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 22px JetBrains Mono';
    ctx.fillText(`Score ${score}`, 20, 30);
    board.forEach((row, r) => row.forEach((value, c) => {
      const x = startX + c * (tile + gap);
      const y = startY + r * (tile + gap);
      ctx.fillStyle = colors[value] || '#be123c';
      ctx.fillRect(x, y, tile, tile);
      if (value) {
        ctx.fillStyle = value <= 4 ? '#0f172a' : '#fff';
        ctx.font = `700 ${value >= 128 ? 24 : 28}px JetBrains Mono`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(value), x + tile / 2, y + tile / 2);
      }
    }));
  }

  function onKeyDown(event) {
    const directions = { arrowleft:'left', arrowright:'right', arrowup:'up', arrowdown:'down' };
    const direction = directions[event.key.toLowerCase()];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  }

  function restart() {
    cleanup();
    currentGame = game_2048(ctx, canvas, controls);
  }

  function cleanup() {
    active = false;
    document.removeEventListener('keydown', onKeyDown);
  }

  addRandomTile();
  addRandomTile();
  document.addEventListener('keydown', onKeyDown);
  render();
  updateStatus();
  return { stop: cleanup };
}

function game_chessclock(ctx, canvas, controls) {
  let playerOne = 300;
  let playerTwo = 300;
  let activePlayer = 0;
  let running = false;
  let rafId = 0;
  let lastTick = 0;

  function format(seconds) {
    const safe = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
  }

  function render() {
    ctx.fillStyle = '#10213b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = activePlayer === 1 ? '#f59e0b' : '#334155';
    ctx.fillRect(32, 40, 496, 120);
    ctx.fillStyle = activePlayer === 2 ? '#7dd3fc' : '#334155';
    ctx.fillRect(32, 220, 496, 120);
    ctx.fillStyle = '#fff';
    ctx.font = '700 18px JetBrains Mono';
    ctx.fillText('Player 1', 52, 74);
    ctx.fillText('Player 2', 52, 254);
    ctx.font = '700 52px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(format(playerOne), 280, 112);
    ctx.fillText(format(playerTwo), 280, 292);
  }

  function restart() {
    cleanup();
    currentGame = game_chessclock(ctx, canvas, controls);
  }

  function finish(winner) {
    running = false;
    cancelAnimationFrame(rafId);
    setGameControls(controls, `${winner} wins on time.`, 'win', 'New Game', restart);
  }

  function loop(now) {
    if (!running) return;
    if (!lastTick) lastTick = now;
    const delta = (now - lastTick) / 1000;
    lastTick = now;
    if (activePlayer === 1) playerOne -= delta;
    if (activePlayer === 2) playerTwo -= delta;
    if (playerOne <= 0) {
      playerOne = 0;
      render();
      finish('Player 2');
      return;
    }
    if (playerTwo <= 0) {
      playerTwo = 0;
      render();
      finish('Player 1');
      return;
    }
    render();
    rafId = requestAnimationFrame(loop);
  }

  function onClick(event) {
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    activePlayer = y < canvas.height / 2 ? 2 : 1;
    setGameControls(controls, `Clock running. Player ${activePlayer} is active.`, 'info');
    if (!running) {
      running = true;
      lastTick = performance.now();
      rafId = requestAnimationFrame(loop);
    }
    render();
  }

  function cleanup() {
    running = false;
    cancelAnimationFrame(rafId);
    canvas.removeEventListener('click', onClick);
  }

  canvas.addEventListener('click', onClick);
  render();
  setGameControls(controls, 'Tap a player area to hand over the move.', 'info');
  return { stop: cleanup };
}
function animateCount(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(ease * target);
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.count);
      animateCount(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObs.observe(el));

// ─────────────────────────────────────────────
// SKILL BAR ANIMATION
// ─────────────────────────────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.sb-fill');
      if (fill) {
        setTimeout(() => fill.classList.add('animate'), 100);
      }
      barObs.unobserve(e.target);
    }
  });
}, { threshold: .3 });

document.querySelectorAll('.skill-bar').forEach(b => barObs.observe(b));

// ─────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

// ─────────────────────────────────────────────
// BACK TO TOP
// ─────────────────────────────────────────────
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─────────────────────────────────────────────
// SMOOTH ANCHOR SCROLLING
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─────────────────────────────────────────────
// PROJ CARD TILT
// ─────────────────────────────────────────────
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease, border-color .35s, box-shadow .35s';
  });
});
