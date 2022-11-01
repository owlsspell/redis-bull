import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath } from '../../constants/all'

export const fetchValues = createAsyncThunk(
  'columnsValues/fetchValues',
  async (selected, { rejectWithValue }) => {
    console.log('selected,',selected);
    try {
      const response = await axios.get(`${basePath}/get-colums-values`,{params:{selected}})
      return response.data.values
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)

// const [selectedColumn, setSelectedColumn] = useState(false)
// const [selectedValue, setSelectedValue] = useState(false)
const columnsValuesSlice = createSlice({
  name: 'columnsValues',
  initialState: {
    columnValues: [],
    loading: true,
    error: false,
  },
  reducers: {
  
  },
  extraReducers: {
    [fetchValues.pending]: (state) => { state.loading = true; state.error = false },
    [fetchValues.fulfilled]: (state, action) => { state.loading = false; state.columnValues = action.payload },
    [fetchValues.error]: (state, action) => { state.loading = false; state.error = action.payload }
  }
})

export const {  } = columnsValuesSlice.actions
export default columnsValuesSlice.reducer

