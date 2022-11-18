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

    let data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
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

  const options = JSON.parse(req.query.checkedOptions)
  for (let option in options) {
    if (options[option]) {
      documentType.push(option)
    }
  }


  const { pdf, xml, table } = JSON.parse(req.query.checkedOptions)
  let data = null
  console.log(' pdf, xml, table ', pdf, xml, table);
  if (table) {
    // data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters.and), $or: JSON.parse(req.query.filters.or) }).sort({ first_name: 'asc' }) :
    data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })
    if (!pdf && !xml && table) {
      console.log('headers 1');

      return res.json({ data: data, chosenColumns: req.query.chosenColumns, result: { pdf, xml, table }, status: 'ok' })
    }
  }
  if (pdf) {
    sendReportToPdf(req.query)
  }
  if (xml) {
    sendReportToExel(req.query)
  }
  // let unique = data.reduce((p,c)=>p.add(c.serial), new Set())
  let results = []
  queue.on('completed', async (job, result) => {

    // app.use("/generate-data", async function (req, res, next) {
    if (pdf && job.name === 'pdf-process') {
      console.log(`Job ${job.name} completed with result ${result.result}`);
      results.push(job.name)
    }
    if (xml && job.name === 'xml-process') {
      console.log(`Job ${job.name} completed with result ${result.result}`);
      results.push(job.name)

    }
    console.log('results.length', results.length);
    console.log('results', results);
    if ((((pdf && !xml) || (!pdf && xml)) && results.length === 1) ||
      (pdf && xml && results.length === 2)) {
      console.log('headers 2');
      res.json({ data: data, chosenColumns: req.query.chosenColumns, result: { pdf, xml, table }, status: 'ok' })
    }



    // if (table) {
    //   data = JSON.parse(req.query.filters).length > 0 ? await Order.find({ $and: JSON.parse(req.query.filters) }).sort({ first_name: 'asc' }) :
    //     await Order.find().sort({ first_name: 'asc' })

    // }
    console.log('DONE');

  })
  console.log('DONE!!!!!!');

  // res.json({ data: data, chosenColumns: req.query.chosenColumns, status: 'ok' })

  queue.on('global:completed', (jobId, result) => {
    // Check if id is a number without any additions

    console.log(`Producer get: Job ${jobId} completed! Result: ${result}`);
    console.log(`Job is completed with result: ${result}`);

  });
  // res.json({ data, chosenColumns: req.query.chosenColumns })
  // } else {
  // res.json({ status: 'ok' })
  // }
  // let result = ["department"]
  // JSON.parse(req.query.filters).map(item => {
  //   // result.includes(item)
  //   console.log('item', Object.keys(item)[0]);
  //   console.log(' result.includes(Object.values(item))', result.includes(Object.values(item)[0]));
  // })
  // console.log(JSON.parse(req.query.filters));

  // console.log('Object.assig', Object.assign(JSON.parse(req.query.filters)));
  console.log('documentType', documentType);
  // Report.create({
  //   documentType,
  //   fields: (req.query.chosenColumns).split(','),
  //   filters: JSON.parse(req.query.filters)
  // }, function (err, small) {
  //   if (err) return console.log(err);;
  //   // saved!
  // })

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


  // return Promise.all(promises).then((result) => {
  //   // res.json({ data, chosenColumns: req.query.chosenColumns })
  //   console.log('111111111res', result);
  //   res.json({ data: result[0], chosenColumns: req.query.chosenColumns, status: 'ok' })
  // });


  // } catch (err) {
  //   console.error(err)
  //   res.send({ error: err.message })
  // }

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

