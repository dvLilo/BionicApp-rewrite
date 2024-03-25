import { configureStore } from "@reduxjs/toolkit"

import { categoryApi } from "../features/category/category.api"
import { farmApi } from "../features/farm/farm.api"
import { buildingApi } from "../features/building/building.api"
import { buyerApi } from "../features/buyer/buyer.api"
import { leadmanApi } from "../features/leadman/leadman.api"
import { plateApi } from "../features/plate/plate.api"

import { informationApi } from "../features/information/information.api"

import userSlice from "../features/user/user.slice"
import informationSlice from "../features/information/information.slice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    information: informationSlice,

    [categoryApi.reducerPath]: categoryApi.reducer,
    [buildingApi.reducerPath]: buildingApi.reducer,
    [farmApi.reducerPath]: farmApi.reducer,
    [buyerApi.reducerPath]: buyerApi.reducer,
    [leadmanApi.reducerPath]: leadmanApi.reducer,
    [plateApi.reducerPath]: plateApi.reducer,

    [informationApi.reducerPath]: informationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    categoryApi.middleware,
    buildingApi.middleware,
    farmApi.middleware,
    buyerApi.middleware,
    leadmanApi.middleware,
    plateApi.middleware,

    informationApi.middleware
  ])
})