(function () {
    document.addEventListener("DOMContentLoaded", function () {
        cargarRecetas();

        function cargarRecetas() {
            const recetasContainer = document.getElementById("recetas-container");
            const recetas = JSON.parse(localStorage.getItem("recetas")) || [];

            recetasContainer.innerHTML = "";

            recetas.forEach(receta => {
                mostrarReceta(resumenReceta(receta));
            });
        }

        function mostrarReceta(receta) {
            const recetasContainer = document.getElementById("recetas-container");

            const recetaElement = document.createElement("div");
            recetaElement.classList.add("receta");
            recetaElement.innerHTML = `
                <h3>${receta.nombre}</h3>
                <div class="descripcion" style="display: none;">
                    <p><strong>Ingredientes:</strong> ${receta.ingredientes}</p>
                    <p><strong>Preparación:</strong> ${receta.preparacion}</p>
                </div>
                <button onclick="abrirReceta(${receta.id})">Abrir Receta</button>
                <button onclick="editarReceta(${receta.id})">Editar</button>
                <button onclick="eliminarReceta(${receta.id})">Eliminar</button>
            `;

            recetasContainer.appendChild(recetaElement);
        }

        function resumenReceta(receta) {
            return {
                id: receta.id,
                nombre: receta.nombre,
                ingredientes: obtenerResumen(receta.ingredientes, 20),
                preparacion: obtenerResumen(receta.preparacion, 20)
            };
        }

        function obtenerResumen(texto, cantidadPalabras) {
            const palabras = texto.split(' ');
            const resumen = palabras.slice(0, cantidadPalabras).join(' ');
            return resumen;
        }

        window.editarReceta = function (id) {
            const receta = obtenerRecetaPorId(id);

            if (receta) {
                llenarFormulario(receta, "Guardar Edición", function () {
                    guardarEdicion(id);
                });
            }
        };

        window.eliminarReceta = function (id) {
            const confirmacion = confirm("¿Estás seguro de eliminar esta receta?");
            if (confirmacion) {
                const nuevasRecetas = obtenerRecetas().filter(receta => receta.id !== id);
                guardarRecetas(nuevasRecetas);
                cargarRecetas();
            }
        };

        window.abrirReceta = function (id) {
            const receta = obtenerRecetaPorId(id);

            if (receta) {
                const modal = document.getElementById("receta-modal");
                const modalContent = document.getElementById("receta-modal-content");

                modalContent.innerHTML = `
                    <h3>${receta.nombre}</h3>
                    <p><strong>Ingredientes:</strong> ${receta.ingredientes}</p>
                    <p><strong>Preparación:</strong> ${receta.preparacion}</p>
                `;

                modal.style.display = "block";
            }
        };

        function llenarFormulario(receta, btnText, btnFunction) {
            document.getElementById("nombre").value = receta.nombre || "";
            document.getElementById("ingredientes").value = receta.ingredientes || "";
            document.getElementById("preparacion").value = receta.preparacion || "";

            document.getElementById("guardarBtn").innerHTML = btnText;
            document.getElementById("guardarBtn").onclick = btnFunction;

            // Mostrar el formulario y ocultar el contenedor de recetas
            document.getElementById("formulario").style.display = "block";
            document.getElementById("recetas-container").style.display = "none";
        }

        function guardarEdicion(id) {
            const nombre = document.getElementById("nombre").value;
            const ingredientes = document.getElementById("ingredientes").value;
            const preparacion = document.getElementById("preparacion").value;

            const nuevasRecetas = obtenerRecetas().map(receta => {
                if (receta.id === id) {
                    return {
                        id,
                        nombre,
                        ingredientes,
                        preparacion
                    };
                }
                return receta;
            });

            guardarRecetas(nuevasRecetas);
            cargarRecetas();
            cancelarAccion();
        }

        function obtenerRecetas() {
            return JSON.parse(localStorage.getItem("recetas")) || [];
        }

        function guardarRecetas(recetas) {
            localStorage.setItem("recetas", JSON.stringify(recetas));
        }

        function obtenerRecetaPorId(id) {
            const recetas = obtenerRecetas();
            return recetas.find(receta => receta.id === id);
        }

        function agregarReceta() {
            const nombre = document.getElementById("nombre").value;
            const ingredientes = document.getElementById("ingredientes").value;
            const preparacion = document.getElementById("preparacion").value;

            if (nombre && ingredientes && preparacion) {
                const receta = {
                    id: Date.now(),
                    nombre,
                    ingredientes,
                    preparacion
                };

                const recetas = obtenerRecetas();
                recetas.push(receta);
                guardarRecetas(recetas);

                cargarRecetas();
                cancelarAccion();
            } else {
                alert("Por favor, complete todos los campos.");
            }
        }

        function cancelarAccion() {
            // Mostrar el contenedor de recetas y ocultar el formulario
            document.getElementById("recetas-container").style.display = "block";
            document.getElementById("formulario").style.display = "none";
        }

        function mostrarFormulario() {
            llenarFormulario({}, "Guardar Receta", agregarReceta);
        }

        document.getElementById("guardarBtn").onclick = agregarReceta;
        document.getElementById("cancelarBtn").onclick = cancelarAccion;
        document.getElementById("agregarBtn").onclick = mostrarFormulario;

        // Cerrar el modal al hacer clic en cualquier lugar fuera de él
        window.onclick = function (event) {
            const modal = document.getElementById("receta-modal");
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    });
})();
