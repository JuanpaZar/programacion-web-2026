
import { validarRegistro } from "./validaciones.js";

export function iniciarFormulario() {
    const formulario = document.getElementById("form-registro");

    if (!formulario) {
        return;
    }

    const mensaje = document.getElementById("mensaje-registro");

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const datos = Object.fromEntries(new FormData(formulario));
        const errores = validarRegistro(datos);

        const camposError = formulario.querySelectorAll(".error-campo");

        camposError.forEach(function (campo) {
            campo.textContent = "";
        });

        formulario.querySelectorAll(".invalido").forEach(function (campo) {
            campo.classList.remove("invalido");
        });

        mensaje.textContent = "";

        if (Object.keys(errores).length > 0) {
            Object.keys(errores).forEach(function (nombre) {
                const campoError = formulario.querySelector('[data-error-para="' + nombre + '"]');
                const campo = formulario.elements[nombre];

                campoError.textContent = errores[nombre];
                campo.classList.add("invalido");
            });

            return;
        }

        mensaje.textContent = "Cuenta creada.";
        formulario.reset();
    });


    formulario.addEventListener("input", function (e) {
        const campo = e.target;
        const campoError = formulario.querySelector('[data-error-para="' + campo.name + '"]');

        if (campoError) {
            campoError.textContent = "";
            campo.classList.remove("invalido");
        }

        mensaje.textContent = "";
    });
}
