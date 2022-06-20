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

// Aca muestra los productos
class Interfase {
    displayProductos(productos) {
        let resultado = ``;
        productos.forEach(producto => {
            resultado += `
            
            <article class="product">
        <div class="img-container">
            <img
                src=${producto.imagen}
                alt=${producto.nombre}
                class="product-img"
            />
            <button class="bag-btn" data-id=${producto.id}>
            <i class="fas fa-shopping-cart"></i>
            agregar al carrito
            </button>
        </div>
        <h3>${producto.nombre}</h3>
        <h4>$${producto.precio}</h4>
        </article>
            
            `;
        });
        productosDOM.innerHTML = resultado;
    }
    getCarritoBtn() {
        const btns = [...document.querySelectorAll(".bag-btn")];
        btnsDOM = btns;
        btns.forEach(btn => {
            let id = btn.dataset.id;
            let enCarrito = carrito.find(item => item.id === id);
            if (enCarrito) {
                btn.innerText = "En Carrito";
                btn.disabled = true
            }

            btn.addEventListener("click", (event) => {
                event.target.innerText = "En Carrito";
                event.target.disabled = true;

            // tomar el producto de productos
            let itemsCarrito = {...Storage.getProducto(id), cantidad: 1};
                // agregar el producto al carrito
            carrito = [...carrito,itemsCarrito];
                // guardar carrito en el LS
            Storage.guardarCarrito(carrito);
                // valores carrito
            this.setValoresCarrito(carrito);
                // mostrar items carrito
            this.agregarItemCarrito(itemsCarrito);
                // mostrar carrito
            this.mostrarCarrito();
            });

        })
    }
setValoresCarrito(carrito){
    let totalTemporal = 0;
    let itemsTotal = 0;
    carrito.map(item => {
        totalTemporal += item.precio * item.cantidad;
        itemsTotal += item.cantidad;
    })
    totalCarrito.innerText = parseFloat(totalTemporal.toFixed(2))
    itemsCarrito.innerText = itemsTotal;
}
agregarItemCarrito(item){
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.imagen} alt="${item.nombre}" />
            <div>
            <h4>${item.nombre}</h4>
            <h5>$${item.precio}</h5>
            <span class="remove-item" data-id=${item.id}>quitar</span>
            </div>
            <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">
                ${item.cantidad}
            </p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
    
    `
    contenidoCarrito.appendChild(div);
}
mostrarCarrito(){
    carritoOver.classList.add("transparentBcg");
    carritoDOM.classList.add("showCart")
}
setupAPP(){
    carrito = Storage.getCarrito();
    this.setValoresCarrito(carrito);
    this.populateCarrito(carrito);
    btnCarrito.addEventListener("click", this.mostrarCarrito);
    btnCerrarCarrito.addEventListener("click", this.ocultarCarrito);

}
populateCarrito(carrito){
    carrito.forEach(item =>this.agregarItemCarrito(item))
}
ocultarCarrito(){
    carritoOver.classList.remove("transparentBcg");
    carritoDOM.classList.remove("showCart")
}
logicaCarrito(){
    // limpiar carrito 

    limpiarCarritoBtn.addEventListener("click",()=> {
        this.limpiarCarrito();
    });
    
    //funcionalidad
    contenidoCarrito.addEventListener("click", event=> {
        if(event.target.classList.contains("remove-item"))
        {
            let quitarItem = event.target;
            let id = quitarItem.dataset.id;
            contenidoCarrito.removeChild(removeItem.parentElement.parentElement)
            this.quitarItem(id);
        }
        else if(event.target.classList.contains("fa-chevron-up")){
            let agregarCantidad = event.target;
            let id = agregarCantidad.dataset.id;
            let itemTemporal = carrito.find(item => item.id===id);
            itemTemporal.cantidad = itemTemporal.cantidad +1;
            Storage.guardarCarrito(carrito);
            this.setValoresCarrito(carrito);
            agregarCantidad.nextElementSibling.innerText = itemTemporal.cantidad;
        }
        else if(event.target.classList.contains("fa-chevron-down")){
            let bajarCantidad = event.target;
            let id = bajarCantidad.dataset.id;
            let itemTemporal = carrito.find(item => item.id===id);
            itemTemporal.cantidad = itemTemporal.cantidad -1;
            if(itemTemporal.cantidad>0){
                Storage.guardarCarrito(carrito);
                this.setValoresCarrito(carrito);
                bajarCantidad.previousElementSibling.innerText = itemTemporal.cantidad;
            }
            else{
                contenidoCarrito.removeChild(bajarCantidad.parentElement.parentElement);
                this.quitarItem(id);
            }
        }
    })
}
limpiarCarrito(){
    let itemsCarrito = carrito.map(item => item.id);
    itemsCarrito.forEach(id => this.quitarItem(id));
    while(contenidoCarrito.children.length>0){
        contenidoCarrito.removeChild(contenidoCarrito.children[0])
    }
    this.ocultarCarrito();
}
quitarItem(id){
    carrito = carrito.filter(item => item.id !== id);
    this.setValoresCarrito(carrito);
    Storage.guardarCarrito(carrito);
    let btn = this.getSingleBtn(id);
    btn.disabled = false;
    btn.innerHTML = `
    <i class="fas fa-shopping-cart"></i>agregar al carrito
    `;
}
getSingleBtn(id){
    return btnsDOM.find(btn => btn.dataset.id === id);
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