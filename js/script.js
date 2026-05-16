/* ========================================
   Dylan Silver - dylansilver.org
   Main JavaScript File
   ======================================== */

// ========== DOCUMENT READY ==========

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollBehavior();
    initializeContactForm();
    initializeHamburgerMenu();
    initializeScrollHighlight();
    initializeSkillPills();
    initializeHeroVideo();
});

function initializeHeroVideo() {
    const video = document.querySelector('.hero-video-bg');
    if (video) video.playbackRate = 4;
}

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

// ========== CROSS-PAGE ANCHOR SCROLL ==========
// On page load, if URL has a hash, scroll to top first then smoothly scroll to target
if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
        window.scrollTo(0, 0);
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

// ========== SCROLL HIGHLIGHT ==========
//
// Mobile (<=768px): a single box at a time gets `.in-view` — whichever
//   one is closest to the vertical center of the viewport. This mirrors
//   the desktop behavior where only one box can be hovered at once.
// Desktop (>=769px): no scroll highlight; CSS :hover handles it.

let scrollHighlightHandler = null;

function initializeScrollHighlight() {
    const isMobile = window.innerWidth <= 768;

    // Select all box elements that should get the scroll highlight on mobile.
    // Keep this list in sync with the matching @media (max-width: 768px)
    // selector list in css/style.css.
    const boxSelectors = [
        '.service-card',
        '.credential-link',
        '.credential-btn',
        '.credential-item',
        '.expertise-item',
        '.disclosure-item',
        '.why-card',
        '.resource-card',
        '.podcast-card',
        '.philosophy-card',
        '.expertise-block',
        '.project-card',
        '.github-card',
        '.contact-method',
        '.area-card',
        '.faq-item',
        '.bio-card',
        '.intro-card',
        '.service-block'
    ];

    const allBoxes = document.querySelectorAll(boxSelectors.join(', '));
    if (allBoxes.length === 0) return;

    // Tear down any previous scroll handler before re-installing
    if (scrollHighlightHandler) {
        window.removeEventListener('scroll', scrollHighlightHandler);
        scrollHighlightHandler = null;
    }

    if (!isMobile) {
        // Desktop: no scroll highlight, hover only. Clear any leftover state.
        allBoxes.forEach(box => box.classList.remove('in-view'));
        return;
    }

    // Mobile: highlight the single box whose center is closest to the
    // viewport center. As the user scrolls, the highlight transfers from
    // one box to the next so only one is ever highlighted at a time.
    let ticking = false;

    function updateHighlight() {
        ticking = false;
        const vh = window.innerHeight;
        const viewportCenter = vh / 2;

        let bestBox = null;
        let bestDistance = Infinity;

        allBoxes.forEach(box => {
            const rect = box.getBoundingClientRect();
            // Skip boxes that are fully off-screen
            if (rect.bottom <= 0 || rect.top >= vh) return;

            const boxCenter = rect.top + rect.height / 2;
            const distance = Math.abs(boxCenter - viewportCenter);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestBox = box;
            }
        });

        allBoxes.forEach(box => {
            box.classList.toggle('in-view', box === bestBox);
        });
    }

    scrollHighlightHandler = function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHighlight);
            ticking = true;
        }
    };

    window.addEventListener('scroll', scrollHighlightHandler, { passive: true });
    // Set the initial highlight on load
    updateHighlight();
}

// Re-initialize on window resize (handles desktop <-> mobile crossover)
window.addEventListener('resize', () => {
    initializeScrollHighlight();
});

// ========== SKILL PILLS (Projects page) ==========
//
// Each .skill button has a data-info attribute. Clicking a pill toggles
// its description in the #skill-info panel below the grid. Clicking the
// same pill again (or pressing Escape) closes the panel.

function initializeSkillPills() {
    const pills = document.querySelectorAll('.skill[data-info]');
    const infoPanel = document.getElementById('skill-info');
    if (pills.length === 0 || !infoPanel) return;

    function closePanel() {
        infoPanel.hidden = true;
        infoPanel.innerHTML = '';
        pills.forEach(p => {
            p.classList.remove('is-active');
            p.setAttribute('aria-expanded', 'false');
        });
    }

    function openPanel(pill) {
        const label = pill.textContent.trim();
        const info = pill.getAttribute('data-info') || '';
        infoPanel.innerHTML = '<strong>' + label + '</strong>' + info;
        infoPanel.hidden = false;
        pills.forEach(p => {
            const active = p === pill;
            p.classList.toggle('is-active', active);
            p.setAttribute('aria-expanded', active ? 'true' : 'false');
        });
    }

    pills.forEach(pill => {
        pill.setAttribute('aria-expanded', 'false');
        pill.setAttribute('aria-controls', 'skill-info');
        pill.addEventListener('click', () => {
            if (pill.classList.contains('is-active')) {
                closePanel();
            } else {
                openPanel(pill);
            }
        });
    });

    // Press Escape to close the panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !infoPanel.hidden) {
            closePanel();
        }
    });
}

// ========== HAMBURGER MENU ==========

function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        // Toggle menu when hamburger is clicked
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = hamburger.contains(event.target) || navMenu.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
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

// ========== SFR CERTIFICATE MODAL ==========

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('sfr-modal');
    if (!modal) return;

    // Close when clicking the backdrop (outside the box)
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            modal.classList.remove('is-open');
        }
    });
});

// ========== EXPORT FUNCTIONS ==========

window.smoothScrollTo = smoothScrollTo;
window.validateContactForm = validateContactForm;
