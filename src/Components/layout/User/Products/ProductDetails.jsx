import React, { useEffect, useState } from "react";
import {
  useGetProductsDetailsQuery,
  useAddCartMutation,
  useAddWhishlistMutation,
  useRemoveWhishlistProductsMutation,
  useDeleteCartItemMutation,
} from "../../../../Services/Apis/UserApi";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
  const { user_id } = useSelector((state) => state?.user?.userProfile || {});
  const [userId, setuserId] = useState(null);
  const { data, refetch } = useGetProductsDetailsQuery({
    product_id: product_id,
    userId: userId,
  });
  const [RemoveWhishlistProducts] = useRemoveWhishlistProductsMutation();
  const [AddWhishlist] = useAddWhishlistMutation();
  const [DeleteCartItem] = useDeleteCartItemMutation();
  const [AddCart] = useAddCartMutation();
  const [isCart, setIsCart] = useState();
  const [isWishlist, setIsWhishlist] = useState();
  const [review, setReview] = useState([0]);
  const [rating, Setrating] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  console.log('data', data)

  /**
   * handle add to wishlist
   */
  
  const HandleAddToWhishList = async () => {
    console.log("product_id", product_id);
    try {
      const response = await AddWhishlist({ product_id: product_id });
      if (response.data) {
        setIsWhishlist(true); 
        refetch()
        console.log("Added to wishlist successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * handle remove wishlist product
   */

  const HandleRemove = async (product_id) => {
    try {
      const response = await RemoveWhishlistProducts({ product_id });
      if (response.data) {
        setIsWhishlist(false); 
        refetch()
        console.log("Wishlist product removed successfully");
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  /**
   * get product details
   */
  useEffect(() => {
    if (data && data.productDetails) {
      setProduct(data.productDetails);
      setReview(data.productDetails.review || []);
      const totalStar = data?.productDetails.review?.reduce(
        (acc, obj) => acc + obj.star,
        0
      );
      const avgStar = Math.round(totalStar / data.productDetails.review.length);
      Setrating(avgStar);
    }

    if (user_id) {
      setuserId(user_id);
    }

    if (data?.isCart) {
      setIsCart(data.isCart);
    }

    if (data?.isWishlist) {
      setIsWhishlist(data.isWishlist);
    }
  }, [data]);

  /**
   * handle image changing
   */
  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  /**
   * handle Add To Cart
   */
  const handleAddToCart = async () => {
    if (product.stock === 0) {
      console.log("out of stock");
    } else {
      const items = {
        product_id,
        price: product.price,
      };
      const response = await AddCart(items);
      if (response.data) {
        setIsCart(true);
        refetch();
        console.log("response.data.message", response.data.message);
      }
    }
  };

  /**
   * handle delete cart product
   */
  const HandleDeleteToCart = async (product_id) => {
    const response = await DeleteCartItem({ product_id: product_id });
    if (response.data) {
      setIsCart(false);
      refetch();
      console.log("Product removed from cart");
    }
  };

  return (
    <section className="py-8 md:py-16 font-primary bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="w-full lg:w-1/2 relative">
            {/* Main Image */}
            <div className="w-full h-96 relative rounded-xl overflow-hidden mb-8 shadow-lg">
              <AnimatePresence>
                {product.images?.map(
                  (image, index) =>
                    index === selectedImageIndex && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center bg-gray-200"
                      >
                        <Zoom>
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </Zoom>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
            {/* Thumbnail Images */}
            <div className="flex space-x-4 overflow-x-auto pt-4">
              {product.images?.map((image, index) => (
                <div
                  key={index}
                  className={`h-20 w-20 rounded-md overflow-hidden cursor-pointer ${
                    index === selectedImageIndex
                      ? "ring-2 ring-blue-500"
                      : "ring-2 ring-gray-200"
                  } transition-all`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-3xl text-center md:text-3xl font-semibold text-gray-800">
              {product.productName}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Pricing Section */}
            <div>
              {product.discountPrice &&
              product.discountPrice !== product.productPrice ? (
                <div className="flex items-baseline gap-2">
                  {/* <span className="text-2xl md:text-3xl font-bold text-red-600">
                  ₹{product.discountPrice.toFixed(2)}
                </span>
                <span className="line-through text-gray-500 text-lg">
                  ₹{product.price.toFixed(2)}
                </span> */}
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold">
                  ₹{product.price}
                </p>
              )}
              <div>
                {product.stock > 0 ? (
                  <span className="text-green-500">
                    In stock {product.stock}
                  </span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Author:</strong> {product.author}
              </div>
              <div>
                <strong>Publisher:</strong> {product.publisher}
              </div>
              <div>
                <strong>Category:</strong> {product.category}
              </div>
              <div>
                <strong>language:</strong> {product.language}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isCart ? (
                <button
                  onClick={() => HandleDeleteToCart(product._id)}
                  className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition ${
                    product.stock === 0 && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  remove to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition ${
                    product.stock === 0 && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </button>
              )}

              {isWishlist ? (
                <button
                  onClick={()=>HandleRemove(product._id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 py-3 rounded-md hover:bg-gray-300 transition"
                >
                  <FilledHeartIcon className="w-5 h-5 text-red-500" />
                  remove to Wishlist
                </button>
              ) : (
                <button
                  onClick={HandleAddToWhishList}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 py-3 rounded-md hover:bg-gray-300 transition"
                >
                  <HeartIcon className="w-5 h-5 text-red-500" />
                  Add to Wishlist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
