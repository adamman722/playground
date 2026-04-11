// TextField — keep label floated when input has a value
document.querySelectorAll(".mui-text-field input").forEach((input) => {
  const field = input.closest(".mui-text-field");

  function syncShrunk() {
    if (input.value.trim() !== "") {
      field.classList.add("shrunk");
    } else {
      field.classList.remove("shrunk");
    }
  }

  input.addEventListener("input", syncShrunk);

  // Focus keeps the label up even with no value — CSS :focus handles
  // the visual, but we need JS to keep it after blur if empty.
  input.addEventListener("blur", syncShrunk);
});

// Select behavior
document.querySelectorAll(".mui-select-field").forEach((field) => {
  const control = field.querySelector(".mui-select");
  const valueEl = field.querySelector(".mui-select-value");
  const menu = field.querySelector(".mui-select-menu");
  const options = field.querySelectorAll(".mui-select-option");

  if (!control || !menu) return;

  function open() {
    field.classList.add("open");
    control.setAttribute("aria-expanded", "true");
    const selected = menu.querySelector(".selected");
    if (selected) selected.scrollIntoView({ block: "nearest" });
  }

  function close() {
    field.classList.remove("open");
    control.setAttribute("aria-expanded", "false");
  }

  function selectOption(option) {
    options.forEach((o) => o.classList.remove("selected"));
    option.classList.add("selected");
    valueEl.textContent = option.textContent;
    valueEl.classList.remove("mui-select-placeholder");
    control.dataset.selected = option.dataset.value;
    field.classList.add("shrunk");
    close();
    control.focus();
  }

  control.addEventListener("click", () => {
    field.classList.contains("open") ? close() : open();
  });

  control.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      field.classList.contains("open") ? close() : open();
    } else if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!field.classList.contains("open")) { open(); return; }
      const items = [...options];
      const current = menu.querySelector(".selected");
      const idx = current ? items.indexOf(current) : -1;
      const next =
        e.key === "ArrowDown"
          ? items[Math.min(idx + 1, items.length - 1)]
          : items[Math.max(idx - 1, 0)];
      if (next) selectOption(next);
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => selectOption(option));
  });

  document.addEventListener("click", (e) => {
    if (!field.contains(e.target)) close();
  });
});
