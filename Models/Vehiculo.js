const mongoose = require('mongoose');
const {Schema} = mongoose;
const VehiculoSchema = new Schema({
    marca:{type: String, required: true},
    modelo:{type: String, required: true},
    color :{type: String, required: true},
    patente :{type: String, required: true}
});
module.exports = mongoose.models.Vehiculo || mongoose.model('Vehiculo', VehiculoSchema);