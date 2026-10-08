import "./style.css"
const API_URL = import.meta.env.VITE_API_URL;

const container = document.getElementById('espacios-container');

async function loadEspaciosPublicos() {
  try {
    // ¡OJO! No le pasamos el Token. Es una petición pública.
    const response = await fetch(`${API_URL}/espacios`);
    const espacios = await response.json();
    
    container.innerHTML = '';

    espacios.forEach(espacio => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const statusText = espacio.disponible ? 'Abierto' : 'Cerrado';
      const statusClass = espacio.disponible ? 'status' : 'status cerrado';

      card.innerHTML = `
        <h3>${espacio.nombre}</h3>
        <p><strong>Tipo:</strong> ${espacio.tipo}</p>
        <p><strong>Ubicación:</strong> ${espacio.ubicacion}</p>
        <p><strong>Estado:</strong> <span class="${statusClass}">${statusText}</span></p>
        ${espacio.disponible ? '<p style="color:#27ae60; font-weight:bold;">Inicia sesión para reservar</p>' : ''}
      `;

      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = '<p style="color:red;">Error al conectar con el Ayuntamiento.</p>';
  }
}

// Cargamos los espacios al entrar en la web
loadEspaciosPublicos();
