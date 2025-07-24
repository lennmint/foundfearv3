console.log("Ok")

const productos = [
    {
        id: "01", 
        imagen: "posterBank/Indie/asabovesobelow.jpg",
        nombre: "As Above So Below",
        precio: 12000
    },
    {
        id: "02",
        imagen: "posterBank/PA/pa.jpg",
        nombre: "Paranormal Activity",
        precio: 20000
    },
    {
        id: "03",
        imagen: "posterBank/hellhouse/hellhouse.jpg",
        nombre: "Hell House",
        precio: 8000
    },
    {
        id: "04",
        imagen: "posterBank/GE/graveenc.jpg",
        nombre: "Grave Encounters",
        precio: 12000
    },
    {
        id: "05",
        imagen: "posterBank/asian/noroi.jpg",
        nombre: "Noroi",
        precio: 9000
    },
    {
        id: "06",
        imagen: "posterBank/asian/incantation.jpg",
        nombre: "Incantation",
        precio: 20000
    }
];

function compararProductos(a, b){
    if(a.id < b.id){
        return 1;
    }
    if(a.id > b.id){
        return -1;
    }
    return 0;
}

productos.sort(compararProductos);

// Array de almacenamiento de Productos en Carrito
let carrito = [];

//Evento de clic en boton "Comprar"
function manejarClicComprar(evento){
    const productoId = evento.target.dataset.id;
    agregarProductoAlCarrito(productoId);
}

//Agregar los productos del array 'productos' al DOM y configura los listeners de "Comprar"
function agregarProductos(){
    const divProductos = document.querySelector(".productos")
    if (!divProductos){
        console.error("Error: No se encontró el contenedor");
        return;
    }
    for (let i = 0; i < productos.length; i++){
        const producto = productos[i];
        divProductos.insertAdjacentHTML("afterbegin",
            `
            <div class="producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-contenido">
                    <h4>${producto.nombre}</h4>
                    <span>Código: ${producto.id}</span>
                    <span>Precio: $${producto.precio}</span>
                    <button class="btn-comprar" type="button" data-id="${producto.id}">Comprar</button>
                </div>
            </div>
            `
            );
    }

    //Eventos para los botones "Comprar"
    divProductos.addEventListener("click", manejarClicComprar);
}

function agregarProductoAlCarrito(idProducto){
    //buscar si el producto ya se encuentra en el carrito
    let productoEnCarrito = null;
    for (let i = 0; i < carrito.length; i++){
        if (carrito[i].id === idProducto){
            productoEnCarrito = carrito[i];
            break; //salir del bucle una vez que se encuentra el producto
        }
    }

    if (productoEnCarrito){
        //incrementar cantidad si el producto se encuentra en carrito
        productoEnCarrito.cantidad++;
    } else {
        let productoOriginal = null;
        for (let i = 0; i < productos.length; i++){
            if (productos[i].id === idProducto){
                productoOriginal = productos[i];
                break; //salgo de bucle
            }
        }

        if (productoOriginal){
            //añadir producto al carrito con cantidad 1
            carrito.push({...productoOriginal, cantidad: 1});
        }
    }
    actualizarCarritoHTML(); //Actualizar la vista del carrito
}

function manejarClicCarrito(evento){
    const target = evento.target;
    if(target.classList.contains("btn-cantidad") || target.classList.contains("btn-eliminar")) {
        const productoId = target.dataset.id;
        const accion = target.dataset.action;

        if(accion === "eliminar"){
            eliminarProductoDelCarrito(productoId);
        } else if (accion === "restar") {
            restarCantidadProducto(productoId);
        } else if (accion === "sumar") {
            sumarCantidadProducto(productoId);
        }
    }
}

//Actualizar contenido HTML del carriot de compras basado en el array 'carrito'
function actualizarCarritoHTML(){
    const carritoCompras = document.querySelector(".carritoCompras");
    if (!carritoCompras){
        console.error("Error: No se encontró el contenedor con la clase 'CarritoCompras'")
        return;
    }

    //limpiar el contenido actual del carrito y recrear la estructura base
    carritoCompras.innerHTML = `
        <h2>Tu Carrito de Compras</h2>
        <ul class="lista-carrito"></ul>
        <p class="total-carrito"></p>
        <p class="cantidad-carrito"></p>
    `;

    const listaCarrito = carritoCompras.querySelector(".lista-carrito");
    let totalPagar = 0;
    let cantidadProductosUnicos = 0;

    if(carrito.length === 0) {
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        for (let i = 0; i < carrito.length; i++) {
            const item = carrito [i];
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.nombre} - ${item.precio} x ${item.cantidad}</span>
                <div>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="restar">-</button>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="sumar">+</button>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="eliminar">x</button>
                </div>
            `;
            listaCarrito.appendChild(li);
            totalPagar += item.precio * item.cantidad;
            cantidadProductosUnicos++;
        }
    }

    //Mostrar el total a pagar y la cantidad de productos
    carritoCompras.querySelector(".total-carrito").textContent = `Total a pagar: $${totalPagar}`;
    carritoCompras.querySelector(".cantidad-carrito").textContent = `Productos en carrito: ${cantidadProductosUnicos}`;

    //Configurar el Event Listener para los botones de cantidad y eliminar
    const nuevoListaCarrito = carritoCompras.querySelector(".lista-carrito");
    nuevoListaCarrito.addEventListener("click", manejarClicCarrito);
}

function sumarCantidadProducto(idProducto) {
    //Buscar el producto en el carrito
    let productoEnCarrito = null;
    for (let i = 0; i < carrito.length; i++) {
        if(carrito[i].id === idProducto) {
            productoEnCarrito = carrito[i];
            break;
        }
    }

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        actualizarCarritoHTML();
    }
}

function restarCantidadProducto(idProducto) {
    //Buscar el producto en el carrito
    let productoEnCarrito = null;
    for (let i = 0; i < carrito.length; i++) {
        if(carrito[i].id === idProducto) {
            productoEnCarrito = carrito[i];
            break;
        }
    }

    if (productoEnCarrito) {
        productoEnCarrito.cantidad--;
        if (productoEnCarrito.cantidad <= 0) {
            eliminarProductoDelCarrito(idProducto);
        } else {
            actualizarCarritoHTML();
        }
    }
}

function eliminarProductoDelCarrito(idProducto) {
    //Reconstruir el array carrito sin el producto a eliminar
    const nuevoCarrito = [];
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id !== idProducto) {
            nuevoCarrito.push(carrito[i]);
        }
    }
    carrito = nuevoCarrito;
    actualizarCarritoHTML();
}

//Inicializo Aplicación

agregarProductos();
actualizarCarritoHTML();