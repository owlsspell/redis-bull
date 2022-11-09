const { default: mongoose } = require("mongoose");
const { orderSchema } = require("./shemas");
const { reportSchema } = require("./shemas");

const Order = mongoose.model('Order', orderSchema);
const Report = mongoose.model('Report', reportSchema);
module.exports = { Order, Report }