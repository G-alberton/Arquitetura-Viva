gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    gsap.to(".hero-bg-zoom", {
        scale: 1,
        duration: 2.5,
        ease: "power2.out"
    });

    gsap.from(".hero-content", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.5
    });
});

gsap.to(".hero-bg-zoom", {
    y: 150,
    ease: "none",
    scrollTrigger: {
        trigger: ".atelier-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

gsap.from(".detail-text", {
    x: -50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
        trigger: ".craft-details",
        start: "top 80%",
    }
});

gsap.from(".detail-image", {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    scrollTrigger: {
        trigger: ".craft-details",
        start: "top 70%",
    }
});

gsap.from(".manifesto-container", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".manifesto-section",
        start: "top 80%", 
    }
});

gsap.from(".handcrafted-image", {
    x: -100,
    opacity: 0,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".handcrafted-section",
        start: "top 80%",
    }
});

gsap.from(".handcrafted-content", {
    x: 100,
    opacity: 0,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".handcrafted-section",
        start: "top 80%",
    }
});

gsap.from(".value-item", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2, 
    scrollTrigger: {
        trigger: ".values-grid",
        start: "top 85%",
    }
});

gsap.from(".showroom-content", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    scrollTrigger: {
        trigger: ".showroom-section",
        start: "top 75%",
    }
});

gsap.from(".showroom-image", {
    scale: 0.95,
    opacity: 0,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".showroom-section",
        start: "top 70%",
    }
});