let productos = [];

// Esperar que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar el botón de finalizar compra al cargar la página
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.style.display = 'none';
    }
    
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

// Función para agregar productos al carrito
function agregarCarrito(e) {
    const idProducto = parseInt(e.target.getAttribute('data-id'));
    const producto = productos.find(p => p.id === idProducto);
    let carrito = obtenerCarrito();
    carrito.push(producto);
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

// Función para mostrar los productos en el carrito
function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    if (!carritoItems) return; // Verificar si el elemento existe

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
    carrito.push(producto);  // Añade otra unidad
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function disminuirCantidad(id) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);  // Remueve una unidad
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function eliminarProducto(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(p => p.id !== id);  // Elimina todas las unidades del producto
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

function cargarCarrito() {
    mostrarCarrito();
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

// Función para finalizar la compra
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

    let resumenHTML = ''; // Inicializar la variable sin el título
    const productosCount = {}; // Objeto para almacenar la cantidad de cada producto
    let totalGeneral = 0; // Variable para almacenar el total de todos los productos

    // Iterar sobre el carrito y contar la cantidad de cada producto
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

    // Iterar sobre el objeto de productos y generar el resumen
    resumenHTML += '<h3>Resumen de Compra</h3><ul>'; // Agregar el título solo una vez
    Object.keys(productosCount).forEach(producto => {
        const cantidad = productosCount[producto].cantidad;
        const precio = productosCount[producto].precio;
        const total = cantidad * precio;
        totalGeneral += total; // Sumar el total de cada producto al total general
        resumenHTML += `<li>${cantidad} x ${producto} - $${total.toFixed(2)}</li>`;
    });

    resumenHTML += `<li>Total: $${totalGeneral.toFixed(2)}</li>`; // Mostrar el total general
    resumenHTML += '</ul>';

    // Muestra el resumen en la página
    document.getElementById('resumen-compra').innerHTML = resumenHTML;

    // Muestra el formulario de checkout
    document.getElementById('checkout-section').style.display = 'block';

    // Oculta la pantalla previa de carrito de compras
    document.getElementById('carrito').style.display = 'none';
    document.getElementById('total-price').style.display = 'none';

    // Ocultar el botón de "Finalizar Compra"
    document.getElementById('finalizar-compra').style.display = 'none';

    // Asignar evento al botón de confirmar compra
    document.getElementById('form-checkout').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío del formulario

        Swal.fire({
            icon: 'success',
            title: 'Compra confirmada',
            text: 'Gracias por tu compra. Pronto recibirás tu pedido.'
        }).then(() => {
            // Limpiar carrito
            localStorage.removeItem('carrito');
            mostrarCarrito(); // Actualizar la UI para reflejar que el carrito está vacío

            // Ocultar el formulario de checkout tras la compra
            document.getElementById('checkout-section').style.display = 'none';

            // Redirigir al usuario a la página de inicio
            window.location.href = '../index.html'; // Cambia la ruta según sea necesario
        });
    });
}
