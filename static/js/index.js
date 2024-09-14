const body = document.querySelector('body');
body.classList = 'bg-dark text-light fonts'

function getFruits(done) {
    const result = fetch("/frutas.json")

    result
        .then((response) => response.json())
        .then((data) => {
            done(data)
        })
        // .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function agregar(fruta) {

    carritoCompras.push(fruta); 
    localStorage.setItem('Carrito', JSON.stringify(carritoCompras));
} 

let carritoCompras = [];

getFruits(data => {
    console.log(typeof(data))
    function renderizarProductos(buscarFruta = data) {
        const main = document.querySelector('#main');  main.classList='container col-9 div-fruta';
        main.innerHTML = ``;
        const agregar = (fruta) => {
            carritoCompras.push(fruta); 
            localStorage.setItem('Carrito', JSON.stringify(carritoCompras));           
        }
        buscarFruta.forEach(fruta => {
            const article= document.createElement('article'); article.classList= 'text-light border-end border-bottom border-warning rounded'
            main.appendChild(article);
        
            const divImg= document.createElement('div');    divImg.classList='image-container'; 
            article.appendChild(divImg);

            const img= document.createElement('img');       img.src=`/${fruta.imagen}`;
            img.alt=`${fruta.nombre}`;                      divImg.appendChild(img);

            const nombre= document.createElement('h3');     nombre.classList='mt-2 mb-1';
            nombre.textContent=`${fruta.nombre}`;           article.appendChild(nombre);

            const descr= document.createElement('p');       descr.classList='card-text mb-0';
            descr.textContent=`${fruta.descripcion}`;       article.appendChild(descr);

            const precio= document.createElement('h5');     precio.classList='card-text text-warning mb-2';
            precio.textContent=`Precio : $${fruta.precio}`; article.appendChild(precio);

            const boton= document.createElement('buttton'); boton.classList='btn btn-outline-warning mb-2';
            boton.textContent='Agregar al carrito';         article.appendChild(boton)

            boton.addEventListener('click', () => {
                agregar(fruta);
                Toastify({
                    text: `Se agrego ${fruta.nombre}`,
                    className: "info",
                style: {
                  background: "linear-gradient(to right, #96c93d, #96c93d)",
                }
                }).showToast();
            });

            main.appendChild(article);
        });
    }
    renderizarProductos();
  
    const buscadorInput = document.getElementById('buscador-input');
    buscadorInput.addEventListener('input', function () {
        const textoBusqueda = buscadorInput.value.toLowerCase();
        const productosFiltrados = data.filter(fruta =>
            fruta.nombre.toLowerCase().includes(textoBusqueda)
        );
        renderizarProductos(productosFiltrados);
    });

});

// carrito

const pagPagar = document.querySelector('#carrito');

let frutas = JSON.parse(localStorage.getItem('Carrito'));

const divContainer = document.createElement('div');
divContainer.classList = 'container col-7 mt-5'
pagPagar.appendChild(divContainer);

const ol = document.createElement('ol')
ol.classList = 'list-group';
divContainer.appendChild(ol)

frutas.forEach(fruta => {

    const li = document.createElement('li')
    li.classList = 'list-group-item d-flex justify-content-between align-items-start text-bg-warning bg-gradient'
    ol.appendChild(li)

    const divLi = document.createElement('div')
    divLi.classList = 'ms-2 me-auto'
    li.appendChild(divLi);

    const divCantidad = document.createElement('spam');
    divCantidad.classList = 'h4 text-dark rounded-pill p-2 mx-5'
    divCantidad.textContent = `${fruta.id}`
    li.appendChild(divCantidad);

    const divNombre = document.createElement('div');
    divNombre.classList = 'fw-bold h4 mt-2'
    divNombre.textContent = `${fruta.nombre}`
    divLi.appendChild(divNombre);
    
    const spanPrecio = document.createElement('span');
    spanPrecio.classList = 'h4 text-dark rounded-pill p-2 mx-5';
    spanPrecio.textContent = `$ ${fruta.precio}`
    li.appendChild(spanPrecio);
    
    const boton = document.createElement('button');
    boton.classList = 'btn col-1 btn-sm mt-s1 bg-dark text-warning mt-2';
    boton.textContent = `X`
    li.appendChild(boton);
});

let total = 0
function totalDePrecio(producto){
    producto.forEach((producto) => {
        total += producto.precio
        return total
    })
}

totalDePrecio(frutas);

const liTotal = document.createElement('li');
liTotal.classList = 'list-group-item d-flex justify-content-between align-items-start'
ol.appendChild(liTotal);

const divLiTotal = document.createElement('div')
divLiTotal.classList = 'ms-2 me-auto'
liTotal.appendChild(divLiTotal);

const divNombreTotal = document.createElement('div');
divNombreTotal.classList = 'fw-bold h2 mt-2'
divNombreTotal.textContent = `Total`
divLiTotal.appendChild(divNombreTotal);

const spanPrecioTotal = document.createElement('span');
spanPrecioTotal.classList = 'h3 text-dark mt-2';
spanPrecioTotal.textContent = `$ ${total}`
liTotal.appendChild(spanPrecioTotal);


const divFooter = document.createElement('div');
divFooter.classList = 'bg-warrning mt-5'
pagPagar.appendChild(divFooter)

const parrafoFooter = document.createElement('p');
let anio = new Date().getFullYear()
parrafoFooter.textContent = `Juan Miguel Salave todos los derechos reservados ${anio}`
divFooter.classList = 'text-center text-bg-warning bg-gradient pt-3 p-1 mt-5'
divFooter.appendChild(parrafoFooter)