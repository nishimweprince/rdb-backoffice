import { Configuration } from "@/types/models/configurations"
import { createSlice } from "@reduxjs/toolkit"

const initialState: {
  configurations: Configuration[]
} = {
  configurations: []
}

export const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setConfigurations: (state, action) => {
      state.configurations = action.payload
    }
  }
})

export const { setConfigurations } = configurationSlice.actions
export default configurationSlice.reducer
