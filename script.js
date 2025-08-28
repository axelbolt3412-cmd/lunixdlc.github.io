// Ждем загрузку DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initSmoothScrolling();
    initHeaderScroll();
    initGallery();
    initParallaxEffects();
    initGlitchEffect();
});

// Вспомогательная функция для анимации прозрачности
function fadeElement(element, targetOpacity, duration) {
    if (!element) return;
    
    const startOpacity = parseFloat(window.getComputedStyle(element).opacity);
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        element.style.opacity = startOpacity + (targetOpacity - startOpacity) * progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Плавная прокрутка
function initSmoothScrolling() {
    const links = document.querySelectorAll('.nav-link, .cta-button, .download-button');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Получаем id секции из атрибута href
            const targetId = this.getAttribute('href');
            
            // Проверяем, является ли ссылка якорем на текущей странице
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                // Находим элемент, к которому нужно прокрутить
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Плавная прокрутка
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Отступ для фиксированного хедера
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Эффект прокрутки для хедера
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Добавляем класс для изменения стиля при прокрутке
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Скрываем/показываем header при скролле
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Управление галереей
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.gallery-arrow.prev');
    const nextBtn = document.querySelector('.gallery-arrow.next');
    
    if (galleryItems.length === 0) return;
    
    let currentIndex = 0;
    const itemCount = galleryItems.length;
    let galleryInterval;
    
    // Функция для отображения элемента по индексу
    function showItem(index) {
        // Скрываем все элементы
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.zIndex = '0';
            item.classList.remove('active');
        });
        
        // Убираем активный класс у всех точек
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показываем текущий элемент
        galleryItems[index].style.opacity = '1';
        galleryItems[index].style.zIndex = '1';
        galleryItems[index].classList.add('active');
        
        // Добавляем активный класс к соответствующей точке
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        // Обновляем текущий индекс
        currentIndex = index;
    }
    
    // Обработчики событий для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = itemCount - 1;
            showItem(newIndex);
            resetGalleryInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= itemCount) newIndex = 0;
            showItem(newIndex);
            resetGalleryInterval();
        });
    }
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showItem(index);
            resetGalleryInterval();
        });
    });
    
    // Функция для сброса интервала
    function resetGalleryInterval() {
        clearInterval(galleryInterval);
        startGalleryInterval();
    }
    
    // Функция для запуска интервала
    function startGalleryInterval() {
        galleryInterval = setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= itemCount) newIndex = 0;
            showItem(newIndex);
        }, 5000);
    }
    
    // Автоматическая смена слайдов
    startGalleryInterval();
    
    // Останавливаем автоматическую смену при наведении
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(galleryInterval);
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
            startGalleryInterval();
        });
    }
    
    // Инициализация первого элемента
    showItem(0);
}

// Параллакс эффекты
function initParallaxEffects() {
    // Элементы с эффектом параллакса
    const parallaxElements = [
        { element: '.floating-cube', speed: 0.05 },
        { element: '.hero-content', speed: 0.03 },
        { element: '.feature-card', speed: 0.02 },
        { element: '.advantage-item', speed: 0.01 }
    ];
    
    // Обработчик движения мыши
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        parallaxElements.forEach(item => {
            const elements = document.querySelectorAll(item.element);
            
            elements.forEach(el => {
                const moveX = mouseX * item.speed;
                const moveY = mouseY * item.speed;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    });
    
    // Анимация при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .advantage-item, .gallery-item, .download-button, .floating-cube');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Если элемент в области видимости
            if (elementTop < windowHeight * 0.85) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    };
    
    // Инициализация анимации
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запускаем один раз при загрузке
}

// Инициализация эффекта глитча
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    if (glitchElements.length === 0) return;
    
    glitchElements.forEach(el => {
        // Создаем интервал для случайного глитча
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of glitch
                // Случайное смещение для эффекта глитча
                const glitchX = Math.random() * 8 - 4; // от -4 до 4
                const glitchY = Math.random() * 8 - 4; // от -4 до 4
                
                // Сохраняем оригинальную трансформацию
                const originalTransform = el.style.transform;
                
                // Применяем CSS-трансформацию
                el.style.transform = `${originalTransform} translate(${glitchX}px, ${glitchY}px)`;
                
                // Возвращаем в исходное положение через короткое время
                setTimeout(() => {
                    el.style.transform = originalTransform;
                }, 100);
            }
        }, 3000); // Интервал между глитчами
    });
}

// Анимация печатающегося текста
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Запускаем анимацию когда элемент появляется в viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(el);
    });
}

// Обработка форм
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь можно добавить логику отправки формы
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
            }
            
            // Имитация отправки
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = 'Отправлено!';
                    submitBtn.style.backgroundColor = '#4CAF50';
                }
                this.reset();
                
                // Возвращаем исходное состояние через 2 секунды
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.textContent = 'Отправить';
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                    }
                }, 2000);
            }, 1500);
        });
    });
}

// Анимация чисел (счетчики)
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60 fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        const countTo = parseInt(counter.innerText, 10);
        
        const counterInterval = setInterval(() => {
            frame++;
            
            const progress = frame / totalFrames;
            const currentCount = Math.round(countTo + (target - countTo) * progress);
            
            counter.innerText = currentCount.toLocaleString();
            
            if (frame === totalFrames) {
                clearInterval(counterInterval);
            }
        }, frameDuration);
    });
}

// Мягкая загрузка страницы
window.addEventListener('load', function() {
    // Скрываем прелоадер если есть
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 500);
    }
    
    document.body.classList.add('loaded');
    
    // Инициализируем дополнительные эффекты после загрузки
    initTypingEffect();
    initForms();
    initCounters();
    
    // Анимация появления элементов
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.animate-on-load');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 200);
        });
    }, 300);
});

// Обработка ошибок изображений
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
});

// Респонсив поведение
function initResponsive() {
    // Проверяем мобильное устройство
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Отключаем параллакс на мобильных
        document.removeEventListener('mousemove', initParallaxEffects);
        
        // Упрощаем анимации для мобильных
        const complexAnimations = document.querySelectorAll('.floating-cube, .complex-animation');
        complexAnimations.forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        // Переинициализация при изменении размера
        initResponsive();
    });
}

// Инициализация респонсив поведения
initResponsive();

// Добавляем класс touch для тач-устройств
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.body.classList.add('touch-device');
} else {
    document.body.classList.add('mouse-device');
}
