import Persona from "../models/persona.js"


const  existePersonaById=async (id)=>{

    const existe= await  Persona.findOne(id)

    if (!existe) throw new Error(`El id no existe: ${id}`)

}

const  existeNumeroDocumentoByPersona=async (numeroDocumento)=>{

    const existe= await  Persona.findOne({numeroDocumento})

    if (existe) throw new Error(`Ya existe una persona con ese nombre`)

}
const  existetipoPersona=async(tipoPersona)=>{

    if (tipoPersona!='Usuario') {
        if (tipoPersona!='proveedor') {
           throw await new Error('tipo de persona no admitida')
            
        }
        
    }
    

}

 export{existeNumeroDocumentoByPersona, existePersonaById, existetipoPersona}