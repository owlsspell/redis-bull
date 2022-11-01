import fields from '../constants/fields'
import Options from './Option'
import { fetchValues } from '../store/slices/columnsValues'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { addFieldFilter } from '../store/slices/chosenFields'

export default function SelectMenu() {
  const values = useSelector(state => state.values.columnValues)
  const [selectedColumn, setSelectedColumn] = useState(false)
  const [selectedValue, setSelectedValue] = useState(false)
  const [queryColumn, setQueryColumn] = useState('')
  const [queryValue, setQueryValue] = useState('')
  const chosenFilters = useSelector(state => state.chosenColumns.filter)

  const dispatch = useDispatch()

  const addFilters = () => {
    if (!chosenFilters.some(item => item.selectedColumn.value === selectedColumn.value && item.selectedValue === selectedValue)) {
      dispatch(addFieldFilter({ selectedColumn, selectedValue }))
    }
  }
console.log('selectedColumn,',selectedColumn);
  useEffect(() => {
    if(selectedColumn.value){
    dispatch(fetchValues(selectedColumn.value))
    }
  }, [dispatch, selectedColumn])

  useMemo(() => {
    if (selectedColumn) {
      setSelectedValue(values[0])
    }
  }, [values])


  return (
    <div className="flex items-center flex-col"><h4 className="text-white text-2xl font-bold my-5">Add filter for column data (if you want)</h4>
      <div className="flex items-center">

        <Options fields={fields} selected={selectedColumn} setSelected={setSelectedColumn} query={queryColumn} setQuery={setQueryColumn} />

        <Options fields={values} selected={selectedValue} setSelected={setSelectedValue} query={queryValue} setQuery={setQueryValue} />
        <button className="text-white text-2xl font-bold py-1 px-4 border-2 border-white rounded-lg bg-teal-500 disabled:opacity-60" onClick={addFilters} disabled={!selectedColumn || !selectedValue}>Add</button>
      </div>
    </div>
  )
}
