// Registra o plugin para evitar erros
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');

    // 1. Navbar: Troca de cor estável
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Animação Hero (Entrada)
    const tl = gsap.timeline();
    
    tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2
    })
    .from(".subtitle, .hero-description", {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    }, "-=1");

    // 3. Animação de Scroll (Parágrafo inferior)
    gsap.from(".reveal-text", {
        scrollTrigger: {
            trigger: ".description-section",
            start: "top 80%", 
        },
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });

    // Animação de revelação para cada item de ambiente
    gsap.utils.toArray(".js-reveal").forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
            },
            y: 60,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    });
});