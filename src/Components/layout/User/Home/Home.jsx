import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  useGetTopProductsQuery,
  useGetTopCategoryQuery,
} from "../../../../Services/Apis/UserApi";
import { useNavigate } from "react-router-dom";

// Initialize AOS
const useAOS = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);
};



// Custom Button Component
const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded transition-colors duration-300 ${className}`}
  >
    {children}
  </button>
);


const BookCard = ({ product, isWishlist, HandleAddToWhishList, handleProduct }) => (

    <div
      className="relative rounded-lg bg-white p-3 shadow cursor-pointer hover:shadow-lg transition duration-300 transform hover:scale-105"
      data-aos="zoom-in"
    >
      {/* Wishlist and Cart Icons */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        {isWishlist ? (
          <FaHeart className="w-6 h-6 text-red-500" />
        ) : (
          <button
            onClick={() => HandleAddToWhishList(product._id)}
            className="p-1 hover:bg-gray-300 rounded-full"
          >
            <FaHeart className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
  
      {/* Product Image */}
      <img
        onClick={() => handleProduct(product._id)}
        src={product.image}
        alt={product.productName}
        className="mb-2 h-32 w-full object-contain rounded-lg"
      />
  
      {/* Product Details */}
      <div className="flex justify-between py-3">
        <h2 className="text-sm font-semibold">{product.productName}</h2>
        <p className="text-xs text-gray-600">{product.category} book</p>
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-600">Author: {product.author}</p>
        <p className="text-sm font-bold">₹{product.price}</p>
      </div>
    </div>
  );


  const Home = () => {
    const navigate = useNavigate()
    const [topProducts, setTopProducts] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const { data: topCategory } = useGetTopCategoryQuery();
    const { data } = useGetTopProductsQuery();

    console.log('data', topProducts);
    console.log('first', topCategories)
useEffect(() => {

  /**
   * get top products 
   */

  if (data?.topProducts?.length) {
    const transformedProducts = data.topProducts.map((item) => ({
      productName: item.productName,
      image: item.image[0],
      price: item.price,
      author: item.author,
      category: item.category,
      _id: item._id
    }));

    setTopProducts(transformedProducts);
  }

 /**
  * get top categories
  */

  if (topCategory?.topCategory?.length) {
    const transformedCategories = topCategory.topCategory.map((item) => ({
      category: item.category,
      totalOrder: item.totalOrder,
      totalQuantitySelled: item.totalQuantitySelled,
      totalRevenue: item.totalRevenue,
    }));
    setTopCategories(transformedCategories);
  }


  
}, [data, topCategory]);

  useAOS();

  /**
   * outhers
   */

  const authors = [
    {
      _id: "6",
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI3wadLOaACeHlXJNdOojzz8BemJivBhcjrRZoDQLfr4m_r1_VmI8iz-9DEPMb1CU4yqg&usqp=CAU"],
      authorName: "Malala Yousafzai",
      category: "Biography",
      author: "Aravind Adiga",
      price: "999",
    },
    {
      _id: "7",
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf1h7t2IqXBx6cHUhSFEzqFrLRE7eAM2Oqvob6CW-mNHNARZwH7nbkoneuni4WsOpLink&usqp=CAU"],
      authorName: "Arundhati Roy",
      category: "	Fiction, non-fiction",
      author: "Aravind Adiga",
      price: "999",
    },
    {
      _id: "1",
      images: ["https://mosaicmagazine.com/wp-content/uploads/2015/03/Tolstoy-List-Main.jpg"],
      authorName: "Leo Tolstoy",
      category: "Fiction",
      price: "999",
    },
    {
      _id: "2",
      images: ["data:image/jpeg;base64,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"],
      authorName: "Vaikom Muhammad Basheerr",
      category: "prose fiction",
      price: "999",
    },
    {
      _id: "3",
      images: ["https://www.blog.123coimbatore.com/uploads/blog-images/01-02-2018_04-05-12_kamala-das.jpg"],
      authorName: "Kamala Surayya ",
      category: "poet",
      price: "999",
    },
    {
      _id: "4",
      images: ["https://images.squarespace-cdn.com/content/v1/5ef6171b68603d7c6fcaf750/1616591603937-HP9D59S81CJS5ME7CBTV/New-York-Times-Bestselling-Author-Habits-Expert-James-Clear-Joins-BigSpeaks-Exclusive-Talent.jpeg"],
      authorName: "James clear",
      category: "non-fiction",
      price: "999",
    },
    {
      _id: "5",
      images: ["data:image/jpeg;base64,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"],
      authorName: "Robert Kiyosaki",
      category: "non-fiction",
      price: "999",
    },
   
    
    // Add more products as needed
  ];

  // const HandleAddToWhishList = (id) => alert(`Added product ${id} to Wishlist`);
  const HandleAddToWhishList = () => navigate('/whishlist');
  const handleProduct = () => navigate('/shop');
  // const handleProduct = (id) => alert(`Product ${id} clicked`);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[50vh] overflow-hidden">
        <img
          src="https://t4.ftcdn.net/jpg/06/88/66/31/360_F_688663136_CYDZXf10utvUG7QScsByISc5AaEDf68F.jpg"
          alt="Books banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold mb-4">TOP DEAL TODAY!</h1>
            <h2 className="text-2xl mb-6">BOOKS</h2>
            <Button  className="bg-white text-black hover:bg-gray-100">
              SHOP NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Super Saver Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-2xl font-bold text-center mb-8 border-b-2 border-blue-600 inline-block pb-2"
            data-aos="fade-right"
          >
            Super Saver
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {topProducts.map((product) => (
              <BookCard
                key={product._id}
                product={product}
                isWishlist={false}
                HandleAddToWhishList={HandleAddToWhishList}
                handleProduct={handleProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Books Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8" data-aos="fade-left">
            NEW BOOKS TOP DEAL
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {topProducts.map((product) => (
              <BookCard
                key={product._id}
                product={product}
                isWishlist={false}
                HandleAddToWhishList={HandleAddToWhishList}
                handleProduct={handleProduct}
              />
            ))}
          </div>
        </div>
      </section>

 {/* Super Saver Section */}
 <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-2xl font-bold text-center mb-8 border-b-2 border-blue-600 inline-block pb-2"
            data-aos="fade-right"
          >
            Top  Category Books
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {topProducts.map((product) => (
              <BookCard
                key={product._id}
                product={product}
                isWishlist={false}
                HandleAddToWhishList={HandleAddToWhishList}
                handleProduct={handleProduct}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Featured Authors */}
<section className="py-12">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-2xl font-bold text-center mb-8" data-aos="zoom-in">
      FEATURED AUTHORS
    </h2>
    <div
      className="flex gap-8 overflow-x-auto scroll-smooth px-4 py-2"
      data-aos="zoom-in"
    >
      { authors.map((author) => (
        <div
          key={author}
          className="flex-shrink-0 text-center w-32"
          data-aos="zoom-in"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-black to-blue-500 p-1 mx-auto">
            <img
              src={author.images}
              alt="Author"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <p className="text-sm font-semibold mt-2">{author.category}</p>
          <p className="text-sm font-bold mt-2">{author.authorName}</p>
        </div>
      ))}
    </div>
  </div>
</section>

    </div>
  );
}

export default Home
