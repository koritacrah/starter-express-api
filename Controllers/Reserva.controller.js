const persona = require('../models/Persona');
const direccion = require('../models/Direccion');
const reserva = require ('../models/Reserva');
const vehiculo = require('../models/Vehiculo');
const reservaControl = {}
reservaControl.crear = async (req, res) => {
    var reser = await new reserva(req.body.Reserva);
    var dire = await new direccion(req.body.Direccion);
    console.log("aaa"+dire.id);
    //console.log(req.body.Reserva.acompaniantes[0]);
var per = await persona.findOne({"documento":req.body.Persona.documento});
console.log(req.body.Persona.documento);
if(!per){//si la persona no esta registrada la registramos
    try {
        console.log("PERSONA NO REGISTRADA");
        per = await new persona(req.body.Persona); //creamos persona
        per.direccion = dire._id;//seteamos la direcion de la persona com
        await dire.save();//guardamos la direccion
        per.titular=true;  
        await per.save();
        console.log("persona guardada");
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '0',
            'msg': 'error registrando persona'
        })
    }
}else { //avanzamos con la persona ya creada 
    try {
        console.log("PERSONA REGISTRADA");
        per = await persona.findOne({"documento":req.body.Persona.documento});
        console.log(per._id);
        per.titular=true;
        // await persona.findByIdAndUpdate({"documento":per.documento}, per);
        reser.titular = per._id;
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '',
            'msg': 'error creando persona existente'
        })
    }

} // seguimos con el proceso de la reserva

try {
    reser.titular=per._id;
    if(req.body.Vehiculo.marca){
    v = await vehiculo.findOne({"patente":req.body.Vehiculo.patente});
    if(!v){
    v = new vehiculo(req.body.Vehiculo);
    v.save();
    reser.vehiculo = v._id;
    }else{
        reser.vehiculo = v._id;
    }
    }
    
    console.log("guardando titular");
    for (i = 0; i < req.body.Reserva.acompaniantes.length; i++) {
        console.log("entra");
        //buscamos si los acompanantes (que mandamos en la peticion) ya estan en la base de datos.
        aux = await persona.findOne({"documento":req.body.Reserva.acompaniantes[i].documento});
        if(!aux){// si no estan los registramos
            console.log("Acompanante no registrado")
           console.log(req.body.Reserva.acompaniantes[i]);
           let compa ={nombre: req.body.Reserva.acompaniantes[i].nombre,
           apellido: req.body.Reserva.acompaniantes[i].apellido,
           documento: req.body.Reserva.acompaniantes[i].documento,
           documentacion: req.body.Reserva.acompaniantes[i].documentacion,
           email: req.body.Reserva.acompaniantes[i].email,
           telefono: req.body.Reserva.acompaniantes[i].telefono,
           titular: req.body.Reserva.acompaniantes[i].titular,
           direccion: dire._id}
           Acompanante = new persona(compa);
           Acompanante.titular=false;
           await Acompanante.save();// una vez creados lo guardamos en la base de datos.
           reser.acompanantes.push(Acompanante._id); //XD
        }else{
            // si estan solo los sumamos al array
            console.log("acompanante registrado");
            aux = await persona.findOne({"documento":req.body.Persona.documento});
            reser.acompanantes.push(aux._id);
            console.log(reser.acompanantes);
        }
      }
      reser.nroacompanantes = reser.acompanantes.length;

    await reser.save();
    res.status(200).json({
        'status': '1',
        'msg': reser._id
    })

} catch (error) {
    console.log(error);
        res.status(400).json({
            'status': '',
            'msg': 'error guardando reserva'
        })
}

}
reservaControl.traerUno = async (req, res) =>{
try {
    console.log(req.params.id);
    aux = await reserva.findById(req.params.id).populate("titular").populate("acompanantes").populate("vehiculo");
    if (!aux){
        res.status(400).json({
            'status': '0',
            'msg': 'no existe reserva conn ese id'
        })
    }else{
        res.status(200).json({
            'status': '1',
            'reserva': aux
        })
    }
} catch (error) {
    res.status(400).json({
        'status': '0',
        'msg': 'error consultando la reserva'
    })
}
}
reservaControl.editar = async (req, res) =>{
    try {
   var editada = {acompaniantes: [],
        frecuenciaLimpieza: req.body.Reserva.FrecuenciaLimpieza,
        notas: req.body.Reserva.notas,
        firma: req.body.Reserva.firma,
        fechaLlegada: req.body.Reserva.fechaLlegada,
        fechaSalida: req.body.Reserva.fechaSalida,

       
      }
    console.log(editada);
    aux = await reserva.findOne({ _id : req.params.id }); //reserva encontrada desde 
    if (!aux){
        res.status(400).json({
            'status': '0',
            'msg': 'no existe reserva con ese id'
        })
    }else{
        
        if(req.body.Persona){
        personaE = await persona.findOne({"documento":req.body.Persona.documento});
        if (!personaE){
            PersonaE = await new persona(req.body.Persona);
            direNueva = await new direccion(req.body.Direccion);//si no existia la persona vamos a tomar que no existe la direccion
            PersonaE.direccion=direNueva._id;
            await direNueva.save();
            await PersonaE.save();
            console.log(PersonaE);
            editada.titular = PersonaE._id
        }else{
            await direccion.updateOne({ _id : personaE.direccion }, req.body.Direccion);
            await persona.updateOne({ _id : personaE._id }, req.body.Persona)

        }
        console.log(req.body.Reserva.acompaniantes[1].documento);}
        
        if(req.body.Reserva.acompaniantes){
        for (let index = 0; index < req.body.Reserva.acompaniantes.length; index++) {
            acompAux = await persona.findOne({"documento":req.body.Reserva.acompaniantes[index].ocumento})
            if (!acompAux){
                acompAux = new persona(req.body.Reserva.acompaniantes[index]);
                acompAux.save();
                editada.acompanantes.push(acompAux._id);
            }else{
                await persona.updateOne({ _id : acompAux._id }, req.body.Reserva.acompaniantes[index]);
                editada.acompaniantes.push(acompAux._id);
            }

         
        }}
        console.log("llega");
        await reserva.updateOne({ _id : aux._id }, editada);
       
        res.status(200).json({
            'status': '1',
            'nuevo': editada
        })
    }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '0',
            'nuevo': "error editando la reserva"
        })
    }
    

}
reservaControl.TraerDiferenciadas = async (req,res)=>{
    
    console.log("entra");
try {
    Firmadas = await reserva.find({"firma": { $exists: true }}).populate("titular").populate("acompanantes").populate("vehiculo");
    NoFirmadas = await reserva.find({"firma": { $exists: false}}).populate("titular").populate("acompanantes").populate("vehiculo");;
    res.status(200).json({
        'status': '1',
        'firmadas': Firmadas,
        'nofirmadas':NoFirmadas
    })
} catch (error) {
    console.log(error);
    res.status(400).json({
        'status': '0',
        'msg': 'error consultando la informacion'
    })
}
}
reservaControl.traerTodas = async (req, res) => {
    try {
        reservas = await reserva.find().populate({
            path: "titular",
            populate: {
                path: "direccion",
                model: "Direccion"
            }
        }).populate("acompanantes").populate("vehiculo");
        res.status(200).json({
            'status': '1',
            'msg': reservas
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'status': '0',
            'msg': 'error llamando reservas'
        })
    }

}
module.exports = reservaControl;