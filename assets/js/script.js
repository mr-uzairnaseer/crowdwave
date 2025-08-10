// Smooth scrolling for navigation links with navbar offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Calculate navbar height for proper offset
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 76; // Default 76px if navbar not found
            const targetPosition = target.offsetTop - navbarHeight - 20; // Extra 20px padding
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll progress bar and back-to-top
(() => {
    // Create progress bar element
    const progress = document.createElement('div');
    progress.id = 'scrollProgress';
    document.body.appendChild(progress);

    // Create back-to-top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const width = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.width = width + '%';
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Dark mode toggle (commented out)
/*
(() => {
    const STORAGE_KEY = 'cw-theme';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(STORAGE_KEY);
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // Add toggle button to navbar end if not present
    const makeToggle = () => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-secondary ms-2';
        btn.type = 'button';
        btn.id = 'themeToggle';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.innerHTML = '<i class="fas fa-moon"></i>';
        return btn;
    };

    const mountToggle = () => {
        const nav = document.querySelector('.navbar .navbar-collapse');
        if (!nav) return;
        if (document.getElementById('themeToggle')) return;
        const btn = makeToggle();
        nav.appendChild(btn);
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', current);
            localStorage.setItem(STORAGE_KEY, current);
            btn.innerHTML = current === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
        // Set initial icon
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    document.addEventListener('DOMContentLoaded', mountToggle);
})();
*/

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Basic validation
            let isValid = true;
            
            if (!fullName.value.trim()) {
                showError(fullName, 'Please enter your full name');
                isValid = false;
            } else {
                showSuccess(fullName);
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                showSuccess(email);
            }
            
            if (!subject.value.trim()) {
                showError(subject, 'Please enter a subject');
                isValid = false;
            } else {
                showSuccess(subject);
            }
            
            if (!message.value.trim()) {
                showError(message, 'Please enter your message');
                isValid = false;
            } else {
                showSuccess(message);
            }
            
            if (isValid) {
                // Simulate form submission
                showSuccessMessage();
                contactForm.reset();
            }
        });
    }
});

// Form validation helper functions
function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    if (!error) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger small mt-1';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    } else {
        error.textContent = message;
    }
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    if (error) {
        error.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage() {
    // Create success alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        <strong>Success!</strong> Your message has been sent successfully.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h2');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const isStar = target.includes('Star');
        const isK = target.includes('K');
        
        let finalNumber;
        if (isPercentage) {
            finalNumber = parseInt(target);
        } else if (isPlus) {
            finalNumber = parseInt(target);
        } else if (isStar) {
            finalNumber = parseInt(target);
        } else if (isK) {
            finalNumber = parseInt(target);
        } else {
            finalNumber = parseInt(target);
        }
        
        let current = 0;
        const increment = finalNumber / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                current = finalNumber;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isPercentage) {
                counter.textContent = displayValue + '%+';
            } else if (isPlus) {
                counter.textContent = displayValue + '+';
            } else if (isStar) {
                counter.textContent = displayValue + '-Star';
            } else if (isK) {
                counter.textContent = displayValue + 'K+';
            }
        }, 20);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger counter animation for stats section
            if (entry.target.classList.contains('stats-section')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.input-group');
    if (newsletterForm) {
        const button = newsletterForm.querySelector('button');
        const input = newsletterForm.querySelector('input');
        
        button.addEventListener('click', function() {
            const email = input.value.trim();
            
            if (!email || !isValidEmail(email)) {
                input.classList.add('is-invalid');
                return;
            }
            
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            
            // Simulate subscription
            button.textContent = 'Subscribed!';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.textContent = 'Subscribe';
                button.classList.remove('btn-success');
                button.classList.add('btn-secondary');
                input.classList.remove('is-valid');
                input.value = '';
            }, 3000);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Mobile menu auto-close on link click
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
});

// Parallax effect for hero section (respects reduced motion)
(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // do not add parallax listeners
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    }, { passive: true });
})();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.6s ease;
    }
    
    section {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .loaded {
        opacity: 1;
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
    }
    
    .is-valid {
        border-color: #198754 !important;
    }
`;
document.head.appendChild(style);

// Download Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadModal = document.getElementById('downloadModal');
    
    if (downloadModal) {
        // Add event listeners for download buttons
        const downloadButtons = downloadModal.querySelectorAll('.btn-download');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const isGooglePlay = this.querySelector('.fa-google-play');
                const isAppStore = this.querySelector('.fa-apple');
                
                // Add click animation
                const downloadBtn = this.querySelector('.download-btn');
                downloadBtn.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    downloadBtn.style.transform = '';
                }, 150);
                
                // Show success message
                let storeName = '';
                if (isGooglePlay) {
                    storeName = 'Google Play Store';
                } else if (isAppStore) {
                    storeName = 'App Store';
                }
                
                // Create and show toast notification
                showDownloadToast(storeName);
                
                // Here you would typically redirect to the actual store
                console.log(`Redirecting to ${storeName}`);
            });
        });
        
        // Modal show/hide event listeners
        downloadModal.addEventListener('show.bs.modal', function() {
            // Trigger animation when modal shows
            const illustration = this.querySelector('.delivery-animation');
            if (illustration) {
                illustration.style.animationPlayState = 'running';
            }
        });
        
        downloadModal.addEventListener('hidden.bs.modal', function() {
            // Pause animation when modal hides for better performance
            const illustration = this.querySelector('.delivery-animation');
            if (illustration) {
                illustration.style.animationPlayState = 'paused';
            }
        });
    }
});

// Toast notification function
function showDownloadToast(storeName) {
    // Create toast element
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toastHTML = `
        <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="fas fa-check-circle me-2"></i>
                    Redirecting to ${storeName}...
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show the toast
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Add intersection observer for modal animations
const observeModalElements = () => {
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

    // Observe download buttons in modal
    document.querySelectorAll('#downloadModal .download-btn').forEach(btn => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        btn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(btn);
    });
};

// Initialize modal animations when DOM is loaded
document.addEventListener('DOMContentLoaded', observeModalElements);

// Lazy-load images (add loading="lazy" when possible)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
        // Provide a decoding hint
        img.setAttribute('decoding', 'async');
    });
});

// Improve accessibility: add skip link if missing
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.skip-link')) {
        const skip = document.createElement('a');
        skip.href = '#main';
        skip.className = 'skip-link';
        skip.textContent = 'Skip to content';
        document.body.prepend(skip);
    }
    // Ensure main landmark exists
    if (!document.getElementById('main')) {
        const mainCandidate = document.querySelector('main') || document.querySelector('section');
        if (mainCandidate && !mainCandidate.id) {
            mainCandidate.id = 'main';
        }
    }
});

// Video Embed Management
(() => {
    // Configuration - Update these values to change the video
    const VIDEO_CONFIG = {
        // YouTube video ID (the part after 'v=' in YouTube URL)
        // Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> VIDEO_ID = "dQw4w9WgXcQ"
        youtubeId: null, // Set this to your YouTube video ID
        
        // Alternative: Direct video file URL for local/hosted videos
        videoUrl: null,
        
        // Video title for accessibility
        title: "CrowdWave Package Delivery System Demo"
    };

    // Function to load video when ready
    function initializeVideo() {
        const videoContainer = document.querySelector('.video-container');
        const iframe = videoContainer?.querySelector('iframe');
        const fallback = videoContainer?.querySelector('.video-fallback');
        
        if (!videoContainer || !iframe || !fallback) return;

        if (VIDEO_CONFIG.youtubeId) {
            // Load YouTube video
            iframe.src = `https://www.youtube.com/embed/${VIDEO_CONFIG.youtubeId}?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1`;
            iframe.title = VIDEO_CONFIG.title;
            fallback.style.display = 'none';
            iframe.style.display = 'block';
        } else if (VIDEO_CONFIG.videoUrl) {
            // Load direct video file
            const video = document.createElement('video');
            video.className = 'w-100 h-100';
            video.style.borderRadius = '12px';
            video.controls = true;
            video.preload = 'metadata';
            video.src = VIDEO_CONFIG.videoUrl;
            video.title = VIDEO_CONFIG.title;
            
            videoContainer.replaceChild(video, iframe);
            fallback.style.display = 'none';
        } else {
            // Show fallback
            iframe.style.display = 'none';
            fallback.style.display = 'flex';
        }
    }

    // Initialize video when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeVideo);
    } else {
        initializeVideo();
    }

    // Expose function globally for easy video updates
    window.updateVideo = function(youtubeId, title = 'CrowdWave Demo Video') {
        VIDEO_CONFIG.youtubeId = youtubeId;
        VIDEO_CONFIG.title = title;
        initializeVideo();
    };

    // Expose function for direct video URL updates
    window.updateVideoUrl = function(videoUrl, title = 'CrowdWave Demo Video') {
        VIDEO_CONFIG.videoUrl = videoUrl;
        VIDEO_CONFIG.youtubeId = null; // Clear YouTube ID
        VIDEO_CONFIG.title = title;
        initializeVideo();
    };
})();

// Seamless Video Hover Controls
(() => {
    function setupVideoHoverControls() {
        const videos = document.querySelectorAll('video[autoplay]');
        
        videos.forEach(video => {
            const container = video.closest('.video-container, .demo-video');
            if (!container) return;

            // Create controls overlay if it doesn't exist
            let overlay = container.querySelector('.video-controls-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'video-controls-overlay';
                
                // Play/Pause button
                const playBtn = document.createElement('button');
                playBtn.className = 'video-control-btn';
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.setAttribute('aria-label', 'Play/Pause');
                
                // Mute/Unmute button
                const muteBtn = document.createElement('button');
                muteBtn.className = 'video-control-btn';
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteBtn.setAttribute('aria-label', 'Mute/Unmute');
                
                // Fullscreen button
                const fullscreenBtn = document.createElement('button');
                fullscreenBtn.className = 'video-control-btn';
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.setAttribute('aria-label', 'Fullscreen');
                
                overlay.appendChild(playBtn);
                overlay.appendChild(muteBtn);
                overlay.appendChild(fullscreenBtn);
                container.appendChild(overlay);
                
                // Event listeners
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (video.paused) {
                        video.play();
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        video.pause();
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });
                
                muteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.innerHTML = video.muted ? 
                        '<i class="fas fa-volume-mute"></i>' : 
                        '<i class="fas fa-volume-up"></i>';
                });
                
                fullscreenBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    } else if (video.msRequestFullscreen) {
                        video.msRequestFullscreen();
                    }
                });
            }
            
            // Update play button state based on video state
            video.addEventListener('play', () => {
                const playBtn = overlay.querySelector('.video-control-btn');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            
            video.addEventListener('pause', () => {
                const playBtn = overlay.querySelector('.video-control-btn');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            // Ensure video plays on load
            video.addEventListener('loadeddata', function() {
                this.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                });
            });
        });
    }
    
    // Initialize seamless video controls when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupVideoHoverControls);
    } else {
        setupVideoHoverControls();
    }
})();
