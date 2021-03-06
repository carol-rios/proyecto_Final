import Articulo from '../models/articulo.js'

const articuloControlles = {
  articulosGet: async (req, res) => {
    const articulo = await Articulo.find()
      // .populate('nombre','categoria')
    res.json({
      articulo
    })
  },
  articulosGetById: async (res, req) => {
        const { id } = req.params;
        const articulo = await Articulo.findOne({ _id: id })

        res.json({
            articulo
        })
    },

  articulosPost: async (req, res) => {
    const { codigo, nombre, descripcion, precioVenta, stock } = req.body
    const articulo = new Articulo({ codigo, nombre, descripcion, precioVenta, stock })

    await articulo.save();
    res.json({
      articulo
    })
  },

  articulosPut: async (req, res) => {
    const { id } = req.params
    const { _id, estado, createAt, __v, ...resto } = req.body

    // const articulo = await Articulo.findByidAndUpdate(id, resto);
const articulo = await Articulo.findByIdAndUpdate (id, resto);
    res.json({
      articulo
    })

  },

  articulosPutActivar: async (req, res) => {
    const { id } = req.params
    const articulo = await Articulo.findByIdAndUpdate(id,{estado:1});

    res.json({
      articulo
    })

  },

  articulosPutDesactivar: async (req, res) => {
    const { id } = req.params
    const articulo = await Articulo.findByIdAndUpdate(id,{ estado: 0 });
    res.json({
     articulo
    })

  },

  articulosPutDelete: async (req, res) => {
    const { id } = req.params
    const articulo = await Articulo.findByIdAndDelete(id,);
    res.json({
      articulo
    })

  },
}

export default articuloControlles

// import Articulo from '../models/articulo.js'


// const articuloControlles = {

//         articuloGet: async (req, res) => {
//           const articulo = await Articulo.find()
//             // .populate('nombre','categoria')
//           res.json({
//             articulo
//           })
//  },

// articuloPost=async()=>{
//     const {codigo,nombre,categoria,descripcion,precioVenta,stock}=req.body
//     const articulo= new Articulo({codigo,nombre,categoria,descripcion,precioVenta,stock})

// await Articulo.save()

// res.json({
//     articulo
// })

// },
// }



// export default articuloControlles