import queryString from "query-string"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Category"],
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
    getSyncCategories: builder.query({
      query: () => ({
        url: "/api/categories",
        method: "GET",
        params: {
          status: "all",
          page: "none"
        }
      }),
      providesTags: ["Category"]
    })
  })
})

export const { useLazyGetSyncCategoriesQuery } = categoryApi