const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    batch: { type: String, required: true },
    amountPaid: { type: Number, default: 0 },
});

module.exports = mongoose.model('Customer', customerSchema);
