const { default: mongoose } = require("mongoose");
const { orderSchema } = require("./shemas");

const Order =  mongoose.model('Order', orderSchema);
module.exports = {Order}