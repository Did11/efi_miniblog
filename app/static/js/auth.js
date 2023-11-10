document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#login-form');
  const errorMessage = document.querySelector('#error-message')
  const registerForm = document.querySelector('#register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value
        };
        console.log('Sending login data:', formData); // Agrega esto para depurar
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            console.log('Received response:', response); // Agrega esto para depurar
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data));
            }
            return response.json();
        })
        .then(data => {
            console.log('Login response data:', data); // Agrega esto para depurar
            if (data.access_token) {
                console.log('Token received:', data.access_token); // Agrega esto para depurar
                localStorage.setItem('access_token', data.access_token);
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            const errorMessageDiv = document.querySelector('#error-message');
            errorMessageDiv.textContent = error.msg || 'An error occurred during login.';
            errorMessageDiv.style.display = 'block'; // Hace visible el mensaje de error
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
        fetch('register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
          if (data.msg === 'User created') {
            window.location.href = '/login'; // Redirige al login después del registro
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
  