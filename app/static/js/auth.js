document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login-form');
    const registerForm = document.querySelector('#register-form');
  
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
          username: document.querySelector('#username').value,
          password: document.querySelector('#password').value
        };
        fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = '/'; // Redirige al inicio después del login
          } else {
            // Manejar errores, mostrar mensajes al usuario
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
          username: document.querySelector('#username').value,
          email: document.querySelector('#email').value,
          password: document.querySelector('#password').value
        };
        fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
          if (data.msg === 'User created') {
            window.location.href = '/auth/login'; // Redirige al login después del registro
          } else {
            // Manejar errores, mostrar mensajes al usuario
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    }
  });
  