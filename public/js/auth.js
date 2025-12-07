// public/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    
    // ============= STUDENT SIGNUP =============
    const signupForm = document.querySelector('#signup-form');
    const signupBtn = document.querySelector('#signup-btn');
    
    if (signupBtn) {
        signupBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            console.log('Sign up button clicked!'); // Debug log
            
            // Get form values
            const name = document.querySelector('input[placeholder="Full Name"]')?.value.trim();
            const email = document.querySelector('input[type="email"]')?.value.trim();
            const password = document.querySelector('input[type="password"]')?.value;
            const rollNumber = document.querySelector('input[placeholder="Roll Number"]')?.value.trim();
            const department = document.querySelector('input[placeholder="Department"]')?.value.trim();
            const interestedStyle = document.querySelector('select')?.value;
            
            console.log('Form data:', { name, email, rollNumber, department, interestedStyle }); // Debug
            
            // Validation
            if (!name || !email || !password || !rollNumber || !department || !interestedStyle) {
                alert(' Please fill all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert(' Please enter a valid email address');
                return;
            }
            
            // Password validation
            if (password.length < 6) {
                alert(' Password must be at least 6 characters long');
                return;
            }
            
            // Disable button during request
            signupBtn.disabled = true;
            signupBtn.textContent = 'Signing Up...';
            signupBtn.style.opacity = '0.6';
            
            try {
                console.log('Sending request to backend...'); // Debug
                
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role: 'student',
                        rollNumber,
                        department,
                        interestedStyle
                    })
                });
                
                const data = await response.json();
                console.log('Response:', data); // Debug
                
                if (response.ok && data.success) {
                    // Save token and user info
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    alert('✅ Registration successful! Welcome to StepUnity!');
                    
                    // Redirect to student dashboard
                    window.location.href = '/student-dashboard.html';
                } else {
                    alert(' ' + (data.message || 'Registration failed. Please try again.'));
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Network error. Please check if server is running.');
            } finally {
                // Re-enable button
                signupBtn.disabled = false;
                signupBtn.textContent = 'Sign Up';
                signupBtn.style.opacity = '1';
            }
        });
    }
    
    // ============= LOGIN =============
    const loginBtn = document.querySelector('#login-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.querySelector('input[type="email"]')?.value.trim();
            const password = document.querySelector('input[type="password"]')?.value;
            
            if (!email || !password) {
                alert(' Please enter email and password');
                return;
            }
            
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    alert(' Login successful!');
                    
                    // Redirect based on role
                    if (data.user.role === 'student') {
                        window.location.href = '/student-dashboard.html';
                    } else if (data.user.role === 'teacher') {
                        window.location.href = '/teacher-dashboard.html';
                    }
                } else {
                    alert( (data.message || 'Login failed'));
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Network error. Please try again.');
            } finally {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    }
});

