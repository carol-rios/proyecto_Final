import Venta from '../models/venta.js'
import aumentarStock from '../controlles/aumentar_stock.js'
import disminuirStock from '../controlles/disminuir_stock.js'

const ventaControlles = {
    
    ventaGet: async (req, res) => {
    const  venta = await Venta.find()
    res.json({
        venta
    })
  },
  ventaGetById: async (res, req) => {
        const { id } = req.params;
        const  venta = await Venta.findOne({ _id: id })

        res.json({
            venta
        })
    },
    ventaPost: async (req, res) => {
    const { persona,tipoComprobante, serieComprobante,numComprobante, impuesto , total ,detalles } = req.body
    const venta = new Venta({ persona,tipoComprobante, serieComprobante,numComprobante, impuesto , total ,detalles })
    await detalles.map((articulo)=>  disminuirStock(articulo._id,articulo.cantidad))
    await venta.save();
    res.json({
        venta
    })
  },

  ventaPut: async (req, res) => {
    const { id } = req.params
    const { _id, __v, ...resto } = req.body

const venta = await Venta.findByIdAndUpdate (id, resto);
    res.json({
        venta
    })

  },

  ventaPutActivar: async (req, res) => {
    const { id } = req.params
    const venta = await Venta.findByIdAndUpdate(id,{estado:1});
    await venta.detalles.map((articulo)=>  aumentarStock(articulo._id,articulo.cantidad))
    res.json({
        venta
    })

  },

  ventaPutDesactivar: async (req, res) => {
    const { id } = req.params
    const venta= await Venta.findByIdAndUpdate(id,{ estado: 0 });
    await detalles.map((articulo)=>  disminuirStock(articulo._id,articulo.cantidad))
    res.json({
        venta
    })

  },

  ventaPutDelete: async (req, res) => {
    const { id } = req.params
    const venta = await Venta.findByIdAndDelete(id,);
    res.json({
        venta
    })

  },
}

export default ventaControlles