function totalOrdersSum(data){
  let totalOrdersSum = data.reduce((previousValue, currentValue) => previousValue + Number(currentValue.totalSum.slice(1)), 0)
  let fixTotalOrdersSum =  Math.round(totalOrdersSum * 100) / 100;
  return ("$"+fixTotalOrdersSum) 
}
module.exports = {totalOrdersSum}