let productos = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('../db/main.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            productos = data;
            cargarCarrito();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

function agregarCarrito(e) {
    const idProducto = parseInt(e.target.getAttribute('data-id'));
    const producto = productos.find(p => p.id === idProducto);
    let carrito = obtenerCarrito();
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    let carrito = obtenerCarrito();
    let total = 0;
    carritoItems.innerHTML = '';

    let productosAgrupados = carrito.reduce((acc, producto) => {
        let id = producto.id;
        if (!acc[id]) {
            acc[id] = { ...producto, cantidad: 0 };
        }
        acc[id].cantidad += 1;
        return acc;
    }, {});

    for (let id in productosAgrupados) {
        let producto = productosAgrupados[id];
        const div = document.createElement('div');
        div.innerHTML = `
            <div>
                <div>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p class="text-primary"><strong>$${producto.precio.toFixed(2)}</strong></p>
                </div>
            </div>
        `;
        carritoItems.appendChild(div);
        total += producto.precio * producto.cantidad;
    }

    document.getElementById('total-price').textContent = '$' + total.toFixed(2);
}

function obtenerCarrito() {
    if (localStorage.getItem('carrito')) {
        return JSON.parse(localStorage.getItem('carrito'));
    } else {
        return [];
    }
}

function cargarCarrito() {
    mostrarCarrito();
}

function finalizarCompra() {
    try {
        let carrito = obtenerCarrito();

        if (carrito.length === 0) {
            throw new Error('El carrito está vacío, no se puede procesar la compra.');
        }

        console.log("Procesando la compra...");

        Swal.fire({
            title: 'Compra finalizada!!!',
            text: 'Tu compra ha sido completada con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: `Hubo un problema al procesar la compra: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        console.error('Error al finalizar la compra:', error);
    } finally {
        localStorage.removeItem('carrito');
        mostrarCarrito();
    }
}
