// EmailJS Universal Form Handler
// This script handles all forms across the CrowdWave website

// Initialize EmailJS
emailjs.init("B6CJY-_pMaXNvceJY");

// Configuration for EmailJS
const EMAIL_CONFIG = {
    serviceId: 'service_j3bwmzh',
    templateId: 'template_yfiwjyo',
    publicKey: 'B6CJY-_pMaXNvceJY'
};

// Helper function to handle any form submission
function handleFormSubmission(form, successMessage = 'Sent Successfully!') {
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Find submit button and text element
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const btnTextElement = submitBtn.querySelector('span') || submitBtn;
        const originalText = btnTextElement.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        btnTextElement.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        
        // Send email using EmailJS
        emailjs.sendForm(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, this)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                btnTextElement.innerHTML = '<i class="fas fa-check me-2"></i>' + successMessage;
                submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                
                // Reset form
                form.reset();
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                btnTextElement.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Failed!';
                submitBtn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            })
            .finally(function() {
                // Reset button state after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnTextElement.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            });
    });
}

// Initialize all EmailJS forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle forms by ID
    const formsById = {
        'indexContactForm': 'Message Sent!',
        'indexNewsletterForm': 'Subscribed!',
        'waitlistForm': 'Joined!',
        'contactForm': 'Message Sent!',
        'callbackForm': 'Request Sent!',
        'aboutNewsletterForm': 'Subscribed!',
        'featuresNewsletterForm': 'Subscribed!',
        'helpNewsletterForm': 'Subscribed!',
        'signupForm': 'Account Created!',
        'signinForm': 'Welcome Back!',
        'authSignupForm': 'Account Created!',
        'authSigninForm': 'Welcome Back!'
    };
    
    // Initialize forms by ID
    Object.entries(formsById).forEach(([formId, successMessage]) => {
        const form = document.getElementById(formId);
        if (form) {
            handleFormSubmission(form, successMessage);
        }
    });
    
    // Handle any remaining forms with EmailJS class
    const emailjsForms = document.querySelectorAll('.emailjs-form');
    emailjsForms.forEach(form => {
        const successMessage = form.dataset.successMessage || 'Sent Successfully!';
        handleFormSubmission(form, successMessage);
    });
    
    // Handle newsletter forms in footers (generic)
    const newsletterForms = document.querySelectorAll('form[action*="formsubmit.co"]');
    newsletterForms.forEach(form => {
        // Convert FormSubmit forms to EmailJS
        form.removeAttribute('action');
        form.removeAttribute('method');
        
        // Update input names for EmailJS
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.name === 'email') input.name = 'from_email';
            if (input.name === 'name') input.name = 'from_name';
        });
        
        // Add EmailJS class and handle
        form.classList.add('emailjs-form');
        const isNewsletter = form.querySelector('input[placeholder*="email"]') || form.querySelector('input[type="email"]');
        const successMessage = isNewsletter ? 'Subscribed!' : 'Sent Successfully!';
        handleFormSubmission(form, successMessage);
    });
});

// Export for use in other scripts
window.CrowdWaveEmailJS = {
    handleFormSubmission,
    EMAIL_CONFIG
};
