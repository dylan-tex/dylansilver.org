/* ========================================
   Dylan Silver - dylansilver.org
   Main JavaScript File
   ======================================== */

// ========== DOCUMENT READY ==========

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollBehavior();
    initializeContactForm();
});

// ========== NAVIGATION ==========

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = getCurrentPage();

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage || (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    return page || 'index.html';
}

// ========== SCROLL BEHAVIOR ==========

function initializeScrollBehavior() {
    // Smooth scroll behavior is handled by CSS scroll-behavior: smooth

    // Add scroll event listener for navbar shadow
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
    });
}

// ========== NOTIFICATIONS ==========

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        max-width: 400px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#ef4444';
        notification.style.color = 'white';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========== CONTACT FORM ==========

function initializeContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                consent: document.getElementById('consent').checked
            };

            // Validate
            if (!validateContactForm(formData)) {
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Send to serverless function
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification('✅ Message sent successfully! We\'ll be in touch soon.', 'success');
                    form.reset();
                } else {
                    showNotification('❌ Error sending message: ' + (result.message || 'Unknown error'), 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('❌ Error sending message. Please try again.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// ========== UTILITY FUNCTIONS ==========

// Smooth scroll to element
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth' });
}

// Add animation classes on scroll
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.service-card, .credential, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// ========== FORM VALIDATION ==========

function validateContactForm(formData) {
    if (!formData.name || formData.name.trim() === '') {
        alert('Please enter your name');
        return false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!formData.subject || formData.subject === '') {
        alert('Please select a subject');
        return false;
    }

    if (!formData.message || formData.message.trim() === '') {
        alert('Please enter a message');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== MOBILE MENU (if needed for future expansion) ==========

function initializeMobileMenu() {
    // Add mobile menu functionality here if needed
    // For now, the current nav is responsive via CSS
}

// ========== ANALYTICS & TRACKING ==========

// Add your analytics here (Google Analytics, etc.)
function trackPageView() {
    const page = getCurrentPage();
    // Example: ga('send', 'pageview', '/' + page);
}

// ========== EXPORT FUNCTIONS ==========

window.smoothScrollTo = smoothScrollTo;
window.validateContactForm = validateContactForm;
