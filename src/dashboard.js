import "./style.css"


// 1. Configuración de la API
//const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://localhost:3000/api';
// 2. Recuperar datos de la sesión del localStorage
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');
const nombre = localStorage.getItem('nombre');

// 3. Seguridad: Si no hay token, no has logueado, te echo al login
if (!token) {
  window.location.href = '/login.html';
}

// 4. Rellenar la barra de navegación con los datos del usuario
document.getElementById('userName').textContent = nombre;
document.getElementById('userRole').textContent = rol;

// 5. Mostrar panel de Admin si el rol es administrador
if (rol === 'admin') {
  document.getElementById('admin-panel').style.display = 'block';
}

// 6. Cargar los espacios de la API
const container = document.getElementById('espacios-container');

async function loadEspacios() {
  try {
    const response = await fetch(`${API_URL}/espacios`, {
      method: 'GET',
      headers: {
        // Le pasamos el token aunque GET sea público, por si acaso
        'Authorization': `Bearer ${token}` 
      }
    });

    const espacios = await response.json();
    container.innerHTML = ''; // Limpiar "Cargando..."

    // Pintar las tarjetas de cada espacio
    espacios.forEach(espacio => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const statusText = espacio.disponible ? 'Abierto' : 'Cerrado';
      const statusClass = espacio.disponible ? 'status' : 'status cerrado';

      card.innerHTML = `
        <h3>${espacio.nombre}</h3>
        <p><strong>Tipo:</strong> ${espacio.tipo}</p>
        <p><strong>Ubicación:</strong> ${espacio.ubicacion}</p>
        <p><strong>Capacidad:</strong> ${espacio.capacidad_maxima} personas</p>
        <p><strong>Estado:</strong> <span class="${statusClass}">${statusText}</span></p>
      `;

      // LÓGICA DE ROLES EN EL FRONTEND (Botones)
      if (rol === 'admin') {
        // El admin ve el botón de borrar
        const btnBorrar = document.createElement('button');
        btnBorrar.className = 'btn-borrar';
        btnBorrar.textContent = '🗑️ Borrar Espacio';
        btnBorrar.onclick = () => deleteEspacio(espacio.id);
        card.appendChild(btnBorrar);
      } else if (espacio.disponible) {
        // El ciudadano ve el botón de reservar (solo si está abierto)
        const btnReservar = document.createElement('button');
        btnReservar.className = 'btn-reservar';
        btnReservar.textContent = '📅 Reservar';
        btnReservar.onclick = () => crearReserva(espacio.id, espacio.nombre);
        card.appendChild(btnReservar);
      }

      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = '<p style="color:red;">Error al conectar con la API.</p>';
  }
}

// 7. Función de Borrar Espacio (Solo la ejecutarán los Admin)
async function deleteEspacio(id) {
  if (!confirm('¿Seguro que quieres borrar este espacio? Esta acción es irreversible.')) return;

  try {
    const response = await fetch(`${API_URL}/espacios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` } // El guardia pide el carnet
    });

    if (response.ok) {
      alert('Espacio borrado correctamente');
      loadEspacios(); // Recargamos la lista de espacios
    } else {
      const data = await response.json();
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
  }
}

// 8. Función de Crear Reserva (Solo la ejecutarán los Ciudadanos)
async function crearReserva(espacioId, espacioNombre) {
  // Pedimos los datos por prompt
  const fecha = prompt(`Reservar: ${espacioNombre}\n\nIntroduce la fecha (YYYY-MM-DD):`);
  if (!fecha) return; // Si cancela, paramos
  
  const hora_inicio = prompt("Hora de inicio (HH:MM):", "10:00");
  if (!hora_inicio) return;
  
  const hora_fin = prompt("Hora de fin (HH:MM):", "11:00");
  if (!hora_fin) return;

  try {
    // Hacemos la petición POST a la API
    const response = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ¡Importante! El backend saca el usuario_id de aquí
      },
      body: JSON.stringify({ 
        espacio_id: espacioId, 
        fecha, 
        hora_inicio, 
        hora_fin 
      })
    });

    const data = await response.json();

    // Gestionamos la respuesta del Backend
    if (response.ok) {
      alert(`✅ ¡Reserva confirmada! ID de tu reserva: ${data.id}`);
    } else if (response.status === 409) {
      alert(`❌ Conflictos: ${data.error}`); // Doble reserva
    } else {
      alert(`❌ Error: ${data.error}`); // Otros errores (400, 404, etc.)
    }

  } catch (error) {
    alert('Error de conexión con el servidor');
  }
}

// 9. Cerrar Sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear(); // Borramos token, rol y nombre
  window.location.href = '/index.html'; // Volvemos al escaparate público
});

// 10. Inicializar: Cargar los espacios al entrar al dashboard
loadEspacios();

