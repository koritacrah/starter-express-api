const mongoose = require('mongoose');
const {Schema} = mongoose;
const PersonaSchema = new Schema({
    nombre:{type: String, required: true},
    apellido:{type: String, required: true},
    documento :{type: String, required: true},
    email :{type: String},
    telefono:{type: String},
    titular:{type: Boolean, required: true},
    direccion:{type: Schema.Types.ObjectId, ref:"Direccion"},
    documentacion :{type: String}, // foto del documento
});
module.exports = mongoose.models.Persona || mongoose.model('Persona', PersonaSchema);