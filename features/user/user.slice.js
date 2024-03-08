import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "userSlice",
  initialState: null,
  reducers: {
    setUserData: (_, action) => {
      return action.payload
    },
    resetUserData: () => {
      return null
    }
  }
})

export const { setUserData, resetUserData } = userSlice.actions

export default userSlice.reducer