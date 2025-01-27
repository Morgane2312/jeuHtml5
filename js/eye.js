function togglePasswordVisibility(toggleId, passwordId) {
    const toggleIcon = document.getElementById(toggleId);
    const passwordInput = document.getElementById(passwordId);

    toggleIcon.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.src = './assets/eye2.png';
        } else {
            passwordInput.type = 'password';
            toggleIcon.src = './assets/eye.png';
        }
    });
}

togglePasswordVisibility('toggle-password-connexion', 'connexion-password');
togglePasswordVisibility('toggle-password-inscription', 'inscription-password');
