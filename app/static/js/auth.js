document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar el formulario de inicio de sesión
  const loginForm = document.querySelector('#login-form');

  // Verificar si el formulario de inicio de sesión existe en la página
  if (loginForm) {
      // Agregar un manejador de eventos para el envío del formulario
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();

          // Recopilar los datos del formulario
          const formData = {
              username: document.querySelector('#username').value,
              password: document.querySelector('#password').value
          };

          // Realizar una solicitud POST al servidor para iniciar sesión
          fetch('/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          })
          .then(response => {
              // Verificar si la respuesta es exitosa
              if (!response.ok) {
                  throw new Error('Login failed');
              }
              return response.json();
          })
          .then(data => {
              // Verificar si se recibió el token JWT
              if (data.access_token) {
                  // Almacenar el token JWT en localStorage
                  localStorage.setItem('access_token', data.access_token);

                  // Redirigir al usuario a la página de inicio
                  window.location.href = '/';
              } else {
                  // Mostrar un mensaje de error si no se recibió el token
                  alert('Login failed: No token received');
              }
          })
          .catch(error => {
              // Mostrar un mensaje de error en caso de falla en la solicitud
              console.error('Error during login:', error);
              alert('Login failed: ' + error.message);
          });
      });
  }

  // Función de ejemplo para realizar una solicitud a una ruta protegida
  function someProtectedRequest() {
      fetch('/some-protected-route', {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Request failed');
          }
          return response.json();
      })
      .then(data => {
          // Procesar los datos recibidos
          console.log('Protected data:', data);
      })
      .catch(error => {
          // Manejar errores en la solicitud protegida
          console.error('Error in protected request:', error);
          alert('Protected request failed: ' + error.message);
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
  