import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Fields from './components/Fields';
import Preview from './components/Preview';
import ResultQuery from './components/ResultQuery';
import SelectMenu from './components/SelectMenu';
import Table from './components/Table';
import ButtonMain from './components/utils/ButtonMain';
import fields from './constants/fields';
import { addColumns } from './store/slices/chosenFields';
import { downloadPDF, downloadXML, fetchTableData } from './store/slices/resultTable';

function App() {
  const dispatch = useDispatch()
  // const chosenColumns = useSelector(state => state.chosenColumns.columns)
  const chosenFilters = useSelector(state => state.chosenColumns.filter)

  const tableData = useSelector(state => state.tableData.tableData)

  const filters = chosenFilters.map(filter => ({ [filter.selectedColumn.value]: filter.selectedValue }))

  const checked = useSelector(state => state.chosenColumns.checkedFields)


  const getColumns = () => {
    let chosenColumns = []
    for (let key in checked) {
      if (checked[key]) {
        fields.filter((field) => field.value === key
          && chosenColumns.push(field))
      }
    }
    chosenColumns.sort((prev, next) => prev.sort > next.sort)
    console.log(' chosenColumns.sort((prev, next) => prev.sort > next.sort)', chosenColumns.sort((prev, next) => prev.sort > next.sort));
    return chosenColumns
  }

  function addField() {
    // let chosenColumns = []
    // for (let key in checked) {
    //   if (checked[key]) {
    //     fields.filter((field) => field.value === key
    //       // && dispatch(addColumns(field))
    //       && chosenColumns.push(field))
    //   }
    // }
    let chosenColumns = getColumns()
    console.log('chosenColumns', chosenColumns);
    dispatch(fetchTableData({ filters, chosenColumns }))
    // fields.forEach((field) => {
    //   setChecked({ ...checked, ...(checked[field.value] = false) })
    // })
  }

  const getPdf = () => {
    let chosenColumns = getColumns()
    console.log('chosenColumns', chosenColumns);

    dispatch(downloadPDF({ filters, chosenColumns }))
  }
  const getXml = () => {
    let chosenColumns = getColumns()
    console.log('chosenColumns', chosenColumns);

    dispatch(downloadXML({ filters, chosenColumns }))
  }

  return (
    <div className="absolute h-screen bg-gradient-to-b from-green-500 to-teal-500  w-full">
      <div className="container mx-auto pt-10">
        {/* <Fields />
        <SelectMenu />
        <ResultQuery />
        <button className="text-white text-2xl font-bold py-1 px-4 mt-10 border-2 border-white rounded-lg bg-teal-800" onClick={getData} >Get result</button>
        <Table /> */}
        <Preview />
        <SelectMenu />
        <ResultQuery />
        <div className="flex justify-center	py-10">

          <ButtonMain text="Get table" onClick={addField} />
        </div>
        <div className="flex justify-center	pb-8 space-x-6 ">

          <ButtonMain text="Download pdf" onClick={getPdf} />
          <ButtonMain text="Download XLS" onClick={getXml} />
        </div>
      </div>
      {/* <Table /> */}
    </div>
  );
}

export default App;
