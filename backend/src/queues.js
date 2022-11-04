const Queue = require("bull");
const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");
const { createPdfTableProcess, createExelTableProcess } = require("./processes");

const queuePdf = new Queue("queue-for-report", `redis://${process.env.REDIS_URL}`);
const queueExel = new Queue("queue-for-report-exel", `redis://${process.env.REDIS_URL}`);

const { router, setQueues, replaceQueues, addQueue, removeQueue } = createBullBoard([
  new BullAdapter(queuePdf),
  new BullAdapter(queueExel),
])


queuePdf.process(createPdfTableProcess)
queueExel.process(createExelTableProcess)


queuePdf.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
  // app.get("/get-colums-values", async function (req, res, next) {

  //   try {
  //     let uniqueValues = await Order.distinct(req.query.selected)

  //     res.json({ values: uniqueValues })
  //   } catch (err) {
  //     console.error(err)
  //     res.send({ error: err.message })
  //   }

  // });
})
queueExel.on('completed', (job, result) => {
  console.log(`Job completed with result ${result.result}`);
})
queueExel.on('failed', (job, result) => {
  console.log(`Job failed with result`, result);
})
queueExel.on('error', (job, result) => {
  console.log(`Job failed with result`, result);

})

const sendReportToPdf = async ({ chosenColumns, filters }) => {
  await queuePdf.add({ fields: chosenColumns.split(','), filter: JSON.parse(filters) }, { attempts: 2 })
}
const sendReportToExel = async ({ chosenColumns, filters }) => {
  console.log('chosenColumns', chosenColumns);
  await queueExel.add({ fields: chosenColumns.split(','), filter: JSON.parse(filters) }, { attempts: 2 });

}

module.exports = { sendReportToPdf, sendReportToExel, router }