// URL de la API
const API_URL = 'https://taller-api-0w81.onrender.com/Tareas/api/tareas/';

const formTarea = document.getElementById('form-tarea');
const listaTareas = document.getElementById('lista-tareas');

// Obtener y mostrar tareas
async function obtenerTareas() {
  try {
    const respuesta = await fetch(API_URL);
    const tareas = await respuesta.json();
    listaTareas.innerHTML = '';
    tareas.forEach(t => {
      const li = document.createElement('li');

      // Construimos la tarjeta con todos los datos
      const info = document.createElement('div');
      info.classList.add('info');
      info.innerHTML = `
        <h3>${t.titulo}</h3>
        <p class="descripcion">${t.descripcion || 'Sin descripción'}</p>
        <p><strong>Categoría:</strong> ${t.categoria || 'Sin categoría'} | <strong>Prioridad:</strong> ${t.prioridad}</p>
        <p><strong>Creado:</strong> ${new Date(t.fecha_creacion).toLocaleString()}<br>
        <strong>Fecha límite:</strong> ${t.fecha_limite ? new Date(t.fecha_limite).toLocaleString() : 'No asignada'}</p>
        <p class="estado"><strong>Estado:</strong> ${t.completada ? '✔ Finalizado' : '⏳ Pendiente'}</p>
      `;
      li.appendChild(info);

      // Botón completar/incompletar
      const btn = document.createElement('button');
      btn.textContent = t.completada ? 'Marcar pendiente' : 'Marcar completada';
      btn.classList.add('btn-completar');
      btn.addEventListener('click', () => toggleCompletada(t.id, !t.completada));
      li.appendChild(btn);

      listaTareas.appendChild(li);
    });
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
  }
}


// Agregar tarea
formTarea.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevaTarea = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    fecha_limite: document.getElementById('fecha_limite').value || null,
    prioridad: parseInt(document.getElementById('prioridad').value) || 0,
    categoria: document.getElementById('categoria').value
  };
  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaTarea)
    });
    if (respuesta.ok) {
      formTarea.reset();
      obtenerTareas();
    } else {
      console.error('Error al agregar tarea', await respuesta.json());
    }
  } catch (error) {
    console.error('Error al agregar tarea:', error);
  }
});

// Marcar completada/incompleta
async function toggleCompletada(id, nuevoEstado) {
  try {
    const respuesta = await fetch(`${API_URL}${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada: nuevoEstado })
    });
    if (respuesta.ok) {
      obtenerTareas();
    } else {
      console.error('Error al actualizar', await respuesta.json());
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
  }
}

// Cargar tareas al inicio
obtenerTareas();
