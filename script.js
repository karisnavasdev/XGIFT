const CONTRACT_ADDRESS = "FGnzUzwqULDuZk3WX4CGdKeeZiSwp9kHQKL5HGeFpump";

const copyBtn = document.getElementById("copy-ca");
const caText = document.getElementById("ca-text");

if (caText) {
  caText.textContent = CONTRACT_ADDRESS;
}

if (copyBtn && caText) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      copyBtn.classList.add("copied");
      const label = copyBtn.querySelector(".copy-label");
      const icon = copyBtn.querySelector(".copy-icon");
      if (label) label.textContent = "COPIED!";
      if (icon) icon.textContent = "✅";

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (label) label.textContent = "COPY";
        if (icon) icon.textContent = "📋";
      }, 2000);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(caText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}

function initMoneyRain() {
  const container = document.getElementById("money-rain");
  if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const labels = ["$25", "$25", "$25", "$", "$", "💵", "💰"];
  const isMobile = window.innerWidth < 768;
  const initialCount = isMobile ? 40 : 80;
  const maxBills = isMobile ? 55 : 110;
  const spawnInterval = isMobile ? 350 : 220;

  function createBill() {
    if (container.children.length >= maxBills) {
      return;
    }

    const label = labels[Math.floor(Math.random() * labels.length)];
    const isEmoji = label.length <= 2 && /\p{Emoji}/u.test(label);

    const bill = document.createElement("div");
    bill.className = isEmoji ? "money-bill money-bill--emoji" : "money-bill";
    bill.textContent = label;

    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 5;
    const delay = Math.random() * 2;
    const sway = (Math.random() - 0.5) * 140;
    const rotStart = Math.random() * 360;
    const scale = 0.7 + Math.random() * 0.8;
    const peakOpacity = 0.65 + Math.random() * 0.35;

    bill.style.left = `${left}%`;
    bill.style.animationDuration = `${duration}s`;
    bill.style.animationDelay = `${delay}s`;
    bill.style.setProperty("--sway", `${sway}px`);
    bill.style.setProperty("--rot-start", `${rotStart}deg`);
    bill.style.setProperty("--scale", scale.toFixed(2));
    bill.style.setProperty("--peak-opacity", peakOpacity.toFixed(2));

    if (isEmoji) {
      bill.style.fontSize = `${18 + Math.random() * 22}px`;
    } else {
      bill.style.fontSize = `${11 + Math.random() * 7}px`;
      bill.style.padding = `${4 + Math.random() * 4}px ${10 + Math.random() * 8}px`;
    }

    bill.addEventListener("animationend", () => bill.remove());
    container.appendChild(bill);
  }

  for (let i = 0; i < initialCount; i++) {
    setTimeout(createBill, i * 80);
  }

  setInterval(createBill, spawnInterval);
}

initMoneyRain();

function initTapGame() {
  const TAP_GOAL = 10;
  const WINDOW_MS = 1000;

  const tapBtn = document.getElementById("tap-btn");
  const tapCountEl = document.getElementById("tap-count");
  const tapProgress = document.getElementById("tap-progress");
  const tapHint = document.getElementById("tap-hint");
  const tapWin = document.getElementById("tap-win");
  const tapRetry = document.getElementById("tap-retry");
  const tapCard = document.querySelector(".tap-game-card");

  if (!tapBtn || !tapCountEl) {
    return;
  }

  let taps = [];
  let won = false;
  let progressRaf = null;

  function updateProgress() {
    const now = Date.now();
    taps = taps.filter((t) => now - t <= WINDOW_MS);

    const count = taps.length;
    tapCountEl.textContent = count;
    tapCountEl.classList.toggle("hot", count >= 7);

    if (taps.length === 0) {
      tapProgress.style.width = "0%";
      progressRaf = null;
      return;
    }

    const oldest = taps[0];
    const elapsed = now - oldest;
    const remaining = Math.max(0, WINDOW_MS - elapsed);
    const pct = (remaining / WINDOW_MS) * 100;
    tapProgress.style.width = `${pct}%`;

    if (remaining > 0 && !won) {
      progressRaf = requestAnimationFrame(updateProgress);
    } else {
      progressRaf = null;
    }
  }

  function spawnBurst(x, y) {
    const burst = document.createElement("span");
    burst.className = "tap-burst";
    burst.textContent = "$";
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    tapBtn.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
  }

  function showWin() {
    won = true;
    tapCard.classList.add("won");
    tapWin.hidden = false;
    tapWin.classList.remove("hidden");
    tapHint.textContent = "LEGENDARY SPEED 🏆";
    tapHint.classList.add("win");

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const bill = document.createElement("div");
        bill.className = "money-bill";
        bill.textContent = "$25";
        bill.style.left = `${20 + Math.random() * 60}%`;
        bill.style.animation = `money-fall ${2 + Math.random() * 2}s linear forwards`;
        bill.style.setProperty("--sway", `${(Math.random() - 0.5) * 80}px`);
        bill.style.setProperty("--rot-start", `${Math.random() * 360}deg`);
        bill.style.setProperty("--scale", "1.2");
        bill.style.fontSize = "14px";
        bill.style.padding = "6px 12px";
        bill.addEventListener("animationend", () => bill.remove());
        document.getElementById("money-rain")?.appendChild(bill);
      }, i * 80);
    }
  }

  function resetGame() {
    won = false;
    taps = [];
    tapCountEl.textContent = "0";
    tapCountEl.classList.remove("hot");
    tapProgress.style.width = "0%";
    tapHint.textContent = "Tap fast. Degen fingers only. ⚡";
    tapHint.classList.remove("fail", "win");
    tapCard.classList.remove("won");
    tapWin.hidden = true;
    tapWin.classList.add("hidden");
    if (progressRaf) {
      cancelAnimationFrame(progressRaf);
      progressRaf = null;
    }
  }

  function registerTap(x, y) {
    if (won) {
      return;
    }

    const now = Date.now();
    taps.push(now);
    taps = taps.filter((t) => now - t <= WINDOW_MS);

    tapBtn.classList.add("tap-btn--hit");
    setTimeout(() => tapBtn.classList.remove("tap-btn--hit"), 80);

    spawnBurst(x, y);

    if (taps.length >= TAP_GOAL) {
      showWin();
      return;
    }

    tapHint.classList.remove("fail");
    if (taps.length >= 7) {
      tapHint.textContent = "ALMOST THERE — KEEP GOING! 🔥";
    } else if (taps.length >= 4) {
      tapHint.textContent = "Nice pace! Don't stop! 💨";
    } else {
      tapHint.textContent = "Tap fast. Degen fingers only. ⚡";
    }

    if (!progressRaf) {
      progressRaf = requestAnimationFrame(updateProgress);
    } else {
      updateProgress();
    }

    setTimeout(() => {
      if (won) {
        return;
      }
      const now2 = Date.now();
      taps = taps.filter((t) => now2 - t <= WINDOW_MS);
      tapCountEl.textContent = taps.length;
      tapCountEl.classList.toggle("hot", taps.length >= 7);
      if (taps.length === 0) {
        tapProgress.style.width = "0%";
        tapHint.textContent = "Too slow! 10 taps in 1 second. Try again! 😤";
        tapHint.classList.add("fail");
      }
    }, WINDOW_MS + 80);
  }

  function handleTap(e) {
    const rect = tapBtn.getBoundingClientRect();
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
    registerTap(x, y);
  }

  tapBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handleTap(e);
  });

  document.addEventListener("keydown", (e) => {
    if (e.code !== "ShiftLeft" || won) {
      return;
    }
    const rect = tapBtn.getBoundingClientRect();
    registerTap(
      rect.width / 2 + (Math.random() - 0.5) * 48,
      rect.height / 2 + (Math.random() - 0.5) * 48
    );
  });

  tapRetry?.addEventListener("click", resetGame);
}

initTapGame();
