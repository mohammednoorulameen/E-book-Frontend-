import React, { useEffect, useState } from "react";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {useGetCouponListQuery, useBlockCouponMutation} from '../../../../Services/Apis/AdminApi'

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [ coupons, setCoupons ] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("products");
  const [BlockCoupon] = useBlockCouponMutation()
  const {data, refetch} = useGetCouponListQuery({
    currentPage:1,
    limit:10,
  });

   /**
   *  handle change page and take totalPage
   */
   const handlePageChange = (page) => {
    setCurrentPage(page);
  };

const totalPage = data?.totalPage

  console.log('data', data)
  // console.log('couponsData', couponsData)

  /**
   * gettig couponsData 
   */

  useEffect(()=>{
    if (data?.couponsData) {
      console.log('data.couponsData', data.couponsData)
      const available = data.couponsData.filter(coupon =>
        new Date(coupon.startDate) <= Date.now() &&
        new Date(coupon.expireDate) > Date.now()
      );
      setCoupons(available);
    }
    
  },[data])

/**
 * handle block and unblock
 */

const HandleCouponBlock = async (id) => {
  try {
    
    await BlockCoupon({id});
    refetch();
  } catch (error) {
    console.log(error);
    
  }
}
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button
            className={`pb-4 px-2 ${
              activeTab === "products"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Coupons
          </button>
          {/* <button
            className={`pb-4 px-2 ${
              activeTab === "categories"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Products
          </button> */}
        </div>

        {/* add caregory  */}
        <form>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Coupons</h2>

            <div className="flex gap-3">
              <div className="relative">
                <input
                  placeholder="Search..."
                  className=" border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => navigate("/admin/add-coupon")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Coupon
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6">No</th>
                <th className="text-left py-4 px-6">Caoupon Code</th>
                <th className="text-left py-4 px-6">Caoupon Name</th>
                <th className="text-left py-4 px-6">Description</th>
                <th className="text-left py-4 px-6">Minimum Amount</th>
                <th className="text-left py-4 px-6">Offer</th>
                <th className="text-left py-4 px-6">Expiry Date</th>
                <th className="text-left py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ?(
                coupons.map((coupon,index)=>(

                  <tr
                  //   key={caregory._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                <td className="py-4 px-6">{ (currentPage - 1) * 10 + index + 1 }</td>
                <td className="py-4 px-6">{coupon.couponCode}</td>
                <td className="py-4 px-6">{coupon.couponName}</td>
                <td className="py-4 px-6">{coupon.description}</td>
                <td className="py-4 px-6">{coupon.minimumAmount}</td>
                <td className="py-4 px-6">{coupon.offer}%</td>
               
                <td className="py-4 px-6">{new Date(coupon.expireDate).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  <button 
                  onClick={()=> HandleCouponBlock(coupon._id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    coupon.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {coupon.status ? "Active" : "block"}
                  </button>
                </td>
                {/* <td className="py-4 px-11">
                  <div className="flex gap-2">
                    <button className="text-gray-600 hover:text-red-600">
                      <FaTrashAlt className="w-4 h-4" />
                    </button>
                  </div>
                </td> */}
              </tr>
                ))
              ):(
                <p>not fount</p>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChannge={handlePageChange}
        />
      </div>
    </div>
  );
};


const Pagination = ({ currentPage, totalPage, onPageChannge }) => {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChannge(page)}
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




export default AdminCoupons;
