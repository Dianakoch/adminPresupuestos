// variables y selectores
const form = document.querySelector('#agregar-gasto');
const gastoList = document.querySelector('#gastos ul');


//eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto); //se ejecutara al cargar el documento

    form.addEventListener('submit', agregarGasto);
}


//clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]; //agregamos cada gasto al array de gastos
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //Extrayendo valores
        const {presupuesto, restante} = cantidad;

        //insertando en HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        //creamos el div
        const divAlerta = document.createElement('div')
        divAlerta.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divAlerta.classList.add('alert-danger');
        }else{
            divAlerta.classList.add('alert-success');
        }

        //mesnaje de error
        divAlerta.textContent = mensaje;

        //insertar en html el mensaje
        document.querySelector('.primario').insertBefore(divAlerta, form);

        //
        setTimeout(()=>{
            divAlerta.remove();
        }, 3000)
    }

    agregarLista(gastos){

        this.limpiarHTML(); //elimina html previo

        //iterar sobre gastos
        gastos.forEach(gasto =>{
            const {cantidad, nombre, id} = gasto;

            //li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; //tomamos el id

            //agregar html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge-primary badge-pill"> ${cantidad} </span>`;

            //btn para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';

            nuevoGasto.appendChild(btnBorrar);

            gastoList.appendChild(nuevoGasto);
        })
    }

    limpiarHTML(){
        while(gastoList.firstChild){
            gastoList.removeChild(gastoList.firstChild)
        }
    }
}

//instanciamos nuestros constructors (clases)
const ui = new UI();
let presupuesto;


//funciones
function preguntarPresupuesto(){
    const presupuestoU = prompt('Escribe tu presupuesto:');

    if(presupuestoU === '' || presupuestoU === null || isNaN(presupuestoU) || presupuestoU <= 0){ //isNaN compruba si es un string
        window.location.reload(); //si solo da enter se actualiza la pagina y vuelve a preguntar
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoU)
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto)
}


function agregarGasto(e){ //ya que es un submit toma un evento e
    e.preventDefault();

    //leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar datos
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida', 'error');
        return;
    }

    //generar objeto con gasto
    const gasto = {
        nombre, //esto une nombre y acntidad al objeto gasto
        cantidad, 
        id: Date.now()
    };
    
    //añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //mensaje de gasto agregado
    ui.imprimirAlerta('Gasto agregado');

    //imprimir gastos
    const { gastos } = presupuesto;
    ui.agregarLista(gastos);

    //reinicia formulario
    form.reset();
}
