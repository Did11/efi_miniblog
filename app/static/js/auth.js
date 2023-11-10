document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#login-form');
  
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
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              if (data.access_token) {
                  // Guarda el token en localStorage o sessionStorage según prefieras
                  localStorage.setItem('access_token', data.access_token);
                  // Redirige al inicio después del login
                  window.location.href = '/';
              } else {
                  // Manejar errores, mostrar mensajes al usuario
                  console.error('Login failed:', data.msg);
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
  