
export function validarRegistro(datos) {
    const errores = {};

    if (datos.nombre.trim().length < 2) {
        errores.nombre = "Escribe un nombre valido";
    }

    else if (datos.nombre.trim().length > 40) {
        errores.nombre = "El nombre no puede tener mas de 40 caracteres";
    }

    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(datos.nombre.trim())) {
        errores.nombre = "El nombre solo puede contener letras";
    }

    if (!/^\S+@\S+\.\S+$/.test(datos.correo.trim())) {
        errores.correo = "Escribe un correo valido";
    }

    if (datos.contrasena.length < 6) {
        errores.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    return errores;
}
