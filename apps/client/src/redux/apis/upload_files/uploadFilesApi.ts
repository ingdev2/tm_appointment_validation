import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadFilesApi = createApi({
  reducerPath: "uploadFilesApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-files`,
  }),

  endpoints: (builder) => ({
    compareFiles: builder.mutation<IExcelRows[], FormData>({
      query: (files) => ({
        url: `compareFiles`,
        method: "POST",
        body: files,
      }),
    }),
  }),
});

export const { useCompareFilesMutation } = uploadFilesApi;
