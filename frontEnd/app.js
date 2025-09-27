const API_URL = 'https://taller-api-0w81.onrender.com/Tareas/api/tareas/';
const formTarea = document.getElementById('form-tarea');
const listaTareas = document.getElementById('lista-tareas');

// --- Render ---
function renderTareas(tareas) {
  listaTareas.innerHTML = '';

  tareas.forEach(tarea => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${tarea.titulo}</h3>
      <p class="descripcion">${tarea.descripcion || 'Sin descripción'}</p>
      <p><strong>Categoría:</strong> ${tarea.categoria} | 
        <strong>Prioridad:</strong> ${tarea.prioridad}</p>
      <p><strong>Creado:</strong> ${new Date(tarea.fecha_creacion).toLocaleString()}<br>
        <strong>Fecha límite:</strong> ${tarea.fecha_limite ? new Date(tarea.fecha_limite).toLocaleString() : 'Sin fecha'}</p>
      <p><strong>Estado:</strong> ${tarea.completada ? '✔ Finalizada' : 'Pendiente'}</p>
      <button onclick="toggleCompletada(${tarea.id}, ${tarea.completada})">
        ${tarea.completada ? 'Marcar pendiente' : 'Marcar completada'}
      </button>
      <button onclick="eliminarTarea(${tarea.id})">🗑 Eliminar</button>
    `;

    listaTareas.appendChild(card);
  });
}

// --- CRUD ---
async function cargarTareas() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderTareas(data);
}

async function toggleCompletada(id, completada) {
  await fetch(`${API_URL}${id}/`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ completada: !completada }),
  });
  cargarTareas();
}

async function eliminarTarea(id) {
  if (confirm('¿Seguro que quieres eliminar esta tarea?')) {
    await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
    cargarTareas();
  }
}

// --- Crear ---
formTarea.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevaTarea = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    fecha_limite: document.getElementById('fecha_limite').value || null,
    prioridad: parseInt(document.getElementById('prioridad').value) || 0,
    categoria: document.getElementById('categoria').value
  };
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaTarea)
  });
  formTarea.reset();
  cargarTareas();
});

// --- Al iniciar ---
document.addEventListener('DOMContentLoaded', cargarTareas);
