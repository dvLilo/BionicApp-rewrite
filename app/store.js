import { configureStore } from "@reduxjs/toolkit"

import { categoryApi } from "../features/category/category.api"

import userSlice from "../features/user/user.slice"
import informationSlice from "../features/information/information.slice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    information: informationSlice,

    [categoryApi.reducerPath]: categoryApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([categoryApi.middleware])
})