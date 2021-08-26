import recovery from '../components/Recovery.vue'
import login from "../pages/login.vue"
import categorias from '../pages/Categorias.vue'
import articulos from '../pages/Articulos.vue'
import usuarios from '../pages/Usuarios.vue'
import ingresos from '../pages/Ingresos.vue'
import ventas from '../pages/Ventas.vue'
import proveedores from '../pages/Proveedores.vue'
import clientes from '../pages/Clientes.vue'
import grafica from '../pages/Grafica.vue'


export const routes = [
    {path: "/", component: login},
    {path: "/grafica", component: grafica},    
    {path: "/ventas", component: ventas},
    {path: "/recovery", component: recovery},
    {path: "/categorias", component: categorias},
    {path: "/articulos", component: articulos},
    {path: "/usuario", component: usuarios},
    {path: "/ingresos", component: ingresos},
    {path: "/proveedores", component: proveedores},
    {path: "/clientes", component: clientes},
    
    
]   