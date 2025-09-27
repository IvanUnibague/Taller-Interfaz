const API_PROJECTS = "https://taller-api-0w81.onrender.com/api/projects/";
const API_TASKS = "https://taller-api-0w81.onrender.com/Tareas/api/tareas/";

// --------- Navegación entre pestañas ---------
document.getElementById("tab-projects").addEventListener("click", () => {
  document.getElementById("section-projects").classList.add("active");
  document.getElementById("section-tasks").classList.remove("active");
  document.getElementById("tab-projects").classList.add("active");
  document.getElementById("tab-tasks").classList.remove("active");
});

document.getElementById("tab-tasks").addEventListener("click", () => {
  document.getElementById("section-tasks").classList.add("active");
  document.getElementById("section-projects").classList.remove("active");
  document.getElementById("tab-tasks").classList.add("active");
  document.getElementById("tab-projects").classList.remove("active");
});

// --------- Proyectos ---------
async function fetchProjects() {
  const res = await fetch(API_PROJECTS);
  const data = await res.json();
  renderProjects(data);
}

function renderProjects(projects) {
  const container = document.getElementById("proj-projects");
  container.innerHTML = "";
  projects.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description || ""}</p>
      <p><strong>Tecnologías:</strong> ${p.technologies || "-"}</p>
      <p><small>Creado: ${p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</small></p>
      <p><small>Última actualización: ${p.updated_at ? new Date(p.updated_at).toLocaleString() : "-"}</small></p>
      <div class="actions">
        <button class="edit-btn" data-id="${p.id}" data-title="${p.title}" data-description="${p.description}" data-technologies="${p.technologies}">Editar</button>
        <button class="delete-btn" data-id="${p.id}">Eliminar</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => openEditModal(btn.dataset))
  );

  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => deleteProject(btn.dataset.id))
  );
}

// Crear proyecto
document.getElementById("project-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newProj = {
    title: document.getElementById("proj-title").value,
    description: document.getElementById("proj-description").value,
    technologies: document.getElementById("proj-technologies").value,
  };

  const res = await fetch(API_PROJECTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProj),
  });

  if (res.ok) {
    document.getElementById("proj-message").textContent = "Proyecto creado ";
    fetchProjects();
    e.target.reset();
  } else {
    document.getElementById("proj-message").textContent = "Error al crear proyecto";
  }
});

document.getElementById("proj-refresh-btn").addEventListener("click", fetchProjects);

// --------- Modal actualización ---------
const modal = document.createElement("div");
modal.id = "edit-modal";
modal.className = "modal hidden";
modal.innerHTML = `
  <div class="modal-content">
    <h3>Editar Proyecto</h3>
    <form id="edit-form">
      <label>Título <input type="text" id="edit-title" required /></label>
      <label>Descripción <textarea id="edit-description"></textarea></label>
      <label>Tecnologías <input type="text" id="edit-technologies" /></label>
      <div class="actions">
        <button type="submit">Actualizar</button>
        <button type="button" id="edit-cancel">Cancelar</button>
      </div>
    </form>
  </div>
`;
document.body.appendChild(modal);

let currentProjectId = null;

function openEditModal(data) {
  currentProjectId = data.id;
  document.getElementById("edit-title").value = data.title;
  document.getElementById("edit-description").value = data.description;
  document.getElementById("edit-technologies").value = data.technologies;
  modal.classList.remove("hidden");
}

document.getElementById("edit-cancel").addEventListener("click", () => {
  modal.classList.add("hidden");
});

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const updatedProj = {
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    technologies: document.getElementById("edit-technologies").value,
  };

  const res = await fetch(`${API_PROJECTS}${currentProjectId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProj),
  });

  if (res.ok) {
    modal.classList.add("hidden");
    fetchProjects();
  } else {
    alert("Error al actualizar el proyecto ");
  }
});

// Eliminar proyecto
async function deleteProject(id) {
  if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
  const res = await fetch(`${API_PROJECTS}${id}/`, { method: "DELETE" });
  if (res.ok) {
    fetchProjects();
  } else {
    alert("Error al eliminar proyecto");
  }
}

// --------- Tareas ---------
async function fetchTasks() {
  const res = await fetch(API_TASKS);
  const data = await res.json();
  renderTasks(data);
}

function renderTasks(tasks) {
  const container = document.getElementById("task-tasks");
  container.innerHTML = "";
  tasks.forEach((t) => {
    const card = document.createElement("div");
    card.className = "card";

    let completadaHtml = "";
    if (t.completada === false) {
      completadaHtml = `<button class="complete-btn" data-id="${t.id}">Marcar completada</button>`;
    } else {
      completadaHtml = `<span class="badge">Completada</span>`;
    }

    card.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>${t.descripcion || ""}</p>
      <p><strong>Creada:</strong> ${t.fecha_creacion ? new Date(t.fecha_creacion).toLocaleString() : "-"}</p>
      <p><strong>Fecha límite:</strong> ${t.fecha_limite ? new Date(t.fecha_limite).toLocaleString() : "-"}</p>
      <p><strong>Prioridad:</strong> ${t.prioridad || "-"}</p>
      <p><strong>Categoría:</strong> ${t.categoria || "-"}</p>
      <div class="actions">
        ${completadaHtml}
        <button class="delete-task-btn" data-id="${t.id}">Eliminar</button>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".complete-btn").forEach((btn) =>
    btn.addEventListener("click", () => markTaskCompleted(btn.dataset.id))
  );

  document.querySelectorAll(".delete-task-btn").forEach((btn) =>
    btn.addEventListener("click", () => deleteTask(btn.dataset.id))
  );
}

// Crear tarea
document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTask = {
    titulo: document.getElementById("task-titulo").value,
    descripcion: document.getElementById("task-descripcion").value,
    completada: document.getElementById("task-completada").value === "true",
    fecha_limite: document.getElementById("task-fecha_limite").value,
    prioridad: document.getElementById("task-prioridad").value,
    categoria: document.getElementById("task-categoria").value,
  };

  const res = await fetch(API_TASKS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  if (res.ok) {
    document.getElementById("task-message").textContent = "Tarea creada";
    fetchTasks();
    e.target.reset();
  } else {
    document.getElementById("task-message").textContent = "Error al crear tarea";
  }
});

document.getElementById("task-refresh-btn").addEventListener("click", fetchTasks);

// Marcar tarea como completada
async function markTaskCompleted(id) {
  await fetch(`${API_TASKS}${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completada: true }),
  });
  fetchTasks();
}

// Eliminar tarea
async function deleteTask(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
  const res = await fetch(`${API_TASKS}${id}/`, { method: "DELETE" });
  if (res.ok) {
    fetchTasks();
  } else {
    alert("Error al eliminar tarea");
  }
}

fetchProjects();
fetchTasks();
