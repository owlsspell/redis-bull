import { createSlice } from '@reduxjs/toolkit'

const userWantListSlice = createSlice({
  name: 'userWant',
  initialState: {
    checkedOptions: {
      pdf: false,
      xml: false,
      table: true,
    }
  },
  reducers: {

    setUserWant(state, action) {
      state.checkedOptions = ({ ...state.checkedOptions, [action.payload]: !state.checkedOptions[action.payload] });

    },

  },
})

export const { setUserWant } = userWantListSlice.actions
export default userWantListSlice.reducer

