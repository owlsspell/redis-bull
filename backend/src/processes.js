const { Order } = require("../models/models");
const { createExel } = require("./workers/create-exel");
const { createPdf } = require("./workers/create-pdf");

const createPdfTableProcess = async (job, done) => {
  try {

    let all = job.data.filter.length > 0 ? await Order.find({ $and: job.data.filter }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })
    job.progress(50);
    createPdf(all, job.data.fields)
    // throw Error('Error');

    job.progress(100);
    done(null, 'finished');
    // return createPdf(all, job.data.fields)

  } catch (err) {
    done(new Error('Something wrong: ' + err.message));
  }



}
const createExelTableProcess = async (job, done) => {

  try {
    console.log('job.data.filter', job.data.filter);
    console.log('job.data.fields', job.data.fields);

    // const all = await Order.find(job.data.filter).sort({ first_name: 'asc' })
    let all = job.data.filter.length > 0 ? await Order.find({ $and: job.data.filter }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })
    // const all = await Order.find(job.data.filter).sort({ first_name: 'asc' })
    job.progress(50);
    createExel(all, job.data.fields)
    job.progress(100);
    // throw Error('Error');
    done(null, { result: 'done' })
  } catch (err) {
    job.log('createExelTableProcess error')

    done(new Error('Something wrong: ' + err.message));
  }
}
const queueProcess = async (job, done) => {
  try {
    console.log('job.data', job.data);
    let all = job.data.filter.length > 0 ? await Order.find({ $and: job.data.filter }).sort({ first_name: 'asc' }) :
      await Order.find().sort({ first_name: 'asc' })
    job.progress(30);
    createPdf(all, job.data.fields)
    job.progress(50);
    createExel(all, job.data.fields)
    job.progress(100);

    // const all = await Order.find(job.data.filter).sort({ first_name: 'asc' })
    // let all = job.data.filter.length > 0 ? await Order.find({ $or: job.data.filter }).sort({ first_name: 'asc' }) :
    //   await Order.find().sort({ first_name: 'asc' })
    // // const all = await Order.find(job.data.filter).sort({ first_name: 'asc' })
    // job.progress(50);
    // createExel(all, job.data.fields)
    // job.progress(100);
    // // throw Error('Error');
    done(null, { result: 'done' })
  } catch (err) {
    job.log('queueProcess error')

    done(new Error('Something wrong'));
  }
}

module.exports = { createPdfTableProcess, createExelTableProcess, queueProcess }