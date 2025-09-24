const API_URL = "Ruta Api";

async function cargarTareas() {
  const res = await fetch(API_URL);
  const tareas = await res.json();

  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";
  tareas.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.nombre;
    lista.appendChild(li);
  });
}

async function agregarTarea() {
  const input = document.getElementById("nuevaTarea");
  const nombre = input.value;

  if (!nombre) return;

  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nombre })
  });

  input.value = "";
  cargarTareas();
}

cargarTareas();
