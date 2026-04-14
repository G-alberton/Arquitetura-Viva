/* ============================================
   ITEM.JS — Arquitetura Viva
   Lógica da Página de Coleção + Viewer 3D
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. NAVBAR SCROLL BEHAVIOR
    ========================================== */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================
       2. REVEAL ANIMATIONS (IntersectionObserver)
    ========================================== */
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.js-reveal').forEach(el => sectionObserver.observe(el));

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, index * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.js-product-reveal').forEach(card => productObserver.observe(card));

    /* ==========================================
       3. PAGE TRANSITION (fade-in on load)
    ========================================== */
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Smooth page transitions for internal links
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.4s ease';
                setTimeout(() => { window.location.href = href; }, 400);
            }
        });
    });

    /* ==========================================
       4. FILTER TABS
    ========================================== */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');
    const emptyState = document.getElementById('emptyState');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            let visibleCount = 0;

            productCards.forEach((card, i) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;

                if (show) {
                    card.classList.remove('hidden');
                    card.style.animationDelay = `${visibleCount * 80}ms`;
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    });

    /* ==========================================
       5. SORT SELECT
    ========================================== */
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');

    sortSelect.addEventListener('change', () => {
        const value = sortSelect.value;
        const cards = Array.from(document.querySelectorAll('.product-card:not(.hidden)'));

        cards.sort((a, b) => {
            if (value === 'price-asc') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            if (value === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            if (value === 'name') return a.dataset.name.localeCompare(b.dataset.name);
            return 0;
        });

        cards.forEach(card => productsGrid.appendChild(card));
    });

    /* ==========================================
       6. WISHLIST TOGGLE
    ========================================== */
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    /* ==========================================
       7. COLOR DOTS
    ========================================== */
    document.querySelectorAll('.card-colors').forEach(group => {
        group.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                group.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
        });
    });

    /* ==========================================
       8. CART SYSTEM (Handled by cart.js)
    ========================================== */
    // A lógica de adicionar ao carrinho agora é global no cart.js
    // via event delegation.

    /* ==========================================
       9. 3D VIEWER MODAL
    ========================================== */

    // Product data for the modal
    const productData = {
        sofa: {
            name: 'Sofá Modular Infinity',
            category: 'SOFÁS',
            desc: 'Conforto e versatilidade em tecido linho natural com base em carvalho maciço.',
            img: 'image/sofa-hero.jpg',
            price: 'R$ 18.900',
            dimensions: '240 × 95 × 80 cm',
            material: 'Linho + Carvalho',
            color: 0xc8c8c8,
            shape: 'sofa',
            id: 1,
            productName: 'Sofá Modular Infinity',
            productPrice: 18900
        },
        armchair: {
            name: 'Poltrona Éden',
            category: 'POLTRONAS',
            desc: 'Veludo esmeralda com pés em latão escovado. Elegância atemporal.',
            img: 'image/product-armchair.jpg',
            price: 'R$ 7.490',
            dimensions: '75 × 80 × 90 cm',
            material: 'Veludo + Latão',
            color: 0x3d6b4f,
            shape: 'armchair',
            id: 2,
            productName: 'Poltrona Éden',
            productPrice: 7490
        },
        table: {
            name: 'Mesa Orgânica',
            category: 'MESAS',
            desc: 'Carvalho maciço certificado com acabamento natural. Acompanha 6 cadeiras.',
            img: 'image/product-table.jpg',
            price: 'R$ 12.900',
            dimensions: '220 × 100 × 76 cm',
            material: 'Carvalho Maciço',
            color: 0xc8a97a,
            shape: 'table',
            id: 3,
            productName: 'Mesa Orgânica',
            productPrice: 12900
        },
        lamp: {
            name: 'Luminária Pátina',
            category: 'ILUMINAÇÃO',
            desc: 'Pétalas em vidro soprado com acabamento âmbar. Luz quente e difusa.',
            img: 'image/product-lamp.jpg',
            price: 'R$ 3.290',
            dimensions: 'Ø 40 × 35 cm',
            material: 'Vidro Soprado + Latão',
            color: 0xd4956a,
            shape: 'lamp',
            id: 4,
            productName: 'Luminária Pátina',
            productPrice: 3290
        },
        shelf: {
            name: 'Estante Loft',
            category: 'ESTANTES',
            desc: 'Estrutura em aço carbono com prateleiras em nogueira. Modular e expansível.',
            img: 'image/product-shelf.jpg',
            price: 'R$ 8.900',
            dimensions: '160 × 40 × 200 cm',
            material: 'Aço + Nogueira',
            color: 0x5c3d2e,
            shape: 'shelf',
            id: 5,
            productName: 'Estante Loft',
            productPrice: 8900
        },
        bed: {
            name: 'Cama Velvet',
            category: 'CAMAS',
            desc: 'Cabeceira estofada em veludo com estrutura em madeira maciça.',
            img: 'image/collection-bedroom.jpg',
            price: 'R$ 15.500',
            dimensions: '200 × 200 × 130 cm',
            material: 'Veludo + Madeira',
            color: 0x7a6a8a,
            shape: 'bed',
            id: 6,
            productName: 'Cama Velvet',
            productPrice: 15500
        }
    };

    const modal = document.getElementById('modal3d');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalProductName = document.getElementById('modalProductName');
    const modalCategory = document.getElementById('modalCategory');
    const modalDesc = document.getElementById('modalDesc');
    const modalProductImg = document.getElementById('modalProductImg');
    const modalPrice = document.getElementById('modalPrice');
    const specDimensions = document.getElementById('specDimensions');
    const specMaterial = document.getElementById('specMaterial');
    const btnModalCart = document.getElementById('btnModalCart');
    const viewerLoading = document.getElementById('viewerLoading');
    const viewerHint = document.getElementById('viewerHint');

    let currentProduct = null;
    let threeScene = null;

    // Open modal
    document.querySelectorAll('.btn-view3d').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productKey = btn.dataset.product;
            const data = productData[productKey];
            if (!data) return;

            currentProduct = data;
            openModal(data);
        });
    });

    function openModal(data) {
        // Populate sidebar
        modalProductName.textContent = data.name;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.desc;
        modalProductImg.src = data.img;
        modalProductImg.alt = data.name;
        modalPrice.textContent = data.price;
        specDimensions.textContent = data.dimensions;
        specMaterial.textContent = data.material;

        // Cart button (handled by cart.js global listener)
        btnModalCart.dataset.productName = data.productName;
        btnModalCart.dataset.productPrice = data.productPrice;
        btnModalCart.dataset.productImg = data.img;
        
        btnModalCart.onclick = () => {
            // cart.js will catch the click, we just close the modal
            setTimeout(() => closeModal(), 100);
        };

        // Show modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Show loading
        viewerLoading.classList.remove('hidden');
        viewerHint.classList.remove('hidden');

        // Init Three.js after a short delay (for transition)
        setTimeout(() => initThreeJS(data), 300);

        // Hide hint after 4 seconds
        setTimeout(() => viewerHint.classList.add('hidden'), 4000);
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';

        // Cleanup Three.js
        if (threeScene) {
            threeScene.dispose();
            threeScene = null;
        }
    }

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    /* ==========================================
       10. THREE.JS 3D VIEWER
    ========================================== */

    function initThreeJS(data) {
        const canvas = document.getElementById('canvas3d');
        const container = canvas.parentElement;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d0d0d);

        // Subtle fog for depth
        scene.fog = new THREE.FogExp2(0x0d0d0d, 0.04);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );
        camera.position.set(3, 2.5, 4);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // Lights
        // Ambient
        const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.5);
        scene.add(ambientLight);

        // Key light (warm studio)
        const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
        keyLight.position.set(6, 10, 6);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 40;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.radius = 3;
        scene.add(keyLight);

        // Fill light (cool blue)
        const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.7);
        fillLight.position.set(-6, 4, -4);
        scene.add(fillLight);

        // Rim light (warm back)
        const rimLight = new THREE.DirectionalLight(0xffe0a0, 0.5);
        rimLight.position.set(2, -1, -6);
        scene.add(rimLight);

        // Accent point light (warm amber)
        const pointLight = new THREE.PointLight(0xc5a880, 1.0, 18);
        pointLight.position.set(-3, 4, 2);
        scene.add(pointLight);

        // Top hemisphere light for soft fill
        const hemiLight = new THREE.HemisphereLight(0xfff8f0, 0x1a1a2e, 0.4);
        scene.add(hemiLight);

        // Floor (polished dark)
        const floorGeo = new THREE.PlaneGeometry(30, 30);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x161616,
            roughness: 0.3,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1.5;
        floor.receiveShadow = true;
        scene.add(floor);

        // Subtle grid on floor
        const gridHelper = new THREE.GridHelper(12, 24, 0x2a2a2a, 0x1e1e1e);
        gridHelper.position.y = -1.49;
        scene.add(gridHelper);

        // Reflection plane (subtle)
        const reflGeo = new THREE.PlaneGeometry(30, 30);
        const reflMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.05,
            metalness: 0.3,
            transparent: true,
            opacity: 0.4
        });
        const refl = new THREE.Mesh(reflGeo, reflMat);
        refl.rotation.x = -Math.PI / 2;
        refl.position.y = -1.48;
        scene.add(refl);

        // Build 3D model based on product shape
        const model = buildProductModel(data);
        scene.add(model);

        // Hide loading
        viewerLoading.classList.add('hidden');

        // Orbit controls (manual implementation)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let targetRotation = { x: 0.3, y: 0.5 };
        let currentRotation = { x: 0.3, y: 0.5 };
        let targetZoom = 4;
        let currentZoom = 4;
        let autoRotate = false;
        let autoRotateSpeed = 0.005;

        // Mouse events
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            targetRotation.y += deltaX * 0.008;
            targetRotation.x += deltaY * 0.008;
            targetRotation.x = Math.max(-0.8, Math.min(1.2, targetRotation.x));
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Touch events
        let lastTouchX = 0, lastTouchY = 0;
        canvas.addEventListener('touchstart', (e) => {
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const dx = e.touches[0].clientX - lastTouchX;
            const dy = e.touches[0].clientY - lastTouchY;
            targetRotation.y += dx * 0.01;
            targetRotation.x += dy * 0.01;
            targetRotation.x = Math.max(-0.8, Math.min(1.2, targetRotation.x));
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }, { passive: false });

        // Scroll zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetZoom += e.deltaY * 0.005;
            targetZoom = Math.max(2, Math.min(8, targetZoom));
        }, { passive: false });

        // View control buttons
        const btnFront = document.getElementById('btnFront');
        const btnSide = document.getElementById('btnSide');
        const btnTop = document.getElementById('btnTop');
        const btnPerspective = document.getElementById('btnPerspective');
        const btnAutoRotate = document.getElementById('btnAutoRotate');

        function setViewBtn(active) {
            [btnFront, btnSide, btnTop, btnPerspective].forEach(b => b.classList.remove('active'));
            if (active) active.classList.add('active');
        }

        btnFront.addEventListener('click', () => {
            targetRotation = { x: 0, y: 0 };
            targetZoom = 4;
            setViewBtn(btnFront);
        });

        btnSide.addEventListener('click', () => {
            targetRotation = { x: 0.1, y: Math.PI / 2 };
            targetZoom = 4;
            setViewBtn(btnSide);
        });

        btnTop.addEventListener('click', () => {
            targetRotation = { x: Math.PI / 2 - 0.1, y: 0 };
            targetZoom = 5;
            setViewBtn(btnTop);
        });

        btnPerspective.addEventListener('click', () => {
            targetRotation = { x: 0.3, y: 0.5 };
            targetZoom = 4;
            setViewBtn(btnPerspective);
        });

        btnAutoRotate.addEventListener('click', () => {
            autoRotate = !autoRotate;
            btnAutoRotate.classList.toggle('active', autoRotate);
        });

        // Resize handler
        function handleResize() {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }

        window.addEventListener('resize', handleResize);

        // Animation loop
        let frameId;
        let time = 0;

        function animate() {
            frameId = requestAnimationFrame(animate);
            time += 0.01;

            // Auto rotate
            if (autoRotate) {
                targetRotation.y += autoRotateSpeed;
            }

            // Smooth interpolation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
            currentZoom += (targetZoom - currentZoom) * 0.08;

            // Apply rotation to model pivot
            model.rotation.x = currentRotation.x;
            model.rotation.y = currentRotation.y;

            // Gentle floating animation
            model.position.y = Math.sin(time * 0.5) * 0.05;

            // Camera zoom
            camera.position.set(
                Math.sin(0) * currentZoom,
                currentZoom * 0.6,
                Math.cos(0) * currentZoom
            );
            camera.lookAt(0, 0, 0);

            // Animate point light
            pointLight.position.x = Math.sin(time * 0.3) * 4;
            pointLight.position.z = Math.cos(time * 0.3) * 4;

            renderer.render(scene, camera);
        }

        animate();

        // Dispose function
        threeScene = {
            dispose: () => {
                cancelAnimationFrame(frameId);
                window.removeEventListener('resize', handleResize);
                renderer.dispose();
                scene.clear();
            }
        };
    }

    /* ==========================================
       11. 3D MODEL BUILDER
       Builds parametric 3D models for each product
    ========================================== */

    function buildProductModel(data) {
        const group = new THREE.Group();
        const color = data.color;

        switch (data.shape) {
            case 'sofa': buildSofa(group, color); break;
            case 'armchair': buildArmchair(group, color); break;
            case 'table': buildTable(group, color); break;
            case 'lamp': buildLamp(group, color); break;
            case 'shelf': buildShelf(group, color); break;
            case 'bed': buildBed(group, color); break;
            default: buildGenericBox(group, color);
        }

        return group;
    }

    function createMaterial(color, roughness = 0.7, metalness = 0.0, envMapIntensity = 0.5) {
        return new THREE.MeshStandardMaterial({ color, roughness, metalness, envMapIntensity });
    }

    function buildSofa(group, color) {
        const fabricMat = new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0.0, envMapIntensity: 0.2 });
        const woodMat = new THREE.MeshStandardMaterial({ color: 0xc8a97a, roughness: 0.55, metalness: 0.05, envMapIntensity: 0.4 });

        // Base / seat
        const seatGeo = new THREE.BoxGeometry(2.4, 0.3, 1.0);
        const seat = new THREE.Mesh(seatGeo, fabricMat);
        seat.position.y = 0.15;
        seat.castShadow = true;
        group.add(seat);

        // Back cushion
        const backGeo = new THREE.BoxGeometry(2.4, 0.7, 0.25);
        const back = new THREE.Mesh(backGeo, fabricMat);
        back.position.set(0, 0.65, -0.38);
        back.castShadow = true;
        group.add(back);

        // Seat cushions (2)
        for (let i = -1; i <= 1; i += 2) {
            const cushionGeo = new THREE.BoxGeometry(1.1, 0.22, 0.85);
            const cushion = new THREE.Mesh(cushionGeo, createMaterial(color, 0.95));
            cushion.position.set(i * 0.58, 0.41, -0.05);
            cushion.castShadow = true;
            group.add(cushion);
        }

        // Armrests
        for (let i = -1; i <= 1; i += 2) {
            const armGeo = new THREE.BoxGeometry(0.2, 0.55, 1.0);
            const arm = new THREE.Mesh(armGeo, fabricMat);
            arm.position.set(i * 1.1, 0.42, -0.05);
            arm.castShadow = true;
            group.add(arm);
        }

        // Legs (4)
        const legPositions = [[-1.05, -0.35], [1.05, -0.35], [-1.05, 0.35], [1.05, 0.35]];
        legPositions.forEach(([x, z]) => {
            const legGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.25, 8);
            const leg = new THREE.Mesh(legGeo, woodMat);
            leg.position.set(x, -0.125, z);
            leg.castShadow = true;
            group.add(leg);
        });

        group.position.y = -0.5;
    }

    function buildArmchair(group, color) {
        const fabricMat = new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0.0, envMapIntensity: 0.2 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9, envMapIntensity: 1.0 }); // gold legs

        // Seat
        const seatGeo = new THREE.BoxGeometry(0.75, 0.25, 0.75);
        const seat = new THREE.Mesh(seatGeo, fabricMat);
        seat.position.y = 0.12;
        seat.castShadow = true;
        group.add(seat);

        // Back
        const backGeo = new THREE.BoxGeometry(0.75, 0.7, 0.2);
        const back = new THREE.Mesh(backGeo, fabricMat);
        back.position.set(0, 0.6, -0.28);
        back.castShadow = true;
        group.add(back);

        // Seat cushion
        const cushionGeo = new THREE.BoxGeometry(0.68, 0.15, 0.65);
        const cushion = new THREE.Mesh(cushionGeo, createMaterial(color, 0.95));
        cushion.position.y = 0.32;
        cushion.castShadow = true;
        group.add(cushion);

        // Armrests
        for (let i = -1; i <= 1; i += 2) {
            const armGeo = new THREE.BoxGeometry(0.15, 0.45, 0.7);
            const arm = new THREE.Mesh(armGeo, fabricMat);
            arm.position.set(i * 0.3, 0.45, -0.03);
            arm.castShadow = true;
            group.add(arm);
        }

        // Legs (4 angled)
        const legPositions = [[-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]];
        legPositions.forEach(([x, z]) => {
            const legGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.35, 8);
            const leg = new THREE.Mesh(legGeo, metalMat);
            leg.position.set(x, -0.175, z);
            // Slight angle outward
            leg.rotation.z = x > 0 ? 0.1 : -0.1;
            leg.rotation.x = z > 0 ? 0.1 : -0.1;
            leg.castShadow = true;
            group.add(leg);
        });

        group.position.y = -0.5;
    }

    function buildTable(group, color) {
        const woodMat = createMaterial(color, 0.6, 0.05);
        const darkWoodMat = createMaterial(0xa0784a, 0.7, 0.05);

        // Tabletop
        const topGeo = new THREE.BoxGeometry(2.2, 0.1, 1.0);
        const top = new THREE.Mesh(topGeo, woodMat);
        top.position.y = 0.4;
        top.castShadow = true;
        top.receiveShadow = true;
        group.add(top);

        // Center support (T-shape base)
        const supportGeo = new THREE.BoxGeometry(0.15, 0.7, 0.6);
        const support = new THREE.Mesh(supportGeo, darkWoodMat);
        support.position.y = 0.0;
        support.castShadow = true;
        group.add(support);

        // Base foot
        const footGeo = new THREE.BoxGeometry(0.8, 0.08, 0.6);
        const foot = new THREE.Mesh(footGeo, darkWoodMat);
        foot.position.y = -0.35;
        foot.castShadow = true;
        group.add(foot);

        // Chairs (simplified, 2 visible)
        const chairColor = 0xd4b896;
        for (let i = -1; i <= 1; i += 2) {
            const chairGroup = new THREE.Group();

            // Chair seat
            const cSeatGeo = new THREE.BoxGeometry(0.5, 0.08, 0.5);
            const cSeat = new THREE.Mesh(cSeatGeo, createMaterial(chairColor, 0.8));
            cSeat.position.y = 0;
            chairGroup.add(cSeat);

            // Chair back
            const cBackGeo = new THREE.BoxGeometry(0.5, 0.4, 0.06);
            const cBack = new THREE.Mesh(cBackGeo, createMaterial(chairColor, 0.8));
            cBack.position.set(0, 0.24, -0.22);
            chairGroup.add(cBack);

            // Chair legs
            [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([cx, cz]) => {
                const cLegGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6);
                const cLeg = new THREE.Mesh(cLegGeo, createMaterial(chairColor, 0.7));
                cLeg.position.set(cx, -0.175, cz);
                chairGroup.add(cLeg);
            });

            chairGroup.position.set(i * 0.85, 0.05, 0);
            chairGroup.rotation.y = i > 0 ? Math.PI : 0;
            group.add(chairGroup);
        }

        group.position.y = -0.4;
    }

    function buildLamp(group, color) {
        const glassMat = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.1,
            metalness: 0.0,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });
        const metalMat = createMaterial(0xd4af37, 0.2, 0.9);
        const cordMat = createMaterial(0x1a1a1a, 0.9, 0.0);

        // Cord
        const cordGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 6);
        const cord = new THREE.Mesh(cordGeo, cordMat);
        cord.position.y = 0.75;
        group.add(cord);

        // Top fitting
        const fittingGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12);
        const fitting = new THREE.Mesh(fittingGeo, metalMat);
        fitting.position.y = 0.05;
        group.add(fitting);

        // Petals (5 petal shapes)
        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalGeo = new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI, 0, Math.PI * 0.6);
            const petal = new THREE.Mesh(petalGeo, glassMat);
            petal.position.set(Math.sin(angle) * 0.22, -0.3, Math.cos(angle) * 0.22);
            petal.rotation.y = angle;
            petal.rotation.x = 0.3;
            petal.castShadow = true;
            group.add(petal);
        }

        // Bulb
        const bulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0xffeeaa,
            emissive: 0xffcc44,
            emissiveIntensity: 1.5,
            roughness: 0.1
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.y = -0.22;
        group.add(bulb);

        // Point light from bulb
        const bulbLight = new THREE.PointLight(0xffcc44, 1.5, 3);
        bulbLight.position.y = -0.22;
        group.add(bulbLight);

        group.position.y = 0.2;
    }

    function buildShelf(group, color) {
        const woodMat = createMaterial(color, 0.7, 0.05);
        const metalMat = createMaterial(0x2c2c2c, 0.4, 0.7);

        const shelfWidth = 1.6;
        const shelfHeight = 2.0;
        const shelfDepth = 0.4;
        const shelfCount = 5;

        // Vertical frames (2)
        for (let i = -1; i <= 1; i += 2) {
            const frameGeo = new THREE.BoxGeometry(0.05, shelfHeight, shelfDepth);
            const frame = new THREE.Mesh(frameGeo, metalMat);
            frame.position.set(i * (shelfWidth / 2), 0, 0);
            frame.castShadow = true;
            group.add(frame);
        }

        // Back panels (alternating)
        for (let i = 0; i < shelfCount - 1; i++) {
            if (i % 2 === 0) {
                const panelGeo = new THREE.BoxGeometry(shelfWidth - 0.05, shelfHeight / shelfCount - 0.05, 0.02);
                const panel = new THREE.Mesh(panelGeo, woodMat);
                panel.position.set(0, -shelfHeight / 2 + (i + 0.5) * (shelfHeight / shelfCount), -shelfDepth / 2 + 0.01);
                group.add(panel);
            }
        }

        // Shelves
        for (let i = 0; i <= shelfCount; i++) {
            const y = -shelfHeight / 2 + i * (shelfHeight / shelfCount);
            const shelfGeo = new THREE.BoxGeometry(shelfWidth, 0.04, shelfDepth);
            const shelf = new THREE.Mesh(shelfGeo, woodMat);
            shelf.position.y = y;
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            group.add(shelf);
        }

        // Small decorative books on some shelves
        const bookColors = [0x8b4513, 0x2c5f8a, 0x4a7c4e, 0x8a6a2c];
        for (let s = 1; s < shelfCount; s++) {
            const y = -shelfHeight / 2 + s * (shelfHeight / shelfCount) + 0.1;
            const bookCount = Math.floor(Math.random() * 3) + 2;
            let xOffset = -0.5;
            for (let b = 0; b < bookCount; b++) {
                const bW = 0.06 + Math.random() * 0.04;
                const bH = 0.15 + Math.random() * 0.08;
                const bookGeo = new THREE.BoxGeometry(bW, bH, 0.3);
                const bookMat = createMaterial(bookColors[b % bookColors.length], 0.8);
                const book = new THREE.Mesh(bookGeo, bookMat);
                book.position.set(xOffset, y + bH / 2, 0);
                group.add(book);
                xOffset += bW + 0.01;
            }
        }

        group.position.y = -0.5;
    }

    function buildBed(group, color) {
        const fabricMat = createMaterial(color, 0.9, 0.0);
        const woodMat = createMaterial(0x8b6f5e, 0.7, 0.05);
        const whiteMat = createMaterial(0xf5f0eb, 0.95, 0.0);

        // Bed frame base
        const frameGeo = new THREE.BoxGeometry(2.0, 0.2, 2.2);
        const frame = new THREE.Mesh(frameGeo, woodMat);
        frame.position.y = -0.1;
        frame.castShadow = true;
        group.add(frame);

        // Mattress
        const mattressGeo = new THREE.BoxGeometry(1.9, 0.25, 2.0);
        const mattress = new THREE.Mesh(mattressGeo, whiteMat);
        mattress.position.y = 0.225;
        mattress.castShadow = true;
        group.add(mattress);

        // Headboard
        const headGeo = new THREE.BoxGeometry(2.0, 1.0, 0.15);
        const head = new THREE.Mesh(headGeo, fabricMat);
        head.position.set(0, 0.5, -1.0);
        head.castShadow = true;
        group.add(head);

        // Headboard detail (tufted buttons)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const btnGeo = new THREE.SphereGeometry(0.04, 8, 8);
                const btn = new THREE.Mesh(btnGeo, createMaterial(color, 0.8));
                btn.position.set(-0.8 + col * 0.4, 0.1 + row * 0.3, -0.92);
                group.add(btn);
            }
        }

        // Pillow (2)
        for (let i = -1; i <= 1; i += 2) {
            const pillowGeo = new THREE.BoxGeometry(0.7, 0.18, 0.5);
            const pillow = new THREE.Mesh(pillowGeo, whiteMat);
            pillow.position.set(i * 0.4, 0.44, -0.65);
            pillow.castShadow = true;
            group.add(pillow);
        }

        // Blanket
        const blanketGeo = new THREE.BoxGeometry(1.85, 0.12, 1.2);
        const blanket = new THREE.Mesh(blanketGeo, createMaterial(0xd4c4b0, 0.9));
        blanket.position.set(0, 0.41, 0.4);
        blanket.castShadow = true;
        group.add(blanket);

        // Legs
        [[-0.9, -1.0], [0.9, -1.0], [-0.9, 1.0], [0.9, 1.0]].forEach(([x, z]) => {
            const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8);
            const leg = new THREE.Mesh(legGeo, woodMat);
            leg.position.set(x, -0.325, z);
            group.add(leg);
        });

        group.position.y = -0.5;
    }

    function buildGenericBox(group, color) {
        const mat = createMaterial(color, 0.7, 0.1);
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        group.add(mesh);
    }

}); // end DOMContentLoaded
