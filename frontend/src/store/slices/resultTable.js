import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath } from '../../constants/all'
import createLink from '../../functions/getBlob';

export const fetchTableData = createAsyncThunk(
  'table/fetchTableData',
  async (params, { rejectWithValue }) => {
    console.log('111111111111111', params);
    // const [filters,checked] =  params
    // console.log('!!!!!!!!!!!!',checked);
    const filters = params.filters.map(item => (item))

    const chosenColumns = params.chosenColumns.sort((prev, next) => prev.sort - next.sort).map(item => (item.value))

    try {
      // const response = await axios.get(`${basePath}/get-result-table`, { params: { filters: JSON.stringify(filters), chosenColumns: chosenColumns.join(',') } })
      const response = await axios.get(`${basePath}/generate-data`, { params: { filters: JSON.stringify(filters), chosenColumns: chosenColumns.join(','), checkedOptions: params.checkedOptions } })
      return response.data
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)
export const downloadPDF = createAsyncThunk(
  'table/downloadPDF',
  async (params, { rejectWithValue }) => {
    console.log('111111111111111', params);
    console.log('111111111111111chosenColumns', params.chosenColumns);
    // const [filters,checked] =  params
    // console.log('!!!!!!!!!!!!',checked);
    const filters = params.filters.map(item => (item))

    const chosenColumns = params.chosenColumns.sort((prev, next) => prev.sort - next.sort).map(item => (item.value))

    try {
      const response = await fetch(`${basePath}/pdf?` +
        new URLSearchParams({ filters: JSON.stringify(filters), chosenColumns: chosenColumns.join(',') }))
      // const response = await axios.get(`${basePath}/pdf`, { params: { filters: JSON.stringify(filters), chosenColumns: chosenColumns.join(',') } })
      console.log('response', response);
      if (response.status === 200) {
        // const blob = await response.blob()
        // console.log('blob,', blob);
        // const downloadUrl = window.URL.createObjectURL((blob))
        // const link = document.createElement('a')
        // link.href = downloadUrl;
        // link.setAttribute('download', 'table.pdf')
        // document.body.appendChild(link)
        // link.click()
        // link.remove()
        createLink(response)
      }

    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)
export const downloadXML = createAsyncThunk(
  'table/downloadXML',
  async (params, { rejectWithValue }) => {
    const filters = params.filters.map(item => (item))

    const chosenColumns = params.chosenColumns.sort((prev, next) => prev.sort - next.sort).map(item => (item.value))

    try {
      const response = await axios.get(`${basePath}/exel`, { params: { filters: JSON.stringify(filters), chosenColumns: chosenColumns.join(',') } })
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

export const { } = showResultTableSlice.actions
export default showResultTableSlice.reducer

