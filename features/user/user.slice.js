import { createSlice } from "@reduxjs/toolkit"

import AsyncStorage from "@react-native-async-storage/async-storage"

const userSlice = createSlice({
  name: "userSlice",
  initialState: async () => await AsyncStorage.getItem("user"),
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