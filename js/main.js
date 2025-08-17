document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    initScreenshotCarousel();
    initAnimations();
    initFloatingLights();
    initCounters();
    initFeatureCards();
    initScrollEffects();
});

function initNavigation() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add active class to current page nav link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }
        
        // Add hover sound effect
        link.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('nav ul');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            playSound('click');
        });
    }
}

function initScreenshotCarousel() {
    const screenshots = document.querySelectorAll('.screenshot');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const interval = 5000; // 5 seconds
    
    // Initialize first screenshot
    if (screenshots.length > 0) {
        screenshots[0].classList.add('active');
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
    }
    
    // Click event for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showScreenshot(index);
            playSound('click');
        });
    });
    
    // Automatic slideshow
    setInterval(() => {
        currentIndex = (currentIndex + 1) % screenshots.length;
        showScreenshot(currentIndex);
    }, interval);
    
    // Touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carousel = document.querySelector('.screenshot-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Swipe left
            currentIndex = (currentIndex + 1) % screenshots.length;
        } else if (touchEndX > touchStartX) {
            // Swipe right
            currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
        }
        
        showScreenshot(currentIndex);
    }
    
    function showScreenshot(index) {
        // Hide all screenshots
        screenshots.forEach(screenshot => {
            screenshot.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected screenshot
        screenshots[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
    }
}

function initAnimations() {
    // Animate title with glitch effect
    const title = document.querySelector('.animated-title');
    if (title) {
        title.innerHTML = title.textContent.split('').map(char => 
            `<span class="char">${char}</span>`
        ).join('');
        
        const chars = document.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.style.animationDelay = `${index * 0.05}s`;
        });
        
        setInterval(() => {
            const randomChar = Math.floor(Math.random() * chars.length);
            chars[randomChar].classList.add('glitch');
            
            setTimeout(() => {
                chars[randomChar].classList.remove('glitch');
            }, 200);
        }, 3000);
    }
    
    // Animate buttons with hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        button.addEventListener('click', () => {
            playSound('click');
        });
    });
}

function initFloatingLights() {
    const hero = document.querySelector('.hero');
    const lights = 10; // Number of lights
    
    if (hero) {
        for (let i = 0; i < lights; i++) {
            const light = document.createElement('div');
            light.className = 'floating-light';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            light.style.left = `${posX}%`;
            light.style.top = `${posY}%`;
            
            // Random size
            const size = Math.random() * 60 + 20;
            light.style.width = `${size}px`;
            light.style.height = `${size}px`;
            
            // Random animation duration
            const duration = Math.random() * 10 + 10;
            light.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.random() * 5;
            light.style.animationDelay = `${delay}s`;
            
            // Random opacity
            const opacity = Math.random() * 0.06 + 0.02;
            light.style.opacity = opacity;
            
            hero.appendChild(light);
        }
    }
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = Math.ceil(target / (duration / 20)); // Update every 20ms
                
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current > target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = current;
                    }
                }, 20);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index
                setTimeout(() => {
                    entry.target.classList.add('fadeInUp');
                }, index * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        observer.observe(card);
    });
    
    // Same for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        observer.observe(card);
    });
}

function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const title = hero.querySelector('.animated-title');
            const desc = hero.querySelector('.hero-desc');
            
            if (title) {
                title.style.transform = `translateY(${scrollY * 0.2}px)`;
            }
            
            if (desc) {
                desc.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
        }
        
        // Add visual elements when scrolling
        const height = window.innerHeight;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < height * 0.8 && sectionTop > -height * 0.2) {
                section.classList.add('in-view');
            }
        });
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                playSound('click');
            }
        });
    });
}

// Sound effects (subtle)
function playSound(type) {
    // Only enable if user has interacted with the page
    if (!document.body.classList.contains('user-interacted')) {
        return;
    }
    
    const sounds = {
        hover: {
            volume: 0.1,
            src: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAESAAzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmaZmZmZmZmZmZmZmZmZmZmZzMzMzMzMzMzMzMzMzMzMzMzMz///////////////////8AAAA5TEFNRTMuOTlyAc0AAAAAAAAAABSAJAJAQgAAgAAAA0hmJFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
        },
        click: {
            volume: 0.2,
            src: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGQgCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojr///////////////////////////////////////////8AAAA5TEFNRTMuOTlyAc0AAAAAAAAAABSAJAJAQgAAgAAAA0hmdGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
        }
    };
    
    if (sounds[type]) {
        const audio = new Audio(sounds[type].src);
        audio.volume = sounds[type].volume;
        audio.play().catch(() => {});
    }
}

// Enable sounds after user interaction
document.addEventListener('click', () => {
    document.body.classList.add('user-interacted');
});

// Add preloading for images to improve performance
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
}); 