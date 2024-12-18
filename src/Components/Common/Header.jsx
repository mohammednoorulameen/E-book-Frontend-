import React, { useEffect, useState } from "react";
import { useDebounce } from "../../Hooks/useDebounce";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaHome,
  FaCompass,
  FaHeart,
  FaEllipsisV,
  FaBook,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  GlobeAltIcon,
  HomeIcon,
} from "@heroicons/react/outline";
import { Link, useNavigate } from "react-router-dom";
import {
  useLogoutMutation,
  useGetUserProfileQuery,
  useGetCartItemsQuery,
  useGetProductsQuery,
  useGetWhishlistQuery,
} from "../../Services/Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../../Redux/Slice/UserSlice/UserSlice";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: allProducts } = useGetProductsQuery({ limit: 10 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const { data: profile } = useGetUserProfileQuery();
  const userProfile = profile?.userProfile;
  const { data: cart, isLoading } = useGetCartItemsQuery();
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { data: whishlist } = useGetWhishlistQuery();


  // Calculate total count of items in cart
  const itemCount =
    cart?.cartItems?.reduce((total, item) => total + item.items.quantity, 0) ||
    0;

  /**
   * whishlist count
   */

  const whishLisitemCount = whishlist?.items?.length || 0;


  /**
   * setting user data
   */

  useEffect(() => {
    if (userProfile) {
      dispatch(setUser(userProfile));
    }
  }, [dispatch, userProfile]);

  const userData = useSelector((state) => state.user.userProfile);

  /**
   * handling tab change
   */

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  /**
   * handle logout
   */

  const HandleLogout = async () => {
    await logout();
    localStorage.removeItem("userToken");
    dispatch(clearUser());
    navigate("/");
  };

  /**
   * set search
   */

  const filteredProducts =
    debouncedQuery.trim() !== "" && allProducts?.allProducts
      ? allProducts?.allProducts?.filter((product) =>
          product.productName
            .toLowerCase()
            .includes(debouncedQuery.toLowerCase())
        )
      : [];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    console.log("Searching for:", searchQuery);
  };

  const handleProduct = (id) => {
    navigate(`/productdetails/${id}`);
    setSearchQuery("");
  };
  return (
    <header>
      {/* Top Bar */}
      <div className="py-4 px-5 bg-white  fixed top-0 w-full z-40">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-5">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-black">
            <FaBook />
            <span>E-book</span>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex-1 max-w-2xl relative"
          >
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-full text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full p-2"
            >
              <FaSearch />
            </button>
          </form>
          {filteredProducts.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto mt-2 z-50">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  <strong>
                    {" "}
                    <button onClick={() => handleProduct(product._id)}>
                      {product.productName}
                    </button>{" "}
                  </strong>{" "}
                  - ${product.price}
                </li>
              ))}
            </ul>
          )}

          {/* Right Icons */}
          <div>
            {/* Icons for larger screens */}
            <div className="hidden sm:flex items-center gap-11 text-lg ml-auto">
              {/* Login with Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-800 group focus:outline-none">
                  {userData ? (
                    <UserIcon className="w-6 h-6 stroke-black stroke-2 fill-transparent" />
                  ) : (
                    <FaUser />
                  )}
                </button>

                {/* Animated Dropdown on Hover */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 transform transition-all duration-300 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible`}
                >
                  {userData ? (
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <UserIcon className="w-6 h-6 stroke-black stroke-2 fill-transparent" />
                      <span>My Profile</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaUser />
                      <span>Login</span>
                    </Link>
                  )}

                  <Link
                    to="/whishlist"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FaHeart />
                    <span>Wishlist</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FaClipboardList />
                    <span>Orders</span>
                  </Link>
                  {userData && (
                    <Link
                      onClick={HandleLogout}
                      className="flex text-red-500 items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Cart Icon */}
              <Link
                to={"/cart"}
                className="flex items-center gap-1 text-gray-800 relative"
              >
                <ShoppingCartIcon className="w-6 h-6 stroke-black stroke-2 fill-transparent" />
                {!isLoading && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Icon */}
              {/* <Link
                to={"/whishlist"}
                className="flex items-center gap-1 text-gray-800"
              >
                <HeartIcon className="w-6 h-6 stroke-black stroke-2 fill-transparent" />
                {!isLoading && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link> */}
              <Link
                to={"/whishlist"}
                className="flex items-center gap-1 text-gray-800 relative"
              >
                <HeartIcon className="w-6 h-6 stroke-black stroke-2 fill-transparent" />
                {!isLoading && whishLisitemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {whishLisitemCount}
                  </span>
                )}
              </Link>
              {/* More Options Icon */}
              <a href="#" className="flex items-center gap-1 text-gray-800">
                <FaEllipsisV />
              </a>
            </div>

            {/* Icons for smaller screens  */}

            <div className="fixed bottom-0 left-0 w-full bg-white flex justify-around py-2 sm:hidden z-50">
              {/* shop icon */}

              <Link
                to={"/"}
                className="flex flex-col items-center gap-1 text-gray-800"
              >
                {/* home icon */}

                {userData ? (
                  <FaHome className="w-5 h-5" />
                ) : (
                  <HomeIcon className="w-5 h-5" />
                )}
                <span className="text-xs">Home</span>
              </Link>

              <Link
                to={"/shop"}
                className="flex flex-col items-center gap-1 text-gray-800"
              >
                {userData ? (
                  <FaCompass className="w-5 h-5" />
                ) : (
                  <GlobeAltIcon className="w-5 h-5" />
                )}
                <span className="text-xs">Explore</span>
              </Link>

              {/* Login Icon */}
              <div className="relative group">
                <button className="flex flex-col items-center gap-1 text-gray-800">
                  {userData ? (
                    <FaUser className="w-5 h-5" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                  <span className="text-xs">
                    {userData ? "Profile" : "Login"}
                  </span>
                </button>
                <div className="absolute bottom-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 transform transition-all duration-300 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                  {userData ? (
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <UserIcon className="w-6 h-6 stroke-black stroke-2 fill-transparent" />
                      <span>My Profile</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaUser />
                      <span>Login</span>
                    </Link>
                  )}

                  {userData && (
                    <Link
                      onClick={HandleLogout}
                      className="flex text-red-500 items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </Link>
                  )}

                  <Link
                    to="/whishlist"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FaHeart />
                    <span>Wishlist</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FaClipboardList />
                    <span>Orders</span>
                  </Link>
                </div>
              </div>

              {/* Wishlist Icon */}
              <Link
                to={"/whishlist"}
                className="flex flex-col items-center gap-1 text-gray-800"
              >
                {userData ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="text-xs">Wishlist</span>
              </Link>

              {/* Cart Icon */}
              <Link
                to={"/cart"}
                className="flex flex-col items-center gap-1 text-gray-800 relative"
              >
                {userData ? (
                  <FaShoppingCart className="w-5 h-5" />
                ) : (
                  <ShoppingCartIcon className="w-5 h-5" />
                )}
                {!isLoading && itemCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="text-xs">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white px-5 fixed top-16 w-full z-30">
        <div className="max-w-screen-xl mx-auto  lg:flex  justify-center gap-4 hidden">
          {[
            { label: "HOME", path: "/" },
            { label: "SHOP", path: "/shop" },
            { label: "ORDERS", path: "/account/orders" },
          ].map((tab) => (
            <Link
              key={tab.label}
              to={tab.path}
              onClick={() => handleTabChange(tab.label)}
              className="text-black text-sm font-medium px-5 py-3 hover:border-b-2 hover:border-black"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
