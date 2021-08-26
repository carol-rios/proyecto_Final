import categoria from '../models/categoria.js'

const existeCategoriaById = async (id) => {

    const existe = await categoria.findById(id)

    if (!existe) throw new Error(`El id no existe ${id}`)

}

const existeCategoriaByNombre = async (id) => {

    const existe = await categoria.findOne({ nombre })
    if (existe) throw new Error('ya existe una categoria con ese nombre')
}

export { existeCategoriaById, existeCategoriaByNombre }