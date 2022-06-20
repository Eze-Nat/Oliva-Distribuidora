//Variables

const btnCarrito = document.getElementById("btn-carrito");
const btnCerrarCarrito = document.getElementById("cerrar-carrito");
const limpiarCarritoBtn = document.getElementById("limpiar-carrito");
const carritoDOM = document.getElementById("carrito");
const carritoOver = document.getElementById("carrito-overlay");
const itemsCarrito = document.getElementById("items-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contenidoCarrito = document.getElementById("contenido-carrito");
const productosDOM = document.getElementById("productos-cont");

//Carrito

let carrito = [];

//Botones

let btnsDOM = [];

// Aca toma los productos
class Productos {
    async getProductos() {
        try {
            let resultado = await fetch(`products.json`);
            let data = await resultado.json()
            let productos = data.items;
            productos = productos.map(item => {
                const nombre = item.nombre;
                const precio = item.precio
                const id = item.id
                const imagen = item.imagen
                return {
                    nombre,
                    precio,
                    id,
                    imagen
                }
            })
            return productos
        } catch (error) {
            console.log(error);
        }

    }
}

// Aca el localstorage

class Storage {
    static guardarProductos(productos) {
        localStorage.setItem("productos", JSON.stringify(productos))
    }
    static getProducto(id){
        let productos = JSON.parse(localStorage.getItem("productos"));
        return productos.find(producto => producto.id === id)
    }
    static guardarCarrito(carrito){
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    static getCarrito(){
        return localStorage.getItem("carrito")? JSON.parse(localStorage.getItem("carrito")):[];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const interfase = new Interfase();
    const productos = new Productos();
    //setup aplicacion
    interfase.setupAPP()

    // LLamar productos

    productos.getProductos().then(productos => {
        interfase.displayProductos(productos);
        Storage.guardarProductos(productos);
    }).then(() => {
        interfase.getCarritoBtn();
        interfase.logicaCarrito();
    });

});

//enviar por whatsapp

function iniciarChatear(){
    const wa = document.getElementById("enviar-pedido");
    wa.addEventListener("click", ()=>{
        window.location.href = 'https://wa.me/543416878831/?text=Gracias' + 'por' + ' su ' + 'compra ' + carrito
    })
    
}

const wa = document.getElementById("enviar-pedido");

wa.addEventListener("submit", event => {
    event.preventDefault();
    const wa = Productos;
    
;

const URL = `https://api.whatsapp.com/send?phone=${items.id}&text=Hi, ${formData.name}%20you%20have%20scheduled%20an%20appointment%20on%20${formData.date}%20with%20the%20following%20instructions%20&source=&data=`;

  window.open(URL, "_blank");
});