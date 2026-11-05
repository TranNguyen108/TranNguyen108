// NEXT button — cycle hero background videos
const nextBtn = document.querySelector('.next-btn');
const heroVideo = document.querySelector('.hero-video');
const videos = ['videos/hero1.mp4', 'videos/hero2.mp4', 'videos/hero3.mp4'];
let vidIndex = 0;

nextBtn.addEventListener('click', () => {
  vidIndex++;
  if (vidIndex >= videos.length) vidIndex = 0;
  heroVideo.src = videos[vidIndex];
  heroVideo.play().catch(() => {});
});

// Fallback for browsers without CSS scroll-driven animations
if (!CSS.supports('animation-timeline: view()')) {
  document.body.classList.add('no-sda');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.auto-blur,.auto-take-full,.auto-display').forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// Light/dark theme toggle — dark is the original design; choice is remembered
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(t) {
  if (t === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="bx bx-sun"></i>';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="bx bx-moon"></i>';
  }
}
applyTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// Play videos only while they are on screen — decoding 6 videos at once
// is what made scrolling stutter. Off-screen videos are paused.
const videoIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.play().catch(() => {}); }
    else { e.target.pause(); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('video').forEach((v) => videoIO.observe(v));
