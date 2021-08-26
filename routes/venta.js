import { Router } from "express"
import ventacontrolles from '../controlles/venta.js'
import  { existetipoComprobante,existeVentaById} from '../helpers/venta.js'
import { check } from 'express-validator'
import { validarJWT } from '../middlewares/validar-jwt.js'
import validarRoles from '../middlewares/validar_rol.js'
import validadorCampos from '../middlewares/validar-campos.js'

const router = Router();

router.get('/', [
    validarJWT,
    validarRoles('VENDEDOR_ROL', 'ADMIN_ROL'),
    validadorCampos
], ventacontrolles.ventaGet);

router.get('/:id', [
    validarJWT,
    validarRoles('VENDEDOR_ROL,ADMIN_ROL'),
    check('id', 'No es valido').isMongoId(),
    check('id').custom(existeVentaById),
    validadorCampos
], ventacontrolles.ventaGetById);

router.post('/', [
    validarJWT,
    validarRoles('VENDEDOR_ROL,ADMIN_ROL'),
    check('numComprobante', 'El campo numero comprobante es obligatorio').not().isEmpty(),
    check('tipoComprobante').custom(existetipoComprobante),
    validadorCampos
], ventacontrolles.ventaPost); 

router.put('/:id',[validarRoles('ALMACENISTA_ROL,ADMIN_ROL'),
check('id', 'No es valido').isMongoId(),
check('id').custom(existeVentaById),
validadorCampos
], ventacontrolles.ventaPut);


router.put('/activar/:id',ventacontrolles.ventaPutActivar);

router.put('/desactivar/:id', ventacontrolles.ventaPutDesactivar);

export default router;