// Portfolio Mitia Andrimalala - JavaScript Principal

// Attendre que le DOM soit chargé et que GSAP soit disponible
document.addEventListener('DOMContentLoaded', function() {

    // Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        });
    }

    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Call on load

    // Hamburger Menu avec accessibilité
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navLinksContainer.classList.contains('active');
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active')) {
                if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinksContainer.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
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
    document.querySelectorAll('.nav-link, .back-to-top').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }
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

        // Services Section Animations
        // Animate header
        const servicesTitle = document.querySelector('.services-header h2');
        if (servicesTitle) {
            gsap.set(servicesTitle, { opacity: 1 }); // Force visible
            gsap.from(servicesTitle, {
                scrollTrigger: {
                    trigger: '.services',
                    start: 'top 80%'
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        gsap.from('.services-subtitle', {
            scrollTrigger: {
                trigger: '.services',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Animate service cards with stagger
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                y: 80,
                opacity: 0,
                scale: 0.95,
                duration: 1,
                delay: i * 0.15,
                ease: 'back.out(1.3)'
            });
        });

        // Tools Section Animations
        // Animate header
        const toolsTitle = document.querySelector('.tools-header h2');
        if (toolsTitle) {
            gsap.set(toolsTitle, { opacity: 1 }); // Force visible
            gsap.from(toolsTitle, {
                scrollTrigger: {
                    trigger: '.tools',
                    start: 'top 80%'
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        gsap.from('.tools-subtitle', {
            scrollTrigger: {
                trigger: '.tools',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Animate tool cards with stagger
        gsap.utils.toArray('.tool-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                y: 80,
                opacity: 0,
                scale: 0.9,
                duration: 1,
                delay: i * 0.1,
                ease: 'back.out(1.3)'
            });

            // Animate the stat bar on scroll
            const statFill = card.querySelector('.stat-fill');
            if (statFill) {
                gsap.to(statFill, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%'
                    },
                    width: statFill.style.getPropertyValue('--stat-width'),
                    duration: 1.5,
                    delay: 0.5,
                    ease: 'power3.out'
                });
            }
        });

        // Skills Section Animations
        // Animate header
        const skillsTitle = document.querySelector('.skills-header h2');
        if (skillsTitle) {
            gsap.set(skillsTitle, { opacity: 1 }); // Force visible
            gsap.from(skillsTitle, {
                scrollTrigger: {
                    trigger: '.skills',
                    start: 'top 80%'
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        gsap.from('.skills-subtitle', {
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Animate skill cards with stagger
        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                y: 80,
                opacity: 0,
                scale: 0.9,
                duration: 1,
                delay: i * 0.1,
                ease: 'back.out(1.3)'
            });

            // Animate the progress bar on scroll
            const progressFill = card.querySelector('.skill-progress-fill');
            if (progressFill) {
                const progress = progressFill.getAttribute('data-progress');
                gsap.to(progressFill, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%'
                    },
                    width: progress + '%',
                    duration: 1.5,
                    delay: 0.5,
                    ease: 'power3.out'
                });
            }
        });

        // Timeline Section Animations
        // Animate header
        const timelineTitle = document.querySelector('.timeline-header h2');
        if (timelineTitle) {
            gsap.set(timelineTitle, { opacity: 1 }); // Force visible
            gsap.from(timelineTitle, {
                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top 80%'
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        gsap.from('.timeline-subtitle', {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Animate the timeline line
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
            gsap.from(timelineLine, {
                scrollTrigger: {
                    trigger: '.timeline-wrapper',
                    start: 'top 80%'
                },
                scaleY: 0,
                transformOrigin: 'top',
                duration: 1.5,
                ease: 'power3.out'
            });
        }

        // Animate timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            // Animate the dot
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                gsap.from(dot, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%'
                    },
                    scale: 0,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'back.out(2)'
                });

                // Pulse effect on the dot when visible
                gsap.to(dot, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%'
                    },
                    boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.7)',
                    repeat: 1,
                    yoyo: true,
                    duration: 1,
                    delay: 0.6,
                    ease: 'power2.out'
                });
            }

            // Animate the content card
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                opacity: 1,
                x: 0,
                duration: 1,
                delay: i * 0.2,
                ease: 'power3.out'
            });

            // Animate badges and elements inside
            const badge = item.querySelector('.timeline-badge');
            if (badge) {
                gsap.from(badge, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%'
                    },
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.3 + i * 0.2,
                    ease: 'back.out(2)'
                });
            }

            // Animate skill tags
            const skills = item.querySelectorAll('.timeline-skill');
            skills.forEach((skill, j) => {
                gsap.from(skill, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%'
                    },
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    delay: 0.5 + i * 0.2 + j * 0.05,
                    ease: 'back.out(1.7)'
                });
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

        // Contact Section Animations
        // Animate header
        const contactTitle = document.querySelector('.contact-header h2');
        if (contactTitle) {
            gsap.set(contactTitle, { opacity: 1 }); // Force visible
            gsap.from(contactTitle, {
                scrollTrigger: {
                    trigger: '.contact',
                    start: 'top 80%'
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });
        }

        gsap.from('.contact-subtitle', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Animate contact cards with stagger
        gsap.utils.toArray('.contact-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                y: 80,
                opacity: 0,
                scale: 0.9,
                duration: 1,
                delay: i * 0.15,
                ease: 'back.out(1.3)'
            });
        });

        // Animate form wrapper
        gsap.from('.contact-form-wrapper', {
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: 'top 85%'
            },
            y: 100,
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Animate form elements
        gsap.from('.form-row', {
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out'
        });

        gsap.from('.form-group textarea', {
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: 'power2.out'
        });

        gsap.from('.submit-btn', {
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: 0.7,
            ease: 'back.out(1.5)'
        });

        // Animate particles
        gsap.utils.toArray('.form-decoration .particle').forEach((particle, i) => {
            gsap.from(particle, {
                scrollTrigger: {
                    trigger: '.contact-form-wrapper',
                    start: 'top 85%'
                },
                scale: 0,
                opacity: 0,
                duration: 0.6,
                delay: 0.8 + (i * 0.1),
                ease: 'back.out(2)'
            });
        });

        // Animate resume download button
        gsap.from('.contact-footer .resume-download', {
            scrollTrigger: {
                trigger: '.contact-footer',
                start: 'top 90%'
            },
            y: 50,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'back.out(1.7)'
        });

        // Pulse animation for submit button on hover
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('mouseenter', () => {
                gsap.to(submitBtn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            submitBtn.addEventListener('mouseleave', () => {
                gsap.to(submitBtn, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }

        // Icon animation for contact cards
        gsap.utils.toArray('.contact-card').forEach(card => {
            const icon = card.querySelector('.contact-card-icon');

            card.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    rotation: 360,
                    scale: 1.15,
                    duration: 0.6,
                    ease: 'back.out(1.5)'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    rotation: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });

        // Footer Animations
        // Animate footer brand
        gsap.from('.footer-brand', {
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 90%'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Animate footer sections
        gsap.utils.toArray('.footer-links, .footer-contact').forEach((section, i) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.2 + (i * 0.1),
                ease: 'power3.out'
            });
        });

        // Animate footer divider
        gsap.from('.footer-divider', {
            scrollTrigger: {
                trigger: '.footer-divider',
                start: 'top 95%'
            },
            scaleX: 0,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Animate footer bottom content
        gsap.from('.footer-copyright', {
            scrollTrigger: {
                trigger: '.footer-bottom',
                start: 'top 95%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Animate social icons
        gsap.utils.toArray('.social-icon').forEach((icon, i) => {
            gsap.from(icon, {
                scrollTrigger: {
                    trigger: '.footer-social',
                    start: 'top 95%'
                },
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: 0.6 + (i * 0.1),
                ease: 'back.out(2)'
            });
        });

        // Animate back to top button
        gsap.from('.back-to-top', {
            scrollTrigger: {
                trigger: '.footer-bottom',
                start: 'top 95%'
            },
            scale: 0,
            opacity: 0,
            rotation: -180,
            duration: 0.6,
            delay: 0.9,
            ease: 'back.out(2)'
        });

        // Social icons hover animation
        gsap.utils.toArray('.social-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.15,
                    rotation: 360,
                    duration: 0.5,
                    ease: 'back.out(1.5)'
                });
            });

            icon.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Back to top button hover
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('mouseenter', () => {
                gsap.to(backToTop, {
                    scale: 1.15,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            backToTop.addEventListener('mouseleave', () => {
                gsap.to(backToTop, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
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