import { createSlice } from '@reduxjs/toolkit'
import fields from "../../constants/fields";

const chosenColumnsSlice = createSlice({
  name: 'columns',
  initialState: {
    // columns: [],
    filter: [],
    checkedFields: Object.assign({}, ...fields.map(field => ({ [field.value]: true }))),
  },
  reducers: {
    // addColumns(state, action) {
    //   state.columns.push(action.payload) 
    // },
    addFieldFilter(state, action) {
      state.filter.push(action.payload)
    },
    setCheckedFields(state, action) {
      state.checkedFields = ({ ...state.checkedFields, [action.payload]: !state.checkedFields[action.payload] });
    },
    clearCheckedFields(state, action) {
      fields.forEach((field) => {
        state.checkedFields = ({ ...state.checkedFields, ...(state.checkedFields[field.value] = false) })

      })
    },
  },
})

export const { addColumns, addFieldFilter, setCheckedFields, clearCheckedFields } = chosenColumnsSlice.actions
export default chosenColumnsSlice.reducer




// let data = [
//   {id: 1, serial: "Blood.Drive", season: 1},
//   {id: 2, serial: "Blood.Drive", season: 1},
//   {id: 3, serial: "Foo.Bar", season: 1},
//   {id: 4, serial: "HelloWorld", season: 1},
//  ]
 
//  let unique = data.reduce((p,c)=>p.add(c.serial), new Set())
 
//  console.log(unique)
