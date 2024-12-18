import { Card, CardContent, Button, Radio, RadioGroup } from "@mui/material";
import {
  useGetAddressesQuery,
  useGetCartItemsQuery,
  usePlaceOrderMutation,
  useActiveCouponsQuery,
  useApplyCouponMutation,
  useVerifyPaymentMutation,
  useFailedOrderMutation,
} from "../../../../Services/Apis/UserApi";
import { Tag, Truck, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NewOrderPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartSaveAddress = location.state?.address_id || [];
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartSave, setCartSave] = useState([]);
  const { data: cart } = useGetCartItemsQuery();
  const { data: addressesData } = useGetAddressesQuery();
  const [PlaceOrder, { isSuccess }] = usePlaceOrderMutation();
  const { data, refetch } = useActiveCouponsQuery();
  const [ApplyCoupon] = useApplyCouponMutation();
  const [VerifyPayment] = useVerifyPaymentMutation();
  const [FailedOrder] = useFailedOrderMutation();

  const coupons = data?.coupons;

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  const originalTotalPrice = calculateTotal();
  const totalPrice =
    originalTotalPrice - (couponDiscount / 100) * originalTotalPrice;
  const totalDiscount = totalPrice - cartItems[0]?.totalPrice;

  useEffect(() => {
    if (addressesData?.addresses) {
      const selected = addressesData.addresses.find(
        (address) => address._id === cartSaveAddress
      );
      setSelectedAddress(selected || null);
    }

    console.log("check cartItems", totalPrice);

    
    
    if (cart) {
      const filteredItems = cart.cartItems.filter((item)=> item.productDetailes.stock > 0)
      if (filteredItems.length > 0) {
        
        const transformedItems = filteredItems.map((cartItem) => ({
          id: cartItem.productDetailes._id,
          name: cartItem.productDetailes.productName,
          price: parseFloat(cartItem.items.price),
          stock: cartItem.productDetailes.stock,
          quantity: cartItem.items.quantity,
          totalPrice: cartItem.totalPrice,
        }));
        setCartItems(transformedItems);
      }
    }
  }, [addressesData, cartSaveAddress, cart]);

  // Calculate the total price of the cart
  // const calculateTotalPrice = () => {
  //   return cartItems.reduce((acc, item) => item.totalPrice, 0);
  // };

  /**
   * handle HandleOrder
   */

  const handlePaymentChange = (event) => {
    const selectedValue = event.target.value;
    setPaymentMethod(selectedValue);
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
   * Handle Razorpay payment
   */
  const handleRazorpayPayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    try {
      const response = await PlaceOrder({
        cartSave,
        address_id: selectedAddress._id,
        paymentMethod: "razorpay",
        totalPrice,
        couponDiscount,
      });

      if (response?.data?.order) {
        const { id: order_id, amount, currency } = response.data.order;

        const options = {
          key: "rzp_test_bzGh9EH7vBB8Yh",
          amount,
          currency,
          name: "Ebook",
          description: "Order Payment",
          order_id,
          handler: async (paymentResponse) => {
            console.log("Payment Response:", paymentResponse);

            try {
              const verificationResponse = await VerifyPayment({
                payment_id: paymentResponse.razorpay_payment_id,
                order_id: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                cartSave,
                address_id: selectedAddress._id,
                couponDiscount,
                paymentMethod: "razorpay",
              });

              if (verificationResponse?.data?.success) {
                alert("Payment successful and verified!");
                navigate("/payment-success");
              } else {
                navigate("/payment-failed");
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Error during payment verification:", error);
              alert("An error occurred while verifying the payment.");
            }
          },
          prefill: {
            name: selectedAddress?.name || "Customer",
            email: "customer@example.com",
            contact: selectedAddress?.phone || "1234567890",
          },
          notes: {
            address: `${selectedAddress?.address}, ${selectedAddress?.locality}`,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function (response) {
          handlePaymentFailed(cartSave, couponDiscount);
          console.log("payment failed", response);
        });
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error during Razorpay payment initialization:", error);
      alert("An error occurred while initializing payment.");
    }
  };

  /**
   * handle set cartsave
   */
console.log('cartItems', cartItems)
console.log('cartSave', cartSave)

  const handleCartSave = () => {
    const newCartSave = cartItems.map((cartItem) => ({
      product_id: cartItem.id,
      quantity: cartItem.quantity,
      price: cartItem.price,
      totalPrice: cartItem.totalPrice
    }));
    setCartSave(newCartSave);
  };

  /**
   * Handle order placement
   */
  console.log("cartSave", cartSave);
  const HandleOrder = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      PlaceOrder({
        cartSave,
        address_id: selectedAddress._id,
        paymentMethod: "cashOnDelivery",
        totalPrice,
        couponDiscount,
      })
        .then(() => {
          alert("Order placed successfully!");
          navigate("/payment-success");
        })
        .catch((error) => {
          console.error("Error placing order:", error);
          alert("An error occurred while placing the order.");
        });
    }
  };

  /**
   * handle Pending order
   */

  const handlePaymentFailed = async (cartSave, couponDiscount) => {
    try {
      const response = await FailedOrder({
        cartSave,
        paymentMethod: "razorpay",
        paymentStatus: "Pending",
        address_id: selectedAddress._id,
        totalPrice,
        couponDiscount,
      });

      if (response.data) {
        alert("order placed successfully but payment is pending!!");
        const razorpayModal = document.querySelector(".razorpay-container");
        if (razorpayModal) {
          razorpayModal.remove();
          navigate("/payment-failed");
        } else {
          console.log("razorpay modal not fount ");
        }
      } else {
        alert(" failed place order try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * apply coupon
   */

  const handleApplyCoupon = async (couponCode) => {
    if (appliedCoupon === couponCode) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } else {
      const response = await ApplyCoupon({ couponCode });
      if (response.data) {
        setAppliedCoupon(couponCode);
        setCouponDiscount(response.data.coupon.offer);
        console.log("Coupon applied successfully");
        refetch();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <h1 className="text-xl text-center font-bold mb-6">
          Complete Your Order
        </h1>
        <div className="max-w-2xl mx-auto">
          {/* Shipping Address Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-5 w-5" />
                <h2 className="font-semibold text-sm">Shipping Address</h2>
              </div>

              {selectedAddress && (
                <div className="space-y-2 text-sm">
                  <p className="font-bold">{selectedAddress.name}</p>
                  <p>
                    <strong>Address:</strong> {selectedAddress.address},{" "}
                    {selectedAddress.locality}, {selectedAddress.city},{" "}
                    {selectedAddress.state}, {selectedAddress.pincode},{" "}
                    <strong> Address Type:</strong>{" "}
                    {selectedAddress.addressType}
                  </p>
                  <p>
                    <strong>Landmark:</strong>{" "}
                    {selectedAddress.landmark || "N/A"}
                    <strong> Phone:</strong> {selectedAddress.phone}
                    {selectedAddress.altPhone &&
                      ` / ${selectedAddress.altPhone}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3 text-sm">Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 bg-blue-50">
                  <Radio
                    value="razorpay"
                    name="razorpay"
                    id="razorpay"
                    className="mr-2"
                    onClick={handleCartSave}
                  />
                  <label htmlFor="razorpay" className="flex-1 text-sm">
                    Razor Pay
                  </label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <Radio value="wallet" id="wallet" className="mr-2" />
                  <label
                    htmlFor="wallet"
                    className="flex-1 flex justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Wallet
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Balance Amount: ₹0.00
                    </span>
                  </label>
                </div>
                {/* New COD option */}

                {totalPrice < 1000 && (
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <Radio
                      onClick={handleCartSave}
                      value="cod"
                      id="cod"
                      className="mr-2"
                    />
                    <label htmlFor="cod" className="flex-1 text-sm">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                )}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Coupon Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <motion.div
                className="flex items-center gap-2 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Tag className="h-5 w-5" />
                <h2 className="font-semibold text-sm">Apply Coupon</h2>
              </motion.div>

              <Button
                className="w-full text-white"
                sx={{
                  backgroundColor: "#000",
                  "&:hover": { backgroundColor: "#333" },
                  color: "#fff",
                }}
                size="large"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Hide Coupons" : "Apply Coupon"}
              </Button>

              {/* AnimatePresence to handle open and close animations */}

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="mt-4"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {coupons.map((coupon) => (
                      <motion.div
                        key={coupon._id}
                        className="flex justify-between items-center border-b pb-2 mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.1 * coupon.id }}
                      >
                        <div>
                          <h4 className="font-medium text-sm">
                            {coupon.couponCode}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {coupon.offer}% offer, {coupon.description}
                          </p>
                        </div>

                        <button
                          className={`text-sm px-4 py-2 rounded ${
                            appliedCoupon === coupon.couponCode
                              ? "bg-gray-500 text-white hover:bg-gray-600"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                          onClick={() => handleApplyCoupon(coupon.couponCode)}
                        >
                          {appliedCoupon === coupon.couponCode
                            ? "Cancel"
                            : "Apply"}
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3 text-sm">Order Summary</h2>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div className="flex justify-between text-sm" key={item.id}>
                    <span>
                      {item.name} ({item.quantity})
                    </span>
                    <span>₹{item.price}.00</span>
                  </div>
                ))}

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className={`${appliedCoupon ? "line-through" : ""}`}>
                      {/* ₹{calculateTotalPrice()}.00 */}₹{calculateTotal()}.00
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Coupon</span>

                    {appliedCoupon ? (
                      <span>₹{totalPrice}.00</span>
                    ) : (
                      <span>₹0.00</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total Discount</span>
                    <span>-₹{totalDiscount}.00</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>
                      {/* ₹{appliedCoupon ? totalPrice : calculateTotalPrice()}.00 */}
                      ₹{appliedCoupon ? totalPrice : calculateTotal()}.00
                    </span>
                    {/* <span>₹{calculateTotalPrice()}.00</span> */}
                  </div>
                </div>

                <Button
                  onClick={HandleOrder}
                  className="w-full text-white"
                  sx={{
                    backgroundColor: "#000",
                    "&:hover": { backgroundColor: "#333" },
                    color: "#fff",
                  }}
                  size="large"
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewOrderPayment;
