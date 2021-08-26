import {Router} from 'express'
import usuarioControlles from '../controlles/usuario.js'



const router= Router();

router.get('/',usuarioControlles.usuarioGet);

router.get('/:id',usuarioControlles.usuarioGetById);

router.post('/',usuarioControlles.usuarioPost);

router.post('/login',usuarioControlles.usuarioPost);

router.put('/:id',usuarioControlles.usuarioPut);

router.put('/activar/:id',usuarioControlles.usuarioPutActivar);

router.put('/desactivar/:id',usuarioControlles.usuarioPutDesactivar);

export default router;