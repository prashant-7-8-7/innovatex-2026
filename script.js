document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Navbar Shrink & Scroll Progress & Timeline Progress
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const timeline = document.getElementById('timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Navbar shrink
        if (navbar) {
            if (scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }

        // Global scroll progress
        if (scrollProgress && docHeight > 0) {
            const progress = (scrollY / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Timeline glowing line progress
        if (timeline && timelineProgress) {
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // start line fill when timeline enters viewport
            const startScroll = rect.top - windowHeight + 100; // offset
            const totalScroll = rect.height;
            
            if (startScroll < 0) {
                let progress = Math.min(100, Math.max(0, (-startScroll / totalScroll) * 100));
                timelineProgress.style.height = `${progress}%`;
                
                // Light up dots
                timelineItems.forEach(item => {
                    if (item.getBoundingClientRect().top < windowHeight * 0.75) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            } else {
                timelineProgress.style.height = '0%';
                timelineItems.forEach(item => item.classList.remove('active'));
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init

    // 3. Smooth Scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 4. Countdown Timer
    const cdContainer = document.getElementById('countdown-container');
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');
    const cdLive = document.getElementById('cd-live');
    const countdownDiv = document.getElementById('countdown');

    if (cdDays) {
        // 14 October 2026, 10:00 AM IST (+05:30)
        const targetDate = new Date("2026-10-14T10:00:00+05:30").getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                if(countdownDiv) countdownDiv.style.display = 'none';
                if(cdLive) cdLive.style.display = 'block';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            cdDays.innerText = days.toString().padStart(2, '0');
            cdHours.innerText = hours.toString().padStart(2, '0');
            cdMins.innerText = minutes.toString().padStart(2, '0');
            cdSecs.innerText = seconds.toString().padStart(2, '0');
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 5. Scroll Reveal
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.reveal, .reveal-load');
    
    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('revealed'));
    } else {
        // Reveal hero instantly on load
        document.querySelectorAll('.reveal-load').forEach(el => {
            setTimeout(() => el.classList.add('revealed'), 50);
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // 6. Animated Counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;
    if (statNumbers.length > 0) {
        if (prefersReducedMotion) {
            statNumbers.forEach(stat => {
                stat.innerText = stat.getAttribute('data-target') + (stat.getAttribute('data-suffix') || '');
            });
        } else {
            const animateCounter = (el) => {
                const target = parseInt(el.getAttribute('data-target') || 0, 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000;
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    el.innerText = Math.floor(progress * target) + suffix;
                    if (progress < 1) window.requestAnimationFrame(step);
                    else el.innerText = target + suffix;
                };
                window.requestAnimationFrame(step);
            };

            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    statNumbers.forEach(stat => animateCounter(stat));
                }
            }, { threshold: 0.5 });
            statsObserver.observe(document.querySelector('.stats'));
        }
    }

    // 7. 3D Tilt on Speaker Cards
    if (!prefersReducedMotion && window.matchMedia("(min-width: 1025px)").matches) {
        const speakerCards = document.querySelectorAll('.speaker-card');
        speakerCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // 8. Back to Top
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
