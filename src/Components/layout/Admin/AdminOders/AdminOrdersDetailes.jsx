

import React from 'react'

const AdminOrdersDetailes = () => {
  return (
    <div>AdminOrdersDetailes</div>
  )
}

export default AdminOrdersDetailes



// import {
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CardActions,
//   MenuItem,
//   Select,
//   FormControl,
//   Typography,
// } from "@mui/material";
// import { CalendarToday, LocationOn, LocalShipping } from "@mui/icons-material";
// import {
//   useOrdersListQuery,
//   useChangeOrderStatusMutation,
// } from "../../../../Services/Apis/AdminApi";
// import { useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const AdminOrdersDetails = () => {
//   const { userId } = useParams();
//   const [orderActions, setOrderActions] = useState({});
//   const navigate = useNavigate();
//   const { data, isLoading, isError, refetch } = useOrdersListQuery({
//     limit: 10,
//   });
//   const [changeOrderStatus] = useChangeOrderStatusMutation();
//   const [userOrders, setUserOrders] = useState([]);

//   // useEffect(() => {
//   //   if (data?.orderItems) {
//   //     const filteredOrders = data.orderItems.filter(
//   //       (order) => order.user_id._id === userId
//   //     );
//   //     const transformedOrders = filteredOrders.map((order) => ({
//   //       email: order.user_id.email,
//   //       username: order.user_id.username,
//   //       orderDate: new Date(order.items[0]?.itemCreatedAt).toLocaleDateString(),
//   //       items: order.items.map((item) => ({
//   //         productName: item.product_id.productName,
//   //         productImage:
//   //           item.product_id.images[0] || "https://via.placeholder.com/100",
//   //         quantity: item.quantity,
//   //         price: item.price,
//   //         orderStatus: item.orderStatus,
//   //         orderId: item._id,
//   //         paymentStatus: item.payment_status,
//   //       })),
//   //       address: `${order.address_id?.address || "N/A"}, ${order.address_id?.city || "N/A"
//   //         }, ${order.address_id?.state || "N/A"}, ${order.address_id?.locality || "N/A"
//   //         }, ${order.address_id?.pincode || "N/A"}, ${order.address_id?.landmark || "N/A"
//   //         }`,
//   //     }));
//   //     setUserOrders(transformedOrders);
//   //   }
//   // }, [data, userId]);

//   const handleChangeStatus = async (orderId, action) => {
//     try {
//       const response = await changeOrderStatus({
//         user_id: userId,
//         order_id: orderId,
//         action,
//       });
//       if (response.data) {
//         navigate("/admin/orders");
//         console.log("Order status changed successfully");
//         refetch();
//       }
//     } catch (error) {
//       console.error("Failed to update order status:", error);
//     }
//   };

//   if (isLoading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (isError) {
//     return <Typography>Error loading orders</Typography>;
//   }

//   return (
//     <div className="min-h-screen bg-background p-4 mt-7">
//       {userOrders.map((order, index) => (
//         <Card sx={{ maxWidth: 1200, mx: "auto", mb: 4 }} key={index}>
//           <CardHeader
//             title={
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <CalendarToday fontSize="small" />
//                   <span className="text-sm text-muted-foreground">
//                     {order.orderDate}
//                   </span>
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   Order ID: {order.items[0]?.orderId}
//                 </div>
//               </div>
//             }
//           />
//           <CardContent>
//             <div className="grid gap-6 md:grid-cols-3">
//               <div className="space-y-4">
//                 <Typography variant="h6">Customer</Typography>
//                 <div>
//                   <div className="font-medium">{order.username}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {order.email}
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <Typography variant="h6">Order Info</Typography>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <LocalShipping fontSize="small" color="disabled" />
//                     <span>Shipping: Fargo express</span>
//                   </div>
//                   <div>Pay method: Razorpay</div>
//                   <div>Payment Status: Paid</div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <Typography variant="h6">Deliver to</Typography>
//                 <div className="flex items-center gap-2">
//                   <LocationOn fontSize="small" color="disabled" />
//                   <span>{order.address}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border mt-4">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="px-4 py-3 text-left">Product</th>
//                     <th className="px-4 py-3 text-right">Unit Price</th>
//                     <th className="px-4 py-3 text-right">Quantity</th>
//                     <th className="px-4 py-3 text-right">Order Status</th>
//                     <th className="px-4 py-3 text-right">Payment</th>
//                     <th className="px-4 py-3 text-right">Total</th>
//                     <th className="px-4 py-3 text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {order.items.map((item, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-4">
//                           <img
//                             alt="Product"
//                             className="h-16 w-16 rounded-lg border object-cover"
//                             src={item.productImage}
//                           />
//                           <span>{item.productName}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-right">{item.price}</td>
//                       <td className="px-4 py-3 text-right">{item.quantity}</td>
//                       <td className="px-4 py-3 text-right">
//                         <p  className={`px-3 py-1 rounded-full text-sm ${
//                           item.orderStatus === "Pending"
//                             ? "bg-gray-100 text-gray-800"
//                             : item.orderStatus === "Delivered"
//                             ? "bg-green-100 text-green-800"
//                             : item.orderStatus === "Shipped"
//                             ? "bg-blue-100 text-blue-800"
//                             :item.orderStatus === "Cancelled"
//                             ? "bg-red-100 text-red-800"
//                             : ""

                          
//                         }`}
//                       >
//                         {item.orderStatus} 
//                         </p>
//                       </td>

//                       <td className="px-4 py-3 text-right">
//                         <p  className={`px-3 py-1 rounded-full text-sm ${
//                           item.paymentStatus === "Paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {item.paymentStatus} 
//                         </p>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         {item.price * item.quantity}
//                       </td>
//                       <td className="px-4 py-3 text-right">

//                       {(item.orderStatus === "Pending" || item.orderStatus === "Shipped") && <FormControl fullWidth>
//                           <Select
//                             defaultValue={"Pending"}
//                             className="rounded-full "
//                             value={
//                               orderActions[item.orderId] || item.orderStatus
//                             }
//                             onChange={(e) =>
//                               setOrderActions({
//                                 ...orderActions,
//                                 [item.orderId]: e.target.value,
//                               })
//                             }
//                           >
//                             <MenuItem
//                               className="!px-3 !py-1 !m-2 !hover:bg-blue-500 !rounded-full !text-sm !bg-blue-200 !text-green-800"
//                               value="Pending"
//                             >
//                               Pending
//                             </MenuItem>
//                             <MenuItem
//                               className="!px-3 !py-1 !m-2 !hover:bg-blue-500 !rounded-full !text-sm !bg-blue-300 !text-green-800"
//                               value="Shipped"
//                             >
//                               Shipped
//                             </MenuItem>
//                             <MenuItem
//                               className="!px-3 !py-1 !m-2 !hover:bg-blue-500 !rounded-full !text-sm !bg-green-200 !text-green-800"
//                               value="Delivered"
//                             >
//                               Delivered
//                             </MenuItem>
//                           </Select>
//                         </FormControl>}
//                         <Button
//                           variant="contained"
//                           size="small"
//                           sx={{ mt: 1 }}
//                           onClick={() =>
//                             handleChangeStatus(
//                               item.orderId,
//                               orderActions[item.orderId] || item.orderStatus
//                             )
//                           }
//                         >
//                           Save
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Typography variant="body2" className="font-medium">
//                     Subtotal:
//                   </Typography>
//                   <Typography variant="body2">11199</Typography>
//                 </div>
//                 <div className="flex justify-between">
//                   <Typography variant="body2" className="font-medium">
//                     Shipping cost:
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "green" }}>
//                     Free Shipping
//                   </Typography>
//                 </div>
//                 <div className="flex justify-between">
//                   <Typography variant="body2" className="font-medium">
//                     Grand total:
//                   </Typography>
//                   <Typography variant="body2">11199</Typography>
//                 </div>
//                 <div className="flex justify-between">
//                   <Typography variant="body2" className="font-medium">
//                     Status:
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       borderRadius: "9999px",
//                       bgcolor: "orange.100",
//                       px: 2,
//                       py: 0.5,
//                       fontSize: "0.75rem",
//                       color: "orange.600",
//                     }}
//                   >
//                     {order.orderStatus}
//                   </Typography>
//                 </div>
//               </div>
//             </CardActions>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default AdminOrdersDetails;

