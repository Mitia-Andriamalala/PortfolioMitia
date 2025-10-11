// Portfolio Mitia Andrimalala - JavaScript Principal

// Attendre que le DOM soit chargé et que GSAP soit disponible
document.addEventListener('DOMContentLoaded', function() {

    // Hamburger Menu avec accessibilité
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isExpanded = navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Lazy Loading amélioré avec Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Optimisation des performances - Reduce motion pour les users avec préférences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches && typeof gsap !== 'undefined') {
        // Disable heavy animations for users who prefer reduced motion
        gsap.set('*', { duration: 0.1 });
    }

    // Professional Interactive Background System
    function createInteractiveBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '3';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.4';
        hero.appendChild(canvas);

        let particles = [];
        const particleCount = 80;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let time = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.6 + 0.3,
                    originalX: 0,
                    originalY: 0,
                    type: Math.random() > 0.7 ? 'special' : 'normal',
                    hue: Math.random() > 0.5 ? 195 : 280, // cyan or purple
                    connections: []
                });
                particles[i].originalX = particles[i].x;
                particles[i].originalY = particles[i].y;
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Organic movement with sine waves
                particle.x += particle.vx + Math.sin(time + i * 0.1) * 0.3;
                particle.y += particle.vy + Math.cos(time + i * 0.15) * 0.3;

                // Enhanced mouse influence
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    particle.x += dx * force * 0.002;
                    particle.y += dy * force * 0.002;

                    // Glow effect near mouse
                    particle.opacity = Math.min(0.9, particle.opacity + force * 0.3);
                } else {
                    particle.opacity = Math.max(0.3, particle.opacity - 0.01);
                }

                // Boundary check with soft bounce
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -0.8;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -0.8;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                }

                // Draw particle with gradient
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );

                if (particle.type === 'special') {
                    gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`);
                    gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 40%, 0)`);
                } else {
                    gradient.addColorStop(0, `hsla(195, 100%, 50%, ${particle.opacity})`);
                    gradient.addColorStop(1, `hsla(195, 100%, 30%, 0)`);
                }

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw enhanced connections
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = otherParticle.x - particle.x;
                    const dy = otherParticle.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (120 - distance) / 120 * 0.15;
                        const hue = (particle.hue + otherParticle.hue) / 2;

                        ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(drawParticles);
        }

        // Event listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        hero.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Initialize
        resizeCanvas();
        createParticles();
        drawParticles();
    }

    // Interactive background disabled for cleaner design
    // if (!window.matchMedia('(max-width: 768px)').matches && !prefersReducedMotion.matches) {
    //     createInteractiveBackground();
    // }

    // Smooth Scrolling
    document.querySelectorAll('.nav-links a, .back-to-top').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            }
        });
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Initialiser les animations GSAP une fois que la librairie est chargée
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') {
            // Réessayer après un délai si GSAP n'est pas encore chargé
            setTimeout(initGSAPAnimations, 100);
            return;
        }

        // GSAP Animations
        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // Hero Animations
        gsap.from('.hero-content h1 span', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            delay: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });

        gsap.from('.hero-content p', {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 1.2,
            ease: 'power3.out'
        });

        gsap.from('.social-links-hero a', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 1.5,
            ease: 'back.out(1.7)'
        });

        // Typed Text Animation
        const typedText = document.querySelector('.typed-text');
        if (typedText) {
            const words = ['Développeur Fullstack', 'Designer Graphique'];
            let wordIndex = 0;

            function typeWord() {
                gsap.to(typedText, {
                    duration: 1.2,
                    text: words[wordIndex],
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(typedText, {
                            duration: 0.5,
                            text: '',
                            delay: 1.5,
                            ease: 'power2.out',
                            onComplete: () => {
                                wordIndex = (wordIndex + 1) % words.length;
                                typeWord();
                            }
                        });
                    }
                });
            }
            gsap.to(typedText, { opacity: 1, duration: 0, delay: 1.5, onComplete: typeWord });
        }

        // About Section Animations
        gsap.from('.about .profile-img', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            },
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)'
        });

        gsap.from('.about-content', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            },
            x: 100,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Section Title Animations
        document.querySelectorAll('section h2').forEach(h2 => {
            gsap.from(h2, {
                scrollTrigger: {
                    trigger: h2,
                    start: 'top 85%'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Services Animations
        gsap.utils.toArray('.service-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                y: 100,
                opacity: 0,
                duration: 1,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });

        // Tools Animations
        gsap.utils.toArray('.tool-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                scale: 0.7,
                opacity: 0,
                duration: 1,
                delay: i * 0.2,
                ease: 'back.out(1.7)'
            });
        });

        // Skill Bar Animations
        gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
            gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%'
                },
                width: bar.dataset.width,
                duration: 1.8,
                ease: 'power3.out'
            });
        });

        // Timeline Animations
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                x: -100,
                opacity: 0,
                duration: 1.2,
                delay: i * 0.3,
                ease: 'power3.out'
            });
        });

        // Certifications Animations
        gsap.utils.toArray('.certification-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                y: 100,
                opacity: 0,
                duration: 1,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });

        // Case Card Animations
        gsap.utils.toArray('.case-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                y: 150,
                opacity: 0,
                rotation: 5,
                duration: 1.2,
                delay: i * 0.2,
                ease: 'power3.out'
            });

            // Animation du lien projet au hover
            const projectLink = card.querySelector('.project-link');
            if (projectLink) {
                card.addEventListener('mouseenter', () => {
                    gsap.to(projectLink, {
                        y: 0,
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(projectLink, {
                        y: 10,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            }
        });
    }

    // Contact Form et Modal
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.modal-close');

    function showModal() {
        if (modal) {
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 3000);
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }
                    contactForm.reset();
                    showModal();
                } else {
                    throw new Error('Erreur lors de l\'envoi du message');
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
                    formStatus.className = 'form-status error';
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 3500);
                }
            }
        });
    }

    // Animation pour les cartes de projets au clic
    document.querySelectorAll('.case-card').forEach(card => {
        card.addEventListener('click', function() {
            if (typeof gsap !== 'undefined') {
                // Animation de transition avant la redirection
                gsap.to(card, {
                    scale: 1.1,
                    duration: 0.2,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(card, {
                            scale: 0.9,
                            opacity: 0.8,
                            duration: 0.3,
                            ease: 'power2.in'
                        });
                    }
                });
            }
        });
    });

    // Initialiser les animations GSAP
    initGSAPAnimations();
});