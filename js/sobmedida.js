gsap.registerPlugin(ScrollTrigger);

// 1. Efeito Parallax da Imagem
gsap.to(".parallax-img", {
    yPercent: -20, // Move a imagem para cima conforme desce o scroll
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// 2. Animação de Entrada
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.from(".hero-content .subtitle", { y: 30, opacity: 0, duration: 1 })
      .from(".hero-content h1", { y: 50, opacity: 0, duration: 1.2 }, "-=0.7")
      .from(".hero-content p", { y: 30, opacity: 0, duration: 1 }, "-=0.8")
      .from(".btn-cta", { scale: 0.9, opacity: 0, duration: 0.8 }, "-=0.5");
});