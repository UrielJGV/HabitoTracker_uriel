
"use strict";

// Arrays principales de la aplicación.
let habitos = [];
let registros = [];

// Guarda un valor en una cookie.
function guardarCookie(nombre, valor) {
    const json = JSON.stringify(valor);
    const contenido = encodeURIComponent(json);

    document.cookie =
        `${nombre}=${contenido}; max-age=31536000; path=/; SameSite=Lax`;
}

// Lee una cookie y recupera su valor original.
function leerCookie(nombre) {
    const prefijo = `${nombre}=`;
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        if (cookie.startsWith(prefijo)) {
            try {
                const contenido = cookie.substring(prefijo.length);
                return JSON.parse(decodeURIComponent(contenido));
            } catch (error) {
                console.error("No se pudo leer la cookie:", nombre, error);
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

// Guarda los dos arrays en sus respectivas cookies.
function guardarTodo() {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
}

// Recupera los datos guardados al iniciar la aplicación.
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

// Inicialización temporal para esta fase.
document.addEventListener("DOMContentLoaded", () => {
    cargarTodo();
    probarCookiesJSON();

    console.log("HábitoTracker iniciado.");
    console.log("Hábitos recuperados:", habitos);
    console.log("Registros recuperados:", registros);
});
