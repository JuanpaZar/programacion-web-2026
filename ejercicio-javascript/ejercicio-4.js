const articulo = {
    titulo: "Redes socaiels",

    mostrarTitulo: function() {
        console.log(this.titulo);
    },

    mostrarConFlecha: () => {
        console.log(this.titulo);
    }
};

articulo.mostrarTitulo();
articulo.mostrarConFlecha();