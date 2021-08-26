import Compra from "../models/compra.js"


const existeCompraById = async (id) => {

    const existe = await Compra.findById({ id })

    if (!existe) throw new Error(`El id no existe ${id}`)

}
// const  existeCompraByNombre = async (nombre)=>{

//     const existe= await Compra.findOne({nombre})

//     if (existe) throw new Error(`ya existe una compra  con ese nombre`)

// }
const existeCompraByNumComprobante = async (numComprobante) => {

    const existe = await Compra.findOne({ numComprobante })

    if (existe) throw new Error(`ya existe una compra  con ese numero de comprobante`)

}
const existetipoComprobante = async (tipoComprobante) => {
    if (tipoComprobante != 'Factura') {
        if (tipoComprobante != 'Nota Debito') {
            if (tipoComprobante != 'Nota Credito') {
                throw new Error('Tipo de comprobante invalido')
            }
        }
    }
}

    export default { existeCompraById, existeCompraByNumComprobante,existetipoComprobante}