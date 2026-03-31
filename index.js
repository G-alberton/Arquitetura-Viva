document.addEventListener('DOMContentLoaded', () => {

    // 1. Efeito Paralaxe na Imagem de Fundo do Hero
    const heroBg = document.querySelector('.hero-bg');
    
    // Função para o paralaxe baseada na rolagem
    window.addEventListener('scroll', () => {
        let scrollPosition = window.scrollY;
        
        // Se estivermos dentro da section hero, movemos o fundo mais devagar
        if (scrollPosition <= window.innerHeight) {
            // Fator 0.5 cria o efeito de 'subir mais devagar'
            // O valor '-10%' no CSS original é mantido
            heroBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });

    // 2. Efeito de mudar a cor do Header ao rolar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            header.style.padding = '10px 5%';
            header.style.background = 'rgba(245, 242, 237, 0.9)'; // Fundo opaco
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        } else {
            header.style.padding = '20px 5%';
            header.style.background = 'transparent'; // Fundo transparente
            header.style.boxShadow = 'none';
        }
    });

    // 3. Scroll Reveal (Animação de Entrada ao rolar) para Section inteira
    const observerOptions = {
        root: null,
        threshold: 0.2 // Começa quando 20% do elemento está visível
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    // Revelar a section de produtos inteira
    document.querySelectorAll('.js-reveal').forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. Stagger Effect (Animação cascata) para os cards de produtos
    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona um atraso (delay) baseado no índice do card
                // Cria o efeito de "cada um aparece depois do outro"
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, index * 150); // 150ms de atraso entre cada um
                
                observer.unobserve(entry.target);
            }
        });
    }, { ...observerOptions, threshold: 0.1 }); // Começa um pouco antes

    // Revelar os cards individuais
    document.querySelectorAll('.js-product-reveal').forEach(card => {
        productObserver.observe(card);
    });

    // Efeito de movimento lateral do texto de fundo (Marquee Scroll)
    window.addEventListener('scroll', () => {
        const scrollSection = document.querySelector('.philosophy-section');
        const scrollText = document.querySelector('.scrolling-text');
        
        if (scrollSection && scrollText) {
            // Pega a posição da seção em relação ao topo da janela
            const sectionTop = scrollSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // Só movimenta se a seção estiver visível na tela
            if (sectionTop < windowHeight && sectionTop > -scrollSection.offsetHeight) {
                // O cálculo agora usa a posição da seção. 
                // O "-20" é para manter o equilíbrio inicial do CSS.
                // O "0.15" controla a velocidade.
                let moveValue = -20 + (sectionTop * 0.15);
                scrollText.style.transform = `translateX(${moveValue}%)`;
            }
        }
    });
});