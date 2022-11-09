const { default: mongoose } = require("mongoose")

const orderSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  department: String,
  totalSum: String,
})
const reportSchema = new mongoose.Schema({
  files: [{
    documentType: [String],
    fields: [String],
    filters: [String]
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orderSchema'
  },

})

module.exports = { orderSchema, reportSchema }