import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
  }),

  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], null>({
      query: () => "getAllUsers",
    }),

    updateUser: builder.mutation<
      any,
      { id: number; updateUser: Partial<User> }
    >({
      query: ({ id, updateUser }) => ({
        url: `updateUser/${id}`,
        method: "PATCH",
        params: { id },
        body: updateUser,
      }),
    }),

    banUser: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `banUser/${id}`,
        method: "PATCH",
        params: { id },
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useBanUserMutation,
} = userApi;
