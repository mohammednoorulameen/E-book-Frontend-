import { ShoppingCart, Truck } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import {
  useGetAddressesQuery,
  useEditAddressMutation,
  useAddAddressMutation,
  useGetCartItemsQuery,
} from "../../../../Services/Apis/UserApi";
import { useEffect, useState } from "react";
import {
  EditAddressModal,
  AddAddressModal,
} from "../../../Modals/AddressModal";
import NewOderPayment from '../Payments/NewOrderPayment'
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
const CheckOut = () => {
  const { data, refetch } = useGetAddressesQuery();
  const [EditAddress] = useEditAddressMutation();
  const [AddAddress] = useAddAddressMutation();
  const { data: cart } = useGetCartItemsQuery();
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [getAddress, setGetAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress ] = useState()
  const [errorMessages, setErrorMessages] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [cartSave, setCartSave] = useState([])

  const navigate = useNavigate();
console.log(cartItems);

console.log('data', cart)


const calculateTotal = () => {
  return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

  /**
   * address
   */

  useEffect(() => {
    if (data?.addresses) {
      refetch();
      setAddresses(data.addresses);
    }

    if (cart) {

      // const filteredItems = cart.cartItems.filter((item)=> item.productDetailes.stock > 0)




      // if (filteredItems.length > 0) {
        
        const transformedItems = cart.cartItems.map((cartItem) => ({
          id: cartItem.productDetailes._id,
          name: cartItem.productDetailes.productName,
          price: parseFloat(cartItem.items.price), 
          stock: cartItem.productDetailes.stock,
          quantity: cartItem.items.quantity,
          imageUrl:
          cartItem.productDetailes.images[0] ||
          "https://via.placeholder.com/100", 
          totalPrice: cartItem.totalPrice,
          status: cartItem.productDetailes.status
          
        }));
        setCartItems(transformedItems);
      }else{
        console.log("no products available stock");
        setCartItems([]);
      }
    // }
  }, [data]);

  /**
   * Handle Continue Shopping navigation
   */

  const HandleContinueShopping = () => {
    navigate("/shop");
  };

  /**
   * handle continue
   */

   const HandleContinue = () => {
  //   const newCartSave = cartItems.map((item)=>{
  //     address_id : selectedAddress;
  //     prduct_id  : item.id;
  //     quantity :  item.quantity;
  //     price : item.price
    //  })
    // setCartSave(newCartSave)
    navigate("/new-order-payment",{state :{ address_id : selectedAddress }});
  };

console.log('cartSave', cartSave.address_id)

  /**
   * handle edit address modal
   */

  const handleOpenEditAddressModal = () => {
    setIsEditAddressModalOpen(true);
  };

  const handleEditAddressCloseModal = () => {
    setIsEditAddressModalOpen(false);
  };

  /**
   * handle edit address
   */

  const HandleEditAddessDetailes = async (id) => {
    const address = await addresses.find((address) => address._id === id);
    setGetAddress(address);
    setIsEditAddressModalOpen(true);
  };

  /**
   * handle submmit edit address modal
   */

  const handleSubmitEditAddress = async (EditValues) => {
    try {
      console.log("EditValues", EditValues);
      const response = EditAddress(EditValues);
      refetch();
      if (response) {
        setIsEditAddressModalOpen(false);
        console.log("Edit Successfully");
      }
      console.log("EditValues", EditValues);
    } catch (error) {
      setErrorMessages("Error Edit address,please try again");
    }
  };

  /**
   * handle add address modal
   */

  const handleOpenAddAddressModal = () => {
    setIsAddAddressModalOpen(true);
  };

  const handleAddAddressCloseModal = () => {
    setIsAddAddressModalOpen(false);
  };

  /**
   * handle submit add address modal
   */

  const handleSbmitAddAddress = async (addressData) => {
    setLoading(true);
    try {
      console.log("addressdata", addressData);
      const response = AddAddress(addressData);
      refetch();
      setIsAddAddressModalOpen(false);
      setLoading(false);
    } catch (error) {
      setErrorMessages("Error submit address,please try again",error);
      setLoading(false);
    }
  };


  
  return (
    <div className="min-h-screen bg-gray-100 mt-10">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </h2>
              <div className="space-y-4">
                {  cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <img
                      alt="Product thumbnail"
                      className="rounded-lg object-cover h-20 w-20"
                      src={item.imageUrl}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity:{item.quantity}</p>
                      {item.stock < item.quantity &&( <span className="text-red-500">out of stock</span> )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price}</p>
                    </div>
                  </div>
                ))}
                {/* {cartItems.map((item) => ( */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">

                      <span>Subtotal</span>
                
                      {/* <span>₹{cartItems[0]?.totalPrice || 0}.00</span> */}
                      <span>₹{calculateTotal().toFixed(2)} .00</span>

                  
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Total Discount</span>
                      <span>₹0.00</span>
                    </div>

                    <div className="flex justify-between font-medium mt-4 pt-4 border-t">
                      <span>Total</span>
                      <div>

                      {/* <span>₹{cartItems[0]?.totalPrice || 0}.00</span> */}
                      <span>₹{calculateTotal().toFixed(2)}.00</span>


                      </div>
                    </div>

                  </div>
                {/* ))} */}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4">
              <h2 className="text-base font-medium mb-3 flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {addresses.map((address) => (
                  <Card
                    key={address._id}
                    className="shadow-sm max-w-sm mx-auto"
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressType"
                          value={address._id}
                          onChange={(e)=>{
                            setSelectedAddress(e.target.value)
                          }}
                          checked = {selectedAddress == address._id}
                          className="h-4 w-4"
                        />
                        <h1 className="text-sm font-semibold">
                          {address.addressType}
                        </h1>
                      </div>
                      <button
                        onClick={() => {
                          HandleEditAddessDetailes(address._id);
                          handleOpenEditAddressModal();
                        }}
                        className="text-blue-500 text-xs font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <CardHeader
                      title={
                        <Typography className="text-sm">
                          <span className="font-bold">
                            {address.name}, {address.phone}
                          </span>
                        </Typography>
                      }
                      className="p-2"
                    />
                    <CardContent className="p-2">
                      <p className="text-xs">
                        {address.address},{" "}
                        <span className="font-bold">{address.pincode}</span>
                      </p>
                      <p className="text-xs">
                        {address.state}, {address.city}
                      </p>
                      <p className="text-xs">
                        {address.locality}, {address.landmark}
                      </p>
                      <p className="text-xs">
                        {address.phone} / {address.altPhone}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {addresses.length == 0 && (
                <p className="text-gray-500 mb-4">
                  No addresses found. Add a new address below.
                </p>
              )}
              <button
                onClick={handleOpenAddAddressModal}
                className="w-full mt-4 flex items-center justify-center gap-2 border border-black bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-300 ease-in-out"
              >
                + Add New Address
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {/* <button
            onClick={()=> {selectedAddress && HandleContinue()}}
            className={`w-full bg-black text-white py-3 ${  selectedAddress ? 'cursor-pointer' : 'cursor-not-allowed'} rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300 ease-in-out`}
          >
           {selectedAddress ? "Continue" : "Select Your address"}
          </button> */}

<button
  onClick={() => {
    selectedAddress && HandleContinue();
  }}
  className={`w-full bg-black text-white py-3 ${
    cartItems?.every((item) => item.stock >= item.quantity) && selectedAddress
      ? "cursor-pointer"
      : "cursor-not-allowed"
  } rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300 ease-in-out`}
  disabled={
    !cartItems?.every((item) => item.stock >= item.quantity) || !selectedAddress
  }
>
  {cartItems?.every((item) => item.stock >= item.quantity) && selectedAddress
    ? "Continue"
    : "Select Your Address or Check Product Stock"}
</button>


          <button
            onClick={HandleContinueShopping}
            className="w-full border border-black text-black py-3 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-300 ease-in-out"
          >
            Continue Shopping
          </button>
        </div>
      </main>
      <EditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={handleEditAddressCloseModal}
        onSubmit={handleSubmitEditAddress}
        addresses={getAddress}
      />
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={handleAddAddressCloseModal}
        loading={loading}
        errorMessages={errorMessages}
        onSubmit={handleSbmitAddAddress}
      />

    </div>
    
  );
};



export default CheckOut;
