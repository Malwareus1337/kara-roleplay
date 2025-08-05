// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initPlayerCounter();
    initServerCards();
    initSmoothScrolling();
    initCopyToClipboard();
    initAnimations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            
            // Animate hamburger menu
            if (navLinks.classList.contains('show')) {
                mobileToggle.innerHTML = '✕';
            } else {
                mobileToggle.innerHTML = '☰';
            }
        });

        // Close mobile menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                mobileToggle.innerHTML = '☰';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('show');
                mobileToggle.innerHTML = '☰';
            }
        });
    }
}

// Dynamic Player Counter
function initPlayerCounter() {
    const totalPlayersElement = document.getElementById('total-players');
    const currentPlayersElement = document.getElementById('current-players');
    
    if (totalPlayersElement || currentPlayersElement) {
        // Simulate dynamic player count updates
        let totalPlayers = 590;
        let currentPlayers = 245;
        
        try {
            // Update total players every 10 seconds
            setInterval(() => {
                const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
                totalPlayers = Math.max(400, Math.min(800, totalPlayers + change));
                
                if (totalPlayersElement) {
                    animateNumber(totalPlayersElement, totalPlayers);
                }
            }, 10000);

            // Update current server players every 8 seconds
            setInterval(() => {
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                currentPlayers = Math.max(150, Math.min(500, currentPlayers + change));
                
                if (currentPlayersElement) {
                    animateNumber(currentPlayersElement, currentPlayers);
                }
            }, 8000);

        } catch (error) {
            console.error('Error updating player counts:', error);
        }
    }
}

// Animate number changes
function animateNumber(element, targetNumber) {
    const currentNumber = parseInt(element.textContent);
    const difference = targetNumber - currentNumber;
    const steps = 20;
    const stepValue = difference / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.round(currentNumber + (stepValue * currentStep));
        element.textContent = newValue;

        if (currentStep >= steps) {
            element.textContent = targetNumber;
            clearInterval(interval);
        }
    }, 50);
}

// Server Cards Interaction
function initServerCards() {
    const serverCards = document.querySelectorAll('.server-card');
    
    serverCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            serverCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update player counts for demonstration
            const playerElement = this.querySelector('.server-players');
            if (playerElement) {
                const baseCounts = [245, 189, 156];
                const variation = Math.floor(Math.random() * 21) - 10;
                const newCount = Math.max(50, baseCounts[index] + variation);
                playerElement.textContent = '👥 ' + newCount;
            }
        });

        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(5px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Copy to Clipboard Functionality
function initCopyToClipboard() {
    window.copyToClipboard = function(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern clipboard API
                navigator.clipboard.writeText(text).then(() => {
                    showCopyNotification('IP adresi kopyalandı!');
                }).catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopyToClipboard(text);
                });
            } else {
                // Fallback for older browsers
                fallbackCopyToClipboard(text);
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            showCopyNotification('Kopyalama başarısız!', 'error');
        }
    };
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification('IP adresi kopyalandı!');
        } else {
            showCopyNotification('Kopyalama başarısız!', 'error');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showCopyNotification('Kopyalama başarısız!', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show copy notification
function showCopyNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'copy-notification ' + type;
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: ' + 
        (type === 'success' ? '#10b981' : '#ef4444') + 
        '; color: white; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 600; z-index: 10000; transform: translateX(100%); transition: transform 0.3s ease; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);';

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize scroll animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.info-card, .rule-category, .discord-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Additional event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Video placeholder click handler
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            const playButton = this.querySelector('.play-button');
            if (playButton) {
                playButton.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => {
                    playButton.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 200);
            }
            console.log('Video play clicked - implement video functionality here');
        });
    }

    // Start Playing button functionality
    const startPlayingBtn = document.querySelector('.start-playing-btn');
    if (startPlayingBtn) {
        startPlayingBtn.addEventListener('click', function() {
            const serverInfoSection = document.getElementById('server-info');
            if (serverInfoSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = serverInfoSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Guide button functionality
    const guideBtn = document.querySelector('.guide-btn');
    if (guideBtn) {
        guideBtn.addEventListener('click', function() {
            alert('Rehber sayfası yakında eklenecek!');
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }
});

// Error handling for all event listeners
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Console welcome message
console.log('🎮 Kara Roleplay Website - Ready!');
