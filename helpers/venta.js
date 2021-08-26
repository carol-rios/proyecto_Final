import Venta from "../models/usuario.js"

const existeVentaById=async(id)=>{

    const existe=await Venta.findById(id)

    if (!existe) {

        throw new Error('El ID no existe');
        
    }
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

export {existeVentaById,existetipoComprobante}
