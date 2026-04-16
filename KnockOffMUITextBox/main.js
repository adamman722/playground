// TextField — keep label floated when input has a value
document.querySelectorAll(".bilt-text-field input").forEach((input) => {
  const field = input.closest(".bilt-text-field");

  function syncShrunk() {
    if (input.value.trim() !== "") {
      field.classList.add("bilt-shrunk");
    } else {
      field.classList.remove("bilt-shrunk");
    }
  }

  input.addEventListener("input", syncShrunk);

  // Focus keeps the label up even with no value — CSS :focus handles
  // the visual, but we need JS to keep it after blur if empty.
  input.addEventListener("blur", syncShrunk);
});

// Select behavior
document.querySelectorAll(".bilt-select-field").forEach((field) => {
  const control = field.querySelector(".bilt-select");
  const valueEl = field.querySelector(".bilt-select-value");
  const menu = field.querySelector(".bilt-select-menu");
  const options = field.querySelectorAll(".bilt-select-option");

  if (!control || !menu) return;

  function open() {
    field.classList.add("bilt-open");
    control.setAttribute("aria-expanded", "true");
    const selected = menu.querySelector(".bilt-selected");
    if (selected) selected.scrollIntoView({ block: "nearest" });
  }

  function close() {
    field.classList.remove("bilt-open");
    control.setAttribute("aria-expanded", "false");
  }

  function selectOption(option) {
    options.forEach((o) => o.classList.remove("bilt-selected"));
    option.classList.add("bilt-selected");
    valueEl.textContent = option.textContent;
    valueEl.classList.remove("bilt-select-placeholder");
    control.dataset.selected = option.dataset.value;
    field.classList.add("bilt-shrunk");
    close();
    control.focus();
  }

  control.addEventListener("click", () => {
    field.classList.contains("bilt-open") ? close() : open();
  });

  control.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      field.classList.contains("bilt-open") ? close() : open();
    } else if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!field.classList.contains("bilt-open")) { open(); return; }
      const items = [...options];
      const current = menu.querySelector(".bilt-selected");
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
