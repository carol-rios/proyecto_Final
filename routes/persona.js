import {Router} from 'express'
import personaControlles from '../controlles/persona.js'
import { validarJWT } from '../middlewares/validar-jwt.js'
import validarRoles from '../middlewares/validar_rol.js'
import validadorCampos from '../middlewares/validar-campos.js'
import {existeNumeroDocumentoByPersona, existePersonaById,existetipoPersona}from '../helpers/persona.js'
import {check} from 'express-validator'

const router = Router();


router.get('/',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    validadorCampos
], personaControlles.personaGet)

router.get('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    check('id','No es valido').isMongoId(),
    check('id').custom(existePersonaById),
    validadorCampos
], personaControlles.personaGetById)

router.post('/',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    check('nombre', 'nombre es obligatorio').not().isEmpty(),
    check('tipoDocumento', ' tipo de documento es obligatorio').not().isEmpty(),
    check('numeroDocument', 'numero de documento es obligatorio').not().isEmpty(),
    check('direccion', 'dieccion es obligatorio').not().isEmpty(),
    check('telefono','telefono es obligatorio').not().isEmpty(),
    check('email','email es obligatorio').not().isEmpty(),
    check('numeroDocumento').custom(existeNumeroDocumentoByPersona), 
    check('tipoPersona').custom(existetipoPersona),  
        validadorCampos], personaControlles.personaPost)

router.put('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    check('id','No es valido').isMongoId(),
    check('id').custom(existePersonaById),
    validadorCampos
], personaControlles.personaPut)

router.put('/activar/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    check('id','No es valido').isMongoId(),
    check('id').custom(existePersonaById),
    validadorCampos
], personaControlles.personaPutActivar)

router.put('/desactivar/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    check('id','No es valido').isMongoId(),
    check('id').custom(existePersonaById),
    validadorCampos
], personaControlles.personaPutDesactivar)

router.delete('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL'),
    check('id','No es valido').isMongoId(),
    check('id').custom(existePersonaById),
    validadorCampos
], personaControlles.personaPutDelete)


export default router;