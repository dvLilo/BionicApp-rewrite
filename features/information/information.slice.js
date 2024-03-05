import { createSlice } from "@reduxjs/toolkit"

const informationSlice = createSlice({
  name: "informationSlice",
  initialState: null,
  reducers: {
    setInformationData: (_, action) => {
      return action.payload
    },
    resetInformationData: () => {
      return null
    }
  }
})

export const { setInformationData, resetInformationData } = informationSlice.actions

export default informationSlice.reducer