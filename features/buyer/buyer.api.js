import queryString from "query-string"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const buyerApi = createApi({
  reducerPath: "buyerApi",
  tagTypes: ["Buyer"],
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
    getSyncBuyers: builder.query({
      query: () => ({
        url: "/api/buyers",
        method: "GET",
        params: {
          status: "all",
          page: "none"
        }
      }),
      providesTags: ["Buyer"]
    })
  })
})

export const { useLazyGetSyncBuyersQuery } = buyerApi