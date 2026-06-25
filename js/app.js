/* app.js - Core application controller */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initScrollSpy();
    initSmoothScroll();
});

/**
 * Update the top progress bar indicating how far the user has scrolled.
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight > 0) {
            const scrollPercentage = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        } else {
            progressBar.style.width = '0%';
        }
    });
}

/**
 * Set active status on sidebar menu items based on scroll position using IntersectionObserver.
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.heuristic-section');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (sections.length === 0 || navItems.length === 0) return;
    
    const observerOptions = {
        root: null,
        // Trigger observer when section occupies 40% of the viewport height
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                navItems.forEach(item => {
                    if (item.getAttribute('data-target') === sectionId) {
                        item.classList.add('active');
                        
                        // Scroll the active nav item into sidebar view if sidebar overflows (mobile menu)
                        if (window.innerWidth <= 1024) {
                            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Handle smooth scrolling when navigation items are clicked.
 */
function initSmoothScroll() {
    const navItems = document.querySelectorAll('.nav-item');
    const heroBtn = document.querySelector('.scroll-down-indicator');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Adjust scroll offset slightly on mobile due to sticky top header
                const offset = window.innerWidth <= 1024 ? 120 : 0;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetSection.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Also bind hero scroll down indicator
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            const firstSection = document.getElementById('heuristic-1');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}
