
document.addEventListener("DOMContentLoaded", function () {

    /* MENu*/

    const botonMenu = document.getElementById("boton-menu");
    const menu = document.querySelector(".menu");

    if (botonMenu && menu) {
        botonMenu.addEventListener("click", function () {
            menu.classList.toggle("menu--abierto");

            const abierto = menu.classList.contains("menu--abierto");
            botonMenu.setAttribute("aria-expanded", String(abierto));
        });
    }


    /* MODO  */

    const botonTema = document.getElementById("boton-tema");

    if (botonTema) {
        botonTema.addEventListener("click", function () {

            if (document.body.classList.contains("tema-oscuro")) {
                document.body.classList.remove("tema-oscuro");
                document.body.classList.add("tema-claro");
            } else {
                document.body.classList.remove("tema-claro");
                document.body.classList.add("tema-oscuro");
            }

        });
    }


    const buscador = document.getElementById("buscador-articulos");
    const tarjetas = document.querySelectorAll(".articulos__tarjeta");

    if (buscador) {
        buscador.addEventListener("input", function () {

            const texto = buscador.value.trim().toLowerCase();

            tarjetas.forEach(function (tarjeta) {

                const contenido = tarjeta.textContent.toLowerCase();

                if (contenido.includes(texto)) {
                    tarjeta.classList.remove("oculto");
                } else {
                    tarjeta.classList.add("oculto");
                }

            });

        });
    }

});
