document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');

  // Manejador para el formulario de inicio de sesión
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        // Redirigir al usuario a la página de inicio
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.message);
      });
    });
  }

  // Manejador para el formulario de registro
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

  // Función para manejar el cierre de sesión
  function logout() {
    fetch('/auth/logout', {
      method: 'GET'
    })
    .then(() => {
      window.location.href = '/login';
    })
    .catch(error => {
      console.error('Error during logout:', error);
    });
  }

  // Agregar un manejador de eventos para el enlace de cierre de sesión
  const logoutLink = document.querySelector('#logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
});