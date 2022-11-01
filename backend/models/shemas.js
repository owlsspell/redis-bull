const { default: mongoose } = require("mongoose")

const orderSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  department: String,
  totalSum: String,
})

module.exports = {orderSchema}