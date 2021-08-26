import {Router}  from 'express';
import categoriaController from '../controlles/categoria.js';
import { existeCategoriaById,existeCategoriaByNombre} from '../helpers/categoria.js'
import  validadorCampos  from '../middlewares/validar-campos.js';
import {validarJWT} from '../middlewares/validar-jwt.js';
import {check} from 'express-validator';// DESCARGAR EXPRESS-VALIDATOR, consola=>(npm i express-validator)
import validarRoles from '../middlewares/validar_rol.js'

const router= Router();

router.get('/',[
    validarJWT,
    validarRoles('ALMACENISTA_ROL'), 
     validadorCampos
], categoriaController.categoriaGet);

router.get('/:id', [
     validarJWT,
    validarRoles('ALMACENISTA_ROL'), 
     check('id', 'No es valido').isMongoId(),
     check('id').custom(existeCategoriaById),
     validadorCampos

], categoriaController.categoriaGetById);

router.post('/', [
   
    validarRoles('ALMACENISTA_ROL'), 
    check('descripcion','El campo descripcion es obligatorio').not().isEmpty(),
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoriaByNombre),
    validadorCampos

], categoriaController.categoriaPost);

router.put('/:id', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'), 
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    check('nombre').custom(existeCategoriaByNombre),
    validadorCampos
], categoriaController.categoriaPut);

router.put('/activar/:id', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'), 
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validadorCampos
], categoriaController.categoriaPutActivar);

router.put('/desactivar/:id', [
    validarRoles('ALMACENISTA_ROL'), 
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validadorCampos
], categoriaController.categoriaPutDesactivar);

router.delete('/:id', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'), 
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validadorCampos
], categoriaController.categoriaPutDelete);

export default router;
