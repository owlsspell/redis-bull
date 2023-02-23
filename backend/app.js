var express = require("express");
const fs = require("fs");
const app = express();
const Queue = require("bull");
const port = 5000
const { createBullBoard } = require('bull-board')
const { BullAdapter } = require('bull-board/bullAdapter');
const { sendReportToPdf, router, sendReportToExel, queue } = require("./src/queues");
const mongoose = require('mongoose');
const { Order, Report } = require("./models/models");
const path = require("path");
const cors = require('cors')

app.use(cors())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static('uploads'));


app.use('/admin/queues', router)

main().then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err));


async function main() {
  await mongoose.connect('mongodb://mongo_db:27017/database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  )
}


app.get("/pdf", async function (req, res, next) {

  try {
    await sendReportToPdf(req.query)

    res.download(path.join(__dirname, './document.pdf'))

  } catch (err) {
    console.error(err)
    res.send({ error: err.message })
  }
});


app.get("/exel", async function (req, res, next) {
  try {
    await sendReportToExel(req.query)
    res.send({ status: 'ok' })
  } catch (err) {
    console.error(err)
    res.send({ error: err.message })
  }

});

app.get("/get-colums-values", async function (req, res, next) {

  try {
    let uniqueValues = await Order.distinct(req.query.selected)

    res.json({ values: uniqueValues })
  } catch (err) {
    console.error(err)
    res.send({ error: err.message })
  }

});

app.get("/get-result-table", async function (req, res, next) {

  console.log('filters app', req.query);
  try {

    let data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })
    res.json({ data, chosenColumns: req.query.chosenColumns })
  } catch (err) {
    console.error(err)
    res.send({ error: err.message })
  }

});
app.get("/generate-data", async function (req, res) {

  const { pdf, xml, table } = JSON.parse(req.query.checkedOptions)
  let data = null
  if (table) {
    // data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters.and), $or: JSON.parse(req.query.filters.or) }).sort({ first_name: 'asc' }) :
    data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })

    if (!pdf && !xml && table) {
      console.log('get table');
      return res.json({ data: data, chosenColumns: req.query.chosenColumns, result: { pdf, xml, table }, status: 'ok' })
    }
  }
  if (pdf) {
    console.log('get pdf');
    sendReportToPdf(req.query)
  }
  if (xml) {
    console.log('get xml');
    sendReportToExel(req.query)
  }

  res.json({ data: data, chosenColumns: req.query.chosenColumns, result: { pdf, xml, table }, status: 'ok' })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

