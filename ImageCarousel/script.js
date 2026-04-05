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
const track = document.querySelector(".carousel-track");

if (cards.length === 0) {
  document.querySelector(".carousel").innerHTML =
    '<p class="carousel-empty">No photos available.</p>';
} else {
  cards.forEach(({ id, label, src }) => {
    const li = document.createElement("li");
    li.className = "carousel-slide";
    li.innerHTML = `
      <div class="card" data-id="${id}" data-label="${label}" data-src="${src}">
        <img src="${src}" alt="${label}">
        <div class="card-footer">
        <span class="card-label">${label}</span>
          <span class="card-checkbox"></span>
        </div>
      </div>`;
    track.appendChild(li);
  });
}

// ── Carousel navigation ──────────────────────────────────────
const slides = Array.from(track.children);
const dotsContainer = document.querySelector(".carousel-dots");
const btnLeft = document.querySelector(".carousel-btn--left");
const btnRight = document.querySelector(".carousel-btn--right");

const VISIBLE = 3;
const maxIndex = Math.max(0, slides.length - VISIBLE);
let current = 0;

slides.forEach((_, i) => {
  if (i > maxIndex) return;
  const dot = document.createElement("button");
  dot.classList.add("dot");
  dot.setAttribute("aria-label", `Go to position ${i + 1}`);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goTo(i));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function goTo(index) {
  current = Math.max(0, Math.min(index, maxIndex));
  track.style.transform = `translateX(-${current * (100 / VISIBLE)}%)`;
  dots.forEach((d) => d.classList.remove("active"));
  dots[current].classList.add("active");
}

btnLeft.addEventListener("click", () => goTo(current - 1));
btnRight.addEventListener("click", () => goTo(current + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

// ── Card selection ───────────────────────────────────────────
let selectedCard = null; // { id, label, src }

const countEl = document.querySelector(".submit-count");
const submitBtn = document.getElementById("submitBtn");

function updateSubmitBar() {
  countEl.textContent = selectedCard ? "1 selected" : "0 selected";
  submitBtn.disabled = !selectedCard;
}

updateSubmitBar();

const allCards = document.querySelectorAll(".card");

allCards.forEach((card) => {
  card.addEventListener("click", () => {
    const { id, label, src } = card.dataset;

    if (selectedCard?.id === id) {
      selectedCard = null;
      card.classList.remove("selected");
    } else {
      allCards.forEach((c) => c.classList.remove("selected"));
      selectedCard = { id, label, src };
      card.classList.add("selected");
    }

    updateSubmitBar();
  });
});

// ── Modal ─────────────────────────────────────────────────────
const modalOverlay   = document.getElementById("modalOverlay");
const infoForm       = document.getElementById("infoForm");
const step1El        = document.getElementById("step1");
const step2El        = document.getElementById("step2");
const stepLineEl     = document.getElementById("stepLine");

let orderPayload = null;

// Stepper states: info | review | success
function setStep(name) {
  const bubble1 = step1El.querySelector(".stepper-bubble");
  const bubble2 = step2El.querySelector(".stepper-bubble");

  step1El.className   = "stepper-step";
  step2El.className   = "stepper-step";
  stepLineEl.className = "stepper-line";

  document.querySelectorAll(".modal-screen").forEach(s => s.classList.remove("active"));

  if (name === "info") {
    step1El.classList.add("active");
    bubble1.innerHTML = "1";
    bubble2.innerHTML = "2";
    document.getElementById("screenInfo").classList.add("active");
    infoForm.querySelector("input").focus();
  } else if (name === "review") {
    step1El.classList.add("completed");
    bubble1.innerHTML = "&#10003;";
    stepLineEl.classList.add("completed");
    step2El.classList.add("active");
    bubble2.innerHTML = "2";
    document.getElementById("screenReview").classList.add("active");
  } else if (name === "success") {
    step1El.classList.add("completed");
    bubble1.innerHTML = "&#10003;";
    stepLineEl.classList.add("completed");
    step2El.classList.add("completed");
    bubble2.innerHTML = "&#10003;";
    // Hide stepper on success screen
    document.querySelector(".stepper").style.display = "none";
    document.getElementById("screenSuccess").classList.add("active");
  }
}

function openModal() {
  document.querySelector(".stepper").style.display = "";
  modalOverlay.classList.add("open");
  modalOverlay.setAttribute("aria-hidden", "false");
  setStep("info");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden", "true");
  infoForm.reset();
  infoForm.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
}

submitBtn.addEventListener("click", openModal);
document.getElementById("modalCancel").addEventListener("click", closeModal);

modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
});

// Step 1 → Step 2
infoForm.addEventListener("submit", e => {
  e.preventDefault();

  let valid = true;
  infoForm.querySelectorAll("input[required]").forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      valid = false;
    } else {
      input.classList.remove("invalid");
    }
  });
  if (!valid) return;

  orderPayload = {
    selection:     selectedCard,
    firstName:     infoForm.firstName.value.trim(),
    lastName:      infoForm.lastName.value.trim(),
    streetAddress: infoForm.streetAddress.value.trim(),
    city:          infoForm.city.value.trim(),
    state:         infoForm.state.value.trim(),
    zip:           infoForm.zip.value.trim(),
  };

  document.getElementById("reviewImg").src                   = orderPayload.selection.src;
  document.getElementById("reviewImg").alt                   = orderPayload.selection.label;
  document.getElementById("reviewPhotoLabel").textContent    = orderPayload.selection.label;
  document.getElementById("reviewName").textContent          = `${orderPayload.firstName} ${orderPayload.lastName}`;
  document.getElementById("reviewAddress").textContent       = orderPayload.streetAddress;
  document.getElementById("reviewCityStateZip").textContent  = `${orderPayload.city}, ${orderPayload.state} ${orderPayload.zip}`;

  setStep("review");
});

// Step 2 → Step 1
document.getElementById("reviewBack").addEventListener("click", () => setStep("info"));

// Step 2 → Step 3
document.getElementById("confirmOrderBtn").addEventListener("click", () => {
  // Ready for submission — wire this to your API as needed.
  console.log("Order confirmed:", orderPayload);
  setStep("success");
});

// Close on Done
document.getElementById("successClose").addEventListener("click", closeModal);
