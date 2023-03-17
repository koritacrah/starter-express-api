const persona = require('../models/Persona');
const jwt = require('jsonwebtoken');
const direccion = require('../models/Direccion');
const empleado = require('../models/Empleado');
require('dotenv').config();
const personaControl = {}
personaControl.crear = async (req, res) => {
    
    nueva = await persona.findOne({"Documento":req.body.Persona.Documento});
    if(!nueva){
        try {
            const dire = new direccion(req.body.Direccion);
        await dire.save();
        nueva = new persona(req.body.Persona);
        nueva.direccion = dire._id;
        console.log(nueva);
        await nueva.save();
        res.status(200).json({
            'status': '1',
            'msg': 'persona guardada'
        })
        }catch (error) {
            console.log(error);
            res.status(400).json({
                'status': '0',
                'msg': 'Error guardando la persona'
            })
        }   
    }else {
        res.status(400).json({
            'status': '0',
            'msg': 'Persona con el mismo documento ya registrada'
        })
    }
}

personaControl.traerEmpleados = async (req, res) => {
    try {
        nueva = await empleado.find().populate("datos");
        res.status(200).json({
            'status': '1',
            'msg': nueva
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error consultandolos empleados'
        })
    }
}
personaControl.traerEmpleadoU = async (req, res) => {
    try {
        console.log(req.params.usuario);
        unico = await empleado.findOne({usuario: req.params.usuario}).populate("datos");
        res.status(200).json({
            'status': '1',
            'msg': unico
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error consultando empleado'
        })
    }
}

personaControl.EditarPers = async (req, res) => {
    try {
        pers = new persona(req.body);
        aux = await persona.findOne({ documento : pers.documento });
        console.log(aux);
        if(!aux){
            res.status(400).json({
                'status': '0',
                'msg': 'no existe persona con ese documento'
            })
        }else{
        console.log(req.body);
        
        await persona.updateOne({ documento : pers.documento }, pers);
        res.status(200).json({
            'status': '1',
            'nuevo': pers
        })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error editando persona'
        })
    }
};



personaControl.crearEmpleado = async (req, res) => {
if(req.user.usuario.root==true){
nueva = await persona.findOne({"documento":req.body.Persona.documento});
usuarioRepe= await empleado.findOne({"usuario":req.body.Empleado.usuario});
console.log(usuarioRepe+nueva)
if (!nueva && !usuarioRepe){
    try {
        const dire = new direccion (req.body.Direccion);
        const datos = new persona(req.body.Persona);
        datos.titular = false;
        datos.direccion= dire._id;
        const nuevo = new empleado(req.body.Empleado);
        
        await dire.save();
        await datos.save();
        nuevo.datos = datos._id;
        await nuevo.save();
        res.status(200).json({
            'status': '1',
            'msg': 'empleado guardado'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            'status': '0',
            'msg': 'error guardando empleado'
        })
    }
}else {
    res.status(400).json({
        'status': '0',
        'msg': 'empleado con el mismo documento o usuario ya registrado'
    })
}
 }
 else{
     res.status(401).json({
         'status': '0',
         'msg': 'empleado no autorizado a cargar empleados'
     })
 }
}
personaControl.Login = async(req,res) =>{
    criteria = {
        "usuario":req.body.usuario,
        "password":req.body.password
    }
    console.log(criteria);
    try {
        aux = await empleado.findOne(criteria).populate("datos");
       console.log(aux)
        if(!aux){
           res.status(400).json({
               status: 0,
               msg:"empleado no encontrado"
           });
        }else{
            console.log('holi');
            const unToken = jwt.sign({usuario: aux}, process.env.JWT);
            res.json({
                status: 1,
                msg: "Usuario encontrado", 
                user: aux,
                token: unToken 
            }) 
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 0,
            msg:"error loggeando empleado"
        });
    }

} 


// verificacion del tokenn 
 personaControl.verificarToken = async (req, res, next) => {
    console.log(req.headers.authorization);
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    const token = authHeader;
  console.log(token);
    if (!token) {
      // Si no hay token, devolver un error de autenticación
      return res.status(401).json({
        "msg":'error de autenticacion'
      });;
    }
  
    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT);
      console.log(decoded);
      // Agregar la información del usuario al objeto de solicitud para su posterior uso
      req.user = decoded;
     
      // Continuar con la ejecución de la ruta
      next();
    } catch (err) {
      // Si el token no es válido, devolver un error de autenticación
      return res.status(401).json({
        "msg":'debe registrarse para realizar esta operacion'
      });
    }
  }

module.exports = personaControl;