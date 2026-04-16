// ── Card data ────────────────────────────────────────────────
const cards = [
  {
    id: 1,
    label: "Alpine Lake",
    src: "https://picsum.photos/seed/alpine/800/450",
  },
  {
    id: 2,
    label: "Forest Path",
    src: "https://picsum.photos/seed/forest/800/450",
  },
  {
    id: 3,
    label: "Desert Canyon",
    src: "https://picsum.photos/seed/canyon/800/450",
  },
  {
    id: 4,
    label: "Ocean Waves",
    src: "https://picsum.photos/seed/ocean/800/450",
  },
  {
    id: 5,
    label: "Golden Sunset",
    src: "https://picsum.photos/seed/sunset/800/450",
  },
  {
    id: 6,
    label: "Flower Meadow",
    src: "https://picsum.photos/seed/meadow/800/450",
  },
  {
    id: 7,
    label: "Waterfall",
    src: "https://picsum.photos/seed/waterfall/800/450",
  },
  {
    id: 8,
    label: "Glacier",
    src: "https://picsum.photos/seed/glacier/800/450",
  },
  {
    id: 9,
    label: "Volcano",
    src: "https://picsum.photos/seed/volcano/800/450",
  },
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
const slides = Array.from(track.children);
const dotsContainer = document.querySelector(".bilt-carousel-dots");
const btnLeft = document.querySelector(".bilt-carousel-btn--left");
const btnRight = document.querySelector(".bilt-carousel-btn--right");

const VISIBLE = 3;
const maxIndex = Math.max(0, slides.length - VISIBLE);
let current = 0;

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

updateButtons(); // set initial state

btnLeft.addEventListener("click", () => goTo(current - 1));
btnRight.addEventListener("click", () => goTo(current + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

// ── Card selection ───────────────────────────────────────────
let selectedCard = null; // { id, label, src }

const countEl = document.querySelector(".bilt-submit-count");
const submitBtn = document.getElementById("biltSubmitBtn");

function updateSubmitBar() {
  countEl.textContent = selectedCard ? "1 selected" : "0 selected";
  submitBtn.disabled = !selectedCard;
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
    }

    updateSubmitBar();
  });
});
