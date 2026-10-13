
"use strict";

// ==========================================
// FASE 1: COOKIES Y PERSISTENCIA
// ==========================================

let habitos = [];
let registros = [];

function guardarCookie(nombre, valor) {
    const json = JSON.stringify(valor);
    const contenido = encodeURIComponent(json);

    document.cookie =
        `${nombre}=${contenido}; max-age=31536000; path=/; SameSite=Lax`;
}

function leerCookie(nombre) {
    const prefijo = `${nombre}=`;

    for (const cookie of document.cookie.split("; ")) {
        if (cookie.startsWith(prefijo)) {
            try {
                return JSON.parse(
                    decodeURIComponent(cookie.substring(prefijo.length))
                );
            } catch (error) {
                console.error("Error al leer la cookie:", nombre, error);
                return null;
            }
        }
    }

    return null;
}

function borrarCookie(nombre) {
    document.cookie =
        `${nombre}=; max-age=0; path=/; SameSite=Lax`;
}

function guardarTodo() {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
}

function cargarTodo() {
    const h = leerCookie("habitos");
    const r = leerCookie("registros");

    habitos = Array.isArray(h) ? h : [];
    registros = Array.isArray(r) ? r : [];
}


// ==========================================
// FASE 2: CREACIÓN DE HÁBITOS
// ==========================================

function pintarHabitos() {
    const lista = document.getElementById("listaHabitos");
    lista.innerHTML = "";

    habitos.forEach((habito) => {
        const li = document.createElement("li");
        const titulo = document.createElement("strong");
        const detalle = document.createElement("span");

        titulo.textContent = habito.nombre;
        detalle.textContent =
            ` — ${habito.categoria}: ${habito.descripcion || "Sin descripción"}`;

        li.append(titulo, detalle);
        lista.appendChild(li);
    });
}

function actualizarDesplegable() {
    const selector = document.getElementById("habitoRegistro");
    const anterior = selector.value;

    selector.innerHTML = "";

    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.textContent = habitos.length
        ? "Selecciona un hábito"
        : "Primero crea un hábito";

    selector.appendChild(inicial);

    habitos.forEach((habito) => {
        const opcion = document.createElement("option");
        opcion.value = habito.id;
        opcion.textContent = habito.nombre;
        selector.appendChild(opcion);
    });

    if (habitos.some((h) => h.id === anterior)) {
        selector.value = anterior;
    }
}

function crearHabito(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreHabito").value.trim();
    const descripcion =
        document.getElementById("descripcionHabito").value.trim();
    const categoria = document.getElementById("categoriaHabito").value;

    if (!nombre || !categoria) {
        alert("Escribe el nombre y selecciona una categoría.");
        return;
    }

    habitos.push({
        id: crypto.randomUUID(),
        nombre,
        descripcion,
        categoria
    });

    guardarTodo();
    pintarHabitos();
    actualizarDesplegable();

    document.getElementById("formHabito").reset();
}


// ==========================================
// FASE 3: REGISTRO DE DÍAS
// ==========================================

function crearRegistro(event) {
    event.preventDefault();

    const habitoId = document.getElementById("habitoRegistro").value;
    const fecha = document.getElementById("fechaRegistro").value;
    const observaciones =
        document.getElementById("observacionesRegistro").value.trim();
    const cumplido =
        document.getElementById("cumplidoRegistro").checked;

    if (!habitos.some((h) => h.id === habitoId)) {
        alert("Selecciona un hábito válido.");
        return;
    }

    if (!fecha) {
        alert("Selecciona una fecha.");
        return;
    }

    registros.push({
        id: crypto.randomUUID(),
        habitoId,
        fecha,
        observaciones,
        cumplido
    });

    guardarTodo();
    document.getElementById("formRegistro").reset();
    actualizarDesplegable();

    alert("Registro guardado correctamente.");
}


// ==========================================
// FASE 4: MODAL Y TABLA DE SEGUIMIENTO
// ==========================================

function pintarTabla() {
    const tabla = document.getElementById("tablaRegistros");
    const resumen = document.getElementById("resumenTabla");

    tabla.innerHTML = "";

    let cumplidos = 0;
    let fallados = 0;

    registros.forEach((registro) => {
        const habito = habitos.find(
            (h) => h.id === registro.habitoId
        );

        const fila = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = habito ? habito.nombre : "Hábito eliminado";

        const fecha = document.createElement("td");
        fecha.textContent = registro.fecha;

        const observaciones = document.createElement("td");
        observaciones.textContent = registro.observaciones || "Sin observaciones";

        const estado = document.createElement("td");
        estado.textContent = registro.cumplido ? "✓ Cumplido" : "✗ Fallado";
        estado.className = registro.cumplido
            ? "estado-cumplido"
            : "estado-fallado";

        const accion = document.createElement("td");
        accion.textContent = "Fase 5";

        fila.append(nombre, fecha, observaciones, estado, accion);
        tabla.appendChild(fila);

        if (registro.cumplido) {
            cumplidos++;
        } else {
            fallados++;
        }
    });

    if (registros.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "Todavía no hay registros.";
        fila.appendChild(celda);
        tabla.appendChild(fila);
    }

    resumen.textContent =
        `Total: ${registros.length} | Cumplidos: ${cumplidos} | Fallados: ${fallados}`;
}

function abrirModal() {
    pintarTabla();
    document.getElementById("modalSeguimiento").classList.remove("oculto");
}

function cerrarModal() {
    document.getElementById("modalSeguimiento").classList.add("oculto");
}


// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    cargarTodo();

    document.getElementById("formHabito")
        .addEventListener("submit", crearHabito);

    document.getElementById("formRegistro")
        .addEventListener("submit", crearRegistro);

    document.getElementById("abrirSeguimiento")
        .addEventListener("click", (event) => {
            event.preventDefault();
            abrirModal();
        });

    document.getElementById("cerrarSeguimiento")
        .addEventListener("click", cerrarModal);

    document.getElementById("modalSeguimiento")
        .addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                cerrarModal();
            }
        });

    pintarHabitos();
    actualizarDesplegable();

    console.log("HábitoTracker iniciado.");
    console.log("Hábitos:", habitos);
    console.log("Registros:", registros);
});