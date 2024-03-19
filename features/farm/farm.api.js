import queryString from "query-string"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const farmApi = createApi({
  reducerPath: "farmApi",
  tagTypes: ["Farm"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json")
      headers.set("Authorization", `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`)

      return headers
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true
      })
    }
  }),
  endpoints: (builder) => ({
    getSyncFarms: builder.query({
      query: () => ({
        url: "/api/farms",
        method: "GET",
        params: {
          status: "all",
          page: "none"
        }
      }),
      providesTags: ["Farm"]
    })
  })
})

export const { useLazyGetSyncFarmsQuery } = farmApi