const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    order: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: "IN PROCESS"
    },
    create: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Order', orderSchema)