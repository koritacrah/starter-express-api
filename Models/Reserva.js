const mongoose = require('mongoose');
const {Schema} = mongoose;
const ReservaSchema = new Schema({
    titular:{type: Schema.Types.ObjectId, ref: "Persona", required: true},
    acompanantes: {type: [Schema.Types.ObjectId],ref: "Persona", required:false},
    vehiculo:{type: Schema.Types.ObjectId, ref: "Vehiculo", required: false},
    nroacompanantes:{type: String, required: true},
    frecuenciaLimpieza:{type: String, required: true}, //string porque es una frase que manda desde el form
    transporte:{type: String},
    medioTransporte:{type: String},
    notas:{type: String},
    firma:{type: String},//foto de la firma
    fechaLlegada:{type: Date},
    fechaSalida:{type: Date},
    horaLLegada:{type: String}
});
module.exports = mongoose.models.Reserva || mongoose.model('Reserva', ReservaSchema);