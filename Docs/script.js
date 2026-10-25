(() => {
  const dock = document.getElementById("dock");
  const items = [...dock.querySelectorAll(".dock-item")];
  const tooltip = document.getElementById("tooltip");
  const base = 54;
  const max = 82;
  let activePointer = null;
  let raf = 0;

  function resetDock() {
    items.forEach(item => {
      item.style.transform = "translateY(0) scale(1)";
      item.style.zIndex = "1";
    });
    tooltip.style.display = "none";
    activePointer = null;
  }

  function updateDock(clientX, clientY) {
    const dockRect = dock.getBoundingClientRect();
    const centerY = dockRect.bottom;
    const pointerInside = clientY >= dockRect.top - 50 && clientY <= dockRect.bottom + 25
      && clientX >= dockRect.left - 35 && clientX <= dockRect.right + 35;
    if (!pointerInside) { resetDock(); return; }

    activePointer = { clientX, clientY };
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(clientX - centerX);
      const influence = Math.max(0, 1 - distance / 155);
      const scale = 1 + (max / base - 1) * influence * influence;
      const lift = (scale - 1) * 9;
      item.style.transform = `translateY(${-lift}px) scale(${scale})`;
      item.style.zIndex = String(Math.round(scale * 10) + index);
    });

    const hovered = items.find(item => {
      const r = item.getBoundingClientRect();
      return clientX >= r.left && clientX <= r.right && clientY >= r.top - 18 && clientY <= r.bottom + 8;
    });
    if (hovered) {
      tooltip.textContent = hovered.dataset.name || hovered.getAttribute("aria-label") || "";
      tooltip.style.display = "block";
      const r = hovered.getBoundingClientRect();
      tooltip.style.left = `${r.left + r.width / 2}px`;
      tooltip.style.top = `${Math.max(12, r.top - 8)}px`;
    } else {
      tooltip.style.display = "none";
    }
  }

  dock.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => updateDock(event.clientX, event.clientY));
  });
  dock.addEventListener("pointerleave", resetDock);
  items.forEach(item => {
    item.addEventListener("click", () => {
      const name = item.dataset.name;
      if (name === "Recycle Bin") {
        tooltip.textContent = "Recycle Bin · Preview only";
      } else {
        tooltip.textContent = `${name} · Preview only`;
      }
      const r = item.getBoundingClientRect();
      tooltip.style.display = "block";
      tooltip.style.left = `${r.left + r.width / 2}px`;
      tooltip.style.top = `${Math.max(12, r.top - 8)}px`;
      window.setTimeout(() => { if (!activePointer) tooltip.style.display = "none"; }, 1400);
    });
    item.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
      }
    });
  });

  const timeLabel = document.getElementById("time-label");
  const dateLabel = document.getElementById("date-label");
  function updateClock() {
    const now = new Date();
    timeLabel.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    dateLabel.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Replace the placeholder URL in one place after editing this file.
  const modUrl = "https://github.com/stack0ntop/the-full-mac-experience";
  ["download-link", "footer-download"].forEach(id => {
    const link = document.getElementById(id);
    if (link && modUrl !== "https://github.com/stack0ntop/the-full-mac-experience") link.href = modUrl;
  });
})();
