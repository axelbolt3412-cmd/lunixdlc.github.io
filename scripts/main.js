document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParticles();
    initScrollEvents();
    initShowcaseSlider();
    initFaqAccordion();
    initDownloadButtons();
    initMobileMenu();
});

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 80);
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.width = '15px';
        cursor.style.height = '15px';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorFollower.style.width = '30px';
        cursorFollower.style.height = '30px';
    });
    
    const links = document.querySelectorAll('a, button, .feature-card, .faq-question, .download-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '0px';
            cursor.style.height = '0px';
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
            cursorFollower.style.borderColor = 'var(--accent-color)';
            cursorFollower.style.backgroundColor = 'rgba(0, 204, 255, 0.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.borderColor = 'var(--accent-color)';
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });
}

function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;
    
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    const hue = Math.random() * 40 + 200;
    particle.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.8)`;
    particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 100%, 70%, 0.8)`;
    
    container.appendChild(particle);
    
    const keyframes = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 180}deg);
        }
        50% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg);
        }
        75% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 180}deg);
        }
    }`;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
}

function initScrollEvents() {
    const header = document.querySelector('header');
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    if (featureCards.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
        
        document.addEventListener('scroll', () => {
            featureCards.forEach(card => {
                if (isElementInViewport(card) && !card.classList.contains('visible')) {
                    card.classList.add('visible');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });
    }
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

function initShowcaseSlider() {
    const showcaseWrapper = document.querySelector('.showcase-wrapper');
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const prevBtn = document.querySelector('.showcase-nav-btn.prev');
    const nextBtn = document.querySelector('.showcase-nav-btn.next');
    const dotsContainer = document.querySelector('.showcase-dots');
    
    if (!showcaseWrapper || !showcaseItems.length) return;
    
    let currentIndex = 0;
    
    showcaseItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('showcase-dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.showcase-dot');
    
    function goToSlide(index) {
        currentIndex = index;
        showcaseWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? showcaseItems.length - 1 : currentIndex - 1;
            goToSlide(currentIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === showcaseItems.length - 1) ? 0 : currentIndex + 1;
            goToSlide(currentIndex);
        });
    }
    
    setInterval(() => {
        currentIndex = (currentIndex === showcaseItems.length - 1) ? 0 : currentIndex + 1;
        goToSlide(currentIndex);
    }, 5000);
    
    showcaseWrapper.addEventListener('touchstart', handleTouchStart, false);
    showcaseWrapper.addEventListener('touchmove', handleTouchMove, false);
    
    let xDown = null;
    
    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
    }
    
    function handleTouchMove(evt) {
        if (!xDown) return;
        
        const xUp = evt.touches[0].clientX;
        const xDiff = xDown - xUp;
        
        if (xDiff > 50) {
            currentIndex = (currentIndex === showcaseItems.length - 1) ? 0 : currentIndex + 1;
            goToSlide(currentIndex);
        } else if (xDiff < -50) {
            currentIndex = (currentIndex === 0) ? showcaseItems.length - 1 : currentIndex - 1;
            goToSlide(currentIndex);
        }
        
        xDown = null;
    }
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
    
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
}

function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-button');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const version = button.getAttribute('data-version');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Файл загружается';
                
                setTimeout(() => {
                    button.innerHTML = version === 'free' ? 
                        '<i class="fas fa-download"></i> Скачать бесплатно' : 
                        version === 'premium' ? 
                        '<i class="fas fa-download"></i> Скачать Premium' : 
                        '<i class="fas fa-download"></i> Скачать VIP';
                }, 2000);
            }, 2000);
        });
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const socialLinks = document.querySelector('.social-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!mobileNav) {
            const mobileNavElement = document.createElement('div');
            mobileNavElement.classList.add('mobile-nav');
            
            const navLinksClone = navLinks.cloneNode(true);
            mobileNavElement.appendChild(navLinksClone);
            
            if (socialLinks) {
                const socialLinksClone = socialLinks.cloneNode(true);
                mobileNavElement.appendChild(socialLinksClone);
            }
            
            const closeButton = document.createElement('button');
            closeButton.classList.add('mobile-nav-close');
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            mobileNavElement.appendChild(closeButton);
            
            document.body.appendChild(mobileNavElement);
            
            setTimeout(() => {
                mobileNavElement.classList.add('active');
            }, 10);
            
            closeButton.addEventListener('click', () => {
                mobileNavElement.classList.remove('active');
                
                setTimeout(() => {
                    document.body.removeChild(mobileNavElement);
                }, 300);
            });
            
            const mobileNavLinks = mobileNavElement.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileNavElement.classList.remove('active');
                    
                    setTimeout(() => {
                        document.body.removeChild(mobileNavElement);
                    }, 300);
                });
            });
        } else {
            mobileNav.classList.toggle('active');
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (heroGraphic) {
        heroGraphic.style.opacity = '0';
        heroGraphic.style.transform = 'scale(0.8)';
        heroGraphic.style.transition = 'opacity 1s ease 0.5s, transform 1s ease 0.5s';
        
        setTimeout(() => {
            heroGraphic.style.opacity = '1';
            heroGraphic.style.transform = 'scale(1)';
        }, 500);
    }
});

const style = document.createElement('style');
style.textContent = `
    .mobile-nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        height: 100vh;
        background: var(--secondary-color);
        z-index: 2000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 50px 30px;
        transition: right 0.3s ease;
        box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }
    
    .mobile-nav.active {
        right: 0;
    }
    
    .mobile-nav .nav-links {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        margin-bottom: 40px;
    }
    
    .mobile-nav .nav-link {
        font-size: 20px;
    }
    
    .mobile-nav .social-links {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }
    
    .mobile-nav-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: transparent;
        border: none;
        color: var(--text-color);
        font-size: 24px;
        cursor: pointer;
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    }
    
    .feature-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(30px, -30px); }
    }
    
    .showcae-wrapper {
        transition: transform 0.5s ease;
    }
`;

document.head.appendChild(style); 