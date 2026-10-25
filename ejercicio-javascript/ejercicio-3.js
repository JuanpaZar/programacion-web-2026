const datos = [
    {
        id: 1,
        titulo: "El impacto de las redes sociales",
        categoria: "Tecnologia",
        vistas: 150,
        likes: 30,
        publicado: true,
        autor: { nombre: "Ana" }
    },
    {
        id: 2,
        titulo: "La importancia de la educacion",
        categoria: "Educacion",
        vistas: 200,
        likes: 45,
        publicado: true,
        autor: { nombre: "Luis" }
    },
    {
        id: 3,
        titulo: "El cambio climatico",
        categoria: "Medio ambiente",
        vistas: 90,
        likes: 15,
        publicado: false,
        autor: null
    },
    {
        id: 4,
        titulo: "La tecnologia en la actualidad",
        categoria: "Tecnologia",
        vistas: 300,
        likes: 60,
        publicado: true,
        autor: { nombre: "Sofia" }
    },
    {
        id: 5,
        titulo: "El acceso a la salud",
        categoria: "Sociedad",
        vistas: 120,
        likes: 25,
        publicado: true,
        autor: null
    }
];

// Lista filtrada
const filtrados = datos.filter(p =>
    p.publicado && (p.autor?.nombre ?? "Sin autor") !== "Sin autor"
);

// Total de vistas
const total = datos.reduce((acc, { vistas }) =>
    acc + (vistas ?? 0), 0
);

// Promedio de vistas
const promedio = datos.length > 0 ? total / datos.length : 0;

// Lista ordenada por vistas
const ordenados = [...datos].sort((a, b) =>
    b.vistas - a.vistas
);

console.log({ filtrados, total, promedio, ordenados });

// Verificar que el arreglo original no cambió
console.log("Arreglo original:", datos);