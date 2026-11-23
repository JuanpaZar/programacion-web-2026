export function validarRegistro(datos) {
    const errores = {};
    const ingles = localStorage.getItem("nodo_idioma") === "en";

    if (datos.nombre.trim().length < 2) {
        errores.nombre = ingles ? "Enter a name with at least 2 letters" : "Escribe un nombre de al menos 2 letras";
    }

    else if (datos.nombre.trim().length > 40) {
        errores.nombre = ingles ? "Your name cannot be longer than 40 characters" : "El nombre no puede tener mas de 40 caracteres";
    }

    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(datos.nombre.trim())) {
        errores.nombre = ingles ? "Your name can only contain letters" : "El nombre solo puede contener letras";
    }

    if (!/^\S+@\S+\.\S+$/.test(datos.correo.trim())) {
        errores.correo = ingles ? "Enter a valid email address" : "Escribe un correo valido";
    }

    if (datos.contrasena.length < 6) {
        errores.contrasena = ingles ? "Your password must be at least 6 characters long" : "La contraseña debe tener al menos 6 caracteres";
    }

    if (!datos.tema || datos.tema === "seleccionar") {
        errores.tema = ingles ? "Choose a topic or select No preference" : "Selecciona un tema o la opcion Sin preferencias";
    }

    return errores;
}