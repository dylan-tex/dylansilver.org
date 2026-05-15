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

// ========== CONTACT FORM ==========

function initializeContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            // Form will submit to formspree or your email service
            // Remove this if you're using a service that handles submission
            console.log('Contact form submitted');
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
