import "./style.css"
// Apuntamos al Backend (Puerto 3000)
const API_URL = 'http://localhost:3000/api';
//const API_URL = import.meta.env.VITE_API_URL;

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
   e.preventDefault();
  
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;

   try {
       // Petición al Backend
       const response = await fetch(`${API_URL}/auth/login`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password })
       });

       const data = await response.json();

       if (!response.ok) {
           errorMsg.textContent = data.error || 'Error al hacer login';
           return;
       }

       // ¡Login exitoso! Guardamos en localStorage
       localStorage.setItem('token', data.token);
       localStorage.setItem('rol', data.usuario.rol);
       localStorage.setItem('nombre', data.usuario.nombre);

       // Redirigimos al dashboard
       window.location.href = '/dashboard.html';

   } catch (error) {
       // AQUÍ ES DONDE CORS FALLA SI NO LO CONFIGURAMOS EN EXPRESS
       errorMsg.textContent = 'Error de conexión. ¿Está el backend arrancado y CORS configurado?';
       console.error(error);
   }
});
