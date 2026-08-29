import gsap from 'gsap';

export function animateFadeInUp(element: HTMLElement | null, delay = 0) {
  if (!element) return;
  gsap.fromTo(
    element,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, delay, ease: 'power3.out' }
  );
}

export function animatePulseGlow(element: HTMLElement | null) {
  if (!element) return;
  gsap.to(element, {
    boxShadow: '0 0 20px rgba(255, 111, 0, 0.4)',
    repeat: -1,
    yoyo: true,
    duration: 1.5,
  });
}