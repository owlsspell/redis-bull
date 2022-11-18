import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import './css/loader.css';
import Fields from './components/Fields';
import OptionsList from './components/OptionsList';
import Preview from './components/Preview';
import ResultQuery from './components/ResultQuery';
import SelectMenu from './components/SelectMenu';
import Table from './components/Table';
import ButtonMain from './components/utils/ButtonMain';
import fields from './constants/fields';
import { addColumns } from './store/slices/chosenFields';
import { downloadPDF, downloadXML, fetchTableData } from './store/slices/resultTable';
import { basePath } from './constants/all';

function App() {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [links, showLinks] = useState({
    pdf: false,
    table: false,
    xml: false,
  });
  // const chosenColumns = useSelector(state => state.chosenColumns.columns)
  const chosenFilters = useSelector(state => state.chosenColumns.filter)

  const tableData = useSelector(state => state.tableData.tableData)
  console.log('chosenFilters,', chosenFilters);
  const filters = chosenFilters.map(filter => ({ [filter.selectedColumn.value]: filter.selectedValue }))
  console.log('filters', filters);
  const checked = useSelector(state => state.chosenColumns.checkedFields)
  const checkedOptions = useSelector(state => state.userWant.checkedOptions)



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

  function handleClick() {
    // let chosenColumns = []
    // for (let key in checked) {
    //   if (checked[key]) {
    //     fields.filter((field) => field.value === key
    //       // && dispatch(addColumns(field))
    //       && chosenColumns.push(field))
    //   }
    // }
    setLoading(true)
    let chosenColumns = getColumns()
    console.log('chosenColumns', chosenColumns);
    dispatch(fetchTableData({ filters, chosenColumns, checkedOptions }))
      .then((res) => {
        console.log('res', res);
        setLoading(false)
        if (res && res.payload.status === 'ok') {

          showLinks(res.payload.result)
        }
      })
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

  console.log('links', links);

  return (
    <>
      <div className="bg-gradient-to-b from-green-500 to-teal-500  w-full">
        <div className="container mx-auto pt-10">
          {/* <Fields />
        <SelectMenu />
        <ResultQuery />
        <button className="text-white text-2xl font-bold py-1 px-4 mt-10 border-2 border-white rounded-lg bg-teal-800" onClick={getData} >Get result</button>
        <Table /> */}
          <Preview />
          <SelectMenu />
          <ResultQuery />

          {isLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> :
            <><div>
              <div className="flex justify-around	pt-8 space-x-6 ">
                <OptionsList />
                {links.pdf || links.xml ?
                  <div className='text-white flex flex-col'>
                    {links.pdf ?
                      <a className='hover:underline' href={basePath + '/document.pdf'} key="Download pdf" download>Download pdf</a> : ""}
                    {links.xml ?
                      <a className='hover:underline' href={basePath + '/statistics.xlsx'} key="Download xlsm" download>Download xlsm</a> : ""}
                  </div>
                  : ""}
              </div>
              <div className="flex justify-center	py-10">

                <ButtonMain text="Get table" onClick={handleClick} />
              </div>
            </div>

            </>
          }

        </div>

      </div>
      {!isLoading && <Table />}
    </>
  );
}

export default App;
