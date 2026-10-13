
"use strict";

// ==========================================
// FASE 1: DATOS Y COOKIES JSON
// ==========================================

// Array de hábitos y array de registros.
let habitos = [];
let registros = [];

// Guarda cualquier valor en una cookie como JSON.
function guardarCookie(nombre, valor) {
    const json = JSON.stringify(valor);
    const contenido = encodeURIComponent(json);

    document.cookie =
        `${nombre}=${contenido}; max-age=31536000; path=/; SameSite=Lax`;
}

// Lee una cookie y convierte su contenido JSON en un objeto.
function leerCookie(nombre) {
    const prefijo = `${nombre}=`;

    for (const cookie of document.cookie.split("; ")) {
        if (cookie.startsWith(prefijo)) {
            try {
                const contenido = cookie.substring(prefijo.length);
                return JSON.parse(decodeURIComponent(contenido));
            } catch (error) {
                console.error("Error al leer la cookie:", nombre, error);
                return null;
            }
        }
    }

    return null;
}

// Elimina una cookie.
function borrarCookie(nombre) {
    document.cookie =
        `${nombre}=; max-age=0; path=/; SameSite=Lax`;
}

// Guarda los dos arrays.
function guardarTodo() {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
}

// Recupera los dos arrays al iniciar la aplicación.
function cargarTodo() {
    const habitosGuardados = leerCookie("habitos");
    const registrosGuardados = leerCookie("registros");

    habitos = Array.isArray(habitosGuardados)
        ? habitosGuardados
        : [];

    registros = Array.isArray(registrosGuardados)
        ? registrosGuardados
        : [];
}

// Prueba inicial del almacenamiento JSON.
function probarCookiesJSON() {
    const prueba = [
        {
            id: "prueba-1",
            nombre: "Leer",
            descripcion: "Leer durante 20 minutos",
            categoria: "Estudio"
        }
    ];

    guardarCookie("pruebaJSON", prueba);
    const recuperado = leerCookie("pruebaJSON");

    console.log("Array original:", prueba);
    console.log("Array recuperado:", recuperado);
    console.log(
        "¿Se recuperó correctamente?",
        JSON.stringify(prueba) === JSON.stringify(recuperado)
    );

    borrarCookie("pruebaJSON");
}


// ==========================================
// FASE 2: MOSTRAR Y CREAR HÁBITOS
// ==========================================

// Genera la lista de hábitos en la página.
function pintarHabitos() {
    const lista = document.getElementById("listaHabitos");
    lista.innerHTML = "";

    habitos.forEach((habito) => {
        const li = document.createElement("li");

        const titulo = document.createElement("strong");
        titulo.textContent = habito.nombre;

        const detalle = document.createElement("span");
        detalle.textContent =
            ` — ${habito.categoria}: ${habito.descripcion || "Sin descripción"}`;

        li.append(titulo, detalle);
        lista.appendChild(li);
    });
}

// Actualiza el desplegable de hábitos del formulario de registros.
function actualizarDesplegable() {
    const selector = document.getElementById("habitoRegistro");
    const seleccionAnterior = selector.value;

    selector.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";

    if (habitos.length === 0) {
        opcionInicial.textContent = "Primero crea un hábito";
        selector.appendChild(opcionInicial);
        return;
    }

    opcionInicial.textContent = "Selecciona un hábito";
    selector.appendChild(opcionInicial);

    habitos.forEach((habito) => {
        const opcion = document.createElement("option");
        opcion.value = habito.id;
        opcion.textContent = habito.nombre;
        selector.appendChild(opcion);
    });

    if (habitos.some((habito) => habito.id === seleccionAnterior)) {
        selector.value = seleccionAnterior;
    }
}

// Crea un hábito al enviar el formulario.
function crearHabito(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreHabito").value.trim();
    const descripcion =
        document.getElementById("descripcionHabito").value.trim();
    const categoria = document.getElementById("categoriaHabito").value;

    if (!nombre) {
        alert("Escribe el nombre del hábito.");
        document.getElementById("nombreHabito").focus();
        return;
    }

    if (!categoria) {
        alert("Selecciona una categoría.");
        document.getElementById("categoriaHabito").focus();
        return;
    }

    const nuevoHabito = {
        id: crypto.randomUUID(),
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria
    };

    habitos.push(nuevoHabito);

    guardarTodo();
    pintarHabitos();
    actualizarDesplegable();

    document.getElementById("formHabito").reset();

    alert("Hábito creado correctamente.");
}


// ==========================================
// FASE 3: REGISTRAR LOS DÍAS
// ==========================================

// Crea un registro asociado a un hábito mediante habitoId.
function crearRegistro(event) {
    event.preventDefault();

    const habitoId = document.getElementById("habitoRegistro").value;
    const fecha = document.getElementById("fechaRegistro").value;
    const observaciones =
        document.getElementById("observacionesRegistro").value.trim();
    const cumplido =
        document.getElementById("cumplidoRegistro").checked;

    if (!habitoId || !habitos.some((habito) => habito.id === habitoId)) {
        alert("Selecciona un hábito válido.");
        return;
    }

    if (!fecha) {
        alert("Selecciona una fecha.");
        document.getElementById("fechaRegistro").focus();
        return;
    }

    const nuevoRegistro = {
        id: crypto.randomUUID(),
        habitoId: habitoId,
        fecha: fecha,
        observaciones: observaciones,
        cumplido: cumplido
    };

    registros.push(nuevoRegistro);

    guardarTodo();

    document.getElementById("formRegistro").reset();
    actualizarDesplegable();

    alert("Registro guardado correctamente.");

    console.log("Registros guardados:", registros);
}


// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Recuperamos los datos guardados.
    cargarTodo();

    // Conectamos los formularios con sus funciones.
    document.getElementById("formHabito")
        .addEventListener("submit", crearHabito);

    document.getElementById("formRegistro")
        .addEventListener("submit", crearRegistro);

    // Mostramos los datos recuperados.
    pintarHabitos();
    actualizarDesplegable();

    // Comprobamos el almacenamiento JSON.
    probarCookiesJSON();

    console.log("HábitoTracker iniciado.");
    console.log("Hábitos recuperados:", habitos);
    console.log("Registros recuperados:", registros);
});