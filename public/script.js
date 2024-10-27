document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validarFormulario()) {
        crearProducto();
    }
});

// Validar campos del formulario
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const imagen = document.getElementById('imagen').value.trim();

    return validarDatosProducto(nombre, descripcion, precio, stock, imagen);
}

// Validar datos del producto
function validarDatosProducto(nombre, descripcion, precio, stock, imagen) {
    const errores = [];
    if (nombre === '') errores.push('El nombre es obligatorio.');
    if (descripcion === '') errores.push('La descripción es obligatoria.');
    if (isNaN(precio) || precio <= 0) errores.push('El precio debe ser un número válido mayor que 0.');
    if (isNaN(stock) || stock < 0) errores.push('El stock debe ser un número entero válido (0 o mayor).');
    if (imagen === '') errores.push('La URL de la imagen es obligatoria.');

    if (errores.length > 0) {
        alert(errores.join('\n'));
        return false;
    }
    return true; // Todo es válido
}

// Crear un nuevo producto
function crearProducto() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const imagen = document.getElementById('imagen').value;

    fetch('/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion, precio, stock, imagen })
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            cargarProductos();
            document.getElementById('addProductForm').reset();
        })
        .catch(err => console.error('Error al crear el producto:', err));
}

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
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    <button onclick="mostrarFormularioActualizar(${producto.id}, '${producto.nombre}', '${producto.descripcion}', ${producto.precio}, ${producto.stock}, '${producto.imagen}')">Actualizar</button>
                </div>
            `).join('');
            productosDiv.innerHTML = productosHTML;
        })
        .catch(err => console.error('Error al cargar productos:', err));
}

// Mostrar formulario de actualización
function mostrarFormularioActualizar(id, nombre, descripcion, precio, stock, imagen) {
    const asideDiv = document.getElementById('aside');
    asideDiv.innerHTML += `
        <div class="div_actualizar_form">
            <h4>Actualizar Producto</h4>
            <input type="text" id="nombre-${id}" value="${nombre}">
            <textarea id="descripcion-${id}">${descripcion}</textarea>
            <input type="number" id="precio-${id}" value="${precio}">
            <input type="number" id="stock-${id}" value="${stock}">
            <input type="text" id="imagen-${id}" value="${imagen}">
            <button onclick="actualizarProducto(${id})">Guardar</button>
        </div>
    `;
}

// Actualizar un producto
function actualizarProducto(id) {
    const nombre = document.getElementById(`nombre-${id}`).value.trim();
    const descripcion = document.getElementById(`descripcion-${id}`).value.trim();
    const precio = parseFloat(document.getElementById(`precio-${id}`).value);
    const stock = parseInt(document.getElementById(`stock-${id}`).value);
    const imagen = document.getElementById(`imagen-${id}`).value.trim();

    if (!validarDatosProducto(nombre, descripcion, precio, stock, imagen)) {
        return; // Salir si la validación falla
    }

    fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion, precio, stock, imagen })
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            cargarProductos();
        })
        .catch(err => console.error('Error al actualizar el producto:', err));
}

// Eliminar un producto
function eliminarProducto(id) {
    fetch(`/productos/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            cargarProductos();
        })
        .catch(err => console.error('Error al eliminar el producto:', err));
}

// Cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
