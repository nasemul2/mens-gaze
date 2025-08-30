document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const secretCodeInput = document.getElementById('secret-code');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const password = passwordInput.value;
        const secretCode = secretCodeInput.value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, secretCode }),
            });

            if (response.ok) {
                window.location.href = '/admin';
            } else {
                const error = await response.text();
                loginError.textContent = error;
            }
        } catch (error) {
            console.error('Login failed:', error);
            loginError.textContent = 'An error occurred. Please try again.';
        }
    });
});
