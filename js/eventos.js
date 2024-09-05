document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('agregar-carrito')) {
            agregarCarrito(e);
        }
        if (e.target.id === 'finalizar-compra') {
            finalizarCompra();
        }
    });

    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', () => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás deshacer esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, vaciar carrito!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('carrito');
                    mostrarCarrito();

                    Swal.fire(
                        'Carrito vaciado!',
                        'El carrito ha sido vaciado exitosamente.',
                        'success'
                    );
                }
            });
        });
    }
});
