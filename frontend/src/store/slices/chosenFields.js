import { createSlice } from '@reduxjs/toolkit'
import fields from "../../constants/fields";

const chosenColumnsSlice = createSlice({
  name: 'columns',
  initialState: {
    filter: [],
    checkedFields: Object.assign({}, ...fields.map(field => ({ [field.value]: true }))),
  },
  reducers: {
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

