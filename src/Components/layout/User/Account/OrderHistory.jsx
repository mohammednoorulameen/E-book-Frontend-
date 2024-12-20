import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Box, Collapse } from "@mui/material";
import { Button, Typography } from "@mui/material";
// import OrderHistoryProductDetailes from 'OrderHistory'
// import { v4 as uuidv4 } from "uuid";
import {
  useGetOrderDetailesQuery,
  useCancelOrderMutation,
  useRetryingPaymentMutation,
  useVerifyRetryMutation,
  useAddWalletMutation,
} from "../../../../Services/Apis/UserApi";
import { OrderCancelModal, OrderReturnModal } from "../../../Modals/OrderModal";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [AddWallet] = useAddWalletMutation()
  const [cartSave, setCartSave] = useState([]);
  const [isOrderCancelModalOpen, setisOrderCancelModalOpen] = useState(false);
  const [isOrderReturnModalOpen, setisOrderReturnModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [OrderData, setOderData] = useState([]);
  const [CancelOrder] = useCancelOrderMutation();
  const [RetryingPayment, { error }] = useRetryingPaymentMutation();
  const [VerifyRetry] = useVerifyRetryMutation();
  const { data, refetch } = useGetOrderDetailesQuery({
    page: currentPage,
    limit: 5,
  });

  const totalPage = data?.totalPage || 1;


  console.log('data?.orderItems', data)

  useEffect(() => {
    if (data?.orderItems) {
      const orderdata = data.orderItems.flatMap((order) =>
        order.items.map((item) => ({
          productId: item.product_id[0]._id,
          orderId: order._id,
          userId: order.user_id,
          orderItemId: item._id,
          orderDate: new Date(item.itemCreatedAt).toLocaleDateString(),
          // totalItems: order.items.length,
          payableAmount: item.payableAmount || "N/A",
          payment_Method: item.payment_Method || "N/A",
          payment_status: item.payment_status || "N/A",
          status: item.orderStatus || "N/A",
          discount: item.discount || "NA",
          address: `${order.address_id[0]?.address || "N/A"}, ${
            order.address_id[0]?.city || "N/A"
          }, ${order.address_id[0]?.state || "N/A"}, ${
            order.address_id[0]?.locality || "N/A"
          }, ${order.address_id[0]?.pincode || "N/A"}, ${
            order.address_id[0]?.landmark || "N/A"
          }`,
          address_id: order.address_id[0]?._id,
          productName: item.product_id[0]?.productName || "N/A",
          stock: item.product_id[0]?.stock || "N/A",
          price: item.product_id[0]?.price || "N/A",
          category: item.product_id[0]?.category || "N/A",
          quantity: item.quantity,
          payment_id: item.payment_id || "NA"

        }))
      );

      
      // Sorting orderdata based on `orderDate` in descending order
      const sortedOrderData = orderdata.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOderData(sortedOrderData); // Setting sorted data
    }
  }, [data]);

  /**
   * cartsave products
   */

  const HandleCartsave = (productId, quantity, price) => {
    console.log('productId, quantity, price', productId, quantity, price)
    const newCartSave = {
      product_id: productId,
      quantity: quantity,
      price: price,
      // totalPrice: item.totalPrice
    };
    setCartSave(newCartSave);

  }


  console.log('check cartSave', cartSave)

  /**
   * handle page change
   */

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  const handleViewDetails = (productId) => {
    console.log("orderId", productId);
    navigate(`/orderdetails/${productId}`);
    // navigate('/orderdetails')
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  /**
   *  handle cancel modal
   */

  const handleOrderCancelOpenModal = (order) => {
    setSelectedOrder(order);
    setisOrderCancelModalOpen(true);
  };

  const handleOrderCancelCloseModal = () => {
    setisOrderCancelModalOpen(false);
    setSelectedOrder(null);
  };

  /**
   * submit cansel order
   */

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    console.log('selectedOrder', selectedOrder)
    const { product_id, quantity, order_id , productName, payment_id, amount } = selectedOrder;
    console.log('productName, payment_id, amount', productName, payment_id, amount)

    const response = await CancelOrder({
      product_id,
      quantity,
      order_id,
    });
    if (response.data) {

      await AddWallet({ amount: amount, productName: productName, order_id: order_id, payment_id})
      refetch();
      handleOrderCancelCloseModal();

    }
  };

  /**
   * return modal
   */

  const handleOrderReturnOpenModal = (order) => {
    setSelectedOrder(order);
    setisOrderReturnModalOpen(true);
  };

  const handleOrderReturnCancelModal = () => {
    setisOrderReturnModalOpen(false);
    setSelectedOrder(null);

  };

  const handleSubmitOrderreturn =async (value) => {


    if (!selectedOrder) return;

    console.log('selectedOrder', selectedOrder)
    const { product_id, quantity, order_id , productName, payment_id, amount } = selectedOrder;
    console.log('productName, payment_id, amount', productName, payment_id, amount)

    const response = await CancelOrder({
      product_id,
      quantity,
      order_id,
    });
    if (response.data) {

      await AddWallet({ amount: amount, productName: productName, order_id: order_id, payment_id})
      refetch();
      handleOrderCancelCloseModal();

    }

    // console.log("value", value);
    // if (input.trim == "") {
    //   setError(true)
    // }else{
    //   setError(false)
    //   console.log("Form submitted successfull");

    // }
  };

  /**
   * Load Razorpay script
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /**
   * Handle Retry
   */

  const handleRetry = async (amount, order_id, address) => {
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay . Please try again.");
        return;
      }

      const response = await RetryingPayment({ amount, order_id, address });
      const orderId = response.data.order_id;
      if (response.data) {
        const { id: newOrderId, amount, currency } = response.data.order;

        const options = {
          key: "rzp_test_bzGh9EH7vBB8Yh",
          amount,
          currency,
          order_id: newOrderId,
          name: "Ebook",
          description: "Order Payment",
          handler: async function (paymentResponse) {
            try {
              const verifyResponse = await VerifyRetry({
                payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                orderId,
                cartSave,
              });
              console.log("verifyResponse", verifyResponse);
              if (verifyResponse.data) {
                alert("Payment successful!");
                refetch();
              } else {
                alert("Payment verification failed. Please try again.");
              }
            } catch (error) {
              console.error("Error during payment verification:", error);
              alert("An error occurred while verifying the payment.");
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "1234567890",
          },

          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error during retry:", error);
    }
  };

  /**
   * get total products count
   */

  const totalProducts = data?.orderItems.reduce(
    (count, order) => count + order.items.length,
    0
  );

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between w-full">
          <h2 className="text-2xl font-semibold text-gray-900">
            Order History
          </h2>
          <h4 className="text-2xl font-semibold text-gray-900">
            Total Items: {totalProducts}
          </h4>
        </div>

        <div className="space-y-4">
          {OrderData.length > 0 ? (
            OrderData.map((order, index) => (
              <Card key={index} >
                <CardHeader
                  title={order.productName}
                  subheader={`Placed on: ${order.orderDate}`}
                />
                <CardContent>
                  {/* <Typography variant="body2" color="textSecondary">
                  
                  </Typography> */}

                  <Chip
                    label={order.status || "N/A"}
                    color={
                      order.status === "Pending"
                        ? "grey"
                        : order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                        ? "primary"
                        : order.status === "Cancelled"
                        ? "warning"
                        : ""
                    }
                    variant="outlined"
                  />

                  {/* Status: {order.status} */}
                  {/* </Typography> */}
                  <Typography variant="body2" color="textSecondary">
                    Address: {order.address}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Button
                      onClick={() => handleViewDetails(order.productId)}
                      variant="outlined"
                    >
                      View Details
                    </Button>

                    {order.payment_status == "Pending" &&
                    order.payment_Method == "razorpay" ? (
                      
                      <Button
                        onClick={() =>{
                          HandleCartsave(
                            order.productId,
                            order.quantity,
                            order.price
                          ),
                          handleRetry(
                            order.payableAmount,
                            order.orderItemId,
                            order.address_id
                          )
                        }
                        }
                        variant="outlined"
                        color="success"
                      >
                        Retry
                        <p> {order.price}/-</p>
                      </Button>
                    ) : (
                      order.status !== "Cancelled" &&
                      order.status !== "Delivered" && (
                        <Button
                          onClick={() =>
                            handleOrderCancelOpenModal({
                              order_id: order.orderId,
                              product_id: order.productId,
                              quantity: order.quantity,
                              productName: order.productName,
                              payment_id: order.payment_id,
                              amount: order.payableAmount
                            })
                          }
                          variant="outlined"
                          color="error"
                        >
                          Cancel
                        </Button>
                      )
                    )}

                    {order.status == "Delivered" && (
                      <Button
                        // onClick={() =>
                        //   handleOrderReturnOpenModal({
                        //     order_id: order.orderId,
                        //     product_id: order.productId,
                        //     quantity: order.quantity,
                        //     user_id: order.userId
                        //   })
                        // }
                        onClick={() =>

                          handleOrderReturnOpenModal({
                            order_id: order.orderId,
                              product_id: order.productId,
                              quantity: order.quantity,
                              productName: order.productName,
                              payment_id: order.payment_id,
                              amount: order.payableAmount
                          })
                        }
                        variant="outlined"
                        color="primary"
                      >
                        Return
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No orders found</p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderCancelModal
          isOpen={isOrderCancelModalOpen}
          onClose={handleOrderCancelCloseModal}
          onSubmit={handleCancelOrder}
        />
      )}

      <OrderReturnModal
        isOpen={isOrderReturnModalOpen}
        onClose={handleOrderReturnCancelModal}
        onSubmit={handleSubmitOrderreturn}
      />
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 mx-1 border rounded ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

// export default OrderHistory;

// ---------------------------------------------------------------------------------------------------------------------------------

/**
 * order details
 */

import {
  CardMedia,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const OrderHistoryProductDetailes = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOrderCancelModalOpen, setisOrderCancelModalOpen] = useState(false);
  const [CancelOrder] = useCancelOrderMutation();
  const { data, refetch } = useGetOrderDetailesQuery({
    page: currentPage,
    limit: 5,
  });
  const [RetryingPayment, { error }] = useRetryingPaymentMutation();
  const [VerifyRetry] = useVerifyRetryMutation();
  const totalPage = data?.totalPage || 1;




  useEffect(() => {
    console.log("check oder data details ", data);

    if (data?.orderItems) {
      const orderData = data.orderItems.flatMap((order) => {
        return order.items
          .filter(
            (item) => String(item.product_id[0]?._id) === String(productId)
          )
          .map((item) => ({
            orderDate: new Date(item.itemCreatedAt).toLocaleDateString(),
            totalItems: order.items.length,
            payableAmount: item.payableAmount,
            price: item.price,
            payment_status: item.payment_status || "N/A",
            payment_Method: item.payment_Method || "N/A",
            order_status: item.orderStatus || "N/A",
            couponDiscount: item.discount || "00",
            address: `${order.address_id[0]?.address || "N/A"}, ${
              order.address_id[0]?.city || "N/A"
            }, ${order.address_id[0]?.state || "N/A"}, ${
              order.address_id[0]?.locality || "N/A"
            }, ${order.address_id[0]?.pincode || "N/A"}, ${
              order.address_id[0]?.landmark || "N/A"
            }`,
            productId: item.product_id[0]?._id,
            orderItemId: item._id,
            orderId: order._id,
            image: item.product_id[0]?.images?.[0] || "N/A",
            productName: item.product_id[0]?.productName || "N/A",
            category: item.product_id[0]?.category || "N/A",
            quantity: item.quantity,
          }));
      });

      setOrderDetails(orderData);
    }
  }, [data, productId]);

  useEffect(() => {
    console.log("Updated orderDetails:", orderDetails);
  }, [orderDetails]);



  /**
   * discount price 
   */

  // const totalPrice = orderDetails.reduce(
  //   (acc, item) => acc + (item.price - (item.couponDiscount || 0) / 100 * item.price),
  //   0
  // );
  
  const totalPrice = orderDetails.reduce((acc, item) => {
    const discount = (item.couponDiscount || 0) / 100; 
    const priceAfterDiscount = item.price * (1 - discount); 
    return acc + priceAfterDiscount * item.quantity; 
  }, 0);

  
  const totalDiscount = orderDetails.reduce(
    (acc, item) => acc + ((item.couponDiscount || 0) / 100 * item.price),
    0
  );


console.log("Total Discount Check:", totalDiscount);
console.log("Order Price Check:",totalPrice);


  // const totalPrice = orderDetails.price - (orderDetails.couponDiscount / 100) * orderDetails.price;
  // const totalDiscount = totalPrice - orderDetails.price;
  
  // console.log('totalDiscount check check ', orderDetails.price)



  /**
   *  handle cancel modal
   */

  const handleOrderCancelOpenModal = (order) => {
    setSelectedOrder(order);
    setisOrderCancelModalOpen(true);
  };

  const handleOrderCancelCloseModal = () => {
    setisOrderCancelModalOpen(false);
    setSelectedOrder(null);
  };

  /**
   * submit cancel order
   */

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    const { product_id, quantity, order_id } = selectedOrder;

    const response = await CancelOrder({
      product_id,
      quantity,
      order_id,
    });
    if (response.data) {
      refetch();
      handleOrderCancelCloseModal();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  /**
   * handle download invoice
   */

  const handleDownload = (order) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(15);
    doc.text("Welcome to E-book ", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("Your Product Invoice", 105, 20, { align: "center" });

    // Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 20, 40);
    doc.text(`Order Status: ${order.order_status}`, 20, 50);
    doc.text(`Order Date: ${order.orderDate}`, 20, 60);

    // Product Details
    doc.text("Product Details:", 20, 80);
    doc.text(`Product Name: ${order.productName}`, 30, 90);
    doc.text(`Quantity: ${order.quantity}`, 30, 100);
    doc.text(`Price: Rs.${order.payableAmount}`, 30, 110);

    // Payment Details
    doc.text("Payment Details:", 20, 130);
    doc.text(`Payment Method: ${order.payment_Method}`, 30, 140);
    doc.text(`Total Amount: Rs.${order.payableAmount}`, 30, 150);
    doc.text(`Payment Status: Rs.${order.payment_status}`, 30, 160);

    // Address Details
    doc.text("Shipping Address:", 20, 180);
    doc.text(`${order.address}`, 30, 190);

    // Save PDF
    doc.save(`invoice_${order.orderId}.pdf`);
  };

  /**
   * Load Razorpay script
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /**
   * Handle Retry
   */

  const handleRetry = async (amount, order_id, address) => {
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay . Please try again.");
        return;
      }

      const response = await RetryingPayment({ amount, order_id, address });
      const orderId = response.data.order_id;
      if (response.data) {
        const { id: newOrderId, amount, currency } = response.data.order;

        const options = {
          key: "rzp_test_bzGh9EH7vBB8Yh",
          amount,
          currency,
          order_id: newOrderId,
          name: "Ebook",
          description: "Order Payment",
          handler: async function (paymentResponse) {
            try {
              const verifyResponse = await VerifyRetry({
                payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                orderId,
              });
              console.log("verifyResponse", verifyResponse);
              if (verifyResponse.data) {
                refetch();
                alert("Payment successful!");
              } else {
                alert("Payment verification failed. Please try again.");
              }
            } catch (error) {
              console.error("Error during payment verification:", error);
              alert("An error occurred while verifying the payment.");
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "1234567890",
          },

          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error during retry:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      >
      {orderDetails.map((order, index) => (
      <Box sx={{ maxWidth: 900, mx: "auto", my: 4, p: 2 }}>
        {/* Back to Order History */}
        <Button
          variant="text"
          sx={{ mb: 2, textTransform: "none", color: "#555" }}
          onClick={() => navigate("/account/orders")}
        >
          ← Back to Order History
        </Button>
        

        {/* Order Header */}
        {/* {orderDetails.length > 0 && */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Order : {order.productName || "N/A"}
              </Typography>

              <Chip
                label={order.order_status || "N/A"}
                color={
                  order.order_status === "Pending"
                    ? "grey"
                    : order.order_status === "Delivered"
                    ? "success"
                    : order.order_status === "Shipped"
                    ? "primary"
                    : order.order_status === "Cancelled"
                    ? "warning"
                    : ""
                }
                variant="outlined"
              />
            </Box>


        {/* Items Section  */}

          <Card
            key={index}
            sx={{
              mb: 3,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "scale(1.01)",
              },
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Items
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CardMedia
                  component="img"
                  image={order.image}
                  alt={order.productName}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    borderRadius: 1,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {order.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {order.quantity}, Price: ₹{order.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment: {order.payment_status}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  ₹{totalPrice || "N/A"}.00
                </Typography>
              </Box>
            </CardContent>
          </Card>


        {/* Order Summary */}

          <Card
            sx={{
              mb: 3,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
              transition: "box-shadow 0.3s ease",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Order Summary
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Subtotal:</TableCell>
                    <TableCell align="right">₹{order.price}.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shipping:</TableCell>
                    <TableCell align="right">₹00.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax:</TableCell>
                    <TableCell align="right">₹00.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "green" }}>Discount:</TableCell>
                    <TableCell align="right" sx={{ color: "green" }}>
                    - ₹{totalDiscount}.00
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "green" }}>
                      Coupon Discount:
                    </TableCell>
                    <TableCell align="right" sx={{ color: "green" }}>
                    - {order.couponDiscount}.00 %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Total:</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>₹{totalPrice}.00</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        {/* Address */}


          <Card
            sx={{
              mb: 3,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
              transition: "box-shadow 0.3s ease",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Shipping Address
              </Typography>
              {/* <Typography variant="body2">
              {orderDetails[0]?.address?.name || "N/A"}
              </Typography> */}
              <Typography variant="body2">
                {/* {orderDetails[0]?.address?.street}, {orderDetails[0]?.address?.city},{" "} */}
                {/* {orderDetails[0]?.address?.state}, {orderDetails[0]?.address?.zip} */}
                {order.address}
              </Typography>
              {/* <Typography variant="body2">
              Phone: {orderDetails[0]?.address?.phone || "N/A"}
              </Typography> */}
            </CardContent>
          </Card>



        

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => handleDownload(order)}
              variant="contained"
              color="primary"
            >
              Download Invoice
            </Button>

            {/* cancel order */}

            {order.order_status !== "Cancelled" &&
            order.order_status !== "Delivered" ? (
              <Button
                onClick={() =>
                  handleOrderCancelOpenModal({
                    order_id: order.orderId,
                    product_id: order.productId,
                    quantity: order.quantity,
                  })
                }
                variant="outlined"
                color="error"
              >
                Cancel Order
              </Button>
            ) : (
              ""
            )}

            {/* retry payment */}

            { order.payment_status == "Pending" &&
            order.payment_Method == "razorpay" ? (
              <Button
                onClick={() =>
                  handleRetry(
                    order.payableAmount,
                    order.orderItemId,
                    order.address_id
                  )
                }
                variant="outlined"
                color="success"
              >
                Retry Payment
              </Button>
            ) : (
              ""
            )}

            {/* handle return */}

            {order.order_status == "Delivered" && (
              <Button
                onClick={() =>
                  handleOrderReturnOpenModal({
                    order_id: order.orderId,
                    product_id: order.productId,
                    quantity: order.quantity,
                  })
                }
                variant="outlined"
                color="success"
              >
                Return Order
              </Button>
            )}
          </Box>
      </Box>
        ))}

      {/* cancel order */}
      {selectedOrder && (
        <OrderCancelModal
          isOpen={isOrderCancelModalOpen}
          onClose={handleOrderCancelCloseModal}
          onSubmit={handleCancelOrder}
        />
      )}

      {/* Pagination */}
      <OrderDetailesPagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};

const OrderDetailesPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 mx-1 border rounded ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export { OrderHistory, OrderHistoryProductDetailes };


