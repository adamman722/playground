function createRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.width  = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left   = `${x}px`;
  ripple.style.top    = `${y}px`;

  const existing = btn.querySelector('.ripple');
  if (existing) existing.remove();

  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.btn, .btn-icon-only').forEach(btn => {
  btn.addEventListener('click', createRipple);
});
