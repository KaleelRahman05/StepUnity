// public/js/animations.js
gsap.registerPlugin(ScrollTrigger);

// Hero title animation
gsap.from('.hero-title', {
  opacity: 0,
  y: 100,
  duration: 1.5,
  ease: 'power3.out'
});

// Scrub animation for feature boxes
gsap.to('#box1', {
  scrollTrigger: {
    trigger: '#box1',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,  // Smooth scrubbing with 1-second catch-up
    markers: false
  },
  x: 100,
  rotation: 5,
  ease: 'none'
});

gsap.to('#box2', {
  scrollTrigger: {
    trigger: '#box2',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: true,  // Instant scrubbing
  },
  scale: 1.2,
  ease: 'none'
});

gsap.to('#box3', {
  scrollTrigger: {
    trigger: '#box3',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 2,  // Slower scrubbing
  },
  x: -100,
  rotation: -5,
  ease: 'none'
});

// Parallax background effect
gsap.to('.hero', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  },
  opacity: 0.3,
  scale: 0.9,
  ease: 'none'
});
