// Ждем загрузку DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initCursorFollower();
    initSmoothScrolling();
    initHeaderScroll();
    initGallery();
    initParallaxEffects();
});

// Кастомный курсор
function initCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, button');

    // Плавное следование за курсором
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Показываем курсор только когда мышь на странице
    document.addEventListener('mouseenter', () => {
        fadeElement(cursor, 1, 300);
    });

    document.addEventListener('mouseleave', () => {
        fadeElement(cursor, 0, 300);
    });

    // Эффект при наведении на интерактивные элементы
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1.5)`;
            cursor.style.borderColor = '#7b68ee';
            cursor.style.transition = 'transform 0.3s, border-color 0.3s';
        });

        link.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursor.style.borderColor = '#7b68ee';
            cursor.style.transition = 'transform 0.3s, border-color 0.3s';
        });
    });

    // Используем requestAnimationFrame для плавного движения курсора
    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    function render() {
        // Плавная интерполяция движения
        currentX += (cursorX - currentX) * 0.1;
        currentY += (cursorY - currentY) * 0.1;
        
        if (cursor) {
            cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

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
    const links = document.querySelectorAll('.nav-link, .cta-button');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Получаем id секции из атрибута href
            const targetId = this.getAttribute('href');
            
            // Проверяем, является ли ссылка якорем на текущей странице
            if (targetId.startsWith('#')) {
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
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Добавляем класс для изменения стиля при прокрутке
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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
    
    let currentIndex = 0;
    const itemCount = galleryItems.length;
    
    // Функция для отображения элемента по индексу
    function showItem(index) {
        // Скрываем все элементы
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.zIndex = '0';
        });
        
        // Убираем активный класс у всех точек
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показываем текущий элемент
        galleryItems[index].style.opacity = '1';
        galleryItems[index].style.zIndex = '1';
        
        // Добавляем активный класс к соответствующей точке
        dots[index].classList.add('active');
        
        // Обновляем текущий индекс
        currentIndex = index;
    }
    
    // Обработчики событий для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = itemCount - 1;
            showItem(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= itemCount) newIndex = 0;
            showItem(newIndex);
        });
    }
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showItem(index);
        });
    });
    
    // Автоматическая смена слайдов
    let galleryInterval = setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= itemCount) newIndex = 0;
        showItem(newIndex);
    }, 5000);
    
    // Останавливаем автоматическую смену при наведении
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(galleryInterval);
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
            galleryInterval = setInterval(() => {
                let newIndex = currentIndex + 1;
                if (newIndex >= itemCount) newIndex = 0;
                showItem(newIndex);
            }, 5000);
        });
    }
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
                const rect = el.getBoundingClientRect();
                const elementCenterX = rect.left + rect.width / 2;
                const elementCenterY = rect.top + rect.height / 2;
                
                // Рассчитываем дистанцию от центра элемента до центра экрана
                const distanceX = (elementCenterX - centerX) * 0.01;
                const distanceY = (elementCenterY - centerY) * 0.01;
                
                // Применяем эффект параллакса с учетом расстояния
                const moveX = mouseX * item.speed + distanceX;
                const moveY = mouseY * item.speed + distanceY;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    });
    
    // Анимация при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .advantage-item, .gallery-item, .download-button');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementBottom = el.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Если элемент в области видимости
            if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            } else {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
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
    
    glitchElements.forEach(el => {
        // Создаем интервал для случайного глитча
        setInterval(() => {
            // Случайное смещение для эффекта глитча
            const glitchX = Math.random() * 10 - 5; // от -5 до 5
            const glitchY = Math.random() * 10 - 5; // от -5 до 5
            
            // Применяем CSS-трансформацию
            el.style.transform = `translate(${glitchX}px, ${glitchY}px)`;
            
            // Возвращаем в исходное положение через короткое время
            setTimeout(() => {
                el.style.transform = 'translate(0, 0)';
            }, 100);
        }, 3000); // Интервал между глитчами
    });
}

// Мягкая загрузка страницы
window.addEventListener('load', function() {
    // Скрываем прелоадер
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Инициализируем дополнительные эффекты после загрузки
        initGlitchEffect();
    }, 500);
}); 