// Hamburger menu toggle
function toggleMenu() {
  const navMenu = document.querySelector('.navbar-menu') || document.querySelector('.nav-links');
  const navToggle = document.querySelector('.navbar-toggle') || document.querySelector('.hamburger');
  
  if (navMenu && navToggle) {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const navMenu = document.querySelector('.navbar-menu') || document.querySelector('.nav-links');
  const navToggle = document.querySelector('.navbar-toggle') || document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  
  if (navMenu && navToggle && navbar) {
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }
});

// Simple scroll animations (no GSAP)
function animateOnScroll() {
  const elements = document.querySelectorAll('.hero, .goal-card, .master-card, .product-card');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    
    if (elementTop < window.innerHeight && elementBottom > 0) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  // Set initial state for animated elements
  const elements = document.querySelectorAll('.hero, .goal-card, .master-card, .product-card');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
  });
  
  // Trigger animations on scroll
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Initial check
});

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  return { token, userRole, isAuthenticated: !!token };
}

// Utility function for API calls
async function apiCall(endpoint, options = {}) {
  const { token } = checkAuth();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const response = await fetch(endpoint, { ...defaultOptions, ...options });
  return response.json();
}
