import { baseQueryWithReauth } from "../ConnectApi/Api.js";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
    /*
    user registration api
    */
        register: builder.mutation({
            query: (form) => ({
                url: "/user/register",
                method: "POST",
                body: form
            })
        }),

    /*
    user verify Otp
    */
        verifyOtp: builder.mutation({
            query: (otpData) =>({
                url: "/user/verifyOtp",
                method: "POST",
                body: otpData
            })
        }),

    /*
    user resend Otp 
    */

    resendOtp: builder.mutation({
        query: (userId) =>({
            url: "/user/resendOtp",
            method: "POST",
            body: userId
        })
    }),

    /*
    user login 
    */

    login: builder.mutation({
        query: (form)=> ({
            url: "/user/login",
            method: "POST",
            body: form
        })
    }),

    /**
     * google authentication
     */

    GoogleAuth: builder.mutation({
        query: (userToken)=>({
            url: "/user/google-login",
            method: "POST",
            body: userToken
        })
    }),

    /**
     * get products
     * product pagination
     */

    getProducts: builder.query({
        query: ({ page, limit, category, sort }) =>
          `/user/list-Products?page=${page}&limit=${limit}&category=${category || ""}&sort=${sort || ""}`,
        providesTags: ['getProducts']
      }),
      

    /**
     * get products detailes
     * 
     */

    getProductsDetails: builder.query({
        query:({product_id,userId})=>`/user/Products-details?product_id=${product_id}&userId=${userId}`,
        providesTags:['getProductsDetails']
      }),

       /**
     * get user profile
     */

    getUserProfile: builder.query({
        query:() =>'/user/userProfile',
        providesTags:['getUserProfile']    
       }),


    /**
     * logout
     */

    logout: builder.mutation({
        query:()=>({
            url:'/user/logout',
            method: 'POST',
        })
    }),

    /**
     * edit user detailes 
     */

    EditUserInfo: builder.mutation({
        query:(info) =>({
            url:"/user/edit-userInfo",
            method: 'POST',
            body: info
        }),
        invalidatesTags:['getUserProfile']
    }),

    /**
     * change password
     */

    ChangePass : builder.mutation({
        query:(password) => ({
            url:"/user/change-password",
            method: 'POST',
            body: password
        })
    }),

    /**
     * add address
     */

    AddAddress : builder.mutation({
        query:(form)=>({
            url:"/user/add-address",
            method: 'POST',
            body: form
        }),
        invalidatesTags:['getAddresses']
    }),

    /**
     * get address 
     */

    GetAddresses: builder.query({
        query: ()=> '/user/user-address',
        providesTags:['getAddresses']
    }),

    /**
     * edit address
     */

    EditAddress: builder.mutation({
        query:(form)=>({
            url:"/user/Edit-address",
            method: 'PUT',
            body: form
        }),
        invalidatesTags:['getAddresses']
    }),

    /**
     * delete address
     */

    DeleteAddress: builder.mutation({
        query:(address_id)=>({
            url:"/user/delete-address",
            method: 'DELETE',
            body: address_id
        }),
        invalidatesTags:['getAddress']
    }),

    /**
     * Add to cart
     */

    AddCart: builder.mutation({
        query:(items)=>({
            url:"/user/add-cart",
            method: 'POST',
            body: items
        }),
        invalidatesTags:['getProductsDetails',"getCartItems"]
    }),

    /**
     * get cart items 
     */

    GetCartItems: builder.query({
        query:()=> '/user/get-cart-items',
        providesTags:["getCartItems"]
    }),

    /**
     * delete cart item 
     */

    DeleteCartItem: builder.mutation({
        query:({product_id})=>({
            url:"/user/delete-cart-product",
            method:"DELETE",
            body:{product_id}
        }),
        invalidatesTags:["getCartItems","getProductsDetails"]
    }),
 
    /**
     * place order
     */

    PlaceOrder: builder.mutation({
        query:(items)=>({
            url:"/user/place-order",
            method: "POST",
            body:items
        }),
        invalidatesTags:['getCartItems','getOders']
    }),

    /**
     * get order details
     */
    getOrderDetailes: builder.query({
        query:({page,limit})=> `/user/get-order-items?page=${page}$limit=${limit}`,
        providesTags:['getOders']
    }),

    /**
     * cancel order
     */

    CancelOrder: builder.mutation({
        query:({product_id,quantity,order_id})=>({
            url:"/user/cancel-order",
            method: 'PUT',
            body:{product_id,quantity,order_id}

        }),
        invalidatesTags:['getOders','getProductsDetails','getProducts']
    }),

    /**
     * get active coupon 
     */

    ActiveCoupons: builder.query({
       query:()=> '/user/active-coupons',
       providesTags:['getActiveCoupons']
    }),

    /**
     * user apply coupon
     */

    ApplyCoupon : builder.mutation({
        query:(form)=>({
            url: "/user/apply-coupon",
            method: 'PUT',
            body: form
        })
    }),

    /**
     * verify payment 
     */

    VerifyPayment : builder.mutation({
        query:(items)=>({
            url: "/user/verify-payment",
            method: 'POST',
            body: items
        })
    }),

    /**
     * add whishlist 
     */

    AddWhishlist: builder.mutation({
       query:({product_id})=>({
        url: "/user/add-whishlist",
        method: 'POST',
        body: { product_id }
       }),
       invalidatesTags:['getWhishList']
    }),
    
    /**
     * get whishlist 
     */

    GetWhishlist: builder.query({
        query:()=> '/user/get-whishlist',
        providesTags:['getWhishList']
    }),

    /**
     * remove whishlist products
     */

    RemoveWhishlistProducts: builder.mutation({
        query:({product_id}) =>({
            url: '/user/delete-whishlist-products',
            method: 'DELETE',
            body: {product_id}
        })
    }),

    /**
     * add wallet 
     */

    AddWallet: builder.mutation({
        query:(item)=>({
            url: '/user/add-wallet',
            method:'POST',
            body: item
        }),
        invalidatesTags:['getWalletDetails']
    }),

    /**
     * get wallet 
     */

    GetWallet: builder.query({
        query:()=>'/user/get-wallet',
        providesTags:['getWalletDetails']
    }),

    /**
     * failed order
     */

    FailedOrder: builder.mutation({
        query:(items) =>({
            url:'/user/failed-order',
            method: 'POST',
            body: items
        }),
        invalidatesTags:['getCartItems', 'getOders', 'getProductsDetails']
    }),

    /**
     * retrying payment 
     */

    RetryingPayment: builder.mutation({
        query:(items)=>({
            url:'/user/retry-payment',
            method: 'POST',
            body: items
        })
    }),

    /**
     * verifying retrying payment 
     */

    VerifyRetry: builder.mutation({
        query:(items)=>({
            url: '/user/verify-retry',
            method: 'POST',
            body: items
        })
    }),

    /**
     * user home page geting top ten products
     */

    GetTopProducts: builder.query({
        query: ()=> '/user/get-top-products'
    }),

    /**
     * user home page geting top ten Categories
     */

    GetTopCategory: builder.query({
        query: ()=> '/user/get-top-category'
    }),

    /**
     * return order
     */
    
    ReturnOrder: builder.mutation({
        query: (items) => ({
          url: '/user/return-order-order',
          method: 'POST',
          body: items,
        }),
      })
      



// ----------
    })
})
export const {
useRegisterMutation,
useVerifyOtpMutation,
useResendOtpMutation,
useLoginMutation,
useGoogleAuthMutation,
useGetProductsQuery,
useGetProductsDetailsQuery,
useGetUserProfileQuery,
useLogoutMutation,
useEditUserInfoMutation,
useChangePassMutation,
useAddAddressMutation,
useGetAddressesQuery,
useEditAddressMutation,
useDeleteAddressMutation,
useAddCartMutation, 
useGetCartItemsQuery,
useDeleteCartItemMutation,
usePlaceOrderMutation,
useGetOrderDetailesQuery,
useCancelOrderMutation,
useActiveCouponsQuery,
useApplyCouponMutation,
useVerifyPaymentMutation,
useAddWhishlistMutation,
useGetWhishlistQuery,
useRemoveWhishlistProductsMutation,
useAddWalletMutation,
useGetWalletQuery,
useFailedOrderMutation,
useRetryingPaymentMutation,
useVerifyRetryMutation,
useGetTopProductsQuery,
useGetTopCategoryQuery,
useReturnOrderMutation,
} = userApi