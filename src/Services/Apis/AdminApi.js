import { baseQueryWithReauth } from "../ConnectApi/AdminConnectApi.js";
import { createApi } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /*
    admin login api
    */
    adminLogin: builder.mutation({
      query: (form) => ({
        url: "/adminlogin",
        method: "POST",
        body: form,
      }),
    }),

    /*
    get query accesstoken
    */
    adminrefreshtoken: builder.query({
      query: () => ({
        url: "/refresh-token",
        transformResponse: (response) => response.access_token,
      }),
    }),

    /*
    get user list
    */
    getUserList: builder.query({
      query: ({ page, limit }) => `/adminuserslist?page=${page}$limit=${limit}`,
      providesTags: ["getUsersLists"],
    }),

    /*
    block user
    */
    blockuser: builder.mutation({
      query: ({ id }) => ({
        url: "/adminblockuser",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["getUsersLists"],
    }),

    /*
    add category
    */

    addCategory: builder.mutation({
      query: (form) => ({
        url: "/adminaddcategory",
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["getCategory"],
    }),

    /*
    get category
    */

    getCategory: builder.query({
      query: ({ page, limit }) =>
        `/admingetcategory?page=${page}$limit=${limit}`,
      providesTags: ["getCategory"],
    }),

    /*
    block and unblock category
    */

    blockCategory: builder.mutation({
      query: ({ id }) => ({
        url: "/adminblockcategory",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["getCategory"],
    }),

    /**
     *  edit category
     */

    EditCategory: builder.mutation({
      query: (form) => ({
        url: "/admineditcategory",
        method: "PUT",
        body: form,
      }),
      invalidatesTags: ["getCategory"],
    }),

    /**
     * add product
     */

    addProduct: builder.mutation({
      query: (form) => ({
        url: "/adminadd-product",
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["getProducts"],
    }),

    /**
     * get products
     * product pagination
     */

    getProducts: builder.query({
      query: ({ page, limit }) =>
        `/adminlist-Products?page=${page}$limit=${limit}`,
      providesTags: ["getProducts"],
    }),

    /**
     * admin block and unblock product
     */

    blockProduct: builder.mutation({
      query: ({ id }) => ({
        url: "/admin-block-product",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["getProducts"],
    }),

    /**
     * get edit product
     */

    getEitProduct: builder.query({
      query: ({ product_id }) => `get-edit-product?product_id=${product_id}`,
      providesTags: ["getEditProduct"],
    }),

    /**
     * admin edit products
     */

    EditProduct: builder.mutation({
      query: (form) => ({
        url: "/admin-edit-product",
        method: "PUT",
        body: form,
      }),
      invalidatesTags: ["getProducts", "getEditProduct"],
    }),

    /**
     * admin orders list
     */

    OrdersList: builder.query({
      query: ({ page, limit }) =>
        `/get-orders-list?page=${page}$limit=${limit}`,
      providesTags: ["getOrdersDetails"],
    }),

    /**
     * change order status
     */

    ChangeOrderStatus: builder.mutation({
      query: ({ user_id, order_id, action }) => ({
        url: "/change-order-status",
        method: "PUT",
        body: { user_id, order_id, action },
      }),
      invalidatesTags: ["getOrdersDetails"],
    }),

    /**
     * admin add coupon
     */

    AddCoupon: builder.mutation({
      query: (form) => ({
        url: "/admin-add-coupon",
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["getcoupons"],
    }),

    /**
     * admin get coupon list
     */

    GetCouponList: builder.query({
      query: ({ page, limit }) =>
        `/get-coupon-list?page=${page}$limit=${limit}`,
      providesTags: ["getcoupons"],
    }),

    /**
     * admin block unblock coupon
     */

    BlockCoupon: builder.mutation({
      query: ({ id }) => ({
        url: "/admin-block-coupon",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["getcoupons"],
    }),

    /**
     * admin add offer
     */

    AddOffer: builder.mutation({
      query: (form) => ({
        url: "/admin-add-offer",
        method: "POST",
        body: form,
      }),
    }),

    /**
     * get offer list
     */

    getOffer: builder.query({
      query: ({ page, limit }) => `/get-offer-list?page=${page}$limit=${limit}`,
      providesTags:["getOffers"]
    }),

    /**
     * admin block offer
     */

    Blockffer: builder.mutation({
      query: ({ id }) => ({
        url: "/admin-block-offer",
        method: "POST",
        body: { id }
      }),
      invalidatesTags: ["getOffers"]
    }),

    /**
     * sales report
     */


    GetSalesReport: builder.query({
      query: ({ sortBy, startDate, endDate, page, limit }) =>
        `/get-sales-report?page=${page}&limit=${limit}&sortBy=${sortBy}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['getSalesReport'],
    }),


    GetPlainSalesReport: builder.query({
      query: () =>
        `/get-sales-report`,
      providesTags: ['getSalesReport'],
    }),

    /**
     * get top  products
     */

    GetTopProducts: builder.query({
      query: ()=> '/get-top-products'
    }),
    
    /**
     * get top category
     */

    GetTopCategory: builder.query({
      query: () => '/get-top-category'
    }),

    /**
     * get graph data
     */

    GetGraphData : builder.query({
      query: ({period}) => `/get-graph-data?period=${period}`
    })
    
    
    // ---------------
  }),
});

export const {
  useAdminLoginMutation,
  useGetUserListQuery,
  useBlockuserMutation,
  useAddCategoryMutation,
  useGetCategoryQuery,
  useBlockCategoryMutation,
  useEditCategoryMutation,
  useAddProductMutation,
  useGetProductsQuery,
  useBlockProductMutation,
  useEditProductMutation,
  useGetEitProductQuery,
  useOrdersListQuery,
  useChangeOrderStatusMutation,
  useAddCouponMutation,
  useGetCouponListQuery,
  useBlockCouponMutation,
  useAddOfferMutation,
  useGetOfferQuery,
  useBlockfferMutation,
  useGetSalesReportQuery,
  useGetPlainSalesReportQuery,
  useGetTopProductsQuery,
  useGetTopCategoryQuery,
  useGetGraphDataQuery,

} = adminApi;
