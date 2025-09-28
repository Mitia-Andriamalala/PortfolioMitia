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