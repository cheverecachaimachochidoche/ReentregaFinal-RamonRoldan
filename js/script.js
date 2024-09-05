let productos = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://cheverecachaimachochidoche.github.io/Tercera-Entrega-RamonRoldan/db/main.json')
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
    if (!producto) {
        console.error('Producto no encontrado:', idProducto);
        return;
    }
    let carrito = obtenerCarrito();
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const totalPrice = document.getElementById('total-price');

    if (!carritoItems || !totalPrice) {
        console.error('Elementos del carrito no encontrados en el DOM');
        return;
    }

    let carrito = obtenerCarrito();
    let total = 0;
    carritoItems.innerHTML = '';

    // Verificar que los productos en el carrito existen en el archivo JSON
    let productosAgrupados = carrito.reduce((acc, producto) => {
        const productoValido = productos.find(p => p.id === producto.id);
        if (productoValido) {
            let id = producto.id;
            if (!acc[id]) {
                acc[id] = { ...producto, cantidad: 0 };
            }
            acc[id].cantidad += 1;
        } else {
            console.error('Producto inválido o no encontrado en el JSON:', producto);
        }
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

    totalPrice.textContent = '$' + total.toFixed(2);
}

function obtenerCarrito() {
    try {
        const carrito = localStorage.getItem('carrito');
        return carrito ? JSON.parse(carrito) : [];
    } catch (error) {
        console.error('Error al obtener el carrito del localStorage:', error);
        return [];
    }
}

function cargarCarrito() {
    mostrarCarrito();
}
