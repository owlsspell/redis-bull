var express = require("express");
const fs = require("fs");
const app = express();
const Queue = require("bull");
const port = 5000
const { createBullBoard } = require('bull-board')
const { BullAdapter } = require('bull-board/bullAdapter');
const { sendReportToPdf, router, sendReportToExel } = require("./src/queues");
const mongoose = require('mongoose');
const { Order, Report } = require("./models/models");
const path = require("path");
const cors = require('cors')

app.use(cors())
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
app.get("/generate-data", async function (req, res, next) {
  let documentType = [];

  console.log('filters app', req.query);
  console.log('(JSON.parse(req.query.checkedOptions)', JSON.parse(req.query.checkedOptions));

  // (JSON.parse(req.query.checkedOptions)).map((option) => {
  //   if (option) {
  //     documentType.push(option)
  //   }
  // })
  const options = JSON.parse(req.query.checkedOptions)
  for (let option in options) {
    if (options[option]) {
      documentType.push(option)
    }
  }

  const { pdf, xml, table } = JSON.parse(req.query.checkedOptions)

  try {
    if (pdf) {
      sendReportToPdf(req.query)
    }
    if (xml) {
      sendReportToExel(req.query)
    }
    if (table) {
      data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $or: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
        await Order.find().sort({ first_name: 'asc' })

      res.json({ data, chosenColumns: req.query.chosenColumns })
    } else {
      res.json({ status: 'success' })
    }


    console.log('documentType', documentType);
    // await Report.create({

    //   files: [{
    //     documentType,
    //     fields: [String],
    //     filters: [String]
    //   }],
    //   userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'orderSchema'
    //   },
    // })


    // res.json({ data, chosenColumns: req.query.chosenColumns })

    // res.download(path.join(__dirname, './document.pdf'))

  } catch (err) {
    console.error(err)
    res.send({ error: err.message })
  }

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

