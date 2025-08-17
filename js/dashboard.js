document.addEventListener('DOMContentLoaded', function() {
    initSupportLink();
    initDashboardTabs();
    loadUserData();
});

function initSupportLink() {
    const supportLink = document.getElementById('support-link');
    if (supportLink) {
        supportLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://t.me/blinchikbustit42';
        });
    }
}

function initDashboardTabs() {
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    if (!navLinks.length || !sections.length) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });
    
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(item => item.classList.remove('active'));
            document.querySelector('[data-section="download"]').classList.add('active');
            
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById('download').classList.add('active');
        });
    }
}

function loadUserData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (!userId || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('username').textContent = username;
    document.getElementById('overview-username').textContent = username;
    document.getElementById('user-uid').textContent = userId;
    
    if (document.getElementById('settings-username')) {
        document.getElementById('settings-username').value = username;
    }
    
    fetch(`api/getUserData.php?userId=${userId}&token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.email && document.getElementById('settings-email')) {
                    document.getElementById('settings-email').value = data.email;
                }
                
                if (data.registrationDate) {
                    const date = new Date(data.registrationDate * 1000);
                    document.getElementById('registration-date').textContent = formatDate(date);
                }
                
                if (data.lastLogin) {
                    const date = new Date(data.lastLogin * 1000);
                    document.getElementById('last-login').textContent = formatDate(date);
                }
            } else {
                console.error('Failed to load user data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
        });
    
    const profileForm = document.getElementById('profile-settings-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateUserData();
        });
    }
}

function updateUserData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    const email = document.getElementById('settings-email').value;
    
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('token', token);
    formData.append('email', email);
    
    fetch('api/updateUserData.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showUpdateSuccess('Данные успешно обновлены');
        } else {
            showUpdateError(data.message || 'Ошибка при обновлении данных');
        }
    })
    .catch(error => {
        console.error('Update error:', error);
        showUpdateError('Произошла ошибка при обновлении данных');
    });
}

function formatDate(date) {
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showUpdateSuccess(message) {
    const formElement = document.getElementById('profile-settings-form');
    
    const successElement = document.createElement('div');
    successElement.classList.add('success-message');
    successElement.textContent = message;
    
    if (formElement.querySelector('.success-message')) {
        formElement.querySelector('.success-message').remove();
    }
    
    if (formElement.querySelector('.error-message')) {
        formElement.querySelector('.error-message').remove();
    }
    
    formElement.appendChild(successElement);
    
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

function showUpdateError(message) {
    const formElement = document.getElementById('profile-settings-form');
    
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    
    if (formElement.querySelector('.success-message')) {
        formElement.querySelector('.success-message').remove();
    }
    
    if (formElement.querySelector('.error-message')) {
        formElement.querySelector('.error-message').remove();
    }
    
    formElement.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
} 