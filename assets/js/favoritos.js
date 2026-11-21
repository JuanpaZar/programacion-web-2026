const claveFavoritos = "nodo_favoritos";

export function leerFavoritos() {
    try {
        const favoritos = JSON.parse(localStorage.getItem(claveFavoritos));

        return Array.isArray(favoritos) ? favoritos : [];
    } catch (error) {
        console.error("No se pudieron leer los favoritos", error);
        return [];
    }
}


function guardarFavoritos(favoritos) {
    try {
        localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
    } catch (error) {
        console.error("No se pudieron guardar los favoritos", error);
    }
}


export function actualizarFavoritos() {
    const favoritos = leerFavoritos();
    const botones = document.querySelectorAll(".boton-favorito");

    botones.forEach(function (boton) {
        const id = boton.dataset.favorito;
        const guardado = favoritos.includes(id);

        boton.textContent = guardado ? "♥ Guardado" : "♡ Guardar";
        boton.classList.toggle("activo", guardado);
        boton.setAttribute("aria-pressed", String(guardado));
    });
}


export function iniciarFavoritos() {
    actualizarFavoritos();

    document.addEventListener("click", function (e) {
        const boton = e.target.closest(".boton-favorito");

        if (!boton) {
            return;
        }

        const id = boton.dataset.favorito;
        let favoritos = leerFavoritos();

        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(function (favorito) {
                return favorito !== id;
            });
        } else {
            favoritos.push(id);
        }

        guardarFavoritos(favoritos);
        actualizarFavoritos();

        document.dispatchEvent(new Event("favoritos-actualizados"));
    });
}