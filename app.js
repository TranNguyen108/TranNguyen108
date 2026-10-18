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
