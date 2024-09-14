let productos = [];

// Cargar productos del archivo JSON
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
            mostrarCarrito();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

function agregarCarrito(e) {
    const idProducto = parseInt(e.target.getAttribute('data-id'));
    const producto = productos.find(p => p.id === idProducto);

    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    let carrito = obtenerCarrito();
    const productoEnCarrito = carrito.find(p => p.id === idProducto);

    if (productoEnCarrito) {
        // Si ya está en el carrito, incrementar la cantidad
        productoEnCarrito.cantidad += 1;
    } else {
        // Si no está, añadir con cantidad 1
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar notificación con SweetAlert
    Swal.fire({
        title: 'Producto añadido al carrito',
        text: `${producto.nombre} ha sido añadido.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });

    mostrarCarrito();
}

function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    if (!carritoItems) return;

    let carrito = obtenerCarrito();
    let total = 0;
    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p>El carrito está vacío.</p>';
        actualizarUI();
        return;
    }

    const productosAgrupados = {};
    carrito.forEach(producto => {
        if (!productosAgrupados[producto.id]) {
            productosAgrupados[producto.id] = { ...producto };
        }
    });

    for (let id in productosAgrupados) {
        let producto = productosAgrupados[id];
        const div = document.createElement('div');
        div.innerHTML = `
            <div>
                <h5 class="card-title">${producto.nombre}</h5>
                <p>Cantidad: ${producto.cantidad}</p>
                <p class="text-primary"><strong>$${producto.precio.toFixed(2)}</strong></p>
                <button class="btn btn-success" onclick="incrementarCantidad(${producto.id})">+</button>
                <button class="btn btn-danger" onclick="disminuirCantidad(${producto.id})">-</button>
                <button class="btn btn-secondary" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </div>
        `;
        carritoItems.appendChild(div);
        total += producto.precio * producto.cantidad;
    }

    const totalPrice = document.getElementById('total-price');
    if (totalPrice) {
        totalPrice.textContent = '$' + total.toFixed(2);
    }
    actualizarUI();
}

function incrementarCantidad(id) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(p => p.id === id);
    const index = carrito.indexOf(producto);

    if (producto) {
        carrito[index].cantidad += 1;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function disminuirCantidad(id) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(p => p.id === id);
    const index = carrito.indexOf(producto);

    if (producto.cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        eliminarProducto(id);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function eliminarProducto(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function obtenerCarrito() {
    if (localStorage.getItem('carrito')) {
        return JSON.parse(localStorage.getItem('carrito'));
    } else {
        return [];
    }
}

function actualizarUI() {
    const carrito = obtenerCarrito();
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

    if (carrito.length === 0) {
        if (finalizarCompraBtn) {
            finalizarCompraBtn.style.display = 'none';
        }
        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.style.display = 'none';
        }
    } else {
        if (finalizarCompraBtn) {
            finalizarCompraBtn.style.display = 'block';
        }
        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.style.display = 'block';
        }
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
}

function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'No tienes productos en el carrito para finalizar la compra.'
        });
        return;
    }

    let resumenHTML = '<h3>Resumen de Compra</h3><ul>';
    const productosCount = {};
    let totalGeneral = 0;

    carrito.forEach(producto => {
        if (productosCount[producto.nombre]) {
            productosCount[producto.nombre].cantidad++;
        } else {
            productosCount[producto.nombre] = {
                cantidad: 1,
                precio: producto.precio
            };
        }
    });

    Object.keys(productosCount).forEach(producto => {
        const cantidad = productosCount[producto].cantidad;
        const precio = productosCount[producto].precio;
        const total = cantidad * precio;
        totalGeneral += total;
        resumenHTML += `<li>${cantidad} x ${producto} - $${total.toFixed(2)}</li>`;
    });

    resumenHTML += `<li>Total: $${totalGeneral.toFixed(2)}</li></ul>`;
    document.getElementById('resumen-compra').innerHTML = resumenHTML;
    document.getElementById('checkout-section').style.display = 'block';
    document.getElementById('carrito').style.display = 'none';
    document.getElementById('total-price').style.display = 'none';

    document.getElementById('form-checkout').addEventListener('submit', function (event) {
        event.preventDefault();

        Swal.fire({
            icon: 'success',
            title: 'Compra confirmada',
            text: 'Gracias por tu compra. Pronto recibirás tu pedido.'
        }).then(() => {
            localStorage.removeItem('carrito');
            mostrarCarrito();
            document.getElementById('checkout-section').style.display = 'none';
            window.location.href = 'index.html'; // Redirigir a la página de inicio
        });
    });
}
