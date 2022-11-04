var express = require("express");
const fs = require("fs");
const app = express();
const Queue = require("bull");
const port = 5000
const { createBullBoard } = require('bull-board')
const { BullAdapter } = require('bull-board/bullAdapter');
const { sendReportToPdf, router, sendReportToExel } = require("./src/queues");
const mongoose = require('mongoose');
const { Order } = require("./models/order");
const path = require("path");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/admin/queues');
// const queue = new Queue("queue-for-report", `redis://${process.env.REDIS_URL}`);

// const { router, setQueues, replaceQueues, addQueue, removeQueue } = createBullBoard([
//   new BullAdapter(queue),
// ])


app.use('/admin/queues', router)
// app.use('/admin/queues', serverAdapter.getRouter());

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

    let data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $or: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })
    res.json({ data, chosenColumns: req.query.chosenColumns })
  } catch (err) {
    console.error(err)
    res.send({ error: err.message })
  }

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

