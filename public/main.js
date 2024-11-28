// Cargar todos los productos
function cargarProductos() {
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            const productosDiv = document.getElementById('productos');
            productosDiv.innerHTML = '';
            const productosHTML = data.map(producto => `
                <div class="card">
                    <h4>${producto.nombre}</h4>
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio}</p>
                    <p>Stock: ${producto.stock}</p>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <button onclick="addProductToCar(${producto.id})">Agregar al carrito</button>
                    <button onclick="buyNow(${producto.id})">Comprar ahora</button>
                </div>
            `).join('');
            productosDiv.innerHTML = productosHTML;
        })
        .catch(err => console.error('Error al cargar productos:', err));
}

// Cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);