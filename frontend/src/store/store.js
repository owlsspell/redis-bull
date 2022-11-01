import { configureStore } from '@reduxjs/toolkit'
import columnsValuesReducer from "./slices/columnsValues"
import chosenColumnsReducer from "./slices/chosenFields"
import tableDataReducer from "./slices/resultTable"

export const store = configureStore({
  reducer: {
    values: columnsValuesReducer,
    chosenColumns: chosenColumnsReducer,
    tableData: tableDataReducer,
  }
})