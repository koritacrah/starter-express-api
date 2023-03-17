const mongoose = require('mongoose');
const {Schema} = mongoose;
const DireccionSchema = new Schema({
    calle:{type: String},
    numero:{type: Number},
    ciudad :{type: String},
    region :{type: String},
    cpp :{type: Number},
    pais :{type: String},
});
module.exports = mongoose.models.Direccion || mongoose.model('Direccion', DireccionSchema);