import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetProductsQuery,
  useAddWhishlistMutation,
  
} from "../../../../Services/Apis/UserApi";
import { useGetCategoryQuery } from "../../../../Services/Apis/AdminApi";
import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";
const Shop = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("");
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryList, SetCategoryList] = useState([]);
  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page: currentPage,
    limit: 12,
    sort: selectedSort,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const { data: category } = useGetCategoryQuery({ page: 1 });
  const [AddWhishlist] = useAddWhishlistMutation();

  
  /**
   * handle add to whishlist
   */

  const HandleAddToWhishList = async (product_id) => {
    console.log("product_id", product_id);
    try {
      const response = await AddWhishlist({ product_id: product_id });
      if (response.data) {
        setWishlistStatus((prevStatus) => ({
          ...prevStatus,
          [product_id]: true,
        }));
        console.log("Added to wishlist successfully");
      }
    } catch (error) {
      console.log("Error adding to wishlist:", error);
    }
  };
  

  /**
   * get category data
   */

  useEffect(() => {
    if (category && category?.categoryData) {
      const activeList = [...category.categoryData].filter(
        (category) => category.status
      );
      SetCategoryList(activeList);
    }
  }, [category]);

  if (isLoading) {
    return <p className="text-red">Loading products wait 10 seconds...</p>;
  }

  if (isError) {
    return (
      <p>
        Failed to load products. Please try again later.{" "}
        <span
          className="text-red-500 cursor-pointer underline"
          onClick={() => window.location.reload()}
        >
          Click Here
        </span>
      </p>
    );
  }

  /**
   * handle category change product
   */

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    setCurrentPage(1);
    refetch();
  };

  /**
   * handle sort change
   */

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
    refetch();
  };

  /**
   * page changing
   */

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  /**
   * get products
   */

  const { products, totalPage } = data;
  console.log(products);

  /**
   * navigate product detailes
   */

  const handleProduct = (id) => {
    navigate(`/productdetails/${id}`);
  };

  return (
    <div>
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-5 pr-5">
            {/* <!-- Sort Dropdown --> */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-black">
                Sort By
              </label>
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="rounded border border-black bg-white px-4 py-2 text-black"
              >
                <option value="price-all">All</option>
                <option value="price-accending">High to Low</option>
                <option value="price-descending">Low to High</option>
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* <!-- Filter Dropdown --> */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-black">
                Filter By
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="rounded border border-black bg-white px-4 py-2 text-black"
              >
                <option value="all">{selectedCategory}</option>
                <option value="all">All</option>
                {categoryList.map((item) => (
                  <option key={item._id} value={item.category}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>
          </div>


         


          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isWishlist = wishlistStatus[product._id];
              return (
                <div
                  key={product._id}
                  className="relative rounded-lg bg-white p-3 shadow cursor-pointer"
                >
                  {/* Wishlist and Cart Icons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {isWishlist ? (
                      <FilledHeartIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <button
                        onClick={() => HandleAddToWhishList(product._id)}
                        className="p-1 hover:bg-gray-300"
                      >
                        <HeartIcon className="w-6 h-6 text-gray-700" />
                      </button>
                    )}
                  </div>


                  {/* Product Image */}
                  <img
                    key={product._id}
                    onClick={() => handleProduct(product._id)}
                    src={product.images[0]}
                    alt={product.productName}
                    className="mb-2 h-32 w-full object-contain"
                  />

                  <div className="mx-1 flex"></div>

                  {/* Product Details */}
                  <div className="flex justify-between py-3">
                    <h2 className="text-sm font-semibold">
                      {product.productName}
                    </h2>
                    <p className="text-xs text-gray-600">
                      {product.category} book
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-600">
                      Author: {product.author}
                    </p>
                    <p className="text-sm font-bold">₹{product.price}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center space-x-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
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

export default Shop;
