import { generarTokenJWT } from '../middlewares/validar-jwt.js';
import bcryptjs from 'bcryptjs' // =>DESCARGAR.....
import Usuario from '../models/usuario.js'


const usuarioControlles = {

    usuarioGet: async (req, res) => {
        const query = req.query.value
        const usuario = await Usuario.find({
            $or: [
                { nombre: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
                { rol: new RegExp(query, 'i') },
            ]
        });


        res.json({
            usuario
        })
    },

    usuarioGetById: async (req, res) => {
        const { id } = req.params
        const usuario = await Usuario.findById({id})

        res.json({
            usuario
        })
    },


usuarioPost: async (req, res) => {

    // console.log(req.body)

    const { nombre, email, password, rol } = req.body;
    const usuario = Usuario({ nombre, email, password, rol });

    // ENCRIPTACION DE CONRASEÑA CON 'bcryptjs'......
    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);
    usuario.save();
 
    res.json({
        usuario
    })

},

login: async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        return res.json({ 
              mgs: 'usuario y password no son correctos email ' //arreglar msg para todos 
        })

    }
    if (usuario.estado === 0) {
        return res.json({
            msg: 'Usuario/ password no son correctos estado'
        })
    }
    const validarPassword = bcryptjs.compareSync(password, usuario.password)

    if (!validarPassword) {
        res.json({
            msg: 'Usuario/ password no son correctos password'
        })

    }

   const token= await generarTokenJWT(usuario.id);
    res.json({
      usuario, 
      token
    })
},

usuarioPut: async (req, res) => {
    const { id } = req.params
    const { __id, createdAt, estado, _v, email, rol, password, ...resto } = req.body
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuario = await Usuario.findOneAndUpdate(id, resto)

    res.json({
        usuario
    })

},
usuarioPutActivar: async (req, res) => {
    const { id } = req.params
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: 1 })


    res.json({ 
        usuario 
    })

},

usuarioPutDesactivar: async (req, res) => {
    const { id } = req.params
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: 0 })


    res.json({
         usuario 
        })

},
}

export default usuarioControlles