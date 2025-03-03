// Enhanced Animations System
class AnimationSystem {
    constructor() {
        this.init();
        this.setupParticles();
        this.setupScrollAnimations();
        this.setupPageTransitions();
    }

    init() {
        // Add intersection observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    setupParticles() {
        const particleConfig = {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    },
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                },
                interactivity: {
                    detectsOn: "window",
                    events: {
                        onHover: {
                            enable: true,
                            mode: "repulse"
                        },
                        onClick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    }
                }
            }
        };

        // Update particles on theme change
        const observer = new MutationObserver(() => {
            const newColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.color.value = newColor;
                window.pJSDom[0].pJS.particles.line_linked.color = newColor;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });

        // Initialize particles
        particlesJS('particles-js', particleConfig);
    }

    setupScrollAnimations() {
        // Smooth scroll to anchor
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax scroll effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                hero.style.opacity = 1 - (scrolled * 0.003);
            }
        });
    }

    setupPageTransitions() {
        // Add transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);

        // Handle navigation
        document.querySelectorAll('a:not([href^="#"])').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http')) {
                    e.preventDefault();
                    this.transitionToPage(href);
                }
            });
        });
    }

    transitionToPage(href) {
        const overlay = document.querySelector('.page-transition-overlay');
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    }

    // Add ripple effect to buttons
    addRippleEffect(element) {
        element.addEventListener('click', e => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            element.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }
}

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new AnimationSystem();
    
    // Add ripple effect to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        window.animations.addRippleEffect(button);
    });
});
