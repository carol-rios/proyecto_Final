import {Router}from 'express'
import { validarJWT } from '../middlewares/validar-jwt.js'
import  { check } from 'express-validator'
import compraControlles from '../controlles/compra.js'
import validadorCampos from '../middlewares/validar-campos.js'
import validarRoles from '../middlewares/validar_rol.js'
import existeCompraById from '../helpers/compra.js'
import existetipoComprobante from '../helpers/compra.js'
import existeCompraByNumComprobante from '../helpers/compra.js'


const router = Router();

router.get('/', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'),
    validadorCampos
], compraControlles.compraGet),

router.post('/', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'),
    check('numComprobante').custom(existeCompraByNumComprobante),
    check('tipoComprobante').custom(existetipoComprobante),
    
    validadorCampos
], compraControlles.compraPost)

router.put('/:id', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'),
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCompraById),
    validadorCampos

], compraControlles.compraPut),

router.put('/activar/:id', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'),
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCompraById),
    validadorCampos
], compraControlles.compraPutActivar),

router.put('/desactivar/:id', [
    validarRoles('ALMACENISTA_ROL'),
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCompraById),
    validadorCampos
], compraControlles.compraPutDesactivar),

router.delete('/:id', [
    validarJWT,
    validarRoles('ALMACENISTA_ROL'),
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeCompraById),
    validadorCampos
], compraControlles.compraPutDelete)


export default router


// router.post('/', [
//     validarJWT,
//     validarRoles('ALMACENISTA_ROL'),
//     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
//     check('nombre').custom(existeCompraBynombre),
//     validadorCampos

// ], compraControllers.compraPost)