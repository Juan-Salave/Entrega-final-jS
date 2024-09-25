const body = document.querySelector('body'); body.classList = 'bg-dark text-light fonts';

const cards = document.querySelector('#cards');
const items = document.querySelector('#items');
const footer = document.querySelector('#footer');
const templateCard = document.querySelector('#template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));

        Login();
        
        pintarCarrito();

    }

});

cards.addEventListener('click', e => {
    addCarrito(e);
});

items.addEventListener('click', e => {
    btnAccion(e);
});

const fetchData = async () => {
    try {
        const respuesta = await fetch('/frutas.json');
        const data = await respuesta.json();

            frutaFiltrada =
            pintarCards(data);
    
    } catch (error) {
        console.log(error);
    };
};

/////////////////////// filtro /////////////////////////////
let buscadorInput = document.querySelector('#entrada-input');
const productosFiltrados = []

const pintarCards = (data) => {
    
    Object.values(data).forEach(fruta => {
        templateCard.querySelector('img').setAttribute('src', fruta.imagen)
        templateCard.querySelector('h3').textContent = fruta.nombre;
        templateCard.querySelector('p').textContent = fruta.descripcion;
        templateCard.querySelector('h5').textContent = `${fruta.precio}`;
        templateCard.querySelector('.btn-outline-warning').dataset.id = fruta.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);

    buscadorInput.addEventListener('input', function () {
        const textoBusqueda = buscadorInput.value.toLowerCase();
        const frutaFiltrada = data.filter(fruta =>
            fruta.nombre.toLowerCase().includes(textoBusqueda)
            
        );                  
        frutaFiltrada.forEach(element => {
            console.log(element);
        });            
    });

};

const addCarrito = e => {

    if (e.target.classList.contains('btn-outline-warning')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
};

const setCarrito = fruta => {

    const producto = {
        id: fruta.querySelector('button').dataset.id,
        nombre: fruta.querySelector('h3').textContent,
        precio: fruta.querySelector('h5').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    Toastify({
        text: `Se agrego ${producto.nombre}`,
        className: "info",
        style: {
            background: "linear-gradient(to right, #96c93d, #96c93d)",
        }
    }).showToast();
    carrito[producto.id] = { ...producto };
    pintarCarrito()
};

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return
    };

    const nCantidad = Object.values(carrito).reduce((accCantidad, { cantidad }) => accCantidad + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((accPrecio, { cantidad, precio }) => accPrecio + cantidad * precio, 0);
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.querySelector('#vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
    });
};

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        pintarCarrito()
    };

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    };
    e.stopPropagation()
};

//////////////////////// LOGIN  ////////////////////////////
const userName = document.querySelector('#user');
const password = document.querySelector('#password');
const botonLogin = document.querySelector('#login');
const nombreLogin = document.querySelector('.user');
const tituoLogin = document.querySelector('#titulo-logout');


fetch('/user.json')
    .then((response) => response.json())
    .then((datosUsuarios) => {

        Login(datosUsuarios)

    })
    .catch((error) => console.log(error));

if (localStorage.getItem('user')) {
    const newUsuario = JSON.parse(localStorage.getItem('user'));
    nombreLogin.textContent = newUsuario.alias
    tituoLogin.textContent = 'Logout'
    botonLogin.textContent = 'Logout'
    userName.disabled = true;
    password.disabled = true;

    botonLogin.addEventListener('click', e => {
        localStorage.removeItem('user');
        location.reload();
    })
};

const Login = (datosUsuarios) => {

    botonLogin.addEventListener('click', e => {
        e.preventDefault()

        let datosLogin = {
            userName: userName.value,
            password: password.value,

        };
        datosUsuarios.forEach(usuario => {
            console.log(usuario)
            if (String(usuario.nombre) == datosLogin.userName && String(usuario.password) === datosLogin.password) {
                datosLogin = usuario
                localStorage.setItem('user', JSON.stringify(datosLogin));
                botonLogin.textContent = 'logout'
                nombreLogin.textContent = usuario.alias
                location.reload();
            } else {
                console.log('clave incorrecta')
            }

        });
    });
};    