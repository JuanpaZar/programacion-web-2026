import { actualizarFavoritos, leerFavoritos } from "./favoritos.js";
import { leerReacciones } from "./reacciones.js";


export async function iniciarArticulos() {
    const lista = document.getElementById("lista-articulos");
    const listaMeGustaron = document.getElementById("lista-me-gustaron");

    if (!lista && !listaMeGustaron) {
        return;
    }

    const estado = document.getElementById("estado-articulos");
    const estadoMeGustaron = document.getElementById("estado-me-gustaron");

    const soloFavoritos = lista && lista.dataset.soloFavoritos === "true";

    if (estado) {
        estado.textContent = soloFavoritos
            ? "Cargando favoritos..."
            : "Cargando artículos...";
    }

    if (estadoMeGustaron) {
        estadoMeGustaron.textContent = "Cargando artículos que te gustaron...";
    }

    try {
        const respuesta = await fetch("../assets/data/articulos.json");

        if (!respuesta.ok) {
            throw new Error("Error al cargar los artículos");
        }

        const articulos = await respuesta.json();

        if (!Array.isArray(articulos)) {
            throw new Error("Los datos no son validos");
        }


        function crearTarjeta(articulo) {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("articulos__tarjeta");

            const categoria = document.createElement("p");
            categoria.classList.add("articulos__categoria");

            const textoCategoria = document.createElement("strong");
            textoCategoria.textContent = articulo.categoria;
            categoria.append(textoCategoria);

            tarjeta.append(categoria);

            if (articulo.imagen) {
                const imagen = document.createElement("img");
                imagen.classList.add("articulos__imagen");
                imagen.src = articulo.imagen;
                imagen.alt = articulo.alt;
                imagen.loading = "lazy";

                tarjeta.append(imagen);
            } else {
                const portada = document.createElement("div");
                portada.classList.add("articulos__imagen-texto");
                portada.textContent = articulo.portada;

                tarjeta.append(portada);
            }

            const titulo = document.createElement("h3");
            titulo.classList.add("articulos__titulo");
            titulo.textContent = articulo.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = articulo.descripcion;

            const autor = document.createElement("small");
            autor.textContent = articulo.autor;

            const favorito = document.createElement("button");
            favorito.type = "button";
            favorito.classList.add("boton-favorito");
            favorito.dataset.favorito = String(articulo.id);
            favorito.setAttribute("aria-pressed", "false");
            favorito.setAttribute("aria-label", "Guardar " + articulo.titulo);

            const enlace = document.createElement("a");
            enlace.classList.add("boton");
            enlace.href = articulo.enlace;
            enlace.textContent = "Leer artículo";

            tarjeta.append(titulo, descripcion, autor, favorito, enlace);

            return tarjeta;
        }


        function mostrarArticulos() {
            const favoritos = leerFavoritos();
            const reacciones = leerReacciones();

            if (lista) {
                lista.replaceChildren();

                const articulosVisibles = soloFavoritos
                    ? articulos.filter(function (articulo) {
                        return favoritos.includes(String(articulo.id));
                    })
                    : articulos;

                articulosVisibles.forEach(function (articulo) {
                    lista.append(crearTarjeta(articulo));
                });

                if (estado) {
                    if (soloFavoritos) {
                        estado.textContent = articulosVisibles.length === 0
                            ? "Todavía no tienes artículos guardados."
                            : "";
                    } else {
                        estado.textContent = articulosVisibles.length === 0
                            ? "No hay artículos disponibles."
                            : "";
                    }
                }
            }

            if (listaMeGustaron) {
                listaMeGustaron.replaceChildren();

                const articulosGustados = articulos.filter(function (articulo) {
                    const reaccion = reacciones[String(articulo.id)];

                    return reaccion === "encanta" || reaccion === "gusta";
                });

                articulosGustados.forEach(function (articulo) {
                    listaMeGustaron.append(crearTarjeta(articulo));
                });

                if (estadoMeGustaron) {
estadoMeGustaron.textContent = articulosGustados.length === 0
    ? "Aquí aparecerán los artículos que te gusten."
    : "";
                }
            }

            actualizarFavoritos();

            const buscador = document.getElementById("buscador-articulos");

            if (buscador) {
                buscador.dispatchEvent(new Event("input"));
            }
        }


        mostrarArticulos();

        if (soloFavoritos) {
            document.addEventListener("favoritos-actualizados", mostrarArticulos);
            document.addEventListener("reacciones-actualizadas", mostrarArticulos);
        }

    } catch (error) {
        console.error(error);

        if (estado) {
            estado.textContent = "No se pudieron cargar los artículos.";
        }

        if (estadoMeGustaron) {
            estadoMeGustaron.textContent = "No se pudieron cargar los artículos que te gustaron.";
        }
    }
}