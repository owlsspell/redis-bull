import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath } from '../../constants/all'

export const fetchTableData= createAsyncThunk(
  'table/fetchTableData',
  async (params, { rejectWithValue }) => {
    console.log('111111111111111',params);
    // const [filters,checked] =  params
    // console.log('!!!!!!!!!!!!',checked);
    const filters = params.filters.map(item=>(item))
    
    const chosenColumns = params.chosenColumns.map(item=>(item.value))
    try {
      const response = await axios.get(`${basePath}/get-result-table`,{params:{filters: JSON.stringify(filters),chosenColumns:chosenColumns.join(',')}})
      return response.data
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)
export const downloadPDF= createAsyncThunk(
  'table/downloadPDF',
  async (params, { rejectWithValue }) => {
    console.log('111111111111111',params);
    console.log('111111111111111chosenColumns',params.chosenColumns);
    // const [filters,checked] =  params
    // console.log('!!!!!!!!!!!!',checked);
    const filters = params.filters.map(item=>(item))
    
    const chosenColumns = params.chosenColumns.map(item=>(item.value))
    try {
      const response = await axios.get(`${basePath}/pdf`,{params:{filters: JSON.stringify(filters),chosenColumns:chosenColumns.join(',')}})
      return response.data
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)
export const downloadXML= createAsyncThunk(
  'table/downloadXML',
  async (params, { rejectWithValue }) => {
    console.log('111111111111111',params);
    console.log('111111111111111chosenColumns',params.chosenColumns);
    // const [filters,checked] =  params
    // console.log('!!!!!!!!!!!!',checked);
    const filters = params.filters.map(item=>(item))
    
    const chosenColumns = params.chosenColumns.map(item=>(item.value))
    try {
      const response = await axios.get(`${basePath}/exel`,{params:{filters: JSON.stringify(filters),chosenColumns:chosenColumns.join(',')}})
      return response.data
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)

const showResultTableSlice = createSlice({
  name: 'table',
  initialState: {
    tableData: [],
    loading: true,
    error: false,
  },
  reducers: {
  
  },
  extraReducers: {
    [fetchTableData.pending]: (state) => { state.loading = true; state.error = false },
    [fetchTableData.fulfilled]: (state, action) => { state.loading = false; state.tableData = action.payload },
    [fetchTableData.error]: (state, action) => { state.loading = false; state.error = action.payload },
 
    [downloadPDF.pending]: (state) => { state.loading = true; state.error = false },
    [downloadPDF.fulfilled]: (state, action) => { state.loading = false; state.tableData = action.payload },
    [downloadPDF.error]: (state, action) => { state.loading = false; state.error = action.payload },

    [downloadXML.pending]: (state) => { state.loading = true; state.error = false },
    [downloadXML.fulfilled]: (state, action) => { state.loading = false; state.tableData = action.payload },
    [downloadXML.error]: (state, action) => { state.loading = false; state.error = action.payload }
  }
})

export const {  } = showResultTableSlice.actions
export default showResultTableSlice.reducer

