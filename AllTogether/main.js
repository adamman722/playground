// ── Card data ────────────────────────────────────────────────
const cards = [
  { id: 1, label: "Alpine Lake",    src: "https://picsum.photos/seed/alpine/800/450" },
  { id: 2, label: "Forest Path",    src: "https://picsum.photos/seed/forest/800/450" },
  { id: 3, label: "Desert Canyon",  src: "https://picsum.photos/seed/canyon/800/450" },
  { id: 4, label: "Ocean Waves",    src: "https://picsum.photos/seed/ocean/800/450" },
  { id: 5, label: "Golden Sunset",  src: "https://picsum.photos/seed/sunset/800/450" },
  { id: 6, label: "Flower Meadow",  src: "https://picsum.photos/seed/meadow/800/450" },
  { id: 7, label: "Waterfall",      src: "https://picsum.photos/seed/waterfall/800/450" },
  { id: 8, label: "Glacier",        src: "https://picsum.photos/seed/glacier/800/450" },
  { id: 9, label: "Volcano",        src: "https://picsum.photos/seed/volcano/800/450" },
];

// ── Render slides ────────────────────────────────────────────
const track = document.querySelector(".bilt-carousel-track");

if (cards.length === 0) {
  document.querySelector(".bilt-carousel").innerHTML =
    '<p class="bilt-carousel-empty">No photos available.</p>';
} else {
  cards.forEach(({ id, label, src }) => {
    const li = document.createElement("li");
    li.className = "bilt-carousel-slide";
    li.innerHTML = `
      <div class="bilt-card" data-id="${id}" data-label="${label}" data-src="${src}">
        <img src="${src}" alt="${label}">
        <div class="bilt-card-footer">
          <span class="bilt-card-label">${label}</span>
          <span class="bilt-card-checkbox"></span>
        </div>
      </div>`;
    track.appendChild(li);
  });
}

// ── Carousel navigation ──────────────────────────────────────
const slides        = Array.from(track.children);
const dotsContainer = document.querySelector(".bilt-carousel-dots");
const btnLeft       = document.querySelector(".bilt-carousel-btn--left");
const btnRight      = document.querySelector(".bilt-carousel-btn--right");

const VISIBLE  = 3;
const maxIndex = Math.max(0, slides.length - VISIBLE);
let current    = 0;

slides.forEach((_, i) => {
  if (i > maxIndex) return;
  const dot = document.createElement("button");
  dot.classList.add("bilt-dot");
  dot.setAttribute("aria-label", `Go to position ${i + 1}`);
  if (i === 0) dot.classList.add("bilt-active");
  dot.addEventListener("click", () => goTo(i));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function updateButtons() {
  btnLeft.disabled  = current === 0;
  btnRight.disabled = current === maxIndex;
}

function goTo(index) {
  current = Math.max(0, Math.min(index, maxIndex));
  track.style.transform = `translateX(-${current * (100 / VISIBLE)}%)`;
  dots.forEach((d) => d.classList.remove("bilt-active"));
  dots[current].classList.add("bilt-active");
  updateButtons();
}

updateButtons();

btnLeft.addEventListener("click",  () => goTo(current - 1));
btnRight.addEventListener("click", () => goTo(current + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

// ── Card selection ───────────────────────────────────────────
let selectedCard = null;

const countEl       = document.querySelector(".bilt-submit-count");
const submitBtn     = document.getElementById("biltSubmitBtn");
const carouselError = document.getElementById("biltCarouselError");

function updateSubmitBar() {
  countEl.textContent = selectedCard ? "1 selected" : "0 selected";
  submitBtn.disabled  = !selectedCard;
}

updateSubmitBar();

const allCards = document.querySelectorAll(".bilt-card");

allCards.forEach((card) => {
  card.addEventListener("click", () => {
    const { id, label, src } = card.dataset;
    if (selectedCard?.id === id) {
      selectedCard = null;
      card.classList.remove("bilt-selected");
    } else {
      allCards.forEach((c) => c.classList.remove("bilt-selected"));
      selectedCard = { id, label, src };
      card.classList.add("bilt-selected");
      carouselError.classList.remove("bilt-visible");
    }
    updateSubmitBar();
  });
});

// ── Address form → review section ───────────────────────────
const addressForm        = document.getElementById("bilt-address-form");
const reviewSection      = document.getElementById("biltReviewSection");
const reviewImg          = document.getElementById("biltReviewImg");
const reviewPhotoLabel   = document.getElementById("biltReviewPhotoLabel");
const reviewName         = document.getElementById("biltReviewName");
const reviewAddress      = document.getElementById("biltReviewAddress");
const reviewCityStateZip = document.getElementById("biltReviewCityStateZip");

function setFieldError(fieldEl, helperEl, message) {
  fieldEl.classList.add("bilt-error");
  if (helperEl) helperEl.textContent = message;
}

function clearFieldError(fieldEl) {
  fieldEl.classList.remove("bilt-error");
}

// Clear errors as user types
addressForm.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    clearFieldError(input.closest(".bilt-text-field"));
  });
});

addressForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstNameInput = document.getElementById("bilt-first-name");
  const lastNameInput  = document.getElementById("bilt-last-name");
  const streetInput    = document.getElementById("bilt-street-address");
  const cityInput      = document.getElementById("bilt-city");
  const stateEl        = document.querySelector("#bilt-form-state .bilt-select");
  const stateField     = document.getElementById("bilt-form-state");
  const zipInput       = document.getElementById("bilt-zip");
  const zipHelper      = document.getElementById("biltZipHelper");

  const firstName = firstNameInput.value.trim();
  const lastName  = lastNameInput.value.trim();
  const street    = streetInput.value.trim();
  const city      = cityInput.value.trim();
  const state     = stateEl?.dataset.selected ?? "";
  const zip       = zipInput.value.trim();

  let valid = true;

  if (!selectedCard) {
    carouselError.classList.add("bilt-visible");
    carouselError.scrollIntoView({ behavior: "smooth", block: "center" });
    valid = false;
  }

  if (!firstName) {
    setFieldError(document.getElementById("bilt-form-first-name"), null, "Required");
    valid = false;
  }
  if (!lastName) {
    setFieldError(document.getElementById("bilt-form-last-name"), null, "Required");
    valid = false;
  }
  if (!street) {
    setFieldError(document.getElementById("bilt-form-street"), null, "Required");
    valid = false;
  }
  if (!city) {
    setFieldError(document.getElementById("bilt-form-city"), null, "Required");
    valid = false;
  }
  if (!state) {
    stateField.classList.add("bilt-error");
    valid = false;
  } else {
    stateField.classList.remove("bilt-error");
  }
  if (!zip) {
    setFieldError(document.getElementById("bilt-form-zip"), zipHelper, "Required");
    valid = false;
  } else if (!/^\d{5}(-\d{4})?$/.test(zip)) {
    setFieldError(document.getElementById("bilt-form-zip"), zipHelper, "Enter a valid ZIP (e.g. 12345)");
    valid = false;
  }

  if (!valid) return;

  reviewName.textContent         = `${firstName} ${lastName}`;
  reviewAddress.textContent      = street;
  reviewCityStateZip.textContent = `${city}, ${state} ${zip}`;

  if (selectedCard) {
    reviewImg.src                = selectedCard.src;
    reviewImg.alt                = selectedCard.label;
    reviewPhotoLabel.textContent = selectedCard.label;
  }

  reviewSection.hidden = false;
  reviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Clear state error when a state is selected
document.querySelector("#bilt-form-state .bilt-select")?.addEventListener("click", () => {
  document.getElementById("bilt-form-state").classList.remove("bilt-error");
});

// ── Ripple effect ────────────────────────────────────────────
function createRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement("span");
  ripple.classList.add("bilt-ripple");
  ripple.style.width  = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left   = `${x}px`;
  ripple.style.top    = `${y}px`;

  const existing = btn.querySelector(".bilt-ripple");
  if (existing) existing.remove();

  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

document.querySelectorAll(".bilt-btn").forEach((btn) => {
  btn.addEventListener("click", createRipple);
});

// ── TextField: float label on value ─────────────────────────
document.querySelectorAll(".bilt-text-field input").forEach((input) => {
  const field = input.closest(".bilt-text-field");

  function syncShrunk() {
    field.classList.toggle("bilt-shrunk", input.value.trim() !== "");
  }

  input.addEventListener("input", syncShrunk);
  input.addEventListener("blur",  syncShrunk);
});

// ── Select behavior ──────────────────────────────────────────
document.querySelectorAll(".bilt-select-field").forEach((field) => {
  const control = field.querySelector(".bilt-select");
  const valueEl = field.querySelector(".bilt-select-value");
  const menu    = field.querySelector(".bilt-select-menu");
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
      const items   = [...options];
      const current = menu.querySelector(".bilt-selected");
      const idx     = current ? items.indexOf(current) : -1;
      const next    = e.key === "ArrowDown"
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
