import { useEffect, useState } from "react";
import {
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  useGetWhishlistQuery,
  useRemoveWhishlistProductsMutation,
  useAddCartMutation,
  
} from "../../../../Services/Apis/UserApi";
import { useNavigate } from "react-router-dom";


const Cart = () => {
  const navigate = useNavigate();
  const { data, refetch } = useGetWhishlistQuery();
  const [AddCart] = useAddCartMutation()
  const [RemoveWhishlistProducts] = useRemoveWhishlistProductsMutation();
  const [WhishlistItems, setWhishlistItems] = useState([]);
  //   const [outOfStock, setOutOfStock] = useState(false);

  /**
   * handle delete whishlist products
   */

  const HandleRemove = async (product_id) => {
    try {
      setWhishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== product_id)
      );

      const response = RemoveWhishlistProducts({ product_id });
      if (response.data) {
        console.log("whishlist product remove successfully");
        refetch();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * handle add to cart
   */

  const handleAddToCart = async (product_id, price,stock) =>{
    try {
        if(stock == 0){
            console.log("out of stock")
          }else{
            const items = {
              product_id,
              price : price
            }
            
            const response = await AddCart(items)
            if (response.data) {
              console.log('response.data.message', response.data.message)
            }
          } 
    } catch (error) {
        console.log(error)
    }
  }

  /**
   * whishlist detailes
   */

  useEffect(() => {
    if (data?.whishlist) {
      console.log("data?.whishlist", data?.whishlist);

      const transformedItems = data.whishlist.items.map((wishlistItem) => {
        const product = wishlistItem.product_id;
        return {
          id: product._id,
          name: product.productName,
          price: parseFloat(product.price),
          stock: product.stock,
          imageUrl: product.images[0] || "https://via.placeholder.com/100",
          totalPrice: parseFloat(product.price),
        };
      });

      setWhishlistItems(transformedItems);
    }
  }, [data]);

  
  return (
    <div className="bg-gray-100 min-h-screen py-8 mt-10">
      <div className="max-w-screen-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Your Whishlist</h2>

        <div className="space-y-6">
          {WhishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border-b transition-transform transform hover:scale-105"
            >
              <buttonClassesa
                onClick={() => navigate(`/productdetails/${item.id}`)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md transition-all duration-300 ease-in-out hover:scale-105"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-500">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              </buttonClassesa>
              <div className="flex items-center gap-4 flex-col sm:flex-row">
                <p className="text-red-500">
                  {item.stock <= 0 && "stock is over"}
                </p>

                <button onClick={()=> handleAddToCart(item.id,item.price,item.stock)} className="font-semibold text-lg mt-2 sm:mt-0 rounded-full bg-white text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition-all duration-300">
                  <ShoppingCartIcon className="w-5 h-5"/>
                </button>

                <button
                  onClick={() => HandleRemove(item.id)}
                //   className="text-red-600 hover:text-red-800 transition-all duration-300"
                className="font-semibold text-lg mt-2 sm:mt-0 rounded-full bg-white text-red-500 border border-red-500 px-6 py-2 hover:bg-red-300 hover:text-red-500 transition-all duration-300"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 flex-col sm:flex-row">
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto mb-4 sm:mb-0 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
