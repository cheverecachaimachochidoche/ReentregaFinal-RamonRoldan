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
    // Verificamos si estamos en la página del carrito y si los elementos existen
    const carritoItems = document.getElementById('carrito-items');
    const totalPrice = document.getElementById('total-price');

    if (!carritoItems || !totalPrice) {
        console.error('Elementos del carrito no encontrados en el DOM. Asegúrate de que este script se ejecute en la página correcta.');
        return;
    }

    let carrito = obtenerCarrito();
    let total = 0;
    carritoItems.innerHTML = '';

    // Agrupar productos por cantidad
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
    // Verificar si los elementos del carrito están en el DOM antes de llamar a mostrarCarrito
    if (document.getElementById('carrito-items') && document.getElementById('total-price')) {
        mostrarCarrito();
    } else {
        console.log('No se ejecuta cargarCarrito, ya que no es la página del carrito.');
    }
}
