const API = new URL('../../api/propuestas.php', import.meta.url);

export function iniciarPropuestas() {
    const formulario = document.getElementById('form-sugerencias');
    const lista = document.getElementById('lista-propuestas');
    const estado = document.getElementById('estado-propuestas');
    const mensaje = document.getElementById('mensaje-sugerencia');

    if (!formulario || !lista || !estado || !mensaje) return;

    const textos = {
        es: {
            cargando: 'Cargando propuestas...',
            vacio: 'Todavía no hay propuestas.',
            error: 'No se pudieron cargar las propuestas.',
            guardada: 'Propuesta enviada correctamente.',
            invalida: 'Escribe un tema (mínimo 3 caracteres) y una descripción (mínimo 10).',
            enviando: 'Enviando propuesta...',
            errorEnvio: 'No se pudo enviar la propuesta.',
            tituloLista: 'Propuestas de la comunidad',
            tema: 'Tema',
            descripcion: 'Tu propuesta',
            enviar: 'Enviar propuesta',
            pregunta: '¿Hay algún tema del que te gustaría que habláramos?',
            encabezado: '¿Sobre qué te gustaría leer?',
            placeholderTema: 'Ej. El costo de la vivienda',
            placeholderDescripcion: 'Escribe tu idea...'
        },
        en: {
            cargando: 'Loading suggestions...',
            vacio: 'There are no suggestions yet.',
            error: 'Could not load suggestions.',
            guardada: 'Suggestion submitted successfully.',
            invalida: 'Enter a topic (at least 3 characters) and a description (at least 10).',
            enviando: 'Submitting suggestion...',
            errorEnvio: 'Could not submit the suggestion.',
            tituloLista: 'Community suggestions',
            tema: 'Topic',
            descripcion: 'Your suggestion',
            enviar: 'Submit suggestion',
            pregunta: 'Is there a topic you would like us to discuss?',
            encabezado: 'What would you like to read about?',
            placeholderTema: 'E.g. The cost of housing',
            placeholderDescripcion: 'Write your idea...'
        }
    };

    let propuestas = [];
    let estadoActual = 'cargando';
    let mensajeActual = '';

    const seccion = formulario.closest('.sugerencias');
    const encabezado = seccion?.querySelector('h2');
    const pregunta = seccion?.querySelector('h2 + p');
    const tituloLista = document.getElementById('titulo-propuestas');
    const labelTema = formulario.querySelector('label[for="propuesta-tema"]');
    const labelDescripcion = formulario.querySelector('label[for="sugerencia-tema"]');
    const campoTema = document.getElementById('propuesta-tema');
    const campoDescripcion = document.getElementById('sugerencia-tema');
    const botonEnviar = formulario.querySelector('button[type="submit"]');

    function idiomaActual() {
        return localStorage.getItem('nodo_idioma') === 'en'
            ? 'en'
            : 'es';
    }

    function mostrarLista() {
        const t = textos[idiomaActual()];
        lista.replaceChildren();

        propuestas.forEach(function (propuesta) {
            const articulo = document.createElement('article');
            articulo.className = 'propuesta-tarjeta';

            const titulo = document.createElement('h3');
            titulo.textContent = propuesta.tema;

            const descripcion = document.createElement('p');
            descripcion.textContent = propuesta.descripcion;

            const fecha = document.createElement('small');
            fecha.textContent = propuesta.fecha;

            articulo.append(titulo, descripcion, fecha);
            lista.append(articulo);
        });

        estado.textContent = estadoActual === 'lista'
            ? (propuestas.length ? '' : t.vacio)
            : t[estadoActual];

        mensaje.textContent = mensajeActual ? t[mensajeActual] : '';

        if (tituloLista) tituloLista.textContent = t.tituloLista;
        if (encabezado) encabezado.textContent = t.encabezado;
        if (pregunta) pregunta.textContent = t.pregunta;
        if (labelTema) labelTema.textContent = t.tema;
        if (labelDescripcion) labelDescripcion.textContent = t.descripcion;
        if (botonEnviar) botonEnviar.textContent = t.enviar;
        if (campoTema) campoTema.placeholder = t.placeholderTema;
        if (campoDescripcion) campoDescripcion.placeholder = t.placeholderDescripcion;
    }

    async function cargar() {
        estadoActual = 'cargando';
        mostrarLista();

        try {
            const respuesta = await fetch(API);

            if (!respuesta.ok) {
                throw new Error('HTTP ' + respuesta.status);
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error('Respuesta inválida');
            }

            propuestas = datos;
            estadoActual = 'lista';

        } catch (error) {
            console.error(error);
            estadoActual = 'error';
        }

        mostrarLista();
    }

    formulario.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        const tema = campoTema.value.trim();
        const descripcion = campoDescripcion.value.trim();

        if (tema.length < 3 || descripcion.length < 10) {
            mensajeActual = 'invalida';
            mostrarLista();
            return;
        }

        mensajeActual = 'enviando';
        mostrarLista();
        botonEnviar.disabled = true;

        try {
            const respuesta = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tema, descripcion })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'HTTP ' + respuesta.status);
            }

formulario.reset();

await cargar();

mensajeActual = 'guardada';
mostrarLista();

        } catch (error) {
            console.error(error);
            mensajeActual = 'errorEnvio';

        } finally {
            botonEnviar.disabled = false;
            mostrarLista();
        }
    });

    document.addEventListener('click', function (evento) {
        if (evento.target.closest('#boton-idioma')) {
            queueMicrotask(mostrarLista);
        }
    });

    cargar();
}