const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

// Si no hay token o no es admin, fuera
const rol = localStorage.getItem('rol');
if (!token || rol !== 'admin') {
   alert('Acceso no autorizado. Debes ser administrador.');
   window.location.href = '/login.html';
}

const verifyBtn = document.getElementById('verifyBtn');
const resultBox = document.getElementById('resultBox');

verifyBtn.addEventListener('click', async () => {
   const ticketId = document.getElementById('ticketId').value;
   if (!ticketId) return;

   try {
       const response = await fetch(`${API_URL}/reservas/verificar/${ticketId}`, {
           headers: { 'Authorization': `Bearer ${token}` }
       });

       const data = await response.json();

       resultBox.style.display = 'block';

       if (data.valid) {
           // Ticket válido
           resultBox.className = 'result valid';
           resultBox.innerHTML = `
               <h3>✅ ${data.mensaje}</h3>
               <p><strong>Ciudadano:</strong> ${data.reserva.usuario_nombre}</p>
               <p><strong>Espacio:</strong> ${data.reserva.espacio_nombre}</p>
               <p><strong>Día:</strong> ${data.reserva.fecha}</p>
               <p><strong>Hora:</strong> ${data.reserva.hora_inicio} - ${data.reserva.hora_fin}</p>
           `;
       } else {
           // Ticket inválido o cancelado
           resultBox.className = 'result invalid';
           resultBox.innerHTML = `<h3>❌ ${data.mensaje || data.error}</h3>`;
       }

   } catch (error) {
       resultBox.style.display = 'block';
       resultBox.className = 'result invalid';
       resultBox.innerHTML = `<h3>❌ Error de conexión</h3>`;
   }
});

