import { configureStore } from "@reduxjs/toolkit"

import informationSlice from "../features/information/information.slice"

export const store = configureStore({
  reducer: {
    information: informationSlice
  }
})