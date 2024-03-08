import { configureStore } from "@reduxjs/toolkit"

import userSlice from "../features/user/user.slice"
import informationSlice from "../features/information/information.slice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    information: informationSlice
  }
})