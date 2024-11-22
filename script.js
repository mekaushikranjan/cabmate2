document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('form-title');
    const usernameGroup = document.getElementById('username-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const authForm = document.getElementById('auth-form');
    const toggleText = document.getElementById('toggle-text');
    const toggleButton = document.getElementById('toggle-button');
    const submitButton = document.querySelector('.btn');
  
    let isLogin = true;
  
    const toggleForm = () => {
      isLogin = !isLogin;
      formTitle.textContent = isLogin ? 'Login' : 'Signup';
      toggleText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
      toggleButton.textContent = isLogin ? 'Signup' : 'Login';
      usernameGroup.style.display = isLogin ? 'none' : 'block';
      confirmPasswordGroup.style.display = isLogin ? 'none' : 'block';
      submitButton.textContent = isLogin ? 'Login' : 'Signup';
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
  
      if (isLogin) {
        console.log('Login:', { email, password });
      } else {
        if (password !== confirmPassword) {
          console.error('Passwords do not match');
          return;
        }
        console.log('Signup:', { username, email, password });
      }
    };
  
    toggleButton.addEventListener('click', toggleForm);
    authForm.addEventListener('submit', handleFormSubmit);
  });
  // Example: Login function
async function login(username, password) {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('Login successful!');
    } else {
        alert('Login failed!');
    }
}
