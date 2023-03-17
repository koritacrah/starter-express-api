const mongoose = require('mongoose');
const {Schema} = mongoose;
const EmpleadoSchema = new Schema({
    datos:{type: Schema.Types.ObjectId, ref:'Persona', required: true},
    root:{type: Boolean, required: true},
    usuario :{type: String, required: true},
    password :{type: String, required: true}
});
module.exports = mongoose.models.Empleado || mongoose.model('Empleado', EmpleadoSchema);