document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = document.querySelector('.auth-page');
    
    if (isLoginPage) {
        initAuthForms();
    } else {
        checkAuthStatus();
    }
});

function checkAuthStatus() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    
    if (!userId || !token) {
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    fetch(`api/validateToken.php?userId=${userId}&token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (!data.valid) {
                localStorage.removeItem('userId');
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                
                if (window.location.pathname.includes('dashboard.html')) {
                    window.location.href = 'login.html';
                }
            }
        })
        .catch(error => {
            console.error('Auth validation error:', error);
        });
}

function initAuthForms() {
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const btnSlider = document.getElementById('btn-slider');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginToggle && registerToggle) {
        loginToggle.addEventListener('click', () => {
            loginToggle.classList.add('active');
            registerToggle.classList.remove('active');
            btnSlider.style.left = '5px';
            
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
        
        registerToggle.addEventListener('click', () => {
            registerToggle.classList.add('active');
            loginToggle.classList.remove('active');
            btnSlider.style.left = '50%';
            
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    if (!username || !password) {
        showError(errorElement, 'Пожалуйста, заполните все поля');
        return;
    }
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    fetch('api/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            
            window.location.href = 'dashboard.html';
        } else {
            showError(errorElement, data.message || 'Неверное имя пользователя или пароль');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showError(errorElement, 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.');
    });
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorElement = document.getElementById('register-error');
    
    if (!username || !email || !password || !confirmPassword) {
        showError(errorElement, 'Пожалуйста, заполните все поля');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(errorElement, 'Пароли не совпадают');
        return;
    }
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    
    fetch('api/register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            
            window.location.href = 'dashboard.html';
        } else {
            showError(errorElement, data.message || 'Ошибка при регистрации');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        showError(errorElement, 'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
    });
}

function showError(element, message) {
    element.textContent = message;
    element.parentElement.classList.add('shake');
    
    setTimeout(() => {
        element.parentElement.classList.remove('shake');
    }, 500);
}

function logout() {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        fetch(`api/logout.php?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                localStorage.removeItem('userId');
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Logout error:', error);
                
                localStorage.removeItem('userId');
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                
                window.location.href = 'index.html';
            });
    } else {
        window.location.href = 'index.html';
    }
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initTabs();
    initInputEffects();
    initPasswordToggles();
    initSupportLink();
    initLoginForm();
    initRegisterForm();
    initFloatingEffects();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form-content');
    const indicator = document.querySelector('.tab-indicator');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked button and corresponding form
            btn.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
            
            // Move indicator
            const index = Array.from(tabBtns).indexOf(btn);
            indicator.style.left = `${index * 50 + 5}%`;
            
            // Add sound effect
            playSound('click');
        });
    });
}

function initInputEffects() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', () => {
            const wrapper = input.closest('.input-icon-wrapper');
            if (wrapper) {
                wrapper.classList.add('focused');
            }
        });
        
        input.addEventListener('blur', () => {
            const wrapper = input.closest('.input-icon-wrapper');
            if (wrapper) {
                wrapper.classList.remove('focused');
            }
        });
        
        // Add hover sound effect
        input.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });
}

function initPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling.previousElementSibling;
            
            // Toggle input type
            if (input.type === 'password') {
                input.type = 'text';
                toggle.classList.remove('fa-eye');
                toggle.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                toggle.classList.remove('fa-eye-slash');
                toggle.classList.add('fa-eye');
            }
            
            // Add sound effect
            playSound('click');
        });
    });
}

function initSupportLink() {
    const supportLink = document.getElementById('support-link');
    if (supportLink) {
        supportLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://t.me/blinchikbustit42';
        });
    }
}

function initLoginForm() {
    const loginForm = document.getElementById('login');
    const loginError = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const rememberMe = document.getElementById('remember-me')?.checked || false;
            
            // Reset error message
            hideError(loginError);
            
            // Validate inputs
            if (!username || !password) {
                showError(loginError, 'Please fill in all fields');
                shakeForms();
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('.submit-btn');
            setButtonLoading(submitBtn, true);
            
            // Send login request
            fetch('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    remember_me: rememberMe
                })
            })
            .then(response => response.json())
            .then(data => {
                setButtonLoading(submitBtn, false);
                
                if (data.success) {
                    // Store user data in local storage
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('username', username);
                    
                    // Show success animation and redirect
                    showSuccessEffect();
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showError(loginError, data.message || 'Login failed');
                    shakeForms();
                }
            })
            .catch(error => {
                setButtonLoading(submitBtn, false);
                showError(loginError, 'Server error, please try again later');
                console.error('Login error:', error);
                shakeForms();
            });
        });
    }
}

function initRegisterForm() {
    const registerForm = document.getElementById('register');
    const registerError = document.getElementById('register-error');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('register-confirm-password').value.trim();
            const agreeTerms = document.getElementById('agree-terms')?.checked || false;
            
            // Reset error message
            hideError(registerError);
            
            // Validate inputs
            if (!username || !email || !password || !confirmPassword) {
                showError(registerError, 'Please fill in all fields');
                shakeForms();
                return;
            }
            
            if (!agreeTerms) {
                showError(registerError, 'You must agree to the Terms of Service');
                shakeForms();
                return;
            }
            
            if (password !== confirmPassword) {
                showError(registerError, 'Passwords do not match');
                shakeForms();
                return;
            }
            
            if (password.length < 8) {
                showError(registerError, 'Password must be at least 8 characters');
                shakeForms();
                return;
            }
            
            if (!validateEmail(email)) {
                showError(registerError, 'Please enter a valid email');
                shakeForms();
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('.submit-btn');
            setButtonLoading(submitBtn, true);
            
            // Send registration request
            fetch('api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                setButtonLoading(submitBtn, false);
                
                if (data.success) {
                    // Store user data in local storage
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('username', username);
                    
                    // Show success animation and redirect
                    showSuccessEffect();
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showError(registerError, data.message || 'Registration failed');
                    shakeForms();
                }
            })
            .catch(error => {
                setButtonLoading(submitBtn, false);
                showError(registerError, 'Server error, please try again later');
                console.error('Registration error:', error);
                shakeForms();
            });
        });
    }
}

function initFloatingEffects() {
    // Add dynamic floating lights
    const authPage = document.querySelector('.auth-page');
    if (authPage) {
        // Add more lights
        const extraLights = 5;
        for (let i = 0; i < extraLights; i++) {
            const light = document.createElement('div');
            light.className = 'light';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            light.style.left = `${posX}%`;
            light.style.top = `${posY}%`;
            
            // Random size
            const size = Math.random() * 200 + 100;
            light.style.width = `${size}px`;
            light.style.height = `${size}px`;
            
            // Random opacity
            const opacity = Math.random() * 0.08 + 0.02;
            light.style.opacity = opacity;
            
            // Random color
            const hue = Math.random() * 40 + 230; // Blue-purple range
            light.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 60%, 0.8), transparent 70%)`;
            
            // Random animation duration
            const duration = Math.random() * 10 + 15;
            light.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.random() * 5;
            light.style.animationDelay = `${delay}s`;
            
            authPage.appendChild(light);
        }
    }
}

// Helper functions
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

function showError(element, message) {
    if (!element) return;
    
    // Find parent alert element
    const alertElement = element.closest('.alert');
    if (alertElement) {
        element.textContent = message;
        alertElement.style.display = 'flex';
        
        // Add entrance animation
        alertElement.style.animation = 'none';
        setTimeout(() => {
            alertElement.style.animation = 'fadeInUp 0.3s ease forwards';
        }, 10);
    }
}

function hideError(element) {
    if (!element) return;
    
    // Find parent alert element
    const alertElement = element.closest('.alert');
    if (alertElement) {
        alertElement.style.display = 'none';
    }
}

function shakeForms() {
    const formBox = document.querySelector('.form-box');
    if (formBox) {
        formBox.classList.add('shake');
        setTimeout(() => {
            formBox.classList.remove('shake');
        }, 500);
    }
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    const text = button.querySelector('.btn-text');
    const icon = button.querySelector('.btn-icon');
    
    if (isLoading) {
        text.textContent = 'Processing...';
        if (icon) {
            icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        button.disabled = true;
    } else {
        // Reset to original text based on form type
        const formId = button.closest('form')?.id;
        if (formId === 'login') {
            text.textContent = 'Login';
            if (icon) {
                icon.innerHTML = '<i class="fas fa-arrow-right"></i>';
            }
        } else if (formId === 'register') {
            text.textContent = 'Create Account';
            if (icon) {
                icon.innerHTML = '<i class="fas fa-user-plus"></i>';
            }
        }
        button.disabled = false;
    }
}

function showSuccessEffect() {
    const formBox = document.querySelector('.form-box');
    if (formBox) {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = '<i class="fas fa-check-circle"></i><p>Success!</p>';
        
        // Add styles
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(76, 217, 100, 0.9)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = 'white';
        overlay.style.fontSize = '24px';
        overlay.style.borderRadius = '15px';
        overlay.style.zIndex = '100';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';
        
        // Add icon styles
        const icon = overlay.querySelector('i');
        icon.style.fontSize = '60px';
        icon.style.marginBottom = '20px';
        
        formBox.appendChild(overlay);
        
        // Trigger animation
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

// Sound effects
function playSound(type) {
    // Only enable after user interaction
    if (!document.body.classList.contains('user-interacted')) {
        document.body.addEventListener('click', function onFirstClick() {
            document.body.classList.add('user-interacted');
            document.body.removeEventListener('click', onFirstClick);
        });
        return;
    }
    
    const sounds = {
        hover: {
            volume: 0.1,
            src: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAESAAzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmaZmZmZmZmZmZmZmZmZmZmZzMzMzMzMzMzMzMzMzMzMzMz///////////////////8AAAA5TEFNRTMuOTlyAc0AAAAAAAAAABSAJAJAQgAAgAAAA0hmJFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
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

// Add keyframes animation for shake effect
function addShakeAnimation() {
    if (!document.getElementById('shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .shake {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize shake animation
addShakeAnimation(); 