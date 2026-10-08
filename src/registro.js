const API_URL = import.meta.env.VITE_API_URL;

const registerForm = document.getElementById('registerForm');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');

registerForm.addEventListener('submit', async (e) => {
   e.preventDefault();
  
   // Limpiar mensajes previos
   errorMsg.textContent = '';
   successMsg.textContent = '';

   const nombre = document.getElementById('nombre').value;
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;

   try {
       // Hacemos la petición POST a la API de usuarios
       const response = await fetch(`${API_URL}/usuarios`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ nombre, email, password }) // NO mandamos 'rol'
       });

       const data = await response.json();

       if (!response.ok) {
           // Si hay error (ej: 409 email duplicado, o 400 faltan datos)
           errorMsg.textContent = data.error || 'Error al registrarse';
           return;
       }

       // ¡Éxito! Mostramos mensaje y redirigimos al login
       successMsg.textContent = '✅ ¡Registro exitoso! Redirigiendo al login...';
      
       // Limpiamos el formulario
       registerForm.reset();

       // Redirigimos al login tras 2 segundos para que vean el mensaje
       setTimeout(() => {
           window.location.href = '/login.html';
       }, 2000);

   } catch (error) {
       errorMsg.textContent = 'Error de conexión con el servidor';
   }
});

