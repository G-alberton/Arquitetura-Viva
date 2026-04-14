document.addEventListener('DOMContentLoaded', () => {

    const heroBg = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', () => {
        let scrollPosition = window.scrollY;
        
        if (scrollPosition <= window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            header.style.padding = '10px 5%';
            header.style.background = 'rgba(245, 242, 237, 0.9)'; 
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        } else {
            header.style.padding = '20px 5%';
            header.style.background = 'transparent'; 
            header.style.boxShadow = 'none';
        }
    });

    const observerOptions = {
        root: null,
        threshold: 0.2 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.js-reveal').forEach(section => {
        sectionObserver.observe(section);
    });

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, index * 150); 
                
                observer.unobserve(entry.target);
            }
        });
    }, { ...observerOptions, threshold: 0.1 }); 

    document.querySelectorAll('.js-product-reveal').forEach(card => {
        productObserver.observe(card);
    });

    window.addEventListener('scroll', () => {
        const scrollSection = document.querySelector('.philosophy-section');
        const scrollText = document.querySelector('.scrolling-text');
        
        if (scrollSection && scrollText) {
            const sectionTop = scrollSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight && sectionTop > -scrollSection.offsetHeight) {
                let moveValue = -20 + (sectionTop * 0.15);
                scrollText.style.transform = `translateX(${moveValue}%)`;
            }
        }
    });

    // Seleciona todos os links que devem ter transição suave
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Verifica se o link é para outra página interna
            if (link.href.includes(window.location.origin)) {
                e.preventDefault(); // Interrompe a mudança instantânea
                const target = link.href;

                // Adiciona um efeito de fade no corpo do site
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.5s ease';

                // Muda de página após a animação acabar
                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            }
        });
    });
});